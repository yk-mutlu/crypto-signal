import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flurystudio.cryptoscanner',
  appName: 'Crypto Scanner',
  webDir: 'dist',
  server: {},
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#0004ffff',
      sound: 'signal.wav'
    }
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0a0a0f'
  }
};

export default config;
