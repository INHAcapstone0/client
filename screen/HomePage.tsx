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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from 'axios';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import ScheduleCard from '../components/ScheduleCard';
import BottomComponent from '../components/BottomComponent';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPlaneDeparture,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';

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

  const getAllSchedules = async () => {
    try {
      const params = {
        status: '승인',
      };
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(
        'http://10.0.2.2:8002/schedules/status',
        {params, headers},
      );
      setInfo(response.data);
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
    setErrFlag(false);
    return (
      <View style={styles.errScreen}>
        <FontAwesomeIcon
          style={styles.errIcon}
          icon={faPlaneDeparture}
          size={80}
        />
        <Text style={styles.errMsg}>보유하고 계신 일정이 없으시네요</Text>
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
                  doRefresh={getAllSchedules}
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
                />
              </BottomSheetScrollView>
            </BottomSheetModal>
          </View>
        </ScrollView>
      </BottomSheetModalProvider>
    );
  }
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
                doRefresh={doRefresh}
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
        </View>
      </ScrollView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 20,
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
    backgroundColor: 'white', // <==== HERE
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
  errIcon: {
    color: '#4D483D',
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
});
export default HomePage;
