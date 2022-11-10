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
      const sound = await AsyncStorage.getItem('SoundNotification');
      const vibration = await AsyncStorage.getItem('VibrationNotification');
      AsyncStorage.getItem('PushNotification', (err, result) => {
        console.log('result', result);
        if (result === 'true') {
          console.log('fcm foreground 수신');
          PushNotification.localNotification({
            channelId: 'your-channel-id',
            title: 'Android App',
            body: 'Test Body',
            soundName: 'default',
            vibrate: sound === 'true' ? true : false,
            playSound: vibration === 'true' ? true : false,
          });
        }
      });
    });
    console.log('unSubscribe', unSubscribe);
    return unSubscribe;
  }, []);
  return null;
};
