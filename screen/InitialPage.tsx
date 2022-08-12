/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootState} from '../store/reducer';
import CustomButton from '../components/CustomButton';
import HomePage from './HomePage';
import SettingPage from './SettingPage';

const Stack = createNativeStackNavigator();

// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// const Tab = createBottomTabNavigator();

function InitialPage({navigation}: any) {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  return isLoggedIn ? (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <Text style={styles.text}>어플을 처음 이용하시나요?</Text>
          <CustomButton
            title={'회원가입'}
            onPress={() => navigation.navigate('SignUpPage')}
          />
          <Text style={styles.text}>계정을 이미 등록하셨나요?</Text>
          <CustomButton
            title={'로그인'}
            onPress={() => navigation.navigate('SignInPage')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{title: '홈화면'}}
      />
      <Stack.Screen
        name="SignUp"
        component={SettingPage}
        options={{title: '회원가입'}}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#3E382F',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 90,
    marginBottom: 60,
  },
  socialLoginTitle: {
    color: '#B0A69D',
    fontSize: 14,
    marginTop: 100,
    marginBottom: 20,
  },
  socialLoginIcons: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
  },
});

export default InitialPage;
