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
  Dimensions,
} from 'react-native';
function CapturePage({route}: any) {
  console.log(route.params.imgUrl);
  return (
    <View>
      <Image
        style={styles.captureImg}
        source={{
          uri: route.params.imgUrl,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  captureImg: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default CapturePage;
