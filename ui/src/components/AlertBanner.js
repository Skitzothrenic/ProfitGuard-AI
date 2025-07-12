// File: /ui/src/components/AlertBanner.js
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const AlertBanner = ({ message = 'Alert', duration = 5000, onClose }) => {
  useEffect(() => {
    console.log('[AlertBanner] Showing alert:', message, 'for', duration, 'ms');

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, message]);

  return ReactDOM.createPortal(
    <div style={styles.alertContainer}>
      <div style={styles.alertBox}>
        <span>{message || 'No message provided'}</span>
        <button
          style={styles.closeBtn}
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
        >
          ✖
        </button>
      </div>
    </div>,
    document.body
  );
};

const styles = {
  alertContainer: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    pointerEvents: 'none',
  },
  alertBox: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    position: 'relative',
    pointerEvents: 'auto',
  },
  closeBtn: {
    position: 'absolute',
    top: '4px',
    right: '8px',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default AlertBanner;
