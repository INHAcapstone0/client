/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Linking,
  Button,
  Alert,
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

function RegisterAccountPage({navigation}: any) {
  const dispatch = useAppDispatch();
  //액세스토큰
  const id = useSelector((state: RootState) => state.persist.user.id);
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

  return (
    <View>
      <Pressable
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
  hyperlinkStyle: {
    fontSize: 16,
    color: '#505050',
  },
  contentStyle: {
    fontSize: 18,
    color: '#111111',
  },
});
export default RegisterAccountPage;
