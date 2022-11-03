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
import {
  notificationListner,
  requestUserPermission,
  notificationOff,
} from '../utils/push_notification_helper';

function NotificationSettingPage() {
  const dispatch = useAppDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );

  const [enabledPushNotification, setEnabledPushNotification] = useState(true);
  const [enabledInviteNotification, setEnabledInviteNotification] =
    useState(true);
  const [enabledReceiptNotification, setEnabledReceiptNotification] =
    useState(true);
  const [enabledScheduleNotification, setEnabledScheduleNotification] =
    useState(true);
  const [enabledCalculateNotification, setEnabledCalculateNotification] =
    useState(true);

  useEffect(() => {
    loadNotifiCationData();
  }, []);

  // useEffect(() => {
  //   // requestUserPermission();
  //   notificationListner();
  // }, [
  //   enabledPushNotification,
  //   enabledInviteNotification,
  //   enabledReceiptNotification,
  //   enabledScheduleNotification,
  //   enabledCalculateNotification,
  // ]);

  const loadNotifiCationData = async () => {
    const push = await AsyncStorage.getItem('PushNotification');
    const invite = await AsyncStorage.getItem('InviteNotification');
    const receipt = await AsyncStorage.getItem('ReceiptNotification');
    const schedule = await AsyncStorage.getItem('ScheduleNotification');
    const calculate = await AsyncStorage.getItem('CalculateNotification');

    console.log('push', push);

    if (push === 'false') {
      setEnabledPushNotification(false);
    }

    if (invite === 'false') {
      setEnabledInviteNotification(false);
    }

    if (receipt === 'false') {
      setEnabledReceiptNotification(false);
    }

    if (schedule === 'false') {
      setEnabledScheduleNotification(false);
    }

    if (calculate === 'false') {
      setEnabledCalculateNotification(false);
    }
  };

  const togglePushSwitch = () => {
    if (enabledPushNotification) {
      notificationOff();
      setEnabledPushNotification(false);
      setEnabledInviteNotification(false);
      setEnabledReceiptNotification(false);
      setEnabledScheduleNotification(false);
      setEnabledCalculateNotification(false);
      AsyncStorage.setItem('PushNotification', 'false');
      AsyncStorage.setItem('InviteNotification', 'false');
      AsyncStorage.setItem('ReceiptNotification', 'false');
      AsyncStorage.setItem('ScheduleNotification', 'false');
      AsyncStorage.setItem('CalculateNotification', 'false');
    } else {
      requestUserPermission();
      notificationListner();
      setEnabledPushNotification(true);
      setEnabledInviteNotification(true);
      setEnabledReceiptNotification(true);
      setEnabledScheduleNotification(true);
      setEnabledCalculateNotification(true);
      AsyncStorage.removeItem('PushNotification');
      AsyncStorage.removeItem('InviteNotification');
      AsyncStorage.removeItem('ReceiptNotification');
      AsyncStorage.removeItem('ScheduleNotification');
      AsyncStorage.removeItem('CalculateNotification');
    }
  };
  const toggleInviteSwitch = () => {
    if (enabledInviteNotification) {
      setEnabledInviteNotification(false);
      AsyncStorage.setItem('InviteNotification', 'false');
    } else {
      setEnabledPushNotification(true);
      setEnabledInviteNotification(true);
      AsyncStorage.removeItem('PushNotification');
      AsyncStorage.removeItem('InviteNotification');
    }
  };
  const toggleReceiptSwitch = () => {
    if (enabledReceiptNotification) {
      setEnabledReceiptNotification(false);
      AsyncStorage.setItem('ReceiptNotification', 'false');
    } else {
      setEnabledPushNotification(true);
      setEnabledReceiptNotification(true);
      AsyncStorage.removeItem('PushNotification');
      AsyncStorage.removeItem('ReceiptNotification');
    }
  };

  const toggleScheduleSwitch = () => {
    if (enabledScheduleNotification) {
      setEnabledScheduleNotification(false);
      AsyncStorage.setItem('ScheduleNotification', 'false');
    } else {
      setEnabledPushNotification(true);
      setEnabledScheduleNotification(true);
      AsyncStorage.removeItem('PushNotification');
      AsyncStorage.removeItem('ScheduleNotification');
    }
  };

  const toggleCalculateSwitch = () => {
    if (enabledCalculateNotification) {
      setEnabledCalculateNotification(false);
      AsyncStorage.setItem('CalculateNotification', 'false');
    } else {
      setEnabledPushNotification(true);
      setEnabledCalculateNotification(true);
      AsyncStorage.removeItem('PushNotification');
      AsyncStorage.removeItem('CalculateNotification');
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
        <Text style={styles.notificationItemTitle}>초대 알람</Text>
        <Switch
          trackColor={{false: '#767577', true: '#21B8CD'}}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleInviteSwitch}
          value={enabledInviteNotification}
        />
      </View>
      <View style={styles.borderLine} />
      <View style={styles.notificationItemSection}>
        <Text style={styles.notificationItemTitle}>영수증 업로드 알람</Text>
        <Switch
          trackColor={{false: '#767577', true: '#21B8CD'}}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleReceiptSwitch}
          value={enabledReceiptNotification}
        />
      </View>
      <View style={styles.borderLine} />
      <View style={styles.notificationItemSection}>
        <Text style={styles.notificationItemTitle}>일정 시작/종료 알람</Text>
        <Switch
          trackColor={{false: '#767577', true: '#21B8CD'}}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleScheduleSwitch}
          value={enabledScheduleNotification}
        />
      </View>
      <View style={styles.borderLine} />
      <View style={styles.notificationItemSection}>
        <Text style={styles.notificationItemTitle}>
          정산 요청/확인 요청 알람
        </Text>
        <Switch
          trackColor={{false: '#767577', true: '#21B8CD'}}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleCalculateSwitch}
          value={enabledCalculateNotification}
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
