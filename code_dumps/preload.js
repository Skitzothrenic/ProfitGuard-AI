// File: /preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendChatMessage: (data) => ipcRenderer.send('chat-message', data),
  sendKeywordActions: (actions) => ipcRenderer.send('keyword-actions', actions),

  onPlaySound: (callback) => {
    ipcRenderer.removeAllListeners('play-sound');
    ipcRenderer.on('play-sound', callback);
  },

  onShowAlert: (callback) => {
    ipcRenderer.removeAllListeners('show-alert');
    ipcRenderer.on('show-alert', (event, message) => {
      callback(message);
    });
  },

  onStartTimer: (callback) => {
    ipcRenderer.removeAllListeners('start-timer');
    ipcRenderer.on('start-timer', (event, config) => {
      callback(config);
    });
  },
});
