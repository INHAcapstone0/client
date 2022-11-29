/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootState} from '../store/Store';
import CustomButton from '../components/CustomButton';
import HomePage from './HomePage';
import CalculatePage from './CalculatePage';
import CreateGroupPage from './CreateGroupPage';
import AlarmPage from './AlarmPage';
import SettingPage from './SettingPage';
import SignInPage from './SignInPage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  requestUserPermission,
  notificationListner,
} from '../utils/push_notification_helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
const Tab = createBottomTabNavigator();

function InitialPage({navigation}: any) {
  const isLoggedIn = useSelector((state: RootState) => state.persist.user.name);
  const route = useRoute();
  // console.log(route.name);

  useEffect(() => {
    console.log(route.name);
  }, [route, navigation]);

  // useEffect(() => {
  //   if (isLoggedIn !== '') {
  //     requestUserPermission();
  //     notificationListner();
  //   }
  // }, [isLoggedIn]);

  return isLoggedIn === '' ? (
    // <SafeAreaView>
    //   <StatusBar />
    //   <ScrollView contentInsetAdjustmentBehavior="automatic">
    //     <View style={styles.container}>
    //       <Text style={styles.text}>어플을 처음 이용하시나요?</Text>
    //       <CustomButton
    //         title={'회원가입'}
    //         onPress={() => navigation.navigate('SignUpPage')}
    //       />
    //       <Text style={styles.text}>계정을 이미 등록하셨나요?</Text>
    //       <CustomButton
    //         title={'로그인'}
    //         onPress={() => navigation.navigate('SignInPage')}
    //       />
    //       <Text style={styles.text}>비밀번호를 잊으셨나요?</Text>
    //       <CustomButton
    //         title={'비밀번호 찾기'}
    //         onPress={() => navigation.navigate('FindPassWordPage')}
    //       />
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
    <SignInPage navigation={navigation} />
  ) : (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        tabBarStyle: {height: 60, borderTopWidth: 1},
        tabBarInactiveTintColor: 'gray',
        tabBarActiveTintColor: 'black',
      }}>
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({color}: any) => (
            <Entypo name="home" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CalculatePage"
        component={CalculatePage}
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({color}: any) => (
            <MaterialCommunityIcons
              name="calculator-variant"
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CreateGroupPage"
        component={CreateGroupPage}
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({color}: any) => (
            <Image
              source={require('../resources/icons/add.png')}
              style={styles.alarmIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AlarmPage"
        component={AlarmPage}
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({color}: any) => (
            <FontAwesome name="bell" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingPage"
        component={SettingPage}
        options={{
          unmountOnBlur: true,
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({color}: any) => (
            <Ionicons name="settings" size={25} color={color} />
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
    // color: 'black',
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
  alarmIcon: {
    width: 25,
    height: 25,
  },
});

export default InitialPage;
