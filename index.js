/**
 * @format
 */






import { AppRegistry } from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import 'react-native-gesture-handler';  
import notifee, {AndroidImportance} from '@notifee/react-native';   

messaging().setBackgroundMessageHandler(async remoteMessage => {
    // console.log('Message handled in the background!', remoteMessage);
    DisplayNotification(remoteMessage);
})
messaging().getInitialNotification(async remoteMessage => {
    // console.log('Message handled in the background!', remoteMessage);
    DisplayNotification(remoteMessage);
})


async function DisplayNotification(remoteMessage) {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default', // Set the default notification sound
    icon: 'ic_launcher', // Set the icon launcher
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // Set the small icon for the notification
      largeIcon: 'ic_launcher', // Set the large icon for the notification
      sound: 'default', // Set the default notification sound
      },
    });
  }

AppRegistry.registerComponent(appName, () => App);
