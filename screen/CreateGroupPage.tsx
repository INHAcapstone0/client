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
} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import FormButton from '../components/FormButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DatePicker from 'react-native-date-picker';

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

function CreateGroupPage({navigation}: any) {
  const [groupName, setGroupName] = useState('');
  const [searchName, setSearchName] = useState('');
  const groupNameRef = useRef<TextInput | null>(null);
  const [selectedDate, setSelectedDate] = useState<selectDateType>({});
  const [selectedDayes, setSelectedDayes] = useState<Array<string>>([]);
  const [selectedUsers, setSelectedUseres] = useState<Array<userType>>([]);
  const [allUsers, setAllUsers] = useState<Array<userType>>([]);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
  const [isStartTimeModalVisible, setIsStartTimeModalVisible] = useState(false);
  const [isEndTimeModalVisible, setIsEndTimeModalVisible] = useState(false);

  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());

  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const ownerId = useSelector((state: RootState) => state.persist.user.id);

  const toggleDateModal = () => {
    setIsDateModalVisible(!isDateModalVisible);
  };

  const toggleMemberModal = () => {
    setIsMemberModalVisible(!isMemberModalVisible);
  };

  const toggleStartTimeModal = () => {
    setIsStartTimeModalVisible(!isStartTimeModalVisible);
  };

  const toggleEndTimeModal = () => {
    setIsEndTimeModalVisible(!isEndTimeModalVisible);
  };

  useEffect(() => {
    groupNameRef.current?.focus();
    getAllUsers();
  }, []);

  useEffect(() => {
    console.log(String(selectedStartTime.getHours()).padStart(2, '0'));
    console.log(selectedStartTime.getMinutes());
    console.log(String(selectedEndTime.getHours()).padStart(2, '0'));
    console.log(selectedEndTime.getMinutes());
  }, [selectedStartTime, selectedEndTime]);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        'http://146.56.188.32:8002/users?exceptMe=true',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setAllUsers(response.data);
    } catch (err: any) {
      console.log(err.response);
    }
  };

  const onChangeGroupName = useCallback((text: string) => {
    setGroupName(text.trim());
  }, []);

  const onChangeSearchName = useCallback((text: string) => {
    setSearchName(text.trim());
  }, []);

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

  const addToGroupMember = (user: userType) => (event: any) => {
    if (selectedUsers.includes(user)) {
      const newSelectedUsers = selectedUsers.filter(
        selectedUser => selectedUser.id !== user.id,
      );
      setSelectedUseres([...newSelectedUsers]);
    } else {
      setSelectedUseres([...selectedUsers, user]);
    }
  };

  const createGroup = async () => {
    if (Object.keys(selectedDate).length < 2) {
      Alert.alert('시작일과 종료일을 선택해주세요');
    }
    try {
      const orderedDate = Object.keys(selectedDate).sort(
        (a: string, b: string) => (new Date(a) as any) - (new Date(b) as any),
      );
      const selectedUsersId: string[] = [];

      selectedUsers.filter(user => selectedUsersId.push(user.id));
      console.log(
        groupName,
        ownerId,
        orderedDate[0],
        orderedDate[orderedDate.length - 1],
        selectedUsersId,
      );

      const result = await axios.post(
        'http://146.56.188.32:8002/schedules',
        {
          name: groupName,
          owner_id: ownerId,
          startAt:
            orderedDate[0].replace(/\-/g, '') +
            String(selectedStartTime.getHours()).padStart(2, '0') +
            selectedStartTime.getMinutes(),
          endAt:
            orderedDate[orderedDate.length - 1].replace(/\-/g, '') +
            String(selectedEndTime.getHours()).padStart(2, '0') +
            selectedEndTime.getMinutes(),
          participants: selectedUsersId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(result);
      Alert.alert('알림', '그룹생성이 완료되었습니다', [
        {
          text: '확인',
          onPress: () => {
            navigation.reset({
              routes: [
                {
                  name: 'HomePage',
                },
              ],
            });
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert(err.response.data.msg);
    }
  };

  const onSubmit = useCallback(() => {
    console.log(1);
  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={styles.groupCreateWrapper}>
        <View style={styles.elementWrapper}>
          <Text style={styles.elementLabel}>그룹 이름</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeGroupName}
            placeholder="그룹명을 입력해주세요"
            placeholderTextColor="#4D483D"
            importantForAutofill="yes"
            textContentType="familyName"
            value={groupName}
            returnKeyType="next"
            clearButtonMode="while-editing"
            ref={groupNameRef}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.elementWrapper}>
          <Text style={styles.elementLabel}>일정</Text>
          <Button color="#4D483D" title="일정" onPress={toggleDateModal} />
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
                    selectedDayBackgroundColor: '#4D483D',
                    arrowColor: '#4D483D',
                    dotColor: '#4D483D',
                    todayTextColor: '#4D483D',
                  }}
                  onDayPress={day => {
                    addSelectedDate(day.dateString);
                  }}
                />
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setIsDateModalVisible(!isDateModalVisible)}>
                  <Text style={styles.textStyle}>선택 완료</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.elementWrapper}>
          <Text style={styles.elementLabel}>시작 시간</Text>
          <Button
            color="#4D483D"
            title="시작 시간"
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
          <Button
            color="#4D483D"
            title="종료 시간"
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
        <View style={styles.elementWrapper}>
          <Text style={styles.elementLabel}>그룹원 초대</Text>
          <Button
            color="#4D483D"
            title="그룹원 초대"
            onPress={toggleMemberModal}
          />
          <Modal
            animationType="slide"
            transparent={false}
            visible={isMemberModalVisible}
            onRequestClose={() => {
              setIsMemberModalVisible(!isMemberModalVisible);
            }}>
            <ScrollView style={styles.memberInvitation}>
              <TextInput
                style={styles.serchTextInput}
                placeholder="그룹원 검색"
                placeholderTextColor="#666"
                importantForAutofill="yes"
                onChangeText={onChangeSearchName}
                value={searchName}
                autoComplete="name"
                textContentType="name"
                returnKeyType="send"
                clearButtonMode="while-editing"
              />
              <>
                {allUsers.map(user => {
                  if (user.name.includes(searchName)) {
                    return (
                      <TouchableHighlight
                        key={user.id}
                        underlayColor="#d9d4d4"
                        onPress={addToGroupMember(user)}>
                        <View style={styles.userWrapper}>
                          <Image
                            style={styles.userImage}
                            source={{
                              uri: 'https://firebasestorage.googleapis.com/v0/b/instagram-aaebd.appspot.com/o/profile_image.jpg?alt=media&token=5bebe0eb-6552-40f6-9aef-cd11d816b619',
                            }}
                          />
                          <Text style={styles.userName}>{user.name}</Text>
                          {selectedUsers.includes(user) ? (
                            <Image
                              style={styles.checkButton}
                              source={require('../resources/icons/CircleCheck.png')}
                            />
                          ) : (
                            <Image
                              style={styles.checkButton}
                              source={require('../resources/icons/Circle.png')}
                            />
                          )}
                        </View>
                      </TouchableHighlight>
                    );
                  }
                })}
              </>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setIsMemberModalVisible(!isMemberModalVisible)}>
                <Text style={styles.textStyle}>선택 완료</Text>
              </Pressable>
            </ScrollView>
          </Modal>
        </View>
        <Pressable onPress={createGroup} style={styles.groupCreateButton}>
          <Text style={styles.groupCreateButtonText}>그룹 생성하기</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: 0.3,
    borderColor: '#4D483D',
    fontFamily: 'Jalnan',
  },
  groupCreateWrapper: {
    backgroundColor: 'white',
    padding: 20,
  },
  elementWrapper: {
    paddingBottom: 25,
  },
  elementLabel: {
    color: '#4D483D',
    fontFamily: 'Jalnan',
    fontSize: 20,
    marginTop: 10,
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
  serchTextInput: {
    margin: 20,
    paddingLeft: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4D483D',
    fontFamily: 'Jalnan',
  },
  userWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    paddingLeft: 20,
  },
  userImage: {
    width: 54,
    height: 54,
    borderRadius: 30,
    marginRight: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: '400',
    color: '#4D483D',
    fontFamily: 'Jalnan',
  },
  selectedUserWrapper: {
    paddingRight: 10,
    paddingBottom: 10,
    display: 'flex',
    alignItems: 'center',
  },
  selectedUserContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  selectedUserName: {
    fontSize: 10,
    fontWeight: '400',
    color: '#000000',
  },
  selectedUserImage: {
    width: 54,
    height: 54,
    borderRadius: 30,
  },
  groupCreateButton: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 50,
    textAlign: 'center',
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  groupCreateButtonText: {
    color: 'white',
  },
  checkButton: {
    position: 'absolute',
    right: 17,
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
  button: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#4D483D',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#4D483D',
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
});
export default CreateGroupPage;
