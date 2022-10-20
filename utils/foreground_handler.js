/* eslint-disable no-undef */
import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import PushNotification from 'react-native-push-notification';

export default ForegroundHandler = () => {
  useEffect(() => {
    const unSubscribe = messaging().onMessage(async remoteMessage => {
      console.log(1);
      console.log('notification on froground state', remoteMessage);
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'your-channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        title: 'Android App',
        body: 'Test Body',
        soundName: 'default',
        vibrate: true,
        playSound: true,
      });
    });
    return unSubscribe;
  }, []);
  return null;
};
