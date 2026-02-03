
import { getActionsForMessage } from './chatparser';

describe('getActionsForMessage', () => {
  it('returns the correct action for matching keywords', () => {
    const keywordActions = [
      { keyword: 'test', action: { type: 'Play Sound' }, enabled: true },
      { keyword: 'example', action: { type: 'Show Text Alert' }, enabled: true }
    ];

    const actions = getActionsForMessage('test message', keywordActions);
    expect(actions).toEqual([{ type: 'Play Sound' }]);
  });

  it('ignores disabled keywords', () => {
    const keywordActions = [
      { keyword: 'test', action: { type: 'Play Sound' }, enabled: false }
    ];

    const actions = getActionsForMessage('test message', keywordActions);
    expect(actions).toEqual([]);
  });

  it('processes category-enabled actions correctly', () => {
    const keywordActions = [
      { keyword: 'test', action: { type: 'Play Sound' }, enabled: true, categoryEnabled: false },
      { keyword: 'hello', action: { type: 'Show Text Alert' }, enabled: true, categoryEnabled: true }
    ];

    const actions = getActionsForMessage('hello message', keywordActions);
    expect(actions).toEqual([{ type: 'Show Text Alert' }]);
  });
});
    