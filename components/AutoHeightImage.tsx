/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
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

  useEffect(() => {
    Image.getSize(
      path,
      (w, h) => {
        setHeight(h * (width / w));
      },
      error => {
        setHeight(100);
        console.error(`Couldn't get the image size: ${error.message}`);
        console.error(`Couldn't get the image size: ${error}`);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Image
      style={{width: '100%', height: height}}
      source={{uri: path}}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({});

export default AutoHeightImage;
