import { app, BrowserWindow, ipcMain, Menu, shell, Notification } from 'electron' // eslint-disable-line

import fs from 'fs';
import path from 'path';

import request from 'request';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffbinaries from 'ffbinaries';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
let loadingWindow;

const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

const loadingURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080/loading.html'
  : `file://${__dirname}/loading.html`;


// BEGIN MENU CODE
const template = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'Playback',
    submenu: [
      {
        label: 'Play/Pause',
        accelerator: 'Space', 
        click() {
          mainWindow.webContents.send("PLAYER_TOGGLE_PLAY");
        }
      },
      { 
        label: 'Next', 
        accelerator: 'CmdOrCtrl+Right', 
        click() {
          mainWindow.webContents.send("PLAYER_NEXT_SONG");
        }
      },
      {
        label: 'Previous', 
        accelerator: 'CmdOrCtrl+Left', 
        click() {
          mainWindow.webContents.send("PLAYER_PREVIOUS_SONG");
        }
      },
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      { label: 'Swishbox Releases', click() { shell.openExternal('https://github.com/encadyma/swishbox/releases'); } },
      { label: 'Submit Issues and Feature Requests...', click() { shell.openExternal('https://github.com/encadyma/swishbox/issues'); } },
      { label: 'Visit Developer Site', click() { shell.openExternal('https://encadyma.com'); } },
    ]
  }
];
if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {label: 'Preferences...', accelerator: 'Cmd+,', click() { mainWindow.webContents.send("STORAGE_OPEN_PREFERENCES"); }},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  });
}
const menu = Menu.buildFromTemplate(template);
// END MENU CODE

// BEGIN STORAGE CODE
function initStorage() {
  const thumbnailsPath = path.join(app.getPath('userData'), 'yt_thumbnails');
  const metadataFile = path.join(app.getPath('userData'), 'yt_songs.json');
  const preferencesFile = path.join(app.getPath('userData'), 'preferences.json');

  const defaultSongPrefs = {
    ids: [],
    saved: [],
    songs: {},
  };

  const defaultPreferences = {};

  if (!fs.existsSync(thumbnailsPath)) fs.mkdirSync(thumbnailsPath);
  if (!fs.existsSync(metadataFile)) fs.writeFileSync(metadataFile, JSON.stringify(defaultSongPrefs));
  if (!fs.existsSync(preferencesFile)) fs.writeFileSync(preferencesFile, JSON.stringify(defaultPreferences));
}

function saveYoutubeMetadata(info) {
  const thumbnailsPath = path.join(app.getPath('userData'), 'yt_thumbnails', `${info.video_id}.jpg`);
  const metadataFile = path.join(app.getPath('userData'), 'yt_songs.json');

  const savedMetadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
  if (savedMetadata.ids.indexOf(info.video_id) !== -1) return;

  const remoteThumbnail = (info.iurlhq ? info.iurlhq : `https://i.ytimg.com/vi/${info.video_id}/hqdefault.jpg`);

  const videoMetadata = {
    id: info.video_id,
    title: info.title,
    author: info.author,
    duration: parseInt(info.length_seconds, 10),
    keywords: info.keywords,
    description: info.description,
    thumbnail: thumbnailsPath,
    remoteThumbnail: remoteThumbnail
  };

  savedMetadata.ids.push(info.video_id);
  savedMetadata.saved.push(info.video_id);
  savedMetadata.songs[info.video_id] = videoMetadata;

  fs.writeFileSync(metadataFile, JSON.stringify(savedMetadata));

  request(remoteThumbnail)
    .pipe(fs.createWriteStream(thumbnailsPath)).on('close', () => {
      mainWindow.webContents.send("STORAGE_METADATA_UPDATE", savedMetadata);
    });
}

function purgeCacheFolder() {
  const cacheFolder = path.join(app.getPath('userData'), 'yt_cache');
  if (!fs.existsSync(cacheFolder)) return;

  fs.readdirSync(cacheFolder).forEach((file) => {
    const filePath = path.join(cacheFolder, file);
    if (fs.lstatSync(filePath).isFile()) fs.unlinkSync(filePath);
  });
}

function getCacheFolderSize() {
  const cacheFolder = path.join(app.getPath('userData'), 'yt_cache');
  if (!fs.existsSync(cacheFolder)) return 0;

  let totalSize = 0;

  fs.readdirSync(cacheFolder).forEach((file) => {
    const filePath = path.join(cacheFolder, file);
    const fileStats = fs.statSync(filePath);
    if (fileStats.isFile()) totalSize += (fileStats.size / (1024 * 1024));
  });

  return Math.round(totalSize);
}

ipcMain.on("STORAGE_METADATA_FETCH", (event) => {
  const metadataFile = path.join(app.getPath('userData'), 'yt_songs.json');
  const dataFile = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
  event.sender.send("STORAGE_METADATA_UPDATE", dataFile);
});

ipcMain.on("STORAGE_PREFERENCES_FETCH", (event) => {
  const prefsFile = path.join(app.getPath('userData'), 'preferences.json');
  const dataFile = JSON.parse(fs.readFileSync(prefsFile, 'utf8'));
  event.sender.send("STORAGE_PREFERENCES_UPDATE", dataFile);
});

ipcMain.on("STORAGE_CACHE_GET_SIZE", (event) => {
  event.sender.send("STORAGE_CACHE_UPDATE_SIZE", getCacheFolderSize());
});

ipcMain.on("STORAGE_CACHE_PURGE", (event) => {
  purgeCacheFolder();
  event.sender.send("STORAGE_CACHE_UPDATE_SIZE", getCacheFolderSize());
});
// END STORAGE CODE

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1000,
    resizable: false,
    frame: false,
    fullscreenable: false,
    vibrancy: 'light',
    title: 'Swishbox',
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      experimentalFeatures: true,
      backgroundThrottling: false
    }
  });

  Menu.setApplicationMenu(menu);

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    height: 100,
    width: 300,
    useContentSize: true,
    resizable: false,
    frame: false,
    fullscreenable: false,
    title: 'Loading Swishbox..',
    backgroundColor: '#F4EFEA'
  });

  loadingWindow.loadURL(loadingURL);

  loadingWindow.on('closed', () => {
    loadingWindow = null;
  });

  // Setup storage
  initStorage();

  // Setup ffmpeg in /bin
  const ffmpegInstallPath = path.join(app.getPath('userData'), 'bin');
  if (!fs.existsSync(ffmpegInstallPath)) fs.mkdirSync(ffmpegInstallPath);
  ffmpeg.setFfmpegPath(path.join(ffmpegInstallPath, 'ffmpeg'));

  ffbinaries.downloadFiles(['ffmpeg'], {
    destination: ffmpegInstallPath
  }, () => {
    createWindow();
    loadingWindow.destroy();
  });
}

ipcMain.on('PLAYER_MUSIC_NOTIFICATION', (event, song) => {
  if (Notification.isSupported() && !mainWindow.isFocused()) {
    new Notification({
      title: song.title,
      body: song.author.name,
      silent: true
    }).show();
  }
});

// For Youtube downloads queried
// from the Vue frontend
ipcMain.on('YT_DOWNLOAD', (event, yt) => {
  if (!fs.existsSync(path.join(app.getPath('userData'), 'yt_cache'))) fs.mkdirSync(path.join(app.getPath('userData'), 'yt_cache'));
  if (!ytdl.validateID(yt)) return;

  const videoDir = path.join(app.getPath('userData'), 'yt_cache');

  if (fs.existsSync(path.join(videoDir, `${yt}.mp3`))) {
    event.sender.send('YT_DOWNLOAD_PROGRESS', {
      id: yt,
      dlSpeed: 0,
      loading: 100,
      canPlay: true,
      hasFinished: true,
      path: path.join(videoDir, `${yt}.mp3`)
    });
    return;
  }

  const video = ytdl(`https://www.youtube.com/watch?v=${yt}`, { filter: format => format.container === 'mp4' });

  let progressPercent = 0;

  video.on('info', (info) => {
    saveYoutubeMetadata(info);

    const videoProc = ffmpeg({ source: video })
      .format('mp3')
      .output(path.join(videoDir, `${yt}.mp3`));

    videoProc.on('progress', (progress) => {
      event.sender.send('YT_DOWNLOAD_PROGRESS', {
        id: yt,
        dlSpeed: progress.currentKbps,
        loading: progressPercent,
        canPlay: false,
        hasFinished: false,
        path: path.join(videoDir, `${yt}.mp3`)
      });
    });

    videoProc.on('end', () => {
      event.sender.send('YT_DOWNLOAD_PROGRESS', {
        id: yt,
        dlSpeed: 0,
        loading: 100,
        canPlay: true,
        hasFinished: true,
        path: path.join(videoDir, `${yt}.mp3`)
      });
      mainWindow.webContents.send("STORAGE_CACHE_UPDATE_SIZE", getCacheFolderSize());
    });

    videoProc.run();
  });

  video.on('progress', (chunkLength, downloaded, total) => {
    progressPercent = (downloaded / total) * 100;
  });
});

app.on('ready', createLoadingWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('APP_MINIMIZE', () => {
  mainWindow.minimize();
});

ipcMain.on('APP_CLOSE', () => {
  app.quit();
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
