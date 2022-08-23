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
import {format} from 'date-fns';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {useAppDispatch} from '../store/Store';
import EncryptedStorage from 'react-native-encrypted-storage';
import {userActions} from '../slices/User';

interface selectDateType {
  [key: string]: {[key: string]: boolean};
}

function CreateGroupPage({navigation}: any) {
  const [groupName, setGroupName] = useState('');
  const [searchName, setSearchName] = useState('');
  const groupNameRef = useRef<TextInput | null>(null);
  const calendarRef = useRef<TextInput | null>(null);
  const [selectedDate, setSelectedDate] = useState<selectDateType>({});
  const [selectedDayes, setSelectedDayes] = useState<Array<string>>([]);
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const name = useSelector((state: RootState) => state.persist.user.name);

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
            `http://10.0.2.2:8002/users/auth/refersh`, // token refresh api
            {},
            {
              headers: {
                Authorization: `[${accessToken}]`,
                Refresh: `[${refreshToken}]`,
              },
            },
          );
          // 새로운 토큰 저장
          dispatch(userActions.setAccessToken(data.data.accessToken));
          EncryptedStorage.setItem('refreshToken', data.data.refreshToken);
          originalRequest.headers.Authorization = `[${data.data.accessToken}]`;
          // 419로 요청 실패했던 요청 새로운 토큰으로 재요청
          return axios(originalRequest);
        }
        return Promise.reject(error);
      },
    );
  }, [accessToken, dispatch]);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8002/users`, {
        headers: {
          Authorization_Access: `[${accessToken}]`,
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
});
export default CreateGroupPage;
