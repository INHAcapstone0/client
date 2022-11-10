/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
  Dimensions,
  Image,
  InteractionManager,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Modal from 'react-native-modal';
import AccountCard from '../components/AccountCard';
import BottomComponent from '../components/BottomComponent';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlaneDeparture, faSuitcase} from '@fortawesome/free-solid-svg-icons';
import BottomSheetBackDrop from '../components/BottomSheetBackDrop';
import EncryptedStorage from 'react-native-encrypted-storage';
import axiosInstance from '../utils/interceptor';

function MyAccountPage({navigation, route}: any) {
  const userId = useSelector((state: RootState) => state.persist.user.id);

  const [info, setInfo] = useState([]);
  const [infoNumber, setInfoNumber] = useState(0);
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [bottomModalType, setBottomModalType] = useState('');
  const [errFlag, setErrFlag] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [bankAccount, setBankAccount] = useState<any>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [finNum, setFinNum] = useState(0);

  useEffect(() => {
    getAllSchedules();
  }, [infoNumber]);

  const openBottomModal = () => {
    bottomSheetModalRef.current?.present();
  };
  const closeBottomModal = () => {
    bottomSheetModalRef.current?.close();
  };
  const snapPoints = useMemo(() => ['80%'], []);
  const [isModalVisibleForHost, setModalVisibleForHost] = useState(false);

  const openDeleteModalForHost = () => {
    setModalVisibleForHost(true);
  };
  const closeDeleteModalForHost = () => {
    setModalVisibleForHost(false);
  };

  const [isModalVisibleForMember, setModalVisibleForMember] = useState(false);
  const openDeleteModalForMember = () => {
    setModalVisibleForMember(true);
  };
  const closeDeleteModalForMember = () => {
    setModalVisibleForMember(false);
  };

  const getAllAccount = async () => {
    try {
      const params = {
        status: '승인',
      };
      // const headers = {
      //   Authorization: `Bearer ${accessToken}`,
      //   bank-authorization:`Bearer ${bankAccessToken}`
      // };

      const accessToken = await EncryptedStorage.getItem('accessToken');
      const bankAccessToken = await EncryptedStorage.getItem(
        'accessTokenToBank',
      );
      const bankRefreshToken = await EncryptedStorage.getItem(
        'refreshTokenToBank',
      );

      console.log('accessToken', accessToken);
      console.log('bankAccessToken', bankAccessToken);

      const response = await axiosInstance.get(
        'http://146.56.190.78/extra/account/list',
        {
          headers: {
            'bank-authorization': `Bearer ${bankAccessToken}`,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setBankAccount(response.data.res_list);

      console.log('bank response', response.data.res_list);
      // setInfo(response.data.res_list);
      // setErrFlag(false);
    } catch (err: AxiosError | any) {
      console.log(err);
      if (err.response.status === 404) {
        // setErrFlag(true);
      }
    }
  };

  const getAllSchedules = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const params = {
        status: '승인',
      };
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axiosInstance.get(
        'http://146.56.190.78/schedules/status',
        {params, headers},
      );
      setInfo(response.data);
      setErrFlag(false);
    } catch (err: AxiosError | any) {
      console.log(err);
      if (err.response.status === 404) {
        setErrFlag(true);
      }
    }
  };

  const deleteSchedule = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axiosInstance.delete(
        `http://146.56.190.78/schedules/${selectedScheduleId}`,
        {headers},
      );
      setInfoNumber(infoNumber - 1);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteParticipant = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axiosInstance.delete(
        `http://146.56.190.78/participants/${userId}/${selectedScheduleId}`,
        {headers},
      );
      setInfoNumber(infoNumber - 1);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAccount = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const bankAccessToken = await EncryptedStorage.getItem(
        'accessTokenToBank',
      );
      const headers = {
        'bank-authorization': `Bearer ${bankAccessToken}`,
        Authorization: `Bearer ${accessToken}`,
      };
      console.log(finNum);
      const response = await axiosInstance.post(
        'http://146.56.190.78/extra/account/cancel',
        {
          fintech_use_num: finNum,
        },
        {headers},
      );
      console.log('delete response', response);
      return response.data;
    } catch (err: any) {
      console.log('delete error', err.response);
    }
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <BottomSheetModalProvider>
      <ScrollView style={styles.inputWrapper}>
        {bankAccount.map((item: any) => {
          if (item != null) {
            return (
              <AccountCard
                key={item.fintech_use_num}
                item={item}
                setSelectedScheduleId={setSelectedScheduleId}
                setBottomModalType={setBottomModalType}
                openBottomModal={openBottomModal}
                openModal={showModal}
                closeModal={closeModal}
                deleteAccount={deleteAccount}
                doRefresh={getAllAccount}
                navigation={navigation}
                dateStart={route.params.dateStart}
                dateEnd={route.params.dateEnd}
                setFinNum={setFinNum}
              />
            );
          }
        })}
        <View>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            enableContentPanningGesture={false}
            backdropComponent={BottomSheetBackDrop}
            style={styles.bottomModal}>
            <BottomSheetScrollView>
              <BottomComponent
                key={selectedScheduleId}
                selectedScheduleId={selectedScheduleId}
                bottomModalType={bottomModalType}
                closeBottomModal={closeBottomModal}
              />
            </BottomSheetScrollView>
          </BottomSheetModal>
          <Modal
            isVisible={isModalVisibleForMember}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            style={styles.modalContainer}>
            <View style={styles.modalContainerForMember}>
              <View style={styles.modalInnerContainer}>
                <Text style={styles.modalComment}>
                  정말 스케줄을 떠나시겠습니까?
                </Text>
                <View style={styles.modalButtonArea}>
                  <Pressable
                    style={styles.modalButton}
                    onPress={closeDeleteModalForMember}>
                    <Text style={styles.modalButtonText}>아니오</Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => {
                      deleteParticipant();
                      closeDeleteModalForMember();
                      getAllSchedules();
                    }}>
                    <Text style={styles.modalButtonText}>예</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            isVisible={isModalVisible}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
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
                  해당 계좌를 삭제 하시겠습니까?
                </Text>
                <View style={styles.modalButtonArea}>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => {
                      deleteAccount();
                      getAllAccount();
                      closeModal();
                    }}>
                    <Text style={styles.modalButtonText}>예</Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => {
                      closeModal();
                    }}>
                    <Text style={styles.modalButtonText}>아니오</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    // padding: 20,
    backgroundColor: 'white',
    textAlign: 'center',
    height: Dimensions.get('window').height,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 24,
    height: 500,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bottomModal: {
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -15,
    },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 24,
  },
  errImg: {
    height: 245,
    width: 212,
  },
  errScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errMsg: {
    fontSize: 20,
    fontFamily: 'Roboto',
    color: 'black',
    fontWeight: 'bold',
  },
  errIcon: {
    color: '#4D483D',
  },
  errButton: {
    backgroundColor: '#21B8CD',
    width: Dimensions.get('window').width * 0.75,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  errButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    alignItems: 'center',
  },
  modalInnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalContainerForMember: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    width: 325,
    height: 145,
  },
  modalContainerForHost: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    width: 325,
    height: 175,
  },
  modalComment: {
    fontFamily: 'Roboto',
    fontSize: 15,
    color: 'black',
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
  modalButtonText: {
    color: 'white',
    fontSize: 15,
  },
  modalButtonArea: {
    marginTop: 20,
    flexDirection: 'row',
  },
});
export default MyAccountPage;
