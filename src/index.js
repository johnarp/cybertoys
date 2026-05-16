const { app, BrowserWindow, globalShortcut, ipcMain, screen, Menu, nativeTheme } = require('electron');
const path = require('node:path');

if (require('electron-squirrel-startup')) app.quit();

Menu.setApplicationMenu(null);

const tools = require('./tools');
let mainWindow;
const toolWindows = {};

// Matches --sidebar-bg in index.css for both modes
function getOverlay() {
	const dark = nativeTheme.shouldUseDarkColors;
	return {
		color:       dark ? '#0f0f0f' : '#f9f9f9',
		symbolColor: dark ? '#888888' : '#666666',
		height: 36,
	};
}

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 900,
		height: 600,
		titleBarStyle: 'hidden',
		titleBarOverlay: getOverlay(),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			sandbox: false,
		},
	});
	mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

// Update the overlay colors when the OS switches light/dark mode
nativeTheme.on('updated', () => {
	mainWindow?.setTitleBarOverlay(getOverlay());
});

function openToolWindow(toolId) {
	if (toolWindows[toolId]) {
		toolWindows[toolId].focus();
		return;
	}

	const { width, height } = screen.getPrimaryDisplay().workAreaSize;

	const win = new BrowserWindow({
		width: 420,
		height: 270,
		x: width - 440,
		y: height - 290,
		frame: false,
		alwaysOnTop: true,
		resizable: false,
		skipTaskbar: true,
		webPreferences: {
			preload: path.join(__dirname, 'tool-preload.js'),
			sandbox: false,
		},
	});

	win.loadFile(path.join(__dirname, 'tools', toolId + '.html'));
	win.on('closed', () => delete toolWindows[toolId]);
	toolWindows[toolId] = win;
}

app.whenReady().then(() => {
	createMainWindow();

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

ipcMain.on('open-tool', (_, toolId) => openToolWindow(toolId));

ipcMain.on('close-tool-window', (event) => {
	BrowserWindow.fromWebContents(event.sender)?.close();
});

ipcMain.handle('run-tool', async (_, toolId, option, input) => {
	const mod = require(path.join(__dirname, 'tools', toolId));
	return await mod.run(option, input);
});