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
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

function SignInPage({navigation}: any) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
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
  const onSubmit = async () => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      setLoading(true);
      const response = await axios.post(
        'http://146.56.188.32:8002/auth/login',
        {
          email: email,
          password: password,
        },
      );
      EncryptedStorage.setItem('accessToken', response.data.data.accessToken);
      EncryptedStorage.setItem('refreshToken', response.data.data.refreshToken);
      requestUserPermission();
      notificationListner();
      dispatch(
        userActions.setUser({
          name: response.data.user,
          id: response.data.user_id,
          accessToken: response.data.data.accessToken,
        }),
      );
      console.log(response.data.data);
      navigation.navigate('InitialPage');
    } catch (error: AxiosError | any) {
      Alert.alert(error.response.data.msg);
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
      <Text style={styles.text}>로그인</Text>
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
      <FormInput
        labelValue={password}
        onChangeText={onChangePassword}
        placeholderText="비밀번호"
        iconType="lock"
        secureTextEntry={true}
        inputType="login"
      />

      <FormButton buttonTitle="로그인" onPress={onSubmit} />

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => console.log(1)}>
        <Text style={styles.navButtonText}>비밀번호를 잊으셨나요?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotButton} onPress={toSignUpPage}>
        <Text style={styles.navButtonText}>회원가입하로가기</Text>
      </TouchableOpacity>
    </ScrollView>
    // <ScrollView>
    //   <View style={styles.inputWrapper}>
    //     <Text style={styles.label}>이메일</Text>
    //     <TextInput
    //       style={styles.textInput}
    //       onChangeText={onChangeEmail}
    //       placeholder="이메일을 입력해주세요"
    //       placeholderTextColor="#666"
    //       importantForAutofill="yes"
    //       autoComplete="email"
    //       textContentType="emailAddress"
    //       value={email}
    //       returnKeyType="next"
    //       clearButtonMode="while-editing"
    //       ref={emailRef}
    //       onSubmitEditing={() => passwordRef.current?.focus()}
    //       blurOnSubmit={false}
    //     />
    //   </View>
    //   <View style={styles.inputWrapper}>
    //     <Text style={styles.label}>비밀번호</Text>
    //     <TextInput
    //       style={styles.textInput}
    //       placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)"
    //       placeholderTextColor="#666"
    //       importantForAutofill="yes"
    //       onChangeText={onChangePassword}
    //       value={password}
    //       autoComplete="password"
    //       textContentType="password"
    //       secureTextEntry
    //       returnKeyType="send"
    //       clearButtonMode="while-editing"
    //       ref={passwordRef}
    //       onSubmitEditing={onSubmit}
    //     />
    //   </View>
    //   <View style={styles.buttonZone}>
    //     <Pressable
    //       style={
    //         canGoNext
    //           ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
    //           : styles.loginButton
    //       }
    //       disabled={!canGoNext || loading}
    //       onPress={onSubmit}>
    //       {loading ? (
    //         <ActivityIndicator color="white" />
    //       ) : (
    //         <Text style={styles.loginButtonText}>로그인</Text>
    //       )}
    //     </Pressable>
    //     <Pressable onPress={toSignUpPage}>
    //       <Text>회원가입하기</Text>
    //     </Pressable>
    //   </View>
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  // textInput: {
  //   padding: 5,
  //   borderWidth: 0.7,
  //   marginRight: 7,
  //   borderColor: '#4D483D',
  // },
  // inputWrapper: {
  //   padding: 20,
  // },
  // label: {
  //   fontWeight: 'bold',
  //   fontSize: 16,
  //   marginBottom: 20,
  // },
  // buttonZone: {
  //   alignItems: 'center',
  // },
  // loginButton: {
  //   backgroundColor: 'gray',
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  //   borderRadius: 5,
  //   marginBottom: 10,
  // },
  // loginButtonActive: {
  //   backgroundColor: '#4D483D',
  // },
  // loginButtonText: {
  //   color: 'white',
  //   fontSize: 16,
  // },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#3E382F',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3E382F',
    fontFamily: 'Lato-Regular',
  },
});

export default SignInPage;
