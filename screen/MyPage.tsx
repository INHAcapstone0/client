/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import {RootState} from '../store/Store';
import {useSelector} from 'react-redux';
import {
  AlertNotificationRoot,
  ALERT_TYPE,
  Toast,
} from 'react-native-alert-notification';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Modal from 'react-native-modal';

import EncryptedStorage from 'react-native-encrypted-storage';
import axiosInstance from '../utils/interceptor';
function MyPage({navigation}: any) {
  const userId = useSelector((state: RootState) => state.persist.user.id);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [myInfo, setMyInfo] = useState<{
    email: string;
    name: string;
    img_url: string;
  }>({
    email: '',
    name: '',
    img_url: '',
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validPassword, myInfo]);

  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

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
        setValidPassword(true);
        getMyInfo();
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

  const getMyInfo = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axiosInstance.get(
        `http://146.56.190.78/users/${userId}`,
        {headers},
      );
      setMyInfo(response.data);
    } catch (err: AxiosError | any) {
      console.log(err);
    }
  };

  const getGranted = async () => {
    const grantedStorage = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (grantedStorage === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('permission given');
      selectImage();
    }
  };

  const selectImage = async () => {
    try {
      var result: any = await launchImageLibrary(
        {
          mediaType: 'photo',
        },
        response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorCode);
          } else if (response.errorMessage) {
            console.log('ImagePicker ErrorMessage: ', response.errorMessage);
          } else if (response.assets) {
            //정상적으로 사진을 반환 받았을 때
            console.log('ImagePicker res', response);
            const img = {
              uri: response.assets[0].uri,
              type: response.assets[0].type,
              name: response.assets[0].fileName,
            };
            uploadImage(img);
          } else {
            console.log('ImagePicker Error');
          }
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  const uploadImage = async (image: {}) => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'multipart/form-data',
      };
      var body = new FormData();
      body.append('user-profile', image);

      await axiosInstance.patch('http://146.56.190.78/users/img/upload', body, {
        headers: headers,
      });
      getMyInfo();
    } catch (err: AxiosError | any) {
      console.log('uploadImage');
      console.log(err.response);
    }
  };

  const changePassword = async () => {
    if (
      !/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(newPassword)
    ) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody:
          '비밀번호는 최소 8자 문자, 숫자, 특수문자를 사용할 수 있습니다.',
      });
      return;
    } else {
      if (newPassword !== newPasswordCheck) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          textBody: '새 비밀번호 확인이 일치하지 않습니다',
        });
      } else {
        try {
          const accessToken = await EncryptedStorage.getItem('accessToken');
          const headers = {
            Authorization: `Bearer ${accessToken}`,
          };
          const body = {
            password: newPassword,
          };
          const response = await axiosInstance.patch(
            `http://146.56.190.78/users/${userId}`,
            body,
            {headers},
          );
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            textBody: '비밀번호가 변경되었습니다.',
          });
          setNewPassword('');
          setNewPasswordCheck('');
        } catch (err: AxiosError | any) {
          console.log(err.response);
        }
      }
    }
  };

  const initializeProfile = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');

      console.log('accessToken', accessToken);
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axiosInstance.patch(
        'http://146.56.190.78/users/img/empty',
        {headers},
      );
      console.log('res', response);
      getMyInfo();
    } catch (err: AxiosError | any) {
      console.log('initialize profile');
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
        <>
          {!validPassword && (
            <>
              <View style={styles.myPageHeader}>
                <Text style={styles.myPageHeaderTitle}>개인정보 설정</Text>
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
            </>
          )}
        </>
        <>
          {validPassword && (
            <>
              <View style={styles.myPageHeader}>
                <Text style={styles.myPageHeaderTitle}>개인정보 설정</Text>
              </View>
              <View style={styles.profileSection}>
                <View style={styles.profileInfoSection}>
                  <View style={styles.profileImageSection}>
                    <Image
                      style={styles.userImage}
                      source={
                        myInfo.img_url === ''
                          ? require('../resources/icons/noReceiptImage.png')
                          : {uri: myInfo.img_url}
                      }
                    />
                  </View>
                  <View style={styles.profileTextInfo}>
                    <View>
                      <Text style={styles.profileInfoName}>{myInfo.name}</Text>
                    </View>
                    <View style={styles.profileInfoIdSection}>
                      <Text style={styles.profileInfoId}>
                        계정{'  '}
                        {myInfo.email}
                      </Text>
                    </View>
                  </View>
                </View>
                <Modal
                  isVisible={isProfileModalVisible}
                  animationIn={'slideInUp'}
                  animationOut={'slideOutDown'}
                  onBackButtonPress={() => setIsProfileModalVisible(false)}>
                  <View style={{backgroundColor: 'white', height: 150}}>
                    <View
                      style={{
                        margin: 20,
                        flex: 1,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          color: 'black',
                        }}>
                        프로필 사진
                      </Text>
                      <Pressable
                        onPress={() => {
                          setIsProfileModalVisible(false);
                          getGranted();
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            color: 'black',
                          }}>
                          앨범에서 사진 선택
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          //getGranted();
                          initializeProfile();
                          setIsProfileModalVisible(false);
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            color: 'black',
                          }}>
                          기본 이미지로 변경
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
                <View style={styles.changeProfileImageSection}>
                  <Pressable
                    onPress={() => {
                      setIsProfileModalVisible(true);
                    }}>
                    <View style={styles.changeProfileImageButton}>
                      <Text style={styles.changeProfileImageButtonText}>
                        변경
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
              <View style={styles.borderLine} />
              <View>
                <Text style={styles.changePasswordTitle}>
                  비밀번호 변경하기
                </Text>
                <View style={styles.passwordInput}>
                  <TextInput
                    onChangeText={text => {
                      setNewPassword(text);
                    }}
                    placeholder="새 비밀번호"
                    value={newPassword}
                    secureTextEntry={true}
                  />
                </View>
                <View style={styles.passwordInput}>
                  <TextInput
                    onChangeText={text => {
                      setNewPasswordCheck(text);
                    }}
                    placeholder="새 비밀번호 확인"
                    value={newPasswordCheck}
                    secureTextEntry={true}
                  />
                </View>
                <Text style={styles.changePasswordComment}>
                  최소 8자 문자, 숫자, 특수문자를 조합해주세요.
                </Text>
                <View style={styles.changePasswordButtonSection}>
                  <Pressable
                    onPress={() => {
                      changePassword();
                    }}>
                    <View style={styles.changePasswordButton}>
                      <Text style={styles.changePasswordButtonText}>변경</Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </>
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
  },
  borderLine: {
    height: 1,
    backgroundColor: '#21B8CD',
    width: Dimensions.get('window').width * 0.9,
  },
  myPageHeader: {
    height: 50,
    alignItems: 'center',
  },
  myPageHeaderTitle: {color: 'black', fontSize: 16, fontFamily: 'Roboto'},
  profileSection: {
    marginBottom: 30,
  },
  profileInfoSection: {flexDirection: 'row'},
  profileImageSection: {
    margin: 10,
  },
  profileTextInfo: {justifyContent: 'center'},
  profileInfoName: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  profileInfoIdSection: {
    flexDirection: 'row',
    marginTop: 10,
  },
  profileInfoId: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  changeProfileImageSection: {
    marginLeft: 30,
  },
  passwordInput: {
    width: Dimensions.get('window').width * 0.85,
    borderColor: '#21B8CD',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    overflow: 'hidden',
  },
  changePasswordButtonSection: {
    flexDirection: 'row-reverse',
    width: Dimensions.get('window').width * 0.85,
  },
  changePasswordTitle: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Roboto',
    marginTop: 20,
  },
  changePasswordComment: {
    color: '#7E7E7E',
    fontSize: 12,
    fontFamily: 'Roboto',
    marginTop: 5,
  },
  changePasswordButton: {
    width: 60,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#21B8CD',
    borderRadius: 20,
    marginTop: 10,
  },
  changePasswordButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  changeProfileImageButton: {
    width: 40,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#21B8CD',
    borderRadius: 20,
  },
  changeProfileImageButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  commentSection: {
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.1,
  },
  comment: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Roboto',
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
export default MyPage;
