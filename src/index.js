const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('node:path');

if (require('electron-squirrel-startup')) app.quit();

const tools = require('./tools');
let mainWindow;
const toolWindows = {}; // track open tool windows by tool id

// --- Main window ---

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 900,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			sandbox: false,
		},
	});
	mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

// --- Tool popup window ---

function openToolWindow(toolId) {
	// If already open, just bring it to focus
	if (toolWindows[toolId]) {
		toolWindows[toolId].focus();
		return;
	}

	// Position in bottom-right corner of the screen
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;

	const win = new BrowserWindow({
		width: 420,
		height: 270,
		x: width - 440,
		y: height - 290,
		frame: false,        // no title bar
		alwaysOnTop: true,   // stays above other windows
		resizable: false,
		skipTaskbar: true,   // doesn't show in taskbar
		webPreferences: {
			preload: path.join(__dirname, 'tool-preload.js'),
			sandbox: false,
		},
	});

	win.loadFile(path.join(__dirname, 'tools', toolId + '.html'));

	win.on('closed', () => delete toolWindows[toolId]);
	toolWindows[toolId] = win;
}

// --- App lifecycle ---

app.whenReady().then(() => {
	createMainWindow();

	// Register a global hotkey for every tool
	for (const tool of tools) {
		if (tool.hotkey) {
			globalShortcut.register(tool.hotkey, () => openToolWindow(tool.id));
		}
	}

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});

// --- IPC handlers ---

// Called from main window when user clicks "Open Tool" button
ipcMain.on('open-tool', (_, toolId) => openToolWindow(toolId));

// Called from tool window to close itself
ipcMain.on('close-tool-window', (event) => {
	BrowserWindow.fromWebContents(event.sender)?.close();
});

// Run a tool — called via ipcRenderer.invoke from tool windows
ipcMain.handle('run-tool', async (_, toolId, option, input) => {
	const mod = require(path.join(__dirname, 'tools', toolId));
	return await mod.run(option, input);
});