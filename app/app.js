/* eslint import/no-extraneous-dependencies: ["off"] */
/* eslint import/no-unresolved: ["off"] */
/* eslint strict: ["off"] */

'use strict';

const electron = require('electron');

const { app } = electron;
const { BrowserWindow } = electron;

let win;

function createWindow() {
  win = new BrowserWindow({
    title: 'Hangouts Tools',
    icon: '../build/icon.png',
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
