const { app, BrowserWindow } = require('electron');
const path = require('node:path');

function criarJanela() {
  const janela = new BrowserWindow({ width: 1280, height: 800, minWidth: 1000, minHeight: 650, autoHideMenuBar: true, webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true } });
  janela.loadFile(path.join(__dirname, '../dist/index.html'));
}

app.whenReady().then(() => {
  criarJanela();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) criarJanela();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});