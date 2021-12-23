import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron';
import { defaultGbfData, defaultDetailData, GBF_JSON_KEY, DETAIL_JSON_KEY } from './data/constants.js';
import { getByKeyOrDefault } from './utils/dbUtil.js';
import { removeClosest, findByRaidId } from './utils/gbfUtil.js';
import packageInfo from '../package.json';

const dayjs = require('dayjs');
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

let mainWindow;
const mainWidth = 900;
const mainHeight = 550;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: mainWidth,
    height: mainHeight,
    titleBarStyle: 'hidden',
    useContentSize: true,
    alwaysOnTop: true,
    resizable: false,
    icon: path.resolve(__dirname, 'statics/icon.ico'),
    frame: false,
    webPreferences: {
      contextIsolation: true,
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

ipcMain.handle('version', async () => {
  return packageInfo.version;
});

ipcMain.on('minimize', () => {
  mainWindow.minimize();
});

ipcMain.on('close', () => {
  mainWindow.close();
});

ipcMain.on('changeOnTop', () => {
  mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop());
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
  mainWindow.setSize(mainWidth, mainHeight);
  mainWindow.setResizable(false);
});

ipcMain.handle('count', async (_, raidId) => {
  try {
    let data = await getByKeyOrDefault(storage, GBF_JSON_KEY, defaultGbfData);
    return data[raidId] || defaultGbfData[raidId];
  } catch (e) {
    console.log(e);
  }
});

ipcMain.handle('countAll', async (_, __) => {
  try {
    let data = await getByKeyOrDefault(storage, GBF_JSON_KEY, defaultGbfData);
    return data;
  } catch (e) {
    console.log(e);
  }
});

ipcMain.handle('save', async (_, { raidId, itemId, num }) => {
  try {
    let data = await getByKeyOrDefault(storage, GBF_JSON_KEY, defaultGbfData);
    if (!data[raidId]) {
      data[raidId] = {};
    }
    data[raidId][itemId] = num;
    storage.set(GBF_JSON_KEY, data);
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
});

ipcMain.handle('saveRaid', async (_, { raidId, raidData }) => {
  try {
    let data = await getByKeyOrDefault(storage, GBF_JSON_KEY, defaultGbfData);
    data[raidId] = raidData;
    storage.set(GBF_JSON_KEY, data);
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
});

ipcMain.handle('increment', async (_, { raidId, itemId, itemName }) => {
  try {
    let data = await getByKeyOrDefault(storage, DETAIL_JSON_KEY, defaultDetailData);
    let now = dayjs().toISOString();
    data.record.push({
      raidId: raidId,
      itemId: itemId,
      itemName,
      num: 1,
      damage: -1,
      duration: -1,
      time: now,
    });
    storage.set(DETAIL_JSON_KEY, data);
    return true;
  } catch (e) {
    console.log(e);
  }
});

ipcMain.handle('decrement', async (_, { raidId, itemId }) => {
  try {
    let data = await getByKeyOrDefault(storage, DETAIL_JSON_KEY, defaultDetailData);
    let newRecord = removeClosest(data.record, raidId, itemId);
    data.record = newRecord;
    storage.set(DETAIL_JSON_KEY, data);
  } catch (e) {
    console.log(e);
  }
});

ipcMain.handle('listByRaidId', async (_, raidId) => {
  try {
    let data = await getByKeyOrDefault(storage, DETAIL_JSON_KEY, defaultDetailData);
    let dataByRaid = findByRaidId(data.record, raidId);
    return dataByRaid;
  } catch (e) {
    console.log(e);
  }
});

ipcMain.handle('list', async (_, __) => {
  try {
    let data = await getByKeyOrDefault(storage, DETAIL_JSON_KEY, defaultDetailData);
    return data.record;
  } catch (e) {
    console.log(e);
  }
});
