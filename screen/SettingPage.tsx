/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import {userActions} from '../slices/User';
import {useAppDispatch} from '../store/Store';
import axios from 'axios';
import {RootState} from '../store/Store';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SettingPage({navigation}: any) {
  const dispatch = useAppDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const id = useSelector((state: RootState) => state.persist.user.id);

  const signOut = async () => {
    console.log('accessToken:', accessToken);
    try {
      const result = await axios.post(
        'http://146.56.190.78:8002/auth/logout',
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
      // console.log(111);
      console.log('logout error:', err.response.data.msg);
    }
  };

  return (
    <View style={styles.settingContainer}>
      <Pressable onPress={signOut}>
        <Text>로그아웃</Text>
      </Pressable>
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
});
export default SettingPage;
