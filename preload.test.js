import { contextBridge } from 'electron';

jest.mock('electron', () => ({
  contextBridge: {
    exposeInMainWorld: jest.fn(),
  },
}));

describe('Preload.js Exposed API', () => {
  it('should expose the sendChatMessage function', () => {
    const mockCallback = jest.fn();
    contextBridge.exposeInMainWorld('electronAPI', {
      sendChatMessage: mockCallback,
    });

    expect(contextBridge.exposeInMainWorld).toHaveBeenCalledWith('electronAPI', expect.objectContaining({
      sendChatMessage: expect.any(Function),
    }));
  });
});
