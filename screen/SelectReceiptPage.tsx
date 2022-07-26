/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, {AxiosError} from 'axios';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Dimensions,
  Image,
  PermissionsAndroid,
  Button,
  TouchableOpacity,
} from 'react-native';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
  IConfigDialog,
  IConfigToast,
} from 'react-native-alert-notification';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import EncryptedStorage from 'react-native-encrypted-storage';
import axiosInstance from '../utils/interceptor';

const imagePickerOption: any = {
  mediaType: 'photo',
  maxWidth: 768,
  maxHeight: 768,
  includeBase64: Platform.OS === 'android',
};

interface userType {
  uri: string;
}

function SelectReceiptPage({navigation, route}: any) {
  const [selectImg, setSelectImg] = useState({uri: ''});
  const [showSpinner, setShowSpinner] = useState(false);

  const moveToNextStep = () => {
    navigation.navigate('ReceiptUploadPage', {
      scheduleId: route.params.scheduleId,
    });
  };

  const moveToyMyAccountPage = () => {
    navigation.navigate('MyAccountPage', {
      scheduleId: route.params.scheduleId,
      dateStart: route.params.dateStart,
      dateEnd: route.params.dateEnd,
    });
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        onLaunchCamera();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const sendCameraScreenShot = async (screenShot: any) => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      console.log(1);
      const data = new FormData();

      const photo = new FormData();
      console.log(`Bearer ${accessToken}`);
      console.log('uri', screenShot.uri);
      console.log('name', screenShot.fileName);
      console.log('type', screenShot.type);

      // data.append('file', screenShot.uri);

      data.append('file', {
        uri: screenShot.uri,
        name: screenShot.fileName,
        type: screenShot.type,
      });

      photo.append('receipt-img', {
        uri: screenShot.uri,
        name: screenShot.fileName,
        type: screenShot.type,
      });

      console.log('data', data);

      setShowSpinner(true);
      const response = await axiosInstance.post(
        'http://146.56.190.78/receipts/parse',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('response.data.data', response.data.data);
      setShowSpinner(false);
      navigation.navigate('ReceiptResultPage', {
        data: response.data.data,
        scheduleId: route.params.scheduleId,
        screenShot: photo,
      });
      // navigation.reset({
      //   routes: [
      //     {
      //       name: 'ReceiptResultPage',
      //       params: {
      //         data: response.data.data,
      //         scheduleId: route.params.scheduleId,
      //         screenShot: photo,
      //       },
      //     },
      //   ],
      // });
    } catch (err: any) {
      setShowSpinner(false);
      Toast.show({
        type: ALERT_TYPE.WARNING,
        textBody: err.response.data.msg,
      });
      // setTimeout(() => {
      //   Toast.show({
      //     type: ALERT_TYPE.WARNING,
      //     textBody: err.response.data.msg,
      //   });
      // }, 1000);
      console.log('err', err.response.data.msg);
    }
  };

  const onLaunchCamera = () => {
    const options: any = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };

    launchCamera(options, (response: any) => {
      if (response.didCancle) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error', response.error);
      } else {
        console.log(1);
        if (response !== undefined) {
          console.log('response', response.didCancel);
          if (!response?.didCancel) {
            sendCameraScreenShot(response?.assets[0]);
          }
        }
      }
    });
  };

  const onLaunchImageLibrary = () => {
    const options: any = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };

    launchImageLibrary(options, (response: any) => {
      if (response.didCancle) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error', response.error);
      } else {
        if (response !== undefined) {
          if (!response?.didCancel) {
            sendCameraScreenShot(response?.assets[0]);
          }
        }
      }
    });
  };

  if (showSpinner) {
    return (
      <View style={styles.loading}>
        <Text>영수증에서 정보를 가져오는 중 입니다.</Text>
        <Text>잠시만 기다려주세요.</Text>
        <ActivityIndicator size="large" color="#21B8CD" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.receiptPage}>
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
        <View style={styles.header}>
          <Text style={styles.scheduleName}>영수증 등록</Text>
        </View>
        <Text style={styles.text}>영수증을 등록할 수단을 선택해주세요</Text>
        <View style={styles.imageContainer}>
          <Pressable
            style={styles.imageWrapper}
            onPress={requestCameraPermission}>
            <Image
              source={require('../resources/icons/camera.png')}
              style={styles.imageIcon}
            />
          </Pressable>
          <Pressable style={styles.imageWrapper} onPress={onLaunchImageLibrary}>
            <Image
              source={require('../resources/icons/gallery.png')}
              style={styles.imageIcon}
            />
          </Pressable>
        </View>
        <View style={styles.borderLine} />
        {/* <Text style={styles.manualFirstText}>
        영수증이 없다면 [다음]을 누르신 후
      </Text>
      <Text style={styles.manualSecondText}>지출 정보를 직접 입력하세요</Text> */}
        {/* <Image source={selectImg} style={{height: 300, width: 1000}} /> */}
        <TouchableOpacity activeOpacity={0.8} style={styles.nextButton}>
          <Button
            color="#21B8CD"
            title="계좌에서 가져오기"
            onPress={moveToyMyAccountPage}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.nextButton}>
          <Button
            color="#21B8CD"
            title="영수증 수동입력"
            onPress={moveToNextStep}
          />
        </TouchableOpacity>
      </AlertNotificationRoot>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21B8CD',
    height: 60,
  },
  scheduleName: {
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  receiptPage: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
  },
  loading: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text: {
    padding: 60,
    textAlign: 'center',
    fontSize: 17,
    color: 'black',
    fontWeight: '700',
  },
  manualFirstText: {
    paddingTop: 70,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    fontWeight: '700',
  },
  manualSecondText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    fontWeight: '700',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    // width: 100,
    // height: 100,
  },
  nextButton: {
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    margin: 20,
    marginTop: 20,
  },
  borderLine: {
    height: 1,
    backgroundColor: '#21B8CD',
    marginTop: 100,
    marginBottom: 20,
    width: Dimensions.get('window').width * 0.9,
    marginLeft: 17,
    marginRight: 17,
  },
});
export default SelectReceiptPage;
