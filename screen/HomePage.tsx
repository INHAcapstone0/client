/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, useRef, useCallback} from 'react';
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
  ScrollView
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import SettingPage from './SettingPage';
import CalculatePage from './CalculatePage';
import AlarmPage from './AlarmPage';
import {useAppDispatch} from '../store/Store';
import ScheduleArea from "../components/ScheduleArea";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {userActions} from '../slices/User';

const Stack = createNativeStackNavigator();

function HomePage({navigation}: any) {
  const [info, setInfo] = useState([]);

  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );

  useEffect(() => {
    
    AsyncStorage.getItem('user_id', (err, result1) => { //user_id에 담긴 아이디 불러오기

      
      result1 = '4008b5cb-c626-4a3a-9490-08572249ccf4'; //test0 계정
      const params ={
        status: "승인"
      };
    
      //엑세스토큰 먼저 확인하고 id 가져오기 - 추후수정
      //엑세스 토큰 만료되면 refresh로 액세스토큰 만들어주기
      AsyncStorage.getItem('accessToken', (err, result2) => {
        result2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQwMDhiNWNiLWM2MjYtNGEzYS05NDkwLTA4NTcyMjQ5Y2NmNCIsIm5hbWUiOiLthYzsiqTtirjsnKDsoIAwIiwiaWF0IjoxNjYyMjEyNDI3LCJleHAiOjE2NjM0MjIwMjd9.WOdLOl4a2WRCzqobCuuCLj5HE9fCtcGb2c2NUFZxHLA';
        const headers ={
        Authorization : `Bearer ${result2}`
      }
      
      axios.get("http://10.0.2.2:8002/schedules/status", {params,headers})
      .then(res=>setInfo(res.data))
      .catch(err=>console.log('3 : ',err));
    });

    
    /*
    //엑세스토큰 먼저 확인하고 id 가져오기 - 추후수정
    //엑세스 토큰 만료되면 refresh로 액세스토큰 만들어주기
    AsyncStorage.getItem('accessToken', (err, result2) => {
      //result2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQwMDhiNWNiLWM2MjYtNGEzYS05NDkwLTA4NTcyMjQ5Y2NmNCIsIm5hbWUiOiLthYzsiqTtirjsnKDsoIAwIiwiaWF0IjoxNjYxODQ3MTcwLCJleHAiOjE2NjMwNTY3NzB9.DO02grsZ2zwzIPj0-2s2AJAtzgoAcmJv_vQDL2Biqg4';
      const headers ={
      Authorization : `Bearer ${result2}`
    }

    
    const params ={
      owner_id: result1
    };
    
    axios.get("http://10.0.2.2:8002/schedules", {params,headers})
    .then(res=>setInfo(res.data))
    .catch(err=>console.log('3 : ',err));
    
  });*/
    
      });
    },[]);
  return (
    <ScrollView style={styles.inputWrapper}>
      {/* <BottomNavigation /> */}
      <ScheduleArea info={info}/>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonZone: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
export default HomePage;

