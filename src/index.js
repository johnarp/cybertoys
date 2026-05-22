const { app, BrowserWindow, globalShortcut, ipcMain, screen, Menu, Tray, nativeTheme } = require('electron');
const path = require('node:path');

if (process.platform === 'win32') {
    app.setAppUserModelId('com.johnarp.cybertoys'); 
}

if (require('electron-squirrel-startup')) app.quit();

Menu.setApplicationMenu(null);

const tools = require('./tools');
let mainWindow = null;
let tray = null;
const toolWindows = {};

function getOverlay() {
	const dark = nativeTheme.shouldUseDarkColors;
	return {
		color:       dark ? '#0f0f0f' : '#f9f9f9',
		symbolColor: dark ? '#888888' : '#666666',
		height: 36,
	};
}

function createMainWindow() {
	// If already open, just focus it
	if (mainWindow) {
		mainWindow.focus();
		return;
	}

	mainWindow = new BrowserWindow({
		width: 900,
		height: 600,
		titleBarStyle: 'hidden',
		titleBarOverlay: getOverlay(),
		icon: path.join(__dirname, 'assets', 'icon.ico'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			sandbox: false,
		},
	});

	mainWindow.loadFile(path.join(__dirname, 'index.html'));

	// Closing the window just hides it — app stays alive in the tray
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

nativeTheme.on('updated', () => {
	mainWindow?.setTitleBarOverlay(getOverlay());
});

function createTray() {
	// tray.png should be a small transparent PNG in src/assets/
	tray = new Tray(path.join(__dirname, 'assets', 'tray.png'));

	const menu = Menu.buildFromTemplate([
		{ label: 'Open CyberToys', click: () => createMainWindow() },
		{ type: 'separator' },
		{ label: 'Quit', click: () => app.quit() },
	]);

	tray.setToolTip('CyberToys');
	tray.setContextMenu(menu);

	// Left-click also opens the main window
	tray.on('click', () => createMainWindow());
}

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

	win.loadFile(path.join(__dirname, 'tools', toolId, 'index.html'));
	win.on('closed', () => delete toolWindows[toolId]);
	toolWindows[toolId] = win;
}

app.whenReady().then(() => {
	createTray();
	// No createMainWindow() here — starts in tray only, open via tray or hotkey

	for (const tool of tools) {
		if (tool.hotkey) {
			globalShortcut.register(tool.hotkey, () => openToolWindow(tool.id));
		}
	}

	app.on('activate', () => createMainWindow());
});

// Don't quit when all windows close — stay alive in the tray
app.on('window-all-closed', () => {});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});

ipcMain.on('open-tool', (_, toolId) => openToolWindow(toolId));

ipcMain.on('close-tool-window', (event) => {
	BrowserWindow.fromWebContents(event.sender)?.close();
});

ipcMain.handle('run-tool', async (_, toolId, option, input) => {
	const mod = require(path.join(__dirname, 'tools', toolId, 'index.js'));
	return await mod.run(option, input);
});