/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Linking,
  Button,
  Alert,
  AppState,
  ScrollView,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {userActions} from '../slices/user';
import {useAppDispatch} from '../store/Store';
import axios from 'axios';
import {RootState} from '../store/Store';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal/dist/modal';
import Hyperlink from 'react-native-hyperlink';
import axiosInstance from '../utils/interceptor';
import AccountSettingCard from '../components/AccountSettingCard';

export const enum USER_APP_STATE {
  active = 'active', // 앱 안에서 사용중인 경우
  inactive = 'inactive', // [IOS] 앱 안에서 벗어난 경우
  background = 'background', // 앱 안에서 다른곳으로 벗어난 경우
}

function RegisterAccountPage({navigation}: any) {
  const dispatch = useAppDispatch();
  //액세스토큰
  const id = useSelector((state: RootState) => state.persist.user.id);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const OPENBANK_CALLBACK_URL_1 = 'http://146.56.190.78/extra/send';
  const OPENBANK_CLIENT_ID = '141f9981-d313-400a-991d-bd7e8fa5392c';
  const OPENBANK_STATE_RANDSTR = 'nananananananananananananananana';

  const redirect_uri =
    `https://testapi.openbanking.or.kr/oauth/2.0/authorize?` +
    `response_type=code&client_id=${OPENBANK_CLIENT_ID}&` +
    `scope=login inquiry transfer&auth_type=0&redirect_uri=${OPENBANK_CALLBACK_URL_1}&` +
    `state=${OPENBANK_STATE_RANDSTR}` +
    `&client_info=${id}`;

  const dummyData = [
    {
      bank: '카카오',
      name: '카카오뱅크통장',
      number: '11111-11111-11111',
      fin_num: '1',
      money: '10000',
    },
    {
      bank: '하나',
      name: 'Young하나은행',
      number: '22222-22222-22222',
      fin_num: '2',
      money: '20000',
    },
    {
      bank: '우체국',
      name: '우체국',
      number: '33333-33333-33333',
      fin_num: '3',
      money: '30000',
    },
    {
      bank: '국민',
      name: '국민통장',
      number: '44444-44444-44444',
      fin_num: '4',
      money: '40000',
    },
    {
      bank: '우리',
      name: '우리통장',
      number: '55555-55555-55555',
      fin_num: '5',
      money: '50000',
    },
    {
      bank: '농협',
      name: '농협통장',
      number: '66666-66666-66666',
      fin_num: '6',
      money: '60000',
    },
    {
      bank: '기업',
      name: '기업통장',
      number: '77777-77777-77777',
      fin_num: '7',
      money: '70000',
    },
    {
      bank: '신한',
      name: '신한통장',
      number: '88888-88888-88888',
      fin_num: '8',
      money: '80000',
    },
  ];

  const redirectToOpenbanking = async () => {
    await Linking.openURL(redirect_uri);
  };
  const getTokenForOpenbanking = async () => {};

  const getToken = async () => {
    const accessToken = await EncryptedStorage.getItem('accessToken');
    console.log('accessToken', accessToken);
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axiosInstance.get(
        `http://146.56.190.78/extra/token`,
        {
          headers,
        },
      );
      const accessTokenData = await EncryptedStorage.setItem(
        'accessTokenToBank',
        response.data.access_token,
      );

      const refreshTokenData = await EncryptedStorage.setItem(
        'refreshTokenToBank',
        response.data.refresh_token,
      );
      console.log('response.data', response.data);
    } catch (err: any) {
      console.log('err.response.msg', err.response);
    }
  };
  const fn_handleAppStateChange = (nextAppState: any) => {
    if (
      (appState.current === USER_APP_STATE.inactive ||
        appState.current === USER_APP_STATE.background) &&
      nextAppState === USER_APP_STATE.active
    ) {
      console.log('앱으로 다시 돌아오는 경우 foreground');
      setTimeout(() => getToken(), 1000);
    }
    appState.current = nextAppState; // 변경된 상태를 바꿔줌.
    setAppStateVisible(appState.current);
  };

  useEffect(() => {
    AppState.addEventListener('change', fn_handleAppStateChange);
  });
  return (
    <ScrollView>
      <Pressable
        style={styles.addButton}
        onPress={() => {
          //리다이렉션 시키기
          redirectToOpenbanking();
        }}>
        <Text style={styles.addButtonText}>새 계좌 등록하기</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          //토큰 발급 받기
          getToken();
        }}>
        <Text>인증 완료 후 토큰 발급받기</Text>
      </Pressable>
      {dummyData.map((item: any) => {
        return <AccountSettingCard key={item.number} item={item} />;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: Dimensions.get('window').width * 0.9,
    height: 50,
    justifyContent: 'center',
    aligntems: 'center',
    backgroundColor: '#21B8CD',
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
export default RegisterAccountPage;
