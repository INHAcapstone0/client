/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {userActions} from '../slices/User';
import {useAppDispatch} from '../store/Store';

function SettingPage({navigation}: any) {
  const dispatch = useAppDispatch();

  const signOut = () => {
    EncryptedStorage.removeItem('refreshToken');
    dispatch(userActions.signout());
  };

  return (
    <View style={styles.inputWrapper}>
      <Pressable onPress={signOut}>
        <Text>로그아웃</Text>
      </Pressable>
    </View>
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
export default SettingPage;
