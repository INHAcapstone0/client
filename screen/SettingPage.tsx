/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View, Dimensions} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {userActions} from '../slices/User';
import {useAppDispatch} from '../store/Store';
import axios from 'axios';
import {RootState} from '../store/Store';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal/dist/modal';

function SettingPage({navigation}: any) {
  const dispatch = useAppDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const id = useSelector((state: RootState) => state.persist.user.id);

  useEffect(() => {
    console.log('id', id);
    asd();
  }, [id]);

  const asd = async () => {
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log(fcmToken);
  };

  const pressNotificationSetting = () => {
    navigation.navigate('NotificationSettingPage');
  };
  const pressMyPage = () => {
    navigation.navigate('PreMyPage');
  };
  const [modalVisible, setModalVisible] = useState(false);
  const signOut = async () => {
    console.log('accessToken:', accessToken);
    try {
      const result = await axios.post(
        'http://146.56.190.78/auth/logout',
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('/auth/logout', result);
      EncryptedStorage.removeItem('refreshToken');
      EncryptedStorage.removeItem('accessToken');
      AsyncStorage.removeItem('fcmToken');
      dispatch(userActions.signout());
    } catch (err: any) {
      console.log('logout error:', err.response.data.msg);
    }
  };

  return (
    <View style={styles.settingContainer}>
      <View style={styles.settingHeader}>
        <Text style={styles.settingHeaderTitle}>설정</Text>
      </View>
      <View style={styles.titleSection}>
        <Pressable
          onPress={() => {
            pressMyPage();
          }}>
          <Text style={styles.titleText}>개인정보 설정</Text>
        </Pressable>
      </View>
      <View style={styles.borderLine} />
      <View style={styles.titleSection}>
        <Pressable
          onPress={() => {
            pressNotificationSetting();
          }}>
          <Text style={styles.titleText}>알림 설정</Text>
        </Pressable>
      </View>
      <View style={styles.borderLine} />
      <View style={styles.titleSection}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Text style={styles.titleText}>로그아웃</Text>
        </Pressable>
      </View>
      <Modal
        isVisible={modalVisible}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        style={styles.modalContainer}>
        <View style={styles.signoutModalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalComment}>로그아웃 하시겠습니까?</Text>
            <View style={styles.modalButtonArea}>
              <Pressable
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>아니오</Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  signOut();
                }}>
                <Text style={styles.modalButtonText}>예</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  settingContainer: {
    padding: 20,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
  },
  settingHeader: {
    height: 50,
    alignItems: 'center',
  },
  settingHeaderTitle: {color: 'black', fontSize: 16, fontFamily: 'Roboto'},
  borderLine: {
    height: 1,
    backgroundColor: '#21B8CD',
    width: Dimensions.get('window').width * 0.9,
  },
  titleSection: {height: 50, justifyContent: 'center'},
  titleText: {
    color: 'black',
    fontSize: 15,
  },
  signoutModalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    width: 325,
    height: 150,
  },
  modalContainer: {
    alignItems: 'center',
  },
  modalContent: {
    alignItems: 'center',
  },
  modalComment: {
    fontFamily: 'Roboto',
    fontSize: 15,
    color: 'black',
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
  modalButtonArea: {
    marginTop: 20,
    flexDirection: 'row',
  },
});
export default SettingPage;
