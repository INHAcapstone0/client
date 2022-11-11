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
  const [bankInfo, setBankInfo] = useState([]);
  const [selectedFinNum, setSelectedFinNum] = useState('');
  const OPENBANK_CALLBACK_URL_1 = 'http://146.56.190.78/extra/send';
  const OPENBANK_CLIENT_ID = '141f9981-d313-400a-991d-bd7e8fa5392c';
  const OPENBANK_STATE_RANDSTR = 'nananananananananananananananana';

  const redirect_uri =
    `https://testapi.openbanking.or.kr/oauth/2.0/authorize?` +
    `response_type=code&client_id=${OPENBANK_CLIENT_ID}&` +
    `scope=login inquiry transfer&auth_type=0&redirect_uri=${OPENBANK_CALLBACK_URL_1}&` +
    `state=${OPENBANK_STATE_RANDSTR}` +
    `&client_info=${id}`;

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const openDeleteModal = () => {
    setDeleteModalVisible(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
  };

  const redirectToOpenbanking = async () => {
    await Linking.openURL(redirect_uri);
  };
  const getTokenForOpenbanking = async () => {};

  const getToken = async () => {
    const accessToken = await EncryptedStorage.getItem('accessToken');
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
      getAccountInfo();
    } catch (err: any) {
      console.log('err.response.msg', err.response);
    }
  };

  const getAccountInfo = async () => {
    const accessToken = await EncryptedStorage.getItem('accessToken');
    const accessTokenToBank = await EncryptedStorage.getItem(
      'accessTokenToBank',
    );
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'bank-authorization': `Bearer ${accessTokenToBank}`,
      };

      const response = await axiosInstance.get(
        `http://146.56.190.78/extra/user/me`,
        {
          headers,
        },
      );

      setBankInfo(response.data.res_list);
    } catch (err: any) {
      console.log('err.response.msg', err.response);
    }
  };

  const deleteAccount = async () => {
    const accessToken = await EncryptedStorage.getItem('accessToken');
    const accessTokenToBank = await EncryptedStorage.getItem(
      'accessTokenToBank',
    );
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'bank-authorization': `Bearer ${accessTokenToBank}`,
      };

      const body = {
        fintech_use_num: selectedFinNum,
      };

      const response = await axiosInstance.post(
        `http://146.56.190.78/extra/account/cancel`,
        body,
        {
          headers,
        },
      );
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
      setTimeout(() => getToken(), 1000);
    }
    appState.current = nextAppState; // 변경된 상태를 바꿔줌.
    setAppStateVisible(appState.current);
  };

  useEffect(() => {
    AppState.addEventListener('change', fn_handleAppStateChange);
    getAccountInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ScrollView
      style={{
        backgroundColor: 'white',
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          margin: 20,
        }}>
        <Pressable
          style={styles.addButton}
          onPress={() => {
            //리다이렉션 시키기
            redirectToOpenbanking();
          }}>
          <Text style={styles.addButtonText}>새 계좌 등록하기</Text>
        </Pressable>
      </View>
      {bankInfo.map((item: any) => {
        return (
          <AccountSettingCard
            key={item.fintech_use_num}
            item={item}
            setSelectedFinNum={setSelectedFinNum}
            openDeleteModal={openDeleteModal}
          />
        );
      })}
      <Modal
        isVisible={isDeleteModalVisible}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        style={styles.modalContainer}>
        <View style={styles.modalContainerForDelete}>
          <View style={styles.modalInnerContainer}>
            <Text style={styles.modalComment}>계좌를 삭제하시겠습니까?</Text>
            <View style={styles.modalButtonArea}>
              <Pressable style={styles.modalButton} onPress={closeDeleteModal}>
                <Text style={styles.modalButtonText}>아니오</Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  deleteAccount();
                  closeDeleteModal();
                  getAccountInfo();
                }}>
                <Text style={styles.modalButtonText}>예</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: Dimensions.get('window').width * 0.9,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21B8CD',
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    alignItems: 'center',
  },
  modalContainerForDelete: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    width: 325,
    height: 175,
  },
  modalInnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  modalComment: {
    fontFamily: 'Roboto',
    fontSize: 15,
    color: 'black',
  },
  modalButtonArea: {
    marginTop: 20,
    flexDirection: 'row',
  },
  modalButton: {
    width: 80,
    height: 40,
    backgroundColor: '#21B8CD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 15,
  },
});
export default RegisterAccountPage;
