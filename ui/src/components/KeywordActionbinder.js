import React, { useEffect, useState } from 'react';
import './KeywordActionBinder.css';

function KeywordActionBinder() {
  console.log('[Renderer] KeywordActionBinder mounted');

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [actionType, setActionType] = useState('Play Sound');
  const [volume, setVolume] = useState(100);
  const [soundFile, setSoundFile] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('#ff0000');
  const [alertDuration, setAlertDuration] = useState(5);
  const [alertFontSize, setAlertFontSize] = useState(24);
  const [timerName, setTimerName] = useState('');
  const [timerDuration, setTimerDuration] = useState(10);
  const [timerDirection, setTimerDirection] = useState('down');
  const [timerColor, setTimerColor] = useState('#00ff00');
  const [timerSize, setTimerSize] = useState('medium');
  const [keyPressValue, setKeyPressValue] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [triggerStates, setTriggerStates] = useState({});
  const [keywordActions, setKeywordActions] = useState([]);
  const [categoryToggles, setCategoryToggles] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [resetTimer, setResetTimer] = useState(false);  // New option to reset or create new timer
  const [activeTimers, setActiveTimers] = useState({}); // Track active timers by keyword

  useEffect(() => {
    console.log('[KeywordActionBinder] Loading from localStorage');
    const stored = localStorage.getItem('keywordActions');
    const states = localStorage.getItem('triggerStates');
    const toggles = localStorage.getItem('categoryToggles');

    if (stored) setKeywordActions(JSON.parse(stored));
    if (states) setTriggerStates(JSON.parse(states));
    if (toggles) setCategoryToggles(JSON.parse(toggles));
  }, []);

  useEffect(() => {
    localStorage.setItem('keywordActions', JSON.stringify(keywordActions));
  }, [keywordActions]);

  useEffect(() => {
    localStorage.setItem('triggerStates', JSON.stringify(triggerStates));
  }, [triggerStates]);

  useEffect(() => {
    localStorage.setItem('categoryToggles', JSON.stringify(categoryToggles));
  }, [categoryToggles]);

  useEffect(() => {
    if (window.electronAPI?.onShowAlert) {
      window.electronAPI.onShowAlert((_, alertData) => {
        console.log('[Renderer] Received alert:', alertData);
      });
    }
    if (window.electronAPI?.onPlaySound) {
      window.electronAPI.onPlaySound((_, soundPath) => {
        console.log('[Renderer] Received sound trigger:', soundPath);
        const audio = new Audio(soundPath);
        audio.volume = volume / 100;
        audio.play();
      });
    }
    if (window.electronAPI?.onStartTimer) {
      window.electronAPI.onStartTimer((_, timerData) => {
        console.log('[Renderer] Received timer trigger:', timerData);
      });
    }
  }, [volume]);

  const exportBindings = () => {
    const data = {
      keywordActions,
      triggerStates,
      categoryToggles
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bindings.json';
    a.click();
    URL.revokeObjectURL(url);
    console.log('[KeywordActionBinder] Exported bindings.json');
  };

  const importBindings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        setKeywordActions(imported.keywordActions || []);
        setTriggerStates(imported.triggerStates || {});
        setCategoryToggles(imported.categoryToggles || {});
        console.log('[KeywordActionBinder] Imported bindings from file');
      } catch (err) {
        console.error('[KeywordActionBinder] Failed to import bindings:', err);
      }
    };
    reader.readAsText(file);
  };

  const sendChatMessage = () => {
    if (chatMessage && window.electronAPI?.sendChatMessage) {
      const categoryStates = {};
      for (const key in grouped) {
        const group = grouped[key];
        if (Array.isArray(group) && group.length > 0) {
          const anyEnabled = group.some(item => triggerStates[item.index] !== false);
          categoryStates[key] = anyEnabled;
        }
      }

      const packaged = keywordActions.map((entry, index) => ({
        ...entry,
        index,
        enabled: triggerStates[index] !== false,
        categoryEnabled: categoryStates[entry.category || 'Uncategorized'] !== false,
      }));

      console.log('[KeywordActionBinder] Sending chat-message with keywordActions:', packaged);

      window.electronAPI.sendChatMessage({
        message: chatMessage,
        keywordActions: packaged,
      });
    }
  };

  const clearForm = () => {
    setKeyword('');
    setCategory('');
    setActionType('Play Sound');
    setSoundFile(null);
    setVolume(100);
    setAlertMessage('');
    setAlertColor('#ff0000');
    setAlertDuration(5);
    setAlertFontSize(24);
    setTimerName('');
    setTimerDuration(10);
    setTimerDirection('down');
    setTimerColor('#00ff00');
    setTimerSize('medium');
    setKeyPressValue('');
    setEditingIndex(null);
  };

  const addOrUpdateAction = () => {
    const keywords = keyword.split(',').map(k => k.trim()).filter(k => k);
    if (keywords.length === 0) return;

    const action = { type: actionType };

    if (actionType === 'Play Sound') {
      if (soundFile) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result;
          const newActions = keywords.map(k => ({
            keyword: k,
            category,
            action: {
              type: 'Play Sound',
              file: base64,
              volume
            }
          }));
          const updated = [...keywordActions];
          if (editingIndex !== null) {
            updated[editingIndex] = newActions[0];
          } else {
            updated.push(...newActions);
          }
          setKeywordActions(updated);
          setCategoryToggles(prev => ({
            ...prev,
            [category || 'Uncategorized']: prev[category || 'Uncategorized'] ?? true
          }));
          clearForm();
        };
        reader.readAsDataURL(soundFile);
        return;
      }
    } else if (actionType === 'Show Text Alert') {
      action.message = alertMessage;
      action.color = alertColor;
      action.duration = alertDuration;
      action.fontSize = `${alertFontSize}px`;
    } else if (actionType === 'Start Timer') {
      action.name = timerName;
      action.duration = timerDuration;
      action.direction = timerDirection;
      action.color = timerColor;
      action.size = timerSize;
      action.reset = resetTimer;
    } else if (actionType === 'Key Press') {
      action.keys = keyPressValue;
    }

    const newActions = keywords.map(k => ({
      keyword: k,
      category,
      action
    }));

    // Handle resetting timers for repeated keywords
    newActions.forEach(newAction => {
      if (resetTimer && activeTimers[newAction.keyword]) {
        console.log(`[KeywordActionBinder] Resetting timer for keyword: ${newAction.keyword}`);
        // If reset is enabled and the timer exists, reset it
        clearTimeout(activeTimers[newAction.keyword]);
        console.log(`[KeywordActionBinder] Timer for keyword ${newAction.keyword} has been reset.`);
      }
      const timer = setTimeout(() => {
        console.log(`[Main] Timer for keyword ${newAction.keyword} started.`);
        // Call actual timer starting logic here (e.g., start timer)
      }, newAction.action.duration * 1000); // Simulate the timer duration
      activeTimers[newAction.keyword] = timer;
      console.log(`[Main] Timer for keyword ${newAction.keyword} set. Current timers:`, activeTimers);
    });

    const updated = [...keywordActions];
    if (editingIndex !== null) {
      updated[editingIndex] = newActions[0];
    } else {
      updated.push(...newActions);
    }

    setKeywordActions(updated);
    setCategoryToggles(prev => ({
      ...prev,
      [category || 'Uncategorized']: prev[category || 'Uncategorized'] ?? true
    }));
    clearForm();
  };

  const editTrigger = (index) => {
    const entry = keywordActions[index];
    setKeyword(entry.keyword);
    setCategory(entry.category || '');
    setActionType(entry.action.type);
    if (entry.action.type === 'Show Text Alert') {
      setAlertMessage(entry.action.message);
      setAlertColor(entry.action.color);
      setAlertDuration(entry.action.duration);
      setAlertFontSize(parseInt(entry.action.fontSize));
    } else if (entry.action.type === 'Start Timer') {
      setTimerName(entry.action.name);
      setTimerDuration(entry.action.duration);
      setTimerDirection(entry.action.direction);
      setTimerColor(entry.action.color);
      setTimerSize(entry.action.size);
    } else if (entry.action.type === 'Key Press') {
      setKeyPressValue(entry.action.keys);
    }
    setEditingIndex(index);
  };

  const deleteTrigger = (index) => {
    const updated = keywordActions.filter((_, i) => i !== index);
    setKeywordActions(updated);
    setEditingIndex(null);
    clearForm();
  };

  const toggleTrigger = (index) => {
    setTriggerStates({
      ...triggerStates,
      [index]: !triggerStates[index]
    });
  };

  const toggleCategory = (cat) => {
    setCategoryToggles(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const testSound = () => {
    if (soundFile) {
      const url = URL.createObjectURL(soundFile);
      const audio = new Audio(url);
      audio.volume = volume / 100;
      audio.play();
    }
  };

  const grouped = keywordActions.reduce((acc, curr, idx) => {
    const cat = curr.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ ...curr, index: idx });
    return acc;
  }, {});

  return (
    <div className="keyword-action-container">
      <h2>Keyword Action Binder</h2>

      <div style={{ marginBottom: '1em' }}>
        <button onClick={exportBindings}>Export Bindings</button>
        <input type="file" accept=".json" onChange={importBindings} />
      </div>

      <input type="text" placeholder="Keyword(s, comma-separated)" value={keyword} onChange={e => setKeyword(e.target.value)} />
      <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />

      <select value={actionType} onChange={e => setActionType(e.target.value)}>
        <option>Play Sound</option>
        <option>Show Text Alert</option>
        <option>Start Timer</option>
        <option>Key Press</option>
      </select>

      {actionType === 'Play Sound' && (
        <div>
          <input type="file" accept="audio/*" onChange={e => setSoundFile(e.target.files[0])} />
          <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} />
          <button onClick={testSound}>Test Sound</button>
        </div>
      )}

      {actionType === 'Show Text Alert' && (
        <div>
          <input type="text" placeholder="Alert Message" value={alertMessage} onChange={e => setAlertMessage(e.target.value)} />
          <input type="color" value={alertColor} onChange={e => setAlertColor(e.target.value)} />
          <input type="number" placeholder="Duration (s)" value={alertDuration} onChange={e => setAlertDuration(Number(e.target.value))} />
          <input type="number" placeholder="Font Size (px)" value={alertFontSize} onChange={e => setAlertFontSize(Number(e.target.value))} />
        </div>
      )}

      {actionType === 'Start Timer' && (
        <div>
          <input type="text" placeholder="Timer Name" value={timerName} onChange={e => setTimerName(e.target.value)} />
          <input type="number" placeholder="Duration (s)" value={timerDuration} onChange={e => setTimerDuration(Number(e.target.value))} />
          <select value={timerDirection} onChange={e => setTimerDirection(e.target.value)}>
            <option value="up">Up</option>
            <option value="down">Down</option>
          </select>
          <input type="color" value={timerColor} onChange={e => setTimerColor(e.target.value)} />
          <select value={timerSize} onChange={e => setTimerSize(e.target.value)}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={resetTimer}
              onChange={() => setResetTimer(!resetTimer)}
            />
            Reset Timer on Multiple Keywords
          </label>
        </div>
      )}

      {actionType === 'Key Press' && (
        <div>
          <input type="text" placeholder="Keys to press" value={keyPressValue} onChange={e => setKeyPressValue(e.target.value)} />
        </div>
      )}

      <button onClick={addOrUpdateAction}>{editingIndex !== null ? 'Save' : 'Assign'}</button>
      {editingIndex !== null && <button onClick={clearForm}>Cancel</button>}

      <h3>Category Toggles</h3>
      {Object.keys(grouped).map(cat => (
        <div key={cat}>
          <label>
            <input type="checkbox" checked={categoryToggles[cat] !== false} onChange={() => toggleCategory(cat)} />
            {cat}
          </label>
        </div>
      ))}

      <h3>Current Keyword Bindings</h3>
      {Object.keys(grouped).map(cat => (
        <div key={cat}>
          <strong>{cat}</strong>
          <ul>
            {grouped[cat].map(item => (
              <li key={item.index}>
                <input type="checkbox" checked={triggerStates[item.index] !== false} onChange={() => toggleTrigger(item.index)} />
                {`${item.keyword}: ${item.action.type}`}
                <button onClick={() => editTrigger(item.index)}>Edit</button>
                <button onClick={() => deleteTrigger(item.index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <input type="text" placeholder="Chat Message" value={chatMessage} onChange={e => setChatMessage(e.target.value)} />
      <button onClick={sendChatMessage}>Send Chat Message</button>
    </div>
  );
}

export default KeywordActionBinder;
