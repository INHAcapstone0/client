/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {REACT_APP_API_URL} from '@env';
import {emailCheck, nickNameCheck, signUp} from '../api/Auth';
import LoginScreen from 'react-native-login-screen';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

function SignUpPage({navigation}: any) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [name, setName] = useState('');
  const [nameChecked, setNameChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const passwordConfirmRef = useRef<TextInput | null>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const emailDuplicateCheck = useCallback(async () => {
    emailCheck(email, (response: AxiosResponse) => {
      if (response.data.duplicated === false) {
        setEmailChecked(true);
        Alert.alert('알림', '사용 가능한 이메일 입니다');
      } else {
        Alert.alert('알림', '이미 존재하는 이메일 입니다');
      }
    });
  }, [email]);
  const nameDuplicateCheck = useCallback(async () => {
    nickNameCheck(name, (response: AxiosResponse) => {
      if (response.data.duplicated === false) {
        setNameChecked(true);
        Alert.alert('알림', '사용 가능한 닉네임 입니다');
      } else {
        Alert.alert('알림', '이미 존재하는 닉네임 입니다');
      }
    });
  }, [name]);
  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
    setEmailChecked(false);
  }, []);
  const onChangeName = useCallback((text: string) => {
    setName(text.trim());
    setNameChecked(false);
  }, []);
  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);
  const onChangePasswordConfirm = useCallback((text: string) => {
    setPasswordConfirm(text.trim());
  }, []);
  const onSubmit = async () => {
    console.log('회원가입');
    if (loading) {
      return;
    }
    if (!emailChecked) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!nameChecked) {
      return Alert.alert('알림', '닉네임을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    if (password !== passwordConfirm) {
      return Alert.alert('알림', '비밀번호가 일치하지 않습니다');
    }
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      );
    }
    setLoading(true);
    signUp(email, name, password, (response: AxiosResponse) => {
      console.log(response.data);
      Alert.alert('알림', '회원가입 되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            navigation.navigate('InitialPage');
          },
        },
      ]);
    });
  };

  const toSignInPage = useCallback(() => {
    navigation.navigate('SignInPage');
  }, [navigation]);

  const canGoNext = email && name && password;

  return (
    <View style={styles.container}>
      <Image
        source={require('../resources/icons/LoginImage.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>회원가입</Text>
      <View style={styles.formWrapper}>
        <FormInput
          labelValue={email}
          onChangeText={onChangeEmail}
          placeholderText="이메일"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          inputType="register"
        />
        <Pressable
          style={
            !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
              email,
            ) === false
              ? StyleSheet.compose(
                  styles.duplicateButton,
                  styles.duplicateButtonActive,
                )
              : styles.duplicateButton
          }
          disabled={email.length === 0 || loading}
          onPress={emailDuplicateCheck}>
          <Text style={styles.duplicateButtonText}>중복확인</Text>
        </Pressable>
      </View>
      <View style={styles.formWrapper}>
        <FormInput
          labelValue={name}
          onChangeText={onChangeName}
          placeholderText="닉네임"
          iconType="user"
          keyboardType="email-address"
          secureTextEntry={true}
          inputType="register"
        />
        <Pressable
          style={
            !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
              email,
            ) === false
              ? StyleSheet.compose(
                  styles.duplicateButton,
                  styles.duplicateButtonActive,
                )
              : styles.duplicateButton
          }
          disabled={name.length === 0 || loading}
          onPress={nameDuplicateCheck}>
          <Text style={styles.duplicateButtonText}>중복확인</Text>
        </Pressable>
      </View>
      <FormInput
        labelValue={password}
        onChangeText={onChangePassword}
        placeholderText="비밀번호"
        iconType="lock"
        secureTextEntry={true}
        inputType="login"
      />
      <FormInput
        labelValue={passwordConfirm}
        onChangeText={onChangePasswordConfirm}
        placeholderText="비밀번호 확인"
        iconType="lock"
        secureTextEntry={true}
        inputType="login"
      />
      <FormButton buttonTitle="회원가입" onPress={onSubmit} />
      <TouchableOpacity style={styles.navButton} onPress={toSignInPage}>
        <Text style={styles.navButtonText}>로그인 하러가기</Text>
      </TouchableOpacity>
      {/* <Button
        title={'toast notification'}
        onPress={() =>
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: 'Congrats! this is toast notification success',
          })
        }
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  // signUpPage: {
  //   backgroundColor: '#F3EFEA',
  // },
  // textInput: {
  //   width: '80%',
  //   padding: 6,
  //   borderWidth: 0,
  //   marginRight: 7,
  //   backgroundColor: 'white',
  //   fontSize: 14,
  //   // borderColor: '#4D483D',
  // },
  // passwordTextInput: {
  //   width: '100%',
  //   padding: 5,
  //   borderWidth: 0.7,
  //   borderColor: '#4D483D',
  // },
  // inputWrapper: {
  //   padding: 20,
  // },
  formWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  // label: {
  //   fontWeight: 'bold',
  //   fontSize: 11,
  //   marginBottom: 5,
  // },
  // buttonZone: {
  //   alignItems: 'center',
  // },
  duplicateButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 10,
    // borderRadius: 5,
    height: Dimensions.get('window').height / 16,
    borderRadius: 3,
    marginBottom: 4,
    marginLeft: 10,
  },
  duplicateButtonActive: {
    backgroundColor: '#4D483D',
  },
  duplicateButtonText: {
    color: 'white',
    fontSize: 12,
  },
  // registerButton: {
  //   backgroundColor: 'gray',
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  //   borderRadius: 5,
  //   marginBottom: 10,
  // },
  // registerButtonActive: {
  //   backgroundColor: '#4D483D',
  // },
  // registerButtonText: {
  //   color: 'white',
  //   fontSize: 16,
  // },
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  navButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3E382F',
    fontFamily: 'Lato-Regular',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
});

export default SignUpPage;
