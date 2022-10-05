/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
} from 'react-native';
// import ImagePicker from 'react-native-image-picker';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

const imagePickerOption: any = {
  mediaType: 'photo',
  maxWidth: 768,
  maxHeight: 768,
  includeBase64: Platform.OS === 'android',
};

function SelectReceiptPage({navigation}: any) {
  const [selectImg, setSelectImg] = useState({});

  const moveToCameraPage = () => {
    navigation.navigate('CameraPage');
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
    console.log(1);
    const options: any = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };

    launchCamera(options, (response: any) => {
      console.log('Response =', response);
      if (response.didCancle) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error', response.error);
      } else {
        const source = {uri: 'data:image/jpeg;base64' + response.base64};
        console.log(source);
        setSelectImg(source);
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
      const source = {uri: 'data:image/jpeg;base64' + response.base64};
      console.log(source);
    });
  };
  return (
    <View style={styles.receiptPage}>
      <Text style={styles.text}>영수증을 등록해주세요</Text>
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
      <Text style={styles.manualFirstText}>
        영수증이 없다면 [다음]을 누르신 후
      </Text>
      <Text style={styles.manualSecondText}>지출 정보를 직접 입력하세요</Text>
      <Image source={selectImg} />
      {/* <Pressable>
        <Text style={styles.nextButton}>다음</Text>
      </Pressable> */}
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
    fontSize: 20,
    color: '#4D483D',
    fontWeight: '700',
  },
  manualFirstText: {
    paddingTop: 70,
    textAlign: 'center',
    fontSize: 18,
    color: '#4D483D',
    fontWeight: '700',
  },
  manualSecondText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#4D483D',
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
    width: 100,
    height: 100,
  },
  nextButton: {
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    textAlign: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#4D483D',
    color: 'white',
  },
});
export default SelectReceiptPage;
