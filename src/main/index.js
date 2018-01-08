import { app, BrowserWindow, ipcMain, Menu, shell } from 'electron' // eslint-disable-line

import fs from 'fs';
import path from 'path';

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

//
// MENU CODE
//

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
      {label: 'Preferences...', accelerator: 'Cmd+,'},
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

//
// END MENU CODE
//

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
    title: 'Loading Swishbox..'
  });

  loadingWindow.loadURL(loadingURL);

  loadingWindow.on('closed', () => {
    loadingWindow = null;
  });

  // Setup ffmpeg in /bin
  const ffmpegInstallPath = path.join(app.getPath('userData'), 'bin');
  if (!fs.existsSync(ffmpegInstallPath)) fs.mkdirSync(ffmpegInstallPath);
  ffmpeg.setFfmpegPath(path.join(ffmpegInstallPath, 'ffmpeg'));

  ffbinaries.downloadFiles(['ffmpeg'], {
    destination: ffmpegInstallPath
  }, () => {
    loadingWindow.destroy();
    createWindow();
  });
}

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

  video.on('info', () => {
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
