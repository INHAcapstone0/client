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
  const accessToken = useSelector(
    (state: any) => state.persist.user.accessToken,
  );

  const moveToNextStep = () => {
    navigation.navigate('ReceiptUploadPage', {
      scheduleId: route.params.scheduleId,
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
      console.log(1);
      const data = new FormData();
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

      console.log('data', data);

      setShowSpinner(true);
      const response = await axios.post(
        'http://146.56.190.78:8002/receipts/test',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('response.data.data', response.data.data);
      navigation.navigate('ReceiptResultPage', {
        data: response.data.data,
        scheduleId: route.parms.scheduleId,
      });
      // navigation.reset({
      //   routes: [
      //     {
      //       name: 'ReceiptResultPage',
      //       params: {data: response.data.data},
      //     },
      //   ],
      // });
      setShowSpinner(false);
    } catch (err: any) {
      setShowSpinner(false);
      setTimeout(() => {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          textBody: '영수증 이미지를 업로드해주세요',
        });
      }, 1000);
      console.log('err', err);
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
      // console.log(response);
      // console.log(response.assets[0]);
      // console.log('Response =', response.assets[0].fileName);
      // console.log('Response =', response.assets[0].fileSize);
      // console.log('Response =', response.assets[0].fileHeight);
      // console.log('Response =', response.assets[0].uri);
      if (response.didCancle) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error', response.error);
      } else {
        // const source = {
        //   uri: 'data:image/jpeg;base64' + response.assets[0].base64,
        // };
        // console.log(source);
        // setSelectImg({uri: response.assets[0].uri});

        sendCameraScreenShot(response.assets[0]);
        setSelectImg({uri: response.assets[0].uri});
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
      sendCameraScreenShot(response.assets[0]);
    });
  };

  if (showSpinner) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#21B8CD" />
      </View>
    );
  }
  return (
    <View style={styles.receiptPage}>
      {/* <AlertNotificationRoot
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
        ]}> */}
      <Text style={styles.text}>영수증을 등록할 수단을 선택해주세요</Text>
      <View style={styles.imageContainer}>
        <Pressable
          style={styles.imageWrapper}
          onPress={requestCameraPermission}>
          <Image
            // source={require(`${process.env.PUBLIC_URL}/assets/dog-img.png`)}
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
      <Text style={styles.manualFirstText}>
        영수증이 없다면 [다음]을 누르신 후
      </Text>
      <Text style={styles.manualSecondText}>지출 정보를 직접 입력하세요</Text>
      {/* <Image source={selectImg} style={{height: 300, width: 1000}} /> */}
      <TouchableOpacity activeOpacity={0.8} style={styles.nextButton}>
        <Button color="#21B8CD" title="다음" onPress={moveToNextStep} />
      </TouchableOpacity>
      {/* </AlertNotificationRoot> */}
    </View>
  );
}

const styles = StyleSheet.create({
  receiptPage: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
  },
  loading: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    display: 'flex',
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
    marginTop: 60,
  },
});
export default SelectReceiptPage;
