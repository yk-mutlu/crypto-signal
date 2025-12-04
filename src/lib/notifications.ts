import { SignalResult } from './indicators';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendSignalNotification(signal: SignalResult) {
  if (Notification.permission !== 'granted') return;

  const icon = signal.direction === 'LONG' ? '📈' : '📉';
  const title = `${icon} ${signal.direction} Sinyali`;
  const body = `${signal.symbol} ${signal.timeframe} grafikte ${signal.direction === 'LONG' ? 'yukarı' : 'aşağı'} kesişim tespit edildi.\nRSI: ${signal.rsi.toFixed(1)} | Fiyat: $${signal.price.toFixed(2)}`;

  const notification = new Notification(title, {
    body,
    icon: signal.direction === 'LONG' ? '/icon-192.png' : '/icon-192.png',
    tag: `${signal.symbol}-${signal.direction}`,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  // Auto close after 10 seconds
  setTimeout(() => notification.close(), 10000);
}

export function playSignalSound(direction: 'LONG' | 'SHORT') {
  // Create audio context for notification sound
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Different frequencies for LONG vs SHORT
  oscillator.frequency.value = direction === 'LONG' ? 880 : 440;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}
