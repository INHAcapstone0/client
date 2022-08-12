/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SettingPage from './SettingPage';
import CalculatePage from './CalculatePage';
import AlarmPage from './AlarmPage';

const Stack = createNativeStackNavigator();
function HomePage({navigation}: any) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>홈</Text>
      {/* <BottomNavigation /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonZone: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
export default HomePage;
