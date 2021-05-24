import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron';

const fs = require('fs');
const path = require('path');

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    fs.unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'));
  }
} catch (_) {}

const storage = require('electron-json-storage');
const STORE_PATH = app.getPath('userData');
storage.setDataPath(STORE_PATH);
const defaultGbfData = {
  "proto_bahamut": {
    "ffj": 0,
    "red_ring": 0,
    "black_ring": 0,
    "white_ring": 0
  },
  "akasha": {
    "ffj": 0,
    "red_ring": 0,
    "black_ring": 0,
    "white_ring": 0,
    "silver_centrum":0,
    "red_paper": 0,
    "black_paper": 0,
    "white_paper": 0,
    "hollow_key": 0,
    "mirage_munition": 0
  }
};


let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 800,
    height: 450,
    titleBarStyle: 'hidden',
    useContentSize: true,
    alwaysOnTop: true,
    resizable: false,
    icon: path.resolve(__dirname, 'statics/icon.ico'),
    frame: false,
    webPreferences: {
      contextIsolation: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      preload: path.resolve(__dirname, 'electron-preload.js'),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools();
    });
  }

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

ipcMain.on('minimize', () => {
  mainWindow.minimize();
});

ipcMain.on('close', () => {
  mainWindow.close();
});

ipcMain.on('start-count', (_, arg) => {
  const height = arg;
  mainWindow.setResizable(true);
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  }
  mainWindow.setSize(170, height);
  mainWindow.setResizable(false);
});

ipcMain.on('end-count', () => {
  mainWindow.setResizable(true);
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  }
  mainWindow.setSize(800, 450);
  mainWindow.setResizable(false);
});

ipcMain.handle('statistics', (_, raidId) => {
  return new Promise((resolve, reject) => {
    storage.has('gbf', function(error, hasKey){
      if (error) {
        reject (error);
      }
      if (hasKey) {
        storage.get('gbf', function(error, data) {
          if (error) {
            reject(error);
          }
          resolve(data[raidId]);
        });
      } else {
        storage.set('gbf', defaultGbfData);
        resolve(defaultGbfData[raidId]);
      }
    });
  });
});

ipcMain.handle('save',  (_, { raidId, itemId, num }) => {
  return new Promise((resolve, reject) => {
    storage.get('gbf', function(error, data) {
      if (error) reject(error);
      else {
        data[raidId][itemId] = num;

        storage.set('gbf', data);
        resolve(true);
      }
    });
  });
});
