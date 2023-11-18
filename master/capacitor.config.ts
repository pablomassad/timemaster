import {CapacitorConfig} from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.pp.timemaster',
  appName: 'Terranostra',
  webDir: 'dist/spa',
  bundledWebRuntime: false,
  server: {hostname: "localhost:8080", androidScheme: "http", cleartext: true},
  //server: {url: 'http://192.168.1.9:9000', cleartext: true},
  android: {
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    //PushNotifications: {
    //  presentationOptions: ["badge", "sound", "alert"],
    //},
    Badge: {
      persist: true,
      autoClear: false
    },
    LocalNotifications: {
      smallIcon: "ic_launcher",
      iconColor: "#488AFF",
      sound: "beep.wav",
    }
  }
}
export default config
