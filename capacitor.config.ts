import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.eaf83cc6471d4e34acf723771c76805b',
  appName: 'Crypto Scanner',
  webDir: 'dist',
  server: {
    url: 'https://eaf83cc6-471d-4e34-acf7-23771c76805b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#00f7ff',
      sound: 'signal.wav'
    }
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0a0a0f'
  }
};

export default config;
