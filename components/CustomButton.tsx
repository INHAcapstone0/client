/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Component} from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

function CustomButton({title, onPress}: CustomButtonProps) {
  return (
    <TouchableOpacity style={styles.textButton} onPress={onPress}>
      <Text style={styles.buttonTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  textButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#21B8CD',
    width: 207,
    height: 56,
    borderRadius: 100,
  },
  buttonTitle: {
    color: 'white',
    fontSize: 18,
  },
  socialIconButton: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default CustomButton;
