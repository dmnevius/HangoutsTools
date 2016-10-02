const electron = require('electron');

const { app } = electron;
const { BrowserWindow } = electron;
const { ipcMain } = electron;

let win;

function createWindow() {
  win = new BrowserWindow({
    title: 'Hangouts Tools',
    icon: './images/icons/icon.png',
  });

  win.loadURL(`file://${__dirname}/index.html`);

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('toggle-dev-mode-true', () => {
  win.webContents.openDevTools();
});

ipcMain.on('toggle-dev-mode-false', () => {
  win.webContents.closeDevTools();
});
