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
} from 'react-native';
// import ImagePicker from 'react-native-image-picker';
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

function SelectReceiptPage({navigation}: any) {
  const [selectImg, setSelectImg] = useState({uri: 'aa'});
  const accessToken = useSelector(
    (state: any) => state.persist.user.accessToken,
  );

  const moveToNextStep = () => {
    navigation.navigate('ReceiptUploadPage');
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

  const onLaunchCamera = () => {
    const options: any = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };

    launchCamera(options, (response: any) => {
      console.log(response.assets[0]);
      console.log('Response =', response.assets[0].fileName);
      console.log('Response =', response.assets[0].fileSize);
      console.log('Response =', response.assets[0].fileHeight);
      console.log('Response =', response.assets[0].uri);
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

        sendCameraScreenShot(response.assets[0].uri);
      }
    });
  };

  const sendCameraScreenShot = async (screenShot: string) => {
    try {
      console.log(1);
      const data = new FormData();

      data.append('file', {
        uri: screenShot,
        name: 'upload.jpg',
        type: 'image/jpg',
      });

      const response = await axios.post(
        'http://146.56.188.32:8002/receipts/test',
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'content-type': `multipart/form-data`,
          },
        },
      );
      console.log('response', response.data);
    } catch (err: any) {
      console.log(2);
      console.log('err', err);
    }
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
      const source = {uri: 'data:image/jpeg;base64' + response.base64};
      console.log(source);
    });
  };
  return (
    <View style={styles.receiptPage}>
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
      <View style={styles.nextButton}>
        <Button color="#21B8CD" title="다음" onPress={moveToNextStep} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  receiptPage: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
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
