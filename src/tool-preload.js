const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
	// invoke sends to ipcMain.handle in index.js — properly returns a Promise
	run: (toolId, option, input) => ipcRenderer.invoke('run-tool', toolId, option, input),
	close: () => ipcRenderer.send('close-tool-window'),
});