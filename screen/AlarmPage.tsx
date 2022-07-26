/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import {RootState} from '../store/Store';
import axiosInstance from '../utils/interceptor';
import EncryptedStorage from 'react-native-encrypted-storage';

interface alarmType {
  alarm_type: string;
  checked: false;
  createdAt: string;
  deletedAt: null;
  id: string;
  message: string;
  updatedAt: string;
  user_id: string;
}

function AlarmPage({navigation}: any) {
  const [allAlarms, setAllAlarms] = useState<Array<alarmType>>([]);
  const [alarmId, setAlarmId] = useState('');
  const [isInvitaionModalVisible, setInvitationModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const userId = useSelector((state: RootState) => state.persist.user.id);
  const [scheduleId, setScheduleId] = useState('');
  const [errFlag, setErrFlag] = useState(false);
  const [알람감지, 알람감지세팅] = useState('');

  useEffect(() => {
    getAllAlarms();
  }, [알람감지]);

  useEffect(() => {
    setInterval(() => {
      loadAlarm();
    }, 1000);
  }, []);

  const loadAlarm = async () => {
    const alarms = await AsyncStorage.getItem('alarm');
    알람감지세팅(alarms as string);
  };

  const getAllAlarms = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      console.log('accessToken', accessToken);
      console.log('refreshToken', refreshToken);

      const response = await axiosInstance.get(
        `http://146.56.190.78/alarms?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('response', response);
      setAllAlarms(response.data);
      console.log('getAllAlarms', response.data);
    } catch (err: AxiosError | any) {
      console.log(err.response);
      setErrFlag(true);
    }
  };

  const deleteAlarm = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');

      const response = await axiosInstance.delete(
        `http://146.56.190.78/alarms/${alarmId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      getAllAlarms();
      console.log('deleteAlarm response', response);
    } catch (err: AxiosError | any) {
      console.log(err.response);
    }
  };

  const joinSchedule = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');

      const response = await axiosInstance.patch(
        `http://146.56.190.78/participants/${userId}/${scheduleId}`,
        {
          status: '승인',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      deleteAlarm();
      console.log('joinSchedule response', response);
    } catch (err: AxiosError | any) {
      console.log(err.response);
    }
  };

  const rejectSchedule = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const response = await axiosInstance.patch(
        `http://146.56.190.78/participants/${userId}/${scheduleId}`,
        {
          status: '거절',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      deleteAlarm();
      console.log(response);
    } catch (err: AxiosError | any) {
      console.log(err.response);
    }
  };

  const openInvitaionModal = (id: string, alarmsId: string) => (event: any) => {
    setInvitationModalVisible(true);
    setScheduleId(id);
    setAlarmId(alarmsId);
  };

  const closeInvitationModal = () => {
    setInvitationModalVisible(false);
  };

  const openModal = (id: string) => (event: any) => {
    setModalVisible(true);
    setAlarmId(id);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (errFlag) {
    return (
      <View style={styles.emptyImg}>
        <Image source={require('../resources/icons/alarmImg.png')} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.alarmPage}>
      <ScrollView>
        <View style={styles.settingHeader}>
          <Text style={styles.settingHeaderTitle}>알람내역</Text>
        </View>
        {allAlarms.length > 0
          ? allAlarms.map((alarm: any) => {
              if (alarm.alarm_type === '초대') {
                return (
                  <View key={alarm.id}>
                    <TouchableOpacity
                      style={styles.alarmWrapper}
                      onPress={openInvitaionModal(alarm.data, alarm.id)}
                      key={alarm.id}>
                      <Image
                        source={require('../resources/icons/Invitation.png')}
                        style={styles.alarmIcon}
                      />
                      <Text style={styles.alarmText} key={alarm.id}>
                        {alarm.message}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.borderLine} />
                  </View>
                );
              } else if (alarm.alarm_type === '영수증 업로드') {
                return (
                  <View key={alarm.id}>
                    <TouchableOpacity
                      style={styles.alarmWrapper}
                      onPress={openModal(alarm.id)}
                      key={alarm.id}>
                      <Image
                        source={require('../resources/icons/AlarmReceipt.png')}
                        style={styles.alarmIcon}
                      />
                      {/* <Ionicons name="receipt-outline" color="black" size={40} /> */}
                      <Text style={styles.alarmText} key={alarm.id}>
                        {alarm.message}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.borderLine} />
                  </View>
                );
              } else if (alarm.alarm_type === '일정 시작') {
                return (
                  <View key={alarm.id}>
                    <TouchableOpacity
                      style={styles.alarmWrapper}
                      onPress={openModal(alarm.id)}
                      key={alarm.id}>
                      <Image
                        source={require('../resources/icons/DateStart.png')}
                        style={styles.alarmIcon}
                      />
                      <Text style={styles.alarmText} key={alarm.id}>
                        {alarm.message}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.borderLine} />
                  </View>
                );
              } else if (alarm.alarm_type === '일정 종료') {
                return (
                  <View key={alarm.id}>
                    <TouchableOpacity
                      style={styles.alarmWrapper}
                      onPress={openModal(alarm.id)}
                      key={alarm.id}>
                      <Image
                        source={require('../resources/icons/DateEnd.png')}
                        style={styles.alarmIcon}
                      />
                      <Text style={styles.alarmText} key={alarm.id}>
                        {alarm.message}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.borderLine} />
                  </View>
                );
              } else if (alarm.alarm_type === '정산 확인 요청') {
                return (
                  <View key={alarm.id}>
                    <TouchableOpacity
                      style={styles.alarmWrapper}
                      onPress={openModal(alarm.id)}
                      key={alarm.id}>
                      <Image
                        source={require('../resources/icons/CalculateRequestCheck.png')}
                        style={styles.alarmIcon}
                      />
                      <Text style={styles.alarmText} key={alarm.id}>
                        {alarm.message}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.borderLine} />
                  </View>
                );
              } else {
                return (
                  <View key={alarm.id}>
                    <TouchableOpacity
                      style={styles.alarmWrapper}
                      onPress={openModal(alarm.id)}
                      key={alarm.id}>
                      <Image
                        source={require('../resources/icons/CalculateCheck.png')}
                        style={styles.alarmIcon}
                      />
                      <Text style={styles.alarmText} key={alarm.id}>
                        {alarm.message}.
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.borderLine} />
                  </View>
                );
              }
            })
          : null}
      </ScrollView>
      <Modal
        isVisible={isInvitaionModalVisible}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        onBackButtonPress={() => setInvitationModalVisible(false)}
        style={{
          alignItems: 'center',
        }}>
        <View style={styles.modalContainerForMember}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <Text style={styles.modalComment}>
              해당 스케줄에 참여하시겠습니까?
            </Text>
            <View style={styles.modalButtonArea}>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  joinSchedule();
                  closeInvitationModal();
                  deleteAlarm();
                }}>
                <Text style={styles.modalButtonText}>예</Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  rejectSchedule();
                  closeInvitationModal();
                  deleteAlarm();
                }}>
                <Text style={styles.modalButtonText}>아니오</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isModalVisible}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        onBackButtonPress={() => setModalVisible(false)}
        style={{
          alignItems: 'center',
        }}>
        <View style={styles.modalContainerForMember}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <Text style={styles.modalComment}>확인하셨습니까?</Text>
            <View style={styles.modalButtonArea}>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  deleteAlarm();
                  closeModal();
                }}>
                <Text style={styles.modalButtonText}>예</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>아니오</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  alarmPage: {
    padding: 20,
    paddingBottom: 100,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'white',
  },
  settingHeader: {
    height: 50,
    alignItems: 'center',
  },
  settingHeaderTitle: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  borderLine: {
    width: Dimensions.get('window').width * 0.9,
    borderBottomWidth: 1,
    borderBottomColor: '#21B8CD',
  },
  alarmWrapper: {
    paddingTop: 8,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: 0.5,
    // borderColor: '#21B8CD',
  },
  alarmImage: {
    width: 54,
    height: 54,
    borderRadius: 30,
  },
  alarmText: {
    width: '100%',
    paddingLeft: 20,
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
    flexShrink: 1,
    fontFamily: 'Roboto',
  },
  alarmIcon: {
    width: 55,
    height: 55,
  },
  emptyImg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainerForMember: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    width: 325,
    height: 195,
  },
  modalComment: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: 'black',
  },
  modalButtonArea: {
    marginTop: 20,
    flexDirection: 'row',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
  },
  modalButton: {
    width: 80,
    height: 40,
    backgroundColor: '#21B8CD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
});
export default AlarmPage;
