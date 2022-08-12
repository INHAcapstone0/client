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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootState} from '../store/Reducer';
import CustomButton from '../components/CustomButton';
import HomePage from './HomePage';
import CalculatePage from './CalculatePage';
import AlarmPage from './AlarmPage';
import SettingPage from './SettingPage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// const Tab = createBottomTabNavigator();

function InitialPage({navigation}: any) {
  const isLoggedIn = useSelector((state: RootState) => state.user.name);
  console.log(isLoggedIn);
  return isLoggedIn === '' ? (
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
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarLabel: '홈1',
          tabBarIcon: ({color}) => (
            <AntDesign name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="CalculatePage"
        component={CalculatePage}
        options={{
          tabBarLabel: '정산',
          tabBarIcon: ({color}) => (
            <AntDesign name="calculator" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="AlarmPage"
        component={AlarmPage}
        options={{
          tabBarLabel: '알림',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingPage"
        component={SettingPage}
        options={{
          tabBarLabel: '세팅',
          tabBarIcon: ({color}) => (
            <AntDesign name="setting" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
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
