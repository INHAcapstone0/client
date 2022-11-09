/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

interface AutoHeightImageProps {
  path: string;
}

function AutoHeightImage({path}: AutoHeightImageProps) {
  const [height, setHeight] = useState(0);
  const {width} = Dimensions.get('window');
  Image.getSize(path, (w, h) => {
    setHeight(h * (width / w));
  });
  return (
    <Image
      style={{width: '100%'}}
      source={{uri: path, height}}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({});

export default AutoHeightImage;
