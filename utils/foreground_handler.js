/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default ForegroundHandler = () => {
  useEffect(() => {
    const unSubscribe = messaging().onMessage(async remoteMessage => {
      console.log('foreground test');
      AsyncStorage.getItem('PushNotification', (err, result) => {
        console.log('result', result);
        if (result === null) {
          console.log('fcm foreground 수신');
          PushNotification.localNotification({
            /* Android Only Properties */
            channelId: 'your-channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
            title: 'Android App',
            body: 'Test Body',
            soundName: 'default',
            vibrate: true,
            playSound: true,
          });
        }
      });
    });
    console.log('unSubscribe', unSubscribe);
    return unSubscribe;
  }, []);
  return null;
};
