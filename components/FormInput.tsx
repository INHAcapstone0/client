/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, Dimensions} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

const FormInput = ({
  labelValue,
  placeholderText,
  iconType,
  inputType,
  refType,
  ...rest
}: any) => {
  const [styleType, setStyleType] = useState(styles.inputContainer);
  useEffect(() => {
    if (inputType === 'register') setStyleType(styles.inputContainer2);
  }, [styleType]);
  return (
    <View style={styleType}>
      <View style={styles.iconStyle}>
        <AntDesign name={iconType} size={25} color="#666" />
      </View>
      <TextInput
        value={labelValue}
        style={styles.input}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor="#666"
        type={refType}
        {...rest}
      />
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: Dimensions.get('window').height / 15,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inputContainer2: {
    marginTop: 5,
    marginBottom: 10,
    width: '80%',
    height: Dimensions.get('window').height / 15,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: Dimensions.get('window').height / 1.5,
    height: Dimensions.get('window').height / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});
