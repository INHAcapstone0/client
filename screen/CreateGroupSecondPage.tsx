/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useRef, useState, useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Button,
  Modal,
  Dimensions,
} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../store/Store';
import FormButton from '../components/FormButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DatePicker from 'react-native-date-picker';
import {scheduleAction} from '../slices/Schedule';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import BottomSheetBackDrop from '../components/BottomSheetBackDrop';
import Animated from 'react-native-reanimated';

interface selectDateType {
  [key: string]: {[key: string]: boolean};
}

interface userType {
  createdAt: string;
  deletedAt: null;
  email: string;
  id: string;
  img_url: null;
  is_locked: false;
  login_failed_cnt: number;
  name: string;
  updatedAt: string;
}

function CreateGroupSecondPage({navigation}: any) {
  const [groupName, setGroupName] = useState('');
  const groupNameRef = useRef<TextInput | null>(null);
  const [selectedDate, setSelectedDate] = useState<selectDateType>({});
  const [selectedDayes, setSelectedDayes] = useState<Array<string>>([]);
  const [selectedUsers, setSelectedUseres] = useState<Array<userType>>([]);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [isStartTimeModalVisible, setIsStartTimeModalVisible] = useState(false);
  const [isEndTimeModalVisible, setIsEndTimeModalVisible] = useState(false);

  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [firstDay, setFirstDay] = useState('');
  const [lastDay, setLastDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [startTimeStart, setStartTimeStart] = useState(false);
  const [lastTimeStart, setLastTimeStart] = useState(false);
  const [lastTime, setLastTime] = useState('');

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['78%', '78%'], []);

  const openBottomModal = () => {
    bottomSheetRef.current?.present();
    toggleDateModal();
  };

  const closeBottomModal = () => {
    bottomSheetRef.current?.close();
    toggleDateModal2();
  };

  const dispatch = useAppDispatch();

  const toggleDateModal = () => {
    setIsDateModalVisible(true);
  };

  const toggleDateModal2 = () => {
    setIsDateModalVisible(false);
  };

  const toggleStartTimeModal = () => {
    setStartTimeStart(true);
    setIsStartTimeModalVisible(!isStartTimeModalVisible);
  };

  const toggleEndTimeModal = () => {
    setLastTimeStart(true);
    setIsEndTimeModalVisible(!isEndTimeModalVisible);
  };

  useEffect(() => {
    groupNameRef.current?.focus();
  }, []);

  // useEffect(() => {
  //   setStartTime('');
  //   setLastTime('');
  // }, []);

  useEffect(() => {
    if (startTimeStart) {
      const startTimes =
        String(selectedStartTime.getHours()).padStart(2, '0') +
        ':' +
        String(selectedStartTime.getMinutes()).padStart(2, '0');
      setStartTime(startTimes);
    }
  }, [selectedStartTime]);

  useEffect(() => {
    if (lastTimeStart) {
      const lastTimes =
        String(selectedEndTime.getHours()).padStart(2, '0') +
        ':' +
        String(selectedEndTime.getMinutes()).padStart(2, '0');
      setLastTime(lastTimes);
    }
  }, [selectedEndTime]);

  useEffect(() => {
    console.log('selectedDate', selectedDate);
    const orderedDate = Object.keys(selectedDate).sort(
      (a: string, b: string) => (new Date(a) as any) - (new Date(b) as any),
    );
    if (orderedDate.length === 0) {
      setFirstDay('');
      setLastDay('');
    } else {
      setFirstDay(orderedDate[0]?.replace(/\-/g, '-'));
      setLastDay(orderedDate[orderedDate.length - 1]?.replace(/\-/g, '-'));
    }
  }, [selectedDate]);

  const addSelectedDate = (date: string) => {
    if (selectedDate[date] !== undefined) {
      setSelectedDate({});
      setSelectedDayes([]);
    } else {
      const newlyAddedDate: any = {};
      if (Object.keys(selectedDate).length > 0) {
        const newDate = new Date(date);
        const minDate = new Date(selectedDayes[0]);
        const maxDate = new Date(selectedDayes[selectedDayes.length - 1]);
        while (newDate < minDate) {
          newlyAddedDate[newDate.toISOString().split('T')[0]] = {
            selected: true,
          };
          setSelectedDate({...selectedDate, ...newlyAddedDate});
          setSelectedDayes([
            ...selectedDayes,
            newDate.toISOString().split('T')[0],
          ]);
          newDate.setDate(newDate.getDate() + 1);
        }
        while (newDate > maxDate) {
          newlyAddedDate[newDate.toISOString().split('T')[0]] = {
            selected: true,
          };
          setSelectedDate({...selectedDate, ...newlyAddedDate});
          setSelectedDayes([
            ...selectedDayes,
            newDate.toISOString().split('T')[0],
          ]);
          newDate.setDate(newDate.getDate() - 1);
        }
        // const orderedDate = Object.keys(selectedDate).sort(
        //   (a: string, b: string) => (new Date(a) as any) - (new Date(b) as any),
        // );
        // const firstDay = orderedDate[0].replace(/\-/g, '');
        // const lastDay = orderedDate[orderedDate.length - 1].replace(/\-/g, '');
        // console.log('firstDay', firstDay);
        // console.log('lastDay', lastDay);
        // console.log('selectedDayes', selectedDayes);
      } else {
        const newDate: any = {};
        newDate[date] = {selected: true};
        setSelectedDate({...selectedDate, ...newDate});
        setSelectedDayes([...selectedDayes, date]);
      }
    }
  };

  const removeSelectedDate = () => {
    setSelectedDate({});
    setSelectedDayes([]);
    setTimeout(() => {
      closeBottomModal();
    }, 100);
  };

  const moveToNextStep = () => {
    if (Object.keys(selectedDate).length < 1) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '시작일과 종료일을 선택해주세요',
      });
      return;
    } else {
      // const orderedDate = Object.keys(selectedDate).sort(
      //   (a: string, b: string) => (new Date(a) as any) - (new Date(b) as any),
      // );

      let today = new Date();
      let year = today.getFullYear(); // 년도
      let month = today.getMonth() + 1; // 월
      let date = today.getDate(); // 날짜
      let hours = today.getHours();
      let minutes = today.getMinutes();

      const orderedDate = Object.keys(selectedDate).sort(
        (a: string, b: string) => (new Date(a) as any) - (new Date(b) as any),
      );

      const currentDate =
        year.toString() +
        month.toString().padStart(2, '0') +
        date.toString().padStart(2, '0') +
        hours.toString().padStart(2, '0') +
        minutes.toString().padStart(2, '0');

      console.log('currentDate', currentDate);

      const selectDate =
        orderedDate[0].replace(/\-/g, '') +
        String(selectedStartTime.getHours()).padStart(2, '0') +
        String(selectedStartTime.getMinutes()).padStart(2, '0');

      if (currentDate >= selectDate) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          textBody: '현재시각 이전인 스케줄은 생성할 수 없습니다',
        });
        return;
      }

      dispatch(
        scheduleAction.setDate({
          startAt:
            orderedDate[0].replace(/\-/g, '') +
            String(selectedStartTime.getHours()).padStart(2, '0') +
            String(selectedStartTime.getMinutes()).padStart(2, '0'),
          endAt:
            orderedDate[orderedDate.length - 1].replace(/\-/g, '') +
            String(selectedEndTime.getHours()).padStart(2, '0') +
            String(selectedEndTime.getMinutes()).padStart(2, '0'),
        }),
      );
      navigation.navigate('CreateGroupFinalPage');
    }
  };

  return (
    <SafeAreaView>
      <BottomSheetModalProvider>
        <ScrollView style={styles.groupCreateWrapper}>
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
              <Text style={styles.settingHeaderTitle}>알람내역</Text>
            </View>
            <View style={styles.stepWrapper}>
              <View style={styles.stepImg}>
                <Image source={require('../resources/icons/check.png')} />
                <Text style={styles.stepText}>일정 이름</Text>
              </View>
              <View style={styles.stepImg}>
                <Image source={require('../resources/icons/CellActive.png')} />
              </View>
              <View style={styles.stepImg}>
                <Image source={require('../resources/icons/CellActive.png')} />
              </View>
              <View style={styles.stepImg}>
                <Image source={require('../resources/icons/secondCheck.png')} />
                <Text style={styles.stepActiveText}>일정/시간 설정</Text>
              </View>
              <View style={styles.stepImg}>
                <Image source={require('../resources/icons/Cell.png')} />
              </View>
              <View style={styles.stepImg}>
                <Image source={require('../resources/icons/Cell.png')} />
              </View>
              <View style={styles.stepImg}>
                <Image source={require('../resources/icons/third.png')} />
                <Text style={styles.stepText}>그룹원 초대</Text>
              </View>
            </View>
            <View style={styles.elementWrapper}>
              <Text style={styles.elementLabel}>일정</Text>
              {firstDay === '' ? (
                <Text style={styles.elementSubLabel}>
                  원하는 날짜를 선택해주세요
                </Text>
              ) : (
                <Text style={styles.elementSubLabel}>
                  {firstDay} ~ {lastDay}
                </Text>
              )}
              <Button
                color="#21B8CD"
                title="일정 설정하기"
                onPress={openBottomModal}
              />
              <BottomSheetModal
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                backdropComponent={BottomSheetBackDrop}
                style={styles.bottomModal}>
                <BottomSheetScrollView>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Calendar
                        style={styles.calendar}
                        markedDates={selectedDate}
                        theme={{
                          selectedDayBackgroundColor: '#21B8CD',
                          arrowColor: '#21B8CD',
                          dotColor: '#21B8CD',
                          todayTextColor: 'black',
                        }}
                        onDayPress={day => {
                          addSelectedDate(day.dateString);
                        }}
                      />
                    </View>
                    <View style={styles.modalButtonWrapper}>
                      <Pressable
                        style={styles.cancleButton}
                        onPress={removeSelectedDate}>
                        <Text style={styles.textStyle}>취소</Text>
                      </Pressable>
                      <Pressable
                        style={styles.button}
                        onPress={closeBottomModal}>
                        <Text style={styles.textStyle}>확인</Text>
                      </Pressable>
                    </View>
                  </View>
                </BottomSheetScrollView>
              </BottomSheetModal>
            </View>
            <View style={styles.elementWrapper}>
              <Text style={styles.elementLabel}>시작 시간</Text>
              {startTime === '' ? (
                <Text style={styles.elementSubLabel}>
                  시작시간을 설정해주세요
                </Text>
              ) : (
                <Text style={styles.elementSubLabel}>{startTime}</Text>
              )}
              <Button
                color="#21B8CD"
                title="시작시간 설정하기"
                onPress={toggleStartTimeModal}
              />
              <DatePicker
                modal
                title={null}
                mode={'time'}
                open={isStartTimeModalVisible}
                date={selectedStartTime}
                confirmText={'선택'}
                cancelText={'취소'}
                onConfirm={date => {
                  console.log(date);
                  setSelectedStartTime(date);
                }}
                onCancel={() => {
                  toggleStartTimeModal;
                }}
              />
            </View>
            <View style={styles.elementWrapper}>
              <Text style={styles.elementLabel}>종료 시간</Text>
              {lastTime === '' ? (
                <Text style={styles.elementSubLabel}>
                  종료시간을 설정해주세요
                </Text>
              ) : (
                <Text style={styles.elementSubLabel}>{lastTime}</Text>
              )}
              <Button
                color="#21B8CD"
                title="종료시간 설정하기"
                onPress={toggleEndTimeModal}
              />
              <DatePicker
                modal
                title={null}
                mode={'time'}
                open={isEndTimeModalVisible}
                date={selectedEndTime}
                confirmText={'선택'}
                cancelText={'취소'}
                onConfirm={date => {
                  setSelectedEndTime(date);
                }}
                onCancel={() => {
                  toggleStartTimeModal;
                }}
              />
            </View>
            <TouchableOpacity style={styles.nextButton}>
              <Button color="#21B8CD" title="다음" onPress={moveToNextStep} />
            </TouchableOpacity>
          </AlertNotificationRoot>
        </ScrollView>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
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
  stepWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    margin: 5,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  stepImg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActiveText: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
  },
  stepText: {
    marginTop: 5,
    fontSize: 11,
  },
  groupCreateWrapper: {
    backgroundColor: 'white',
    padding: 20,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  elementWrapper: {
    paddingBottom: 25,
  },
  elementLabel: {
    color: 'black',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 18,
    marginTop: 10,
  },
  elementSubLabel: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 20,
  },
  calendar: {
    width: '100%',
    borderColor: 'white',
  },
  memberInvitation: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#4D483D',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    color: '#4D483D',
  },
  cancleButton: {
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: '50%',
    height: 48,
  },
  button: {
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#21B8CD',
    width: '50%',
    height: 48,
  },
  buttonClose: {
    backgroundColor: '#21B8CD',
    width: '50%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  nextButton: {
    marginTop: Dimensions.get('window').height / 10,
  },
  modalButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    marginLeft: 50,
    marginRight: 50,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
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
  shadowContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
});
export default CreateGroupSecondPage;
