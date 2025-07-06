
console.log('preload script loaded'); // 디버깅 로그 추가
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendCommand: (command) => ipcRenderer.send('gemini-command', command),
  onReply: (callback) => ipcRenderer.on('gemini-reply', (_event, value) => callback(value)),
});
