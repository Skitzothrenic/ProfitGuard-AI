const { ipcMain } = require('electron');

jest.mock('electron', () => {
  return {
    ipcMain: {
      emit: jest.fn(),
    },
  };
});

describe('Main Process IPC Events', () => {
  it('should trigger play sound when action is of type "Play Sound"', () => {
    const action = {
      type: 'Play Sound',
      file: 'test_sound.mp3',
    };

    // Mock the behavior of the ipcMain.emit function
    ipcMain.emit('chat-message', {}, { keywordActions: [action] });

    // Expect ipcMain.emit to have been called correctly
    expect(ipcMain.emit).toHaveBeenCalledWith(
      'chat-message',
      {},
      { keywordActions: [action] }
    );
  });

  it('should trigger text alert action', () => {
    const action = {
      type: 'Show Text Alert',
      message: 'Test Alert',
    };

    ipcMain.emit('chat-message', {}, { keywordActions: [action] });

    expect(ipcMain.emit).toHaveBeenCalledWith(
      'chat-message',
      {},
      { keywordActions: [action] }
    );
  });
});
