/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useRef, useState} from 'react';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

function SignUpPage({navigation}: any) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const passwordConfirmRef = useRef<TextInput | null>(null);

  const emailDuplicateCheck = useCallback(() => {
    console.log(1);
    if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      )
    ) {
      return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
    }
  }, [email]);
  const nameDuplicateCheck = useCallback(() => {
    console.log(1);
  }, []);
  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangeName = useCallback((text: string) => {
    setName(text.trim());
  }, []);
  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);
  const onChangePasswordConfirm = useCallback((text: string) => {
    setPasswordConfirm(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    // loading중인데 한번 더누를경우
    // if (loading) {
    //   return;
    // }
    // if (!email || !email.trim()) {
    //   return Alert.alert('알림', '이메일을 입력해주세요.');
    // }
    // if (!name || !name.trim()) {
    //   return Alert.alert('알림', '이름을 입력해주세요.');
    // }
    // if (!password || !password.trim()) {
    //   return Alert.alert('알림', '비밀번호를 입력해주세요.');
    // }
    // if (
    //   !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
    //     email,
    //   )
    // ) {
    //   return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
    // }
    // if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
    //   return Alert.alert(
    //     '알림',
    //     '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
    //   );
    // }
    // console.log(email, name, password);
    // try {
    //   setLoading(true);
    //   console.log(Config.API_URL);
    //   console.log(123);
    //   const response = await axios.post(`${Config.API_URL}/user`, {
    //     email,
    //     name,
    //     password,
    //   });
    //   console.log(response.data);
    //   Alert.alert('알림', '회원가입 되었습니다.');
    //   navigation.navigate('SignIn');
    // } catch (error) {
    //   const errorResponse = (error as AxiosError).response;
    //   if (errorResponse) {
    //     // Alert.alert('알림', errorResponse.data.message);
    //   }
    // } finally {
    //   setLoading(false);
    // }
    // Alert.alert('알림', '회원가입 되었습니다.');
  }, []);

  const canGoNext = email && name && password;

  return (
    <KeyboardAwareScrollView>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <View style={styles.emailWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="이메일"
            placeholderTextColor="#666"
            onChangeText={onChangeEmail}
            value={email}
            textContentType="name"
            returnKeyType="next"
            clearButtonMode="while-editing"
            ref={nameRef}
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
          />
          <Pressable
            style={
              canGoNext
                ? StyleSheet.compose(
                    styles.duplicateButton,
                    styles.duplicateButtonActive,
                  )
                : styles.duplicateButton
            }
            disabled={!canGoNext || loading}
            onPress={emailDuplicateCheck}>
            {loading ? (
              <ActivityIndicator color="white" /> //로딩창
            ) : (
              <Text style={styles.duplicateButtonText}>중복확인</Text>
            )}
          </Pressable>
        </View>
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>닉네임</Text>
        <View style={styles.emailWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="닉네임"
            placeholderTextColor="#666"
            onChangeText={onChangeName}
            value={name}
            textContentType="name"
            returnKeyType="next"
            clearButtonMode="while-editing"
            ref={nameRef}
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
          />
          <Pressable
            style={
              canGoNext
                ? StyleSheet.compose(
                    styles.duplicateButton,
                    styles.duplicateButtonActive,
                  )
                : styles.duplicateButton
            }
            disabled={!canGoNext || loading}
            onPress={nameDuplicateCheck}>
            {loading ? (
              <ActivityIndicator color="white" /> //로딩창
            ) : (
              <Text style={styles.duplicateButtonText}>중복확인</Text>
            )}
          </Pressable>
        </View>
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.passwordTextInput}
          placeholder="비밀번호(영문,숫자,특수문자 포함하여 8자 이상)"
          placeholderTextColor="#666"
          onChangeText={onChangePassword}
          value={password}
          keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
          textContentType="password"
          secureTextEntry
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={passwordRef}
          onSubmitEditing={() => passwordConfirmRef.current?.focus()}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          style={styles.passwordTextInput}
          placeholder="비밀번호 확인(영문,숫자,특수문자 포함하여 8자 이상)"
          placeholderTextColor="#666"
          onChangeText={onChangePasswordConfirm}
          value={passwordConfirm}
          keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
          textContentType="password"
          secureTextEntry
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={passwordConfirmRef}
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={
            canGoNext
              ? StyleSheet.compose(
                  styles.registerButton,
                  styles.registerButtonActive,
                )
              : styles.registerButton
          }
          disabled={!canGoNext || loading}
          onPress={onSubmit}>
          {loading ? (
            <ActivityIndicator color="white" /> //로딩창
          ) : (
            <Text style={styles.registerButtonText}>회원가입</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    width: '80%',
    padding: 5,
    borderWidth: 0.7,
    marginRight: 7,
    borderColor: '#4D483D',
  },
  passwordTextInput: {
    width: '100%',
    padding: 5,
    borderWidth: 0.7,
    borderColor: '#4D483D',
  },
  inputWrapper: {
    padding: 20,
  },
  emailWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonZone: {
    alignItems: 'center',
  },
  duplicateButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  duplicateButtonActive: {
    backgroundColor: '#4D483D',
  },
  duplicateButtonText: {
    color: 'white',
    fontSize: 12,
  },
  registerButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  registerButtonActive: {
    backgroundColor: '#4D483D',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignUpPage;
