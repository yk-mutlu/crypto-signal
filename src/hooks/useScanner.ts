import { useState, useEffect, useCallback } from 'react';
import { scanner, ScanStatus, ScannerConfig, defaultConfig } from '@/lib/scanner';
import { SignalResult } from '@/lib/indicators';
import { sendSignalNotification, playSignalSound, requestNotificationPermission } from '@/lib/notifications';

export function useScanner() {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<ScanStatus>(scanner.getStatus());
  const [signals, setSignals] = useState<SignalResult[]>([]);
  const [config, setConfig] = useState<ScannerConfig>(defaultConfig);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Check notification permission on mount
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }

    // Load saved config from localStorage
    const savedConfig = localStorage.getItem('scanner-config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
      scanner.setConfig(parsed);
    }

    // Load saved signals
    const savedSignals = localStorage.getItem('scanner-signals');
    if (savedSignals) {
      setSignals(JSON.parse(savedSignals));
    }

    // Subscribe to scanner events
    scanner.subscribe(
      (signal) => {
        setSignals(prev => {
          const newSignals = [signal, ...prev].slice(0, 100);
          localStorage.setItem('scanner-signals', JSON.stringify(newSignals));
          return newSignals;
        });
        
        if (notificationsEnabled) {
          sendSignalNotification(signal);
        }
        
        if (soundEnabled) {
          playSignalSound(signal.direction);
        }
      },
      (newStatus) => {
        setStatus(newStatus);
      }
    );

    return () => {
      scanner.stop();
    };
  }, []);

  // Re-subscribe when notification/sound settings change
  useEffect(() => {
    scanner.subscribe(
      (signal) => {
        setSignals(prev => {
          const newSignals = [signal, ...prev].slice(0, 100);
          localStorage.setItem('scanner-signals', JSON.stringify(newSignals));
          return newSignals;
        });
        
        if (notificationsEnabled) {
          sendSignalNotification(signal);
        }
        
        if (soundEnabled) {
          playSignalSound(signal.direction);
        }
      },
      (newStatus) => {
        setStatus(newStatus);
      }
    );
  }, [notificationsEnabled, soundEnabled]);

  const startScanner = useCallback(() => {
    scanner.start();
    setIsRunning(true);
  }, []);

  const stopScanner = useCallback(() => {
    scanner.stop();
    setIsRunning(false);
  }, []);

  const updateConfig = useCallback((newConfig: Partial<ScannerConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    scanner.setConfig(updated);
    localStorage.setItem('scanner-config', JSON.stringify(updated));
  }, [config]);

  const enableNotifications = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    return granted;
  }, []);

  const clearSignals = useCallback(() => {
    setSignals([]);
    localStorage.removeItem('scanner-signals');
  }, []);

  return {
    isRunning,
    status,
    signals,
    config,
    notificationsEnabled,
    soundEnabled,
    startScanner,
    stopScanner,
    updateConfig,
    enableNotifications,
    setSoundEnabled,
    clearSignals,
  };
}
