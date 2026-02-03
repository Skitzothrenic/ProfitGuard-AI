import React, { useEffect, useState } from 'react';

function TimerDisplay({ id, name, duration, direction = 'down', size = 'medium', onFinish }) {
  const parsedDuration = Number(duration);
  const initialSeconds = !isNaN(parsedDuration) ? parsedDuration : 10;

  const [startTime, setStartTime] = useState(Date.now());
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setStartTime(Date.now());
    setSecondsLeft(initialSeconds);
    console.log('[TimerDisplay] Reset due to ID change:', {
      id,
      name,
      duration,
      parsedDuration,
      direction,
      size,
    });
  }, [id]);

  useEffect(() => {
    if (isNaN(parsedDuration)) {
      console.warn('[TimerDisplay] Invalid duration, defaulting to 10s');
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);

      const remaining = direction === 'down'
        ? Math.max(0, parsedDuration - elapsed)
        : elapsed;

      setSecondsLeft(remaining);

      if (direction === 'down' && remaining === 0) {
        clearInterval(interval);
        if (onFinish) onFinish();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, parsedDuration, direction, onFinish]);

  const fontSizeMap = {
    small: '1rem',
    medium: '1.5rem',
    large: '2rem',
  };

  return (
    <div
      style={{
        background: '#222',
        color: '#fff',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        marginTop: '0.5rem',
        fontSize: fontSizeMap[size] || '1.5rem',
      }}
    >
      <strong>{name}:</strong> {secondsLeft}<span> s</span>
    </div>
  );
}

export default TimerDisplay;
