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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from 'axios';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Modal from 'react-native-modal';
import ScheduleCard from '../components/ScheduleCard';
import BottomComponent from '../components/BottomComponent';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlaneDeparture, faSuitcase} from '@fortawesome/free-solid-svg-icons';
import BottomSheetBackDrop from '../components/BottomSheetBackDrop';
import EncryptedStorage from 'react-native-encrypted-storage';
import axiosInstance from '../utils/interceptor';
import {useIsFocused, useNavigation} from '@react-navigation/native';
interface schedule {
  startAt: string;
  endAt: string;
}

function HomePage({navigation}: any) {
  const userId = useSelector((state: RootState) => state.persist.user.id);
  const userName = useSelector((state: RootState) => state.persist.user.name);
  const [info, setInfo] = useState<schedule[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [bottomModalType, setBottomModalType] = useState('');
  const [errFlag, setErrFlag] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const isFocused = useIsFocused();
  useEffect(() => {
    console.log(1);
    getAllSchedules();
  }, [navigation, isFocused]);

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
  const getAllSchedules = async () => {
    try {
      console.log(2);
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
      console.log(3);
      //setInfo(response.data);
      sortAllSchedules(response.data);
      setErrFlag(false);
    } catch (err: AxiosError | any) {
      console.log(4);
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

      getAllSchedules();
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
    } catch (err) {
      console.log(err);
    }
  };

  const sortAllSchedules = (unsortedSchedules: schedule[]) => {
    const today = new Date().toISOString();
    var validSchedules: schedule[] = [];
    var invalidSchedules: schedule[] = [];
    unsortedSchedules.map(item => {
      var endAt = new Date(item.endAt);
      if (today < item.endAt) {
        //진행~예정된 스케줄
        validSchedules.push(item);
      } else {
        //끝난 스케줄
        invalidSchedules.push(item);
      }
    });

    validSchedules.sort(function (a: schedule, b: schedule) {
      if (a.startAt > b.startAt) {
        return 1;
      } else if (a.startAt < b.startAt) {
        return -1;
      } else {
        return 0;
      }
    });
    invalidSchedules.sort(function (a: schedule, b: schedule) {
      if (a.startAt > b.startAt) {
        return 1;
      } else if (a.startAt < b.startAt) {
        return -1;
      } else {
        return 0;
      }
    });
    setInfo([...validSchedules, ...invalidSchedules]);
  };

  if (errFlag) {
    //갖고있는 스케줄이 0개일 경우
    return (
      <View style={styles.errScreen}>
        <Image
          style={styles.errImg}
          source={require('../resources/icons/LoginImage.png')}
        />
        <Text style={styles.errMsg}>{'\n'}보유하고 계신 일정이 없으시네요</Text>
        <Text style={styles.errMsg}>여행 일정을 등록해 보세요!{'\n'}</Text>
        <Pressable
          onPress={() => {
            navigation.navigate('CreateGroupPage');
          }}>
          <View style={styles.errButton}>
            <Text style={styles.errButtonText}>여행 일정 등록하기</Text>
          </View>
        </Pressable>
      </View>
    );
  } else {
    return (
      <BottomSheetModalProvider>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{userName}의 일정 목록</Text>
        </View>
        <ScrollView style={styles.inputWrapper}>
          {info.map((item: any) => {
            if (item != null) {
              return (
                <ScheduleCard
                  key={item.id}
                  item={item}
                  setSelectedScheduleId={setSelectedScheduleId}
                  setBottomModalType={setBottomModalType}
                  openBottomModal={openBottomModal}
                  openDeleteModalForHost={openDeleteModalForHost}
                  openDeleteModalForMember={openDeleteModalForMember}
                  doRefresh={getAllSchedules}
                  navigation={navigation}
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
              isVisible={isModalVisibleForHost}
              animationIn={'slideInUp'}
              animationOut={'slideOutDown'}
              onBackButtonPress={() => setModalVisibleForHost(false)}
              style={styles.modalContainer}>
              <View style={styles.modalContainerForHost}>
                <View style={styles.modalInnerContainer}>
                  <Text style={styles.modalComment}>
                    당신이 만든 스케줄을 떠나시면
                  </Text>
                  <Text style={styles.modalComment}>
                    스케줄이 영원히 삭제됩니다.
                  </Text>
                  <Text style={styles.modalComment}>정말 떠나시겠습니까?</Text>

                  <View style={styles.modalButtonArea}>
                    <Pressable
                      style={styles.modalButton}
                      onPress={closeDeleteModalForHost}>
                      <Text style={styles.modalButtonText}>아니오</Text>
                    </Pressable>
                    <Pressable
                      style={styles.modalButton}
                      onPress={() => {
                        deleteSchedule();
                        closeDeleteModalForHost();
                        getAllSchedules();
                      }}>
                      <Text style={styles.modalButtonText}>예</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
            <Modal
              isVisible={isModalVisibleForMember}
              animationIn={'slideInUp'}
              animationOut={'slideOutDown'}
              onBackButtonPress={() => setModalVisibleForMember(false)}
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
          </View>
        </ScrollView>
      </BottomSheetModalProvider>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#21B8CD',
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  inputWrapper: {
    padding: 20,
    backgroundColor: 'white',
    textAlign: 'center',
    width: Dimensions.get('window').width,
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
    height: 200,
    width: 200,
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
export default HomePage;
