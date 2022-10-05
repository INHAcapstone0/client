/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useRef, useState, useEffect} from 'react';
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

  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const ownerId = useSelector((state: RootState) => state.persist.user.id);
  const dispatch = useAppDispatch();

  const toggleDateModal = () => {
    setIsDateModalVisible(!isDateModalVisible);
  };

  const toggleStartTimeModal = () => {
    setIsStartTimeModalVisible(!isStartTimeModalVisible);
  };

  const toggleEndTimeModal = () => {
    setIsEndTimeModalVisible(!isEndTimeModalVisible);
  };

  useEffect(() => {
    groupNameRef.current?.focus();
  }, []);

  useEffect(() => {
    console.log(String(selectedStartTime.getHours()).padStart(2, '0'));
    console.log(selectedStartTime.getMinutes());
    console.log(String(selectedEndTime.getHours()).padStart(2, '0'));
    console.log(selectedEndTime.getMinutes());
  }, [selectedStartTime, selectedEndTime]);

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
      toggleDateModal();
    }, 100);
  };

  const moveToNextStep = () => {
    if (Object.keys(selectedDate).length < 2) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: '시작일과 종료일을 선택해주세요',
      });
      return;
    } else {
      const orderedDate = Object.keys(selectedDate).sort(
        (a: string, b: string) => (new Date(a) as any) - (new Date(b) as any),
      );

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
      <ScrollView style={styles.groupCreateWrapper}>
        <AlertNotificationRoot>
          <View style={styles.stepWrapper}>
            <View style={styles.stepImg}>
              <Image source={require('../resources/icons/check.png')} />
              <Text style={styles.stepText}>그룹 이름</Text>
            </View>
            <View style={styles.stepImg}>
              <Image source={require('../resources/icons/secondCheck.png')} />
              <Text style={styles.stepActiveText}>일정/시간 설정</Text>
            </View>
            <View style={styles.stepImg}>
              <Image source={require('../resources/icons/third.png')} />
              <Text style={styles.stepText}>그룹원 초대</Text>
            </View>
          </View>
          <View style={styles.elementWrapper}>
            <Text style={styles.elementLabel}>일정</Text>
            <Text style={styles.elementSubLabel}>
              원하는 날짜를 선택해주세요
            </Text>
            <Button
              color="#21B8CD"
              title="일정 설정하기"
              onPress={toggleDateModal}
            />
            <Modal
              animationType="slide"
              transparent={false}
              visible={isDateModalVisible}
              onRequestClose={() => {
                setIsDateModalVisible(!isDateModalVisible);
              }}>
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
                    onPress={() => setIsDateModalVisible(!isDateModalVisible)}>
                    <Text style={styles.textStyle}>확인</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
          <View style={styles.elementWrapper}>
            <Text style={styles.elementLabel}>시작 시간</Text>
            <Text style={styles.elementSubLabel}>시작시간을 설정해주세요</Text>
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
                setSelectedStartTime(date);
              }}
              onCancel={() => {
                toggleStartTimeModal;
              }}
            />
          </View>
          <View style={styles.elementWrapper}>
            <Text style={styles.elementLabel}>종료 시간</Text>
            <Text style={styles.elementSubLabel}>종료시간을 설정해주세요</Text>
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
          <View style={styles.nextButton}>
            <Button color="#21B8CD" title="다음" onPress={moveToNextStep} />
          </View>
        </AlertNotificationRoot>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
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
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
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
    marginTop: Dimensions.get('window').height / 4,
  },
  modalButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 50,
    marginRight: 50,
  },
});
export default CreateGroupSecondPage;
