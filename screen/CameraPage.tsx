/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useRef, useState} from 'react';
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
  Image,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import {userActions} from '../slices/User';
import {useAppDispatch} from '../store/Store';

function CameraPage({navigation}: any) {
  const dispatch = useAppDispatch();
  const [{cameraRef}, {takePicture}] = useCamera();
  // const cameraRef = useRef(null);

  const captureImg = async () => {
    try {
      const data = await takePicture();
      const filePath = data.uri;
      console.log(filePath);
      navigation.navigate('CapturePage', {imgUrl: filePath});
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
      <View style={styles.captureContainer}>
        <TouchableOpacity onPress={captureImg} style={styles.captureButton}>
          <Text style={styles.captureLabel}> 촬영 </Text>
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
  captureContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  captureButton: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 30,
  },
  captureLabel: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default CameraPage;
