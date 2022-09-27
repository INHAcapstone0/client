/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useRef} from 'react';
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

  const signOut = async () => {
    console.log('accessToken:', accessToken);
    try {
      const result = await axios.post('http://146.56.188.32:8002/auth/logout', {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('/auth/logout', result);
      EncryptedStorage.removeItem('refreshToken');
      dispatch(userActions.signout());
    } catch (err: any) {
      // console.log(111);
      console.log('logout error:', err.response.data.msg);
    }
  };

  const moveToCameraPage = () => {
    navigation.navigate('CameraPage');
  };

  return (
    <View style={styles.settingContainer}>
      <Pressable onPress={signOut}>
        <Text>로그아웃</Text>
      </Pressable>
      <Pressable onPress={moveToCameraPage}>
        <Text>카메라</Text>
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
