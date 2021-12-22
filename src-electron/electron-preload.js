/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  version: async () => {
    return await ipcRenderer.invoke('version');
  },
  startCount: (height) => {
    ipcRenderer.send('start-count', height);
  },
  endCount: () => {
    ipcRenderer.send('end-count');
  },
  minimize: () => {
    ipcRenderer.send('minimize');
  },
  close: () => {
    ipcRenderer.send('close');
  },
  changeOnTop: () => {
    ipcRenderer.send('changeOnTop');
  },
  count: async (raidId) => {
    return await ipcRenderer.invoke('count', raidId);
  },
  countAll: async () => {
    return await ipcRenderer.invoke('countAll');
  },
  save: async ({ raidId, itemId, num }) => {
    return await ipcRenderer.invoke('save', { raidId, itemId, num });
  },
  saveRaid: async ({ raidId, raidData }) => {
    return await ipcRenderer.invoke('saveRaid', { raidId, raidData });
  },
  increment: async ({ raidId, itemId, itemName }) => {
    return await ipcRenderer.invoke('increment', { raidId, itemId, itemName });
  },
  decrement: async ({ raidId, itemId }) => {
    return await ipcRenderer.invoke('decrement', { raidId, itemId });
  },
  listByRaidId: async (raidId) => {
    return await ipcRenderer.invoke('listByRaidId', raidId);
  },
  list: async () => {
    return await ipcRenderer.invoke('list');
  },
});
