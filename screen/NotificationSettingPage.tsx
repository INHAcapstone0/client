/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  Switch,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import {userActions} from '../slices/user';
import {useAppDispatch} from '../store/Store';
import axios from 'axios';
import {RootState} from '../store/Store';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  notificationListner,
  requestUserPermission,
  notificationOff,
} from '../utils/push_notification_helper';

function NotificationSettingPage() {
  const [enabledPushNotification, setEnabledPushNotification] = useState(true);
  const [enabledSoundNotification, setEnabledSoundNotification] =
    useState(true);
  const [enabledVibrationNotification, setEnabledVibrationNotification] =
    useState(true);

  useEffect(() => {
    loadNotifiCationData();
  }, []);

  const loadNotifiCationData = async () => {
    const push = await AsyncStorage.getItem('PushNotification');
    const sound = await AsyncStorage.getItem('SoundNotification');
    const vibration = await AsyncStorage.getItem('VibrationNotification');

    if (push === 'false') {
      setEnabledPushNotification(false);
    }

    if (sound === 'false') {
      setEnabledSoundNotification(false);
    }

    if (vibration === 'false') {
      setEnabledVibrationNotification(false);
    }
  };

  const togglePushSwitch = () => {
    if (enabledPushNotification) {
      notificationOff();
      setEnabledPushNotification(false);
      setEnabledSoundNotification(false);
      setEnabledVibrationNotification(false);

      AsyncStorage.setItem('PushNotification', 'false');
      AsyncStorage.setItem('SoundNotification', 'false');
      AsyncStorage.setItem('VibrationNotification', 'false');
    } else {
      requestUserPermission();
      notificationListner();
      setEnabledPushNotification(true);
      setEnabledSoundNotification(true);
      setEnabledVibrationNotification(true);
      AsyncStorage.removeItem('PushNotification');
      AsyncStorage.removeItem('SoundNotification');
      AsyncStorage.removeItem('VibrationNotification');
    }
  };
  const toggleSoundSwitch = () => {
    if (enabledSoundNotification) {
      setEnabledSoundNotification(false);
      AsyncStorage.setItem('SoundNotification', 'false');
    } else {
      setEnabledPushNotification(true);
      setEnabledSoundNotification(true);
      AsyncStorage.removeItem('PushNotification');
      AsyncStorage.removeItem('SoundNotification');
    }
  };
  const toggleVibrationSwitch = () => {
    if (enabledVibrationNotification) {
      setEnabledVibrationNotification(false);
      AsyncStorage.setItem('VibrationNotification', 'false');
    } else {
      setEnabledPushNotification(true);
      setEnabledVibrationNotification(true);
      AsyncStorage.removeItem('PushNotification');
      AsyncStorage.removeItem('VibrationNotification');
    }
  };

  return (
    <View style={styles.windowContainer}>
      <View style={styles.notificationSettingHeader}>
        <Text style={styles.notificationSettingHeaderTitle}>알림 설정</Text>
      </View>
      <View style={styles.notificationItemSection}>
        <Text style={styles.notificationItemTitle}>푸쉬알람 설정</Text>
        <Switch
          trackColor={{false: '#767577', true: '#21B8CD'}}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={togglePushSwitch}
          value={enabledPushNotification}
        />
      </View>
      <View style={styles.borderLine} />
      <View style={styles.notificationItemSection}>
        <Text style={styles.notificationItemTitle}>소리 설정</Text>
        <Switch
          trackColor={{false: '#767577', true: '#21B8CD'}}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSoundSwitch}
          value={enabledSoundNotification}
        />
      </View>
      <View style={styles.borderLine} />
      <View style={styles.notificationItemSection}>
        <Text style={styles.notificationItemTitle}>진동 설정</Text>
        <Switch
          trackColor={{false: '#767577', true: '#21B8CD'}}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleVibrationSwitch}
          value={enabledVibrationNotification}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  windowContainer: {
    padding: 20,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
  },
  notificationSettingHeader: {
    height: 50,
    alignItems: 'center',
  },
  notificationSettingHeaderTitle: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  borderLine: {
    height: 1,
    backgroundColor: '#21B8CD',
    width: Dimensions.get('window').width * 0.9,
  },
  notificationItemSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
  },
  notificationItemTitle: {fontSize: 15, fontFamily: 'Roboto', color: 'black'},
});
export default NotificationSettingPage;
