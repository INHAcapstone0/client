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

function HomePage({navigation}: any) {
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const userId = useSelector((state: RootState) => state.persist.user.id);

  const [info, setInfo] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [bottomModalType, setBottomModalType] = useState('');
  const [errFlag, setErrFlag] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const openBottomModal = () => {
    bottomSheetModalRef.current?.present();
  };
  const closeBottomModal = () => {
    bottomSheetModalRef.current?.close();
  };
  const snapPoints = useMemo(() => ['80%'], []);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const getAllSchedules = async () => {
    try {
      const params = {
        status: '승인',
      };
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(
        'http://146.56.188.32:8002/schedules/status',
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

  useEffect(() => {
    getAllSchedules();
  }, []);

  if (errFlag) {
    //갖고있는 스케줄이 0개일 경우
    return (
      <View style={styles.errScreen}>
        <FontAwesomeIcon icon={faSuitcase} size={150} style={styles.errIcon} />
        <Text style={styles.errMsg}>{'\n'}보유하고 계신 일정이 없으시네요</Text>
        <Text style={styles.errMsg}>여행 일정을 등록해 보세요!</Text>
      </View>
    );
  } else {
    return (
      <BottomSheetModalProvider>
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
                  openModal={openModal}
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
              isVisible={isModalVisible}
              animationIn={'slideInUp'}
              animationOut={'slideOutDown'}
              style={{
                alignItems: 'center',
              }}>
              <View style={styles.modalContainer}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Text style={styles.modalComment}>
                    정말 스케줄을 떠나시겠습니까?
                  </Text>
                  <View style={styles.modalButtonArea}>
                    <Pressable style={styles.modalButton} onPress={closeModal}>
                      <Text style={styles.modalButtonText}>아니오</Text>
                    </Pressable>
                    <Pressable style={styles.modalButton} onPress={closeModal}>
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
              <View style={styles.modalContainer}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Text style={styles.modalComment}>
                    정말 스케줄을 떠나시겠습니까?
                  </Text>
                  <View style={styles.modalButtonArea}>
                    <Pressable style={styles.modalButton} onPress={closeModal}>
                      <Text style={styles.modalButtonText}>아니오</Text>
                    </Pressable>
                    <Pressable style={styles.modalButton} onPress={closeModal}>
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
  inputWrapper: {
    padding: 20,
    backgroundColor: 'white',
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
  },
  errMsg: {
    fontSize: 20,
    fontFamily: 'Jalnan',
    color: '#4D483D',
  },
  errIcon: {
    color: '#4D483D',
  },
  modalContainer: {
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
    fontSize: 18,
  },
  modalButtonArea: {
    marginTop: 20,
    flexDirection: 'row',
  },
});
export default HomePage;
