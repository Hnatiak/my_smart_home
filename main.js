const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('change-bg-color', (event, color) => {
  event.sender.send('change-bg-color', color);
});

ipcMain.on('button-action', (event, buttonNumber) => {
  event.sender.send('button-action', `Button ${buttonNumber} clicked`);
});

ipcMain.on('send-message', (event, message) => {
  event.sender.send('send-message', `You: ${message}`);
});