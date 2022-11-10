/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, useRef} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import {RootState} from '../store/Store';
import {useSelector} from 'react-redux';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
  IConfigDialog,
  IConfigToast,
} from 'react-native-alert-notification';
import EncryptedStorage from 'react-native-encrypted-storage';
import axiosInstance from '../utils/interceptor';

type IProps = {
  dialogConfig?: Pick<IConfigDialog, 'closeOnOverlayTap' | 'autoClose'>;
  toastConfig?: Pick<
    IConfigToast,
    'autoClose' | 'titleStyle' | 'textBodyStyle'
  >;
  theme?: 'light' | 'dark';
  colors?: [IColors, IColors] /** ['light_colors' , 'dark_colors'] */;
};
type IColors = {
  label: string;
  card: string;
  overlay: string;
  success: string;
  danger: string;
  warning: string;
};
function PreMyPage({navigation}: any) {
  const [password, setPassword] = useState('');

  const checkPassword = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const body = {
        password: password,
      };
      const response = await axiosInstance.post(
        'http://146.56.190.78/users/password/check',
        body,
        {headers},
      );
      if (response.data.isMatch) {
        navigation.navigate('MyPage');
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          textBody: '비밀번호가 일치하지 않습니다',
          autoClose: 800,
        });
      }
    } catch (err: AxiosError | any) {
      console.log(err);
    }
  };

  return (
    <View style={styles.windowContainer}>
      <AlertNotificationRoot
        colors={[
          {
            label: '',
            card: '#e5e8e8',
            overlay: '',
            success: '',
            danger: '',
            warning: '',
          },
          {
            label: 'gray',
            card: 'gray',
            overlay: 'gray',
            success: 'gray',
            danger: 'gray',
            warning: 'gray',
          },
        ]}>
        <View style={styles.preMyPageHeader}>
          <Text style={styles.preMyPageHeaderTitle}>개인정보 설정</Text>
        </View>
        <View style={styles.commentSection}>
          <Text style={styles.comment}>본인 확인을 위해</Text>
          <Text style={styles.comment}>비밀번호를 입력해주세요</Text>
          <View style={styles.passwordInput}>
            <TextInput
              onChangeText={text => {
                setPassword(text);
              }}
              placeholder="비밀번호"
              value={password}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.checkButtonSection}>
            <Pressable
              onPress={() => {
                checkPassword();
              }}>
              <View style={styles.checkButton}>
                <Text style={styles.checkButtonText}>확인</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </AlertNotificationRoot>
    </View>
  );
}

const styles = StyleSheet.create({
  windowContainer: {
    padding: 20,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  preMyPageHeader: {
    height: 50,
    alignItems: 'center',
  },
  preMyPageHeaderTitle: {color: 'black', fontSize: 16, fontFamily: 'Roboto'},
  commentSection: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.1,
  },
  comment: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Roboto',
  },
  passwordInput: {
    width: Dimensions.get('window').width * 0.8,
    borderColor: '#21B8CD',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
  },
  checkButtonSection: {
    flexDirection: 'row-reverse',
    width: Dimensions.get('window').width * 0.8,
  },
  checkButton: {
    width: 60,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#21B8CD',
    borderRadius: 20,
    marginTop: 10,
  },
  checkButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
});
export default PreMyPage;
