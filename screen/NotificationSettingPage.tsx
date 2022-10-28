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
import {userActions} from '../slices/User';
import {useAppDispatch} from '../store/Store';
import axios from 'axios';
import {RootState} from '../store/Store';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

function NotificationSettingPage() {
  const dispatch = useAppDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );

  const [enabledPushNotification, setEnabledPushNotification] =
    useState(Boolean);
  const [enabledSoundNotification, setEnabledSoundNotification] =
    useState(Boolean);
  const [enabledVibrationNotification, setEnabledVibrationNotification] =
    useState(Boolean);

  const togglePushSwitch = () => {
    if (enabledPushNotification) {
      setEnabledSoundNotification(false);
      setEnabledVibrationNotification(false);
      setEnabledPushNotification(false);

      AsyncStorage.setItem('PushNotification', 'false');
      AsyncStorage.setItem('SoundNotification', 'false');
      AsyncStorage.setItem('VibrationNotification', 'false');
    } else {
      setEnabledPushNotification(true);
      AsyncStorage.setItem('PushNotification', 'true');
    }
  };
  const toggleSoundSwitch = () => {
    if (enabledSoundNotification) {
      setEnabledSoundNotification(false);
      AsyncStorage.setItem('SoundNotification', 'false');
    } else {
      setEnabledPushNotification(true);
      setEnabledSoundNotification(true);
      AsyncStorage.setItem('PushNotification', 'true');
      AsyncStorage.setItem('SoundNotification', 'true');
    }
  };
  const toggleVibrationSwitch = () => {
    if (enabledVibrationNotification) {
      setEnabledVibrationNotification(false);
      AsyncStorage.setItem('VibrationNotification', 'false');
    } else {
      setEnabledPushNotification(true);
      setEnabledVibrationNotification(true);
      AsyncStorage.setItem('PushNotification', 'true');
      AsyncStorage.setItem('VibrationNotification', 'true');
    }
  };

  const loadNotifiCationData = async () => {
    const push = await AsyncStorage.getItem('PushNotification');
    const sound = await AsyncStorage.getItem('SoundNotification');
    const vibration = await AsyncStorage.getItem('VibrationNotification');

    if (push === 'true') {
      setEnabledPushNotification(true);
    } else if (push === 'false') {
      setEnabledPushNotification(false);
    }

    if (sound === 'true') {
      setEnabledSoundNotification(true);
    } else if (sound === 'false') {
      setEnabledSoundNotification(false);
    }

    if (vibration === 'true') {
      setEnabledVibrationNotification(true);
    } else if (vibration === 'false') {
      setEnabledVibrationNotification(false);
    }
  };

  useEffect(() => {
    loadNotifiCationData();
  }, []);

  return (
    <View style={styles.windowContainer}>
      <View style={styles.notificationSettingHeader}>
        <Text style={styles.notificationSettingHeaderTitle}>알림 설정</Text>
      </View>
      <View style={styles.notificationItemSection}>
        <Text style={styles.notificationItemTitle}>푸쉬 설정</Text>
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
