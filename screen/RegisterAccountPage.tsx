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
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {userActions} from '../slices/User';
import {useAppDispatch} from '../store/Store';
import axios from 'axios';
import {RootState} from '../store/Store';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal/dist/modal';
import Hyperlink from 'react-native-hyperlink';
import axiosInstance from '../utils/interceptor';

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
      const response = await axios.get(`http://146.56.190.78/extra/token`, {
        headers,
      });
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
      console.log('token is ', response.data);
    } catch (err: any) {
      console.log('token error is ', err);
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

  return (
    <View>
      <Pressable
        style={styles.addButton}
        onPress={() => {
          //리다이렉션 시키기
          redirectToOpenbanking();
        }}>
        <Text>새 계좌 등록하기</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          //리다이렉션 시키기
          getToken();
        }}>
        <Text>인증 완료 후 토큰 발급받기</Text>
      </Pressable>
    </View>
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
});
export default RegisterAccountPage;
