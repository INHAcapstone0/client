/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {REACT_APP_API_URL} from '@env';
import {useAppDispatch} from '../store/Store';
import {userActions} from '../slices/User';
import {
  requestUserPermission,
  notificationListner,
} from '../utils/push_notification_helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

function FindPassWordPage({navigation}: any) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);

  const sendTempPassword = async () => {
    try {
      const response = await axios.post(
        `http://146.56.190.78/auth/mail/password`,
        {
          email: email,
        },
      );
      Alert.alert('알림', '이메일로 임시 비밀번호가 발송되었습니다.');
      setEmailChecked(true);
    } catch (err: any) {
      console.log(err);
      Alert.alert('알림', err?.response?.data?.msg);
    }
  };

  const onSubmit = async () => {
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      console.log(email);
      console.log(password);
      const response = await axios.post('http://146.56.190.78/auth/login', {
        email: email,
        password: password,
      });

      console.log(response);

      EncryptedStorage.setItem('accessToken', response.data.data.accessToken);
      EncryptedStorage.setItem('refreshToken', response.data.data.refreshToken);
      // requestUserPermission();
      // notificationListner();

      AsyncStorage.setItem('PushNotification', 'true');
      AsyncStorage.setItem('SoundNotification', 'true');
      AsyncStorage.setItem('VibrationNotification', 'true');
      AsyncStorage.setItem('alarm', '1');

      dispatch(
        userActions.setUser({
          name: response.data.user,
          id: response.data.user_id,
          accessToken: response.data.data.accessToken,
        }),
      );

      navigation.navigate('ResetPasswordPage');
    } catch (error: AxiosError | any) {
      console.log('login error', error);
      Alert.alert('알림', error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  const toSignUpPage = useCallback(() => {
    navigation.navigate('SignUpPage');
  }, [navigation]);

  const canGoNext = email && password;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../resources/icons/LoginImage.png')}
        style={styles.logo}
      />
      {/* <Text style={styles.text}>로그인</Text> */}
      <FormInput
        labelValue={email}
        onChangeText={onChangeEmail}
        placeholderText="이메일"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={() => passwordRef.current?.focus()}
        inputType="login"
      />
      {emailChecked ? (
        <FormInput
          labelValue={password}
          onChangeText={onChangePassword}
          placeholderText="비밀번호"
          iconType="lock"
          secureTextEntry={true}
          inputType="login"
        />
      ) : null}
      {emailChecked ? (
        <FormButton buttonTitle="로그인" onPress={onSubmit} />
      ) : (
        <FormButton
          buttonTitle="임시 비밀번호 발송"
          onPress={sendTempPassword}
        />
      )}
      <TouchableOpacity onPress={toSignUpPage}>
        <Text style={styles.navButtonText}>회원가입 하러가기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // paddingTop: 50,
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
    marginBottom: 30,
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#21B8CD',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    // marginTop: 40,
    // marginBottom: 10,
    marginVertical: 35,
  },
  navButtonText: {
    marginTop: 20,
    fontSize: 15,
    fontWeight: '500',
    color: '#3E382F',
    fontFamily: 'Lato-Regular',
  },
});

export default FindPassWordPage;
