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
} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';

interface selectDateType {
  [key: string]: {[key: string]: boolean};
}

function CreateGroupPage({navigation}: any) {
  const [groupName, setGroupName] = useState('');
  const [searchName, setSearchName] = useState('');
  const groupNameRef = useRef<TextInput | null>(null);
  const [selectedDate, setSelectedDate] = useState<selectDateType>({});
  const [selectedDayes, setSelectedDayes] = useState<Array<string>>([]);
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const ownerId = useSelector((state: RootState) => state.persist.user.id);

  useEffect(() => {
    groupNameRef.current?.focus();
    getAllUsers();
  }, []);

  const dispatch = useAppDispatch();

  useEffect(() => {
    axios.interceptors.response.use(
      //성공한경우
      response => {
        return response;
      },
      //실패한경우
      async error => {
        const {
          config, //error.config -> 원래요청
          response: {status}, //error.response.status
        } = error;
        //토큰 만료 에러코드
        if (status === 401) {
          console.log(status);
          console.log(config);
          const originalRequest = config;
          const refreshToken = await EncryptedStorage.getItem('refreshToken');
          // token refresh 요청
          const {data} = await axios.post(
            `http://10.0.2.2:8002/users/auth/refresh`, // token refresh api
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Refresh: `${refreshToken}`,
              },
            },
          );
          // 새로운 토큰 저장
          dispatch(userActions.setAccessToken(data.data.accessToken));
          EncryptedStorage.setItem('refreshToken', data.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          // 419로 요청 실패했던 요청 새로운 토큰으로 재요청
          return axios(originalRequest);
        }
        return Promise.reject(error);
      },
    );
  }, [accessToken, dispatch]);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        'http://10.0.2.2:8002/users?exceptMe=true',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      });
      console.log(response);
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
      await axios.post(
        `http://10.0.2.2:8002/schedules`,
        {
          name: groupName,
          owner_id: ownerId,
          startAt: orderedDate[0].replace(/\!/g, ''),
          endAt: orderedDate[orderedDate.length - 1].replace(/\!/g, ''),
          participants: selectedUsersId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
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

  return (
    <SafeAreaView>
      <ScrollView style={styles.groupCreateWrapper}>
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
                  onPress={removeToGroupMember(user)}
                  key={user.id}>
                  <Image
                    key={user.id}
                    style={styles.selectedUserImage}
                    source={{
                      uri: 'https://firebasestorage.googleapis.com/v0/b/instagram-aaebd.appspot.com/o/profile_image.jpg?alt=media&token=5bebe0eb-6552-40f6-9aef-cd11d816b619',
                    }}
                  />
                  <Text style={styles.selectedUserName} key={user.id}>
                    {user.name}
                  </Text>
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
              secureTextEntry
              returnKeyType="send"
              clearButtonMode="while-editing"
            />
          </View>
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
  },
  groupCreateWrapper: {
    padding: 20,
  },
  elementWrapper: {
    paddingBottom: 25,
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
});
export default CreateGroupPage;
