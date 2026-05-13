// Preload runs in Node context but can talk to the renderer via contextBridge.
// Anything you expose here is available as window.api in index.html.

const { contextBridge, ipcRenderer } = require('electron');
const tools = require('./tools');

contextBridge.exposeInMainWorld('api', {
	tools,
	openTool: (toolId) => ipcRenderer.send('open-tool', toolId),
});