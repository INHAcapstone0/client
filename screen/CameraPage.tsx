/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import {userActions} from '../slices/User';
import {useAppDispatch} from '../store/Store';
import RNFS from 'react-native-fs';

function CameraPage({navigation}: any) {
  const dispatch = useAppDispatch();
  const [{cameraRef}, {takePicture}] = useCamera();
  // const cameraRef = useRef(null);

  const captureImg = async () => {
    try {
      const data = await takePicture();
      const filePath = data.uri;
      console.log(filePath);
      //   const newFilePath = RNFS.ExternalDirectoryPath + '.jpg';
      //   RNFS.moveFile(filePath,newFilePath).then()
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        // flashMode={RNCamera.Constants.FlashMode.on}
        // androidCameraPermissionOptions={{
        //   title: 'Permission to use camera',
        //   message: 'We need your permission to use your camera',
        //   buttonPositive: 'Ok',
        //   buttonNegative: 'Cancel',
        // }}
        // androidRecordAudioPermissionOptions={{
        //   title: 'Permission to use audio recording',
        //   message: 'We need your permission to use your audio',
        //   buttonPositive: 'Ok',
        //   buttonNegative: 'Cancel',
        // }}
        // onGoogleVisionBarcodesDetected={({barcodes}) => {
        //   console.log(barcodes);
        // }}
      />
      <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity onPress={captureImg} style={styles.capture}>
          <Text style={{fontSize: 14}}> 촬영 </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default CameraPage;
