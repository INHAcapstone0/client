/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, {AxiosError} from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Button,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import axiosInstance from '../utils/interceptor';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
  IConfigDialog,
  IConfigToast,
} from 'react-native-alert-notification';
import Modal from 'react-native-modal';

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

function CalculatePage({navigation}: any) {
  const userId = useSelector((state: RootState) => state.persist.user.id);
  const [allSettlements, setAllSettlements] = useState<Array<any>>([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [errFlag, setErrFlag] = useState(false);
  const [isInvitaionModalVisible1, setInvitationModalVisible1] =
    useState(false);
  const [isInvitaionModalVisible2, setInvitationModalVisible2] =
    useState(false);
  const [calculateIds, setCalculateIds] = useState('');

  useEffect(() => {
    getSettlements();
  }, []);

  const getSettlements = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const response = await axiosInstance.get(
        `http://146.56.190.78/settlements/custom/mine`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('response.data', response.data);
      console.log('response.data.Settlements', response.data[0].Settlements);
      setAllSettlements(response.data);
    } catch (err: AxiosError | any) {
      setErrFlag(true);
    }
  };

  const updateSettlement = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const response = await axiosInstance.patch(
        `http://146.56.190.78:8002/settlements/${calculateIds}`,
        {is_paid: '확인중'},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      getSettlements();
      setCurrentTab(1);
      console.log('update response', response);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: '입금확인 요청을 보넀습니다.',
      });
    } catch (err: AxiosError | any) {
      console.log('err.response', err.response);
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '입금확인 요청이 실패했습니다',
      });
    }
  };

  const updateSettlement2 = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const response = await axiosInstance.patch(
        `http://146.56.190.78:8002/settlements/${calculateIds}`,
        {is_paid: '정산 완료'},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      getSettlements();
      console.log('update response2', response);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: '정산이 완료되었습니다.',
      });
    } catch (err: AxiosError | any) {
      console.log(err.response);
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '정산완료 처리가 실패했습니다',
      });
    }
  };

  const updateSettlement3 = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const response = await axiosInstance.patch(
        `http://146.56.190.78:8002/settlements/${calculateIds}`,
        {is_paid: '정산 미완료'},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      getSettlements();
      console.log('update response3', response);
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '입금 미완료 알람을 보냈습니다',
      });
    } catch (err: AxiosError | any) {
      console.log(err.response);
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '정산미완료 처리가 실패했습니다',
      });
    }
  };

  const changeCurrentTab = () => {
    if (currentTab === 0) {
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  };

  const 입금확인 = (calculateId: string) => (event: any) => {
    setCalculateIds(calculateId);
    setInvitationModalVisible1(true);
  };

  const 입금완료 = (calculateId: string) => (event: any) => {
    setCalculateIds(calculateId);
    setInvitationModalVisible2(true);
  };

  if (errFlag) {
    return (
      <View style={styles.emptyImg}>
        <Image source={require('../resources/icons/calculateSend.png')} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.calculatePage}>
      <AlertNotificationRoot
        colors={[
          {
            label: '',
            card: '#e5e8e8',
            overlay: '',
            success: '',
            danger: '',
            warning: '',
          },
          {
            label: 'gray',
            card: 'gray',
            overlay: 'gray',
            success: 'gray',
            danger: 'gray',
            warning: 'gray',
          },
        ]}>
        <View style={styles.settingHeader}>
          <Text style={styles.settingHeaderTitle}>정산관리</Text>
        </View>
        <View style={styles.calculateTab}>
          <Pressable
            style={
              currentTab === 0
                ? styles.calculateActiveTabLabel
                : styles.calculateTabLabel
            }
            onPress={changeCurrentTab}>
            <Text
              style={
                currentTab === 0
                  ? styles.calculateActiveTabText
                  : styles.calculateTabText
              }>
              받아야 할 내역
            </Text>
          </Pressable>
          <Pressable
            style={
              currentTab === 1
                ? styles.calculateActiveTabLabel
                : styles.calculateTabLabel
            }
            onPress={changeCurrentTab}>
            <Text
              style={
                currentTab === 1
                  ? styles.calculateActiveTabText
                  : styles.calculateTabText
              }>
              보내야 할 내역
            </Text>
          </Pressable>
        </View>
        <View style={styles.calculateHistory}>
          {currentTab === 0
            ? allSettlements.map((data: any) => (
                <View style={styles.calculateWrapper} key={data.id}>
                  <Text style={styles.calculateText}>{data.name}</Text>
                  <View key={data.id}>
                    {data.Settlements.map((calculate: any) => {
                      if (calculate.sender.id !== userId) {
                        return (
                          <View
                            style={styles.calculateAlarm}
                            key={calculate.id}>
                            <Image
                              key={calculate.id}
                              style={styles.calculateImage}
                              source={{
                                uri: calculate.sender.img_url,
                              }}
                            />
                            <View style={styles.calculateAlarmMessage}>
                              <Text style={styles.calculateGiver}>
                                {calculate.sender.name}{' '}
                                <Text style={styles.calculateMoneyText}>
                                  님께
                                </Text>
                              </Text>
                              <Text style={styles.calculateSendMoney}>
                                {calculate.amount
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                원
                                <Text style={styles.calculateMoneyText}>
                                  &nbsp;입금 받으세요
                                </Text>
                              </Text>
                            </View>
                            {calculate.is_paid === '정산 미완료' ? (
                              <View style={styles.calculateButtonActive}>
                                <Text style={styles.calculateButtonText}>
                                  입금 대기중
                                </Text>
                              </View>
                            ) : calculate.is_paid === '정산 완료' ? (
                              <View style={styles.calculateButtonActive}>
                                <Text style={styles.calculateButtonText}>
                                  정산 완료
                                </Text>
                              </View>
                            ) : (
                              <TouchableOpacity
                                style={styles.calculateButton}
                                onPress={입금확인(calculate.id)}>
                                <Text style={styles.calculateButtonText}>
                                  입금 확인
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      }
                    })}
                  </View>
                </View>
              ))
            : allSettlements.map((data: any) => (
                <View style={styles.calculateWrapper} key={data.id}>
                  <Text style={styles.calculateText} key={data.id}>
                    {data.name}
                  </Text>
                  <View>
                    {data.Settlements.map((calculate: any) => {
                      if (calculate.receiver.id !== userId) {
                        return (
                          <View
                            style={styles.calculateAlarm}
                            key={calculate.id}>
                            <Image
                              key={calculate.giver_id}
                              style={styles.calculateImage}
                              source={{
                                uri: calculate.receiver.img_url,
                              }}
                            />
                            <View style={styles.calculateAlarmMessage}>
                              <Text style={styles.calculateGiver}>
                                {calculate.receiver.name}{' '}
                                <Text style={styles.calculateMoneyText}>
                                  님께
                                </Text>
                              </Text>
                              <Text style={styles.calculateSendMoney}>
                                {calculate.amount
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                원
                                <Text style={styles.calculateMoneyText}>
                                  &nbsp;입금 하세요
                                </Text>
                              </Text>
                            </View>
                            {calculate.is_paid === '정산 미완료' ? (
                              <TouchableOpacity
                                style={styles.calculateButton}
                                onPress={입금완료(calculate.id)}>
                                <Text style={styles.calculateButtonText}>
                                  입금 완료
                                </Text>
                              </TouchableOpacity>
                            ) : calculate.is_paid === '정산 완료' ? (
                              <View style={styles.calculateButtonActive}>
                                <Text style={styles.calculateButtonText}>
                                  정산 완료
                                </Text>
                              </View>
                            ) : (
                              <View style={styles.calculateButtonActive}>
                                <Text style={styles.calculateButtonText}>
                                  정산 확인중
                                </Text>
                              </View>
                            )}
                          </View>
                        );
                      }
                    })}
                  </View>
                </View>
              ))}
        </View>
        <Modal
          isVisible={isInvitaionModalVisible1}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          onBackButtonPress={() => setInvitationModalVisible1(false)}
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
                입금 된것을 확인 하셨습니까?
              </Text>
              <View style={styles.modalButtonArea}>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => {
                    updateSettlement2();
                    setInvitationModalVisible1(false);
                  }}>
                  <Text style={styles.modalButtonText}>예</Text>
                </Pressable>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => {
                    updateSettlement3();
                    setInvitationModalVisible1(false);
                  }}>
                  <Text style={styles.modalButtonText}>아니오</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={isInvitaionModalVisible2}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          onBackButtonPress={() => setInvitationModalVisible2(false)}
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
              <Text style={styles.modalComment}>입금을 완료 하셨습니까?</Text>
              <View style={styles.modalButtonArea}>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => {
                    updateSettlement();
                    setInvitationModalVisible2(false);
                  }}>
                  <Text style={styles.modalButtonText}>예</Text>
                </Pressable>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => {
                    setInvitationModalVisible2(false);
                  }}>
                  <Text style={styles.modalButtonText}>아니오</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </AlertNotificationRoot>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  modalContainerForMember: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    width: 325,
    height: 195,
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
  modalButtonArea: {
    marginTop: 20,
    flexDirection: 'row',
  },
  modalComment: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: 'black',
  },
  settingHeader: {
    paddingTop: 20,
    height: 50,
    alignItems: 'center',
  },
  settingHeaderTitle: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  calculatePage: {
    // paddingLeft: 20,
    // paddingRight: 20,
    // paddingBottom: 100,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
  },
  calculateHistory: {
    // height: Dimensions.get('window').height,
    // width: Dimensions.get('window').width,
    paddingBottom: 100,
    backgroundColor: 'white',
  },
  calculateTab: {
    // paddingTop: 30,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 10,
  },
  calculateActiveTabLabel: {
    backgroundColor: '#21B8CD',
    height: 48,
    width: '50%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    borderColor: '#9acdd4',
    borderWidth: 1,
  },
  calculateActiveTabText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  calculateTabLabel: {
    backgroundColor: 'white',
    height: 48,
    width: '50%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    borderColor: '#9acdd4',
    borderWidth: 1,
  },
  calculateTabText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#21B8CD',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  calculateContainer: {
    paddingBottom: 20,
  },
  calculateLabel: {
    fontSize: 20,
    color: '#3E382F',
    fontFamily: 'Jalnan',
    fontWeight: '400',
    paddingTop: 20,
    paddingBottom: 10,
  },
  calculateBorder: {
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  calculateWrapper: {
    // paddingTop: 8,
    // paddingBottom: 8,
    // display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  calculateImage: {
    width: 54,
    height: 54,
    borderRadius: 30,
  },
  calculateText: {
    width: '100%',
    // marginLeft: 15,
    fontSize: 17,
    fontWeight: '500',
    color: 'black',
    flexShrink: 1,
    fontFamily: 'Roboto',
    borderBottomColor: '#21B8CD',
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  calculateAlarm: {
    paddingTop: 15,
    paddingBottom: 15,
    display: 'flex',
    flexDirection: 'row',
  },
  calculateGiver: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
  },
  calculateMoney: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4980EC',
  },
  calculateSendMoney: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EC4949',
  },
  calculateMoneyText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'gray',
  },
  calculateAlarmMessage: {
    paddingLeft: 20,
  },
  calculateButton: {
    backgroundColor: '#21B8CD',
    width: 75,
    height: 26,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 25,
  },
  calculateButtonActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 75,
    height: 26,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 25,
  },
  calculateButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  emptyImg: {
    marginTop: Dimensions.get('window').height / 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default CalculatePage;
