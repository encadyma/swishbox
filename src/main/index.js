import { app, BrowserWindow, ipcMain } from 'electron' // eslint-disable-line
import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

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

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

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

    /* video.pipe(fs.createWriteStream(path.join(videoDir, `${yt}.${format.container}`)), {
      filter: 'audioonly'
    }); */
  });

  video.on('progress', (chunkLength, downloaded, total) => {
    progressPercent = (downloaded / total) * 100;
  });
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
