// File: /ui/src/components/KeywordActionBinder.js
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
  const [chatMessage, setChatMessage] = useState('');
  const [triggerStates, setTriggerStates] = useState({});
  const [keywordActions, setKeywordActions] = useState([]);

  useEffect(() => {
    console.log('[KeywordActionBinder] Loading from localStorage');
    const stored = localStorage.getItem('keywordActions');
    const states = localStorage.getItem('triggerStates');

    if (stored) setKeywordActions(JSON.parse(stored));
    if (states) setTriggerStates(JSON.parse(states));
  }, []);

  useEffect(() => {
    localStorage.setItem('keywordActions', JSON.stringify(keywordActions));
  }, [keywordActions]);

  useEffect(() => {
    localStorage.setItem('triggerStates', JSON.stringify(triggerStates));
  }, [triggerStates]);

  // Fix for crash on 'on' call
  useEffect(() => {
    if (window.electron?.onShowAlert) {
      window.electron.onShowAlert((_, alertData) => {
        console.log('[Renderer] Received alert:', alertData);
      });
    }
    if (window.electron?.onPlaySound) {
      window.electron.onPlaySound((_, soundPath) => {
        console.log('[Renderer] Received sound trigger:', soundPath);
        const audio = new Audio(soundPath);
        audio.play();
      });
    }
    if (window.electron?.onStartTimer) {
      window.electron.onStartTimer((_, timerData) => {
        console.log('[Renderer] Received timer trigger:', timerData);
      });
    }
  }, []);

  const sendChatMessage = () => {
    if (chatMessage && window.electron?.sendChatMessage) {
      window.electron.sendChatMessage({
        message: chatMessage,
        keywordActions,
      });
    }
  };

  const addAction = () => {
    const action = { type: actionType };

    if (actionType === 'Play Sound') {
      action.file = soundFile;
      action.volume = volume;
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
    }

    const updated = [...keywordActions, {
      keyword,
      category,
      action
    }];
    setKeywordActions(updated);
    setKeyword('');
    setCategory('');
  };

  const deleteTrigger = (index) => {
    const updated = keywordActions.filter((_, i) => i !== index);
    setKeywordActions(updated);
  };

  const toggleTrigger = (index) => {
    setTriggerStates({
      ...triggerStates,
      [index]: !triggerStates[index]
    });
  };

  // Group actions by keyword
  const grouped = keywordActions.reduce((acc, curr, idx) => {
    const cat = curr.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ ...curr, index: idx });
    return acc;
  }, {});

  return (
    <div className="keyword-action-container">
      <h2>Keyword Action Binder</h2>
      <input
        type="text"
        placeholder="Keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
        <option>Play Sound</option>
        <option>Show Text Alert</option>
        <option>Start Timer</option>
      </select>

      {actionType === 'Play Sound' && (
        <div>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setSoundFile(e.target.files[0])}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
      )}

      {actionType === 'Show Text Alert' && (
        <div>
          <input
            type="text"
            placeholder="Alert Message"
            value={alertMessage}
            onChange={(e) => setAlertMessage(e.target.value)}
          />
          <input
            type="color"
            value={alertColor}
            onChange={(e) => setAlertColor(e.target.value)}
          />
          <input
            type="number"
            placeholder="Duration (s)"
            value={alertDuration}
            onChange={(e) => setAlertDuration(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Font Size (px)"
            value={alertFontSize}
            onChange={(e) => setAlertFontSize(Number(e.target.value))}
          />
        </div>
      )}

      {actionType === 'Start Timer' && (
        <div>
          <input
            type="text"
            placeholder="Timer Name"
            value={timerName}
            onChange={(e) => setTimerName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Duration (s)"
            value={timerDuration}
            onChange={(e) => setTimerDuration(Number(e.target.value))}
          />
          <select
            value={timerDirection}
            onChange={(e) => setTimerDirection(e.target.value)}
          >
            <option value="up">Up</option>
            <option value="down">Down</option>
          </select>
          <input
            type="color"
            value={timerColor}
            onChange={(e) => setTimerColor(e.target.value)}
          />
          <select
            value={timerSize}
            onChange={(e) => setTimerSize(e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      )}

      <button onClick={addAction}>Assign</button>

      <h3>Current Keyword Bindings</h3>
      {Object.keys(grouped).map((cat) => (
        <div key={cat}>
          <strong>{cat}</strong>
          <ul>
            {grouped[cat].map((item) => (
              <li key={item.index}>
                <input
                  type="checkbox"
                  checked={triggerStates[item.index] !== false}
                  onChange={() => toggleTrigger(item.index)}
                />
                {`${item.keyword}: ${item.action.type}`}
                <button onClick={() => deleteTrigger(item.index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <input
        type="text"
        placeholder="Chat Message"
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
      />
      <button onClick={sendChatMessage}>Send Chat Message</button>
    </div>
  );
}

export default KeywordActionBinder;
