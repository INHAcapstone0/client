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
} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
//import {format} from 'date-fns';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {useAppDispatch} from '../store/Store';
import EncryptedStorage from 'react-native-encrypted-storage';
import userSlice, {userActions} from '../slices/User';

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
  const calendarRef = useRef<TextInput | null>(null);
  const [selectedDate, setSelectedDate] = useState<selectDateType>({});
  const [selectedDayes, setSelectedDayes] = useState<Array<string>>([]);
  const [selectedUsers, setSelectedUseres] = useState<Array<userType>>([]);
  const [allUsers, setAllUsers] = useState<Array<userType>>([]);
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const name = useSelector((state: RootState) => state.persist.user.name);

  useEffect(() => {
    console.log(accessToken);
    groupNameRef.current?.focus();
    getAllUsers();
    'asdasdasd'.includes('asd');
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8002/users?exceptMe=true`,
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
      return;
    }
    setSelectedUseres([...selectedUsers, user]);
  };

  const removeToGroupMember = (user: userType) => (event: any) => {
    const newSelectedUsers = selectedUsers.filter(
      selectedUser => selectedUser.id !== user.id,
    );
    setSelectedUseres(newSelectedUsers);
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.groupCreateWrapper}>
        <Text style={styles.headerLabel}>새그룹 생성하기</Text>
        <View style={styles.elementWrapper}>
          <Text style={styles.elementLabel}>그룹 이름</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeGroupName}
            placeholder="그룹명을 입력해주세요"
            placeholderTextColor="#666"
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
          <Text style={styles.elementLabel}>일정 선택</Text>
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
        </View>
        <View style={styles.elementWrapper}>
          <Text style={styles.elementLabel}>그룹원 선택</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
            <View style={styles.selectedUserContainer}>
              {selectedUsers.map(user => (
                <TouchableOpacity
                  style={styles.selectedUserWrapper}
                  onPress={removeToGroupMember(user)}>
                  <Image
                    style={styles.selectedUserImage}
                    source={{
                      uri: 'https://firebasestorage.googleapis.com/v0/b/instagram-aaebd.appspot.com/o/profile_image.jpg?alt=media&token=5bebe0eb-6552-40f6-9aef-cd11d816b619',
                    }}
                  />
                  <Text style={styles.selectedUserName}>{user.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <View style={styles.memberInvitation}>
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
                      </View>
                    </TouchableHighlight>
                  );
                }
              })}
            </>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: 0.3,
    borderColor: '#4D483D',
  },
  groupCreateWrapper: {
    padding: 20,
  },
  elementWrapper: {
    paddingBottom: 25,
  },
  headerLabel: {
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 10,
    marginBottom: 20,
  },
  elementLabel: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  calendar: {
    borderColor: '#4D483D',
  },
  memberInvitation: {
    minHeight: 500,
    borderWidth: 1,
    borderColor: '#4D483D',
  },
  serchTextInput: {
    margin: 20,
    paddingLeft: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4D483D',
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
    color: '#000000',
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
});
export default CreateGroupPage;
