/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect} from 'react';
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
import CreateGroupPage from './CreateGroupPage';
import AlarmPage from './AlarmPage';
import SettingPage from './SettingPage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAppDispatch} from '../store/Index';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError, AxiosResponse} from 'axios';
import userSlice from '../slices/User';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// const Tab = createBottomTabNavigator();

function InitialPage({navigation}: any) {
  const isLoggedIn = useSelector((state: RootState) => state.user.name);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        if (!refreshToken) {
          return;
        }
        const response = await axios.post(`http://10.0.2.2:8002/auth/refersh`, {
          headers: {
            Authorization: `[${accessToken}]`,
            Refresh: `[${refreshToken}]`,
          },
        });
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
      } catch (error) {
        console.error(error);
      }
    };
    getTokenAndRefresh();
  }, [accessToken, dispatch]);

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
          headerShown: false,
          tabBarLabel: '홈',
          tabBarIcon: ({color}) => (
            <AntDesign name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="CalculatePage"
        component={CalculatePage}
        options={{
          headerShown: false,
          tabBarLabel: '정산',
          tabBarIcon: ({color}) => (
            <AntDesign name="calculator" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="CreateGroupPage"
        component={CreateGroupPage}
        options={{
          headerShown: false,
          tabBarLabel: '새그룹 생성',
          tabBarIcon: ({color}) => (
            <AntDesign name="pluscircleo" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="AlarmPage"
        component={AlarmPage}
        options={{
          headerShown: false,
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
          headerShown: false,
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
