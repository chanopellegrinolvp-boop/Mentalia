import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'online.mentaliasalud.app',
  appName: 'Mentalia',
  webDir: 'out',
  server: {
    url: 'https://mentaliasalud.online',
    cleartext: false
  }
};

export default config;
