import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError, AxiosResponse} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFCMToken();
  }
}

async function getFCMToken() {
  const fcmToken = await AsyncStorage.getItem('fcmToken');
  const accessToken = await EncryptedStorage.getItem('accessToken');
  console.log('fcmToken is : ', fcmToken);
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      console.log('fcmToken is : ', fcmToken);
      const response = await axios.patch(
        'http://146.56.188.32:8002/users/device/token',
        {
          device_token: fcmToken,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('user/device/token', response);
      if (fcmToken) {
        AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (err) {
      console.log(err.response.data.msg);
    }
  }
}

const notificationListner = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log('notification on froground state', remoteMessage);
  });
};

export {requestUserPermission, notificationListner, getFCMToken};
