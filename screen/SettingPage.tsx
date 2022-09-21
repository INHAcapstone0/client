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
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import {userActions} from '../slices/User';
import {useAppDispatch} from '../store/Store';

function SettingPage({navigation}: any) {
  const dispatch = useAppDispatch();

  const signOut = () => {
    EncryptedStorage.removeItem('refreshToken');
    dispatch(userActions.signout());
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
  },
});
export default SettingPage;
