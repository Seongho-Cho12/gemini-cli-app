import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let geminiProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (geminiProcess) {
      geminiProcess.kill();
    }
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('gemini-command', (event, command) => {
  console.log('Received command:', command);
  // 기존 geminiProcess가 있다면 종료
  if (geminiProcess) {
    geminiProcess.kill();
    geminiProcess = null;
  }

  geminiProcess = spawn('gemini', ['--prompt', command]);
  console.log('Gemini process spawned with prompt:', command);

  geminiProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('Gemini stdout:', output);
    mainWindow.webContents.send('gemini-reply', output);
  });

  geminiProcess.stderr.on('data', (data) => {
    console.log('Gemini stderr:', data.toString());
    mainWindow.webContents.send('gemini-reply', `Error: ${data.toString()}`);
  });

  geminiProcess.on('close', (code) => {
    console.log('Gemini process closed with code:', code);
    mainWindow.webContents.send('gemini-reply', `Process exited with code ${code}`);
    geminiProcess = null;
  });
});