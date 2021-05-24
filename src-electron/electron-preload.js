/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   const { contextBridge } = require('electron')
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
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
  statistics: async (raidId) => {
    return await ipcRenderer.invoke('statistics', raidId);
  },
  save: async ({ raidId, itemId, num }) => {
    return await ipcRenderer.invoke('save', { raidId, itemId, num });
  },
});
