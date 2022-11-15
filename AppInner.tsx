/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from './store/Store';
import InitialPage from './screen/InitialPage';
import SignInPage from './screen/SignInPage';
import SignUpPage from './screen/SignUpPage';
import HomePage from './screen/HomePage';
import SettingPage from './screen/SettingPage';
import CalculatePage from './screen/CalculatePage';
import AlarmPage from './screen/AlarmPage';
import CreateGroupPage from './screen/CreateGroupPage';
import ExpenseHistoryPage from './screen/ExpenseHistoryPage';
import SelectReceiptPage from './screen/SelectReceiptPage';
import ReceiptInfoPage from './screen/ReceiptInfoPage';
import ReceiptUploadPage from './screen/ReceiptUploadPage';
import CreateGroupSecondPage from './screen/CreateGroupSecondPage';
import CreateGroupFinalPage from './screen/CreateGroupFinalPage';
import NotificationSettingPage from './screen/NotificationSettingPage';
import RegisterAccountPage from './screen/RegisterAccountPage';
import PreMyPage from './screen/PreMyPage';
import MyPage from './screen/MyPage';
import {useAppDispatch} from './store/Store';
import {userActions} from './slices/User';
import ReceiptResultPage from './screen/ReceiptResultPage';
import MyAccountPage from './screen/MyAccountPage';
import AccountHistoryPage from './screen/AccountHistoryPage';
import AccountReceiptUploadPage from './screen/AccountReceiptUploadPage';
import FindPassWordPage from './screen/FindPassWordPage';
import ResetPasswordPage from './screen/ResetPasswordPage';

const Stack = createStackNavigator();

function AppInner() {
  // const dispatch = useAppDispatch();
  // const accessToken = useSelector(
  //   (state: RootState) => state.persist.user.accessToken,
  // );
  // useEffect(() => {
  //   axios.interceptors.response.use(
  //     //성공한경우
  //     response => {
  //       return response;
  //     },
  //     //실패한경우
  //     async error => {
  //       const {
  //         config, //error.config -> 원래요청
  //         response: {status}, //error.response.status
  //       } = error;
  //       //토큰 만료 에러코드
  //       if (status === 401) {
  //         console.log(status);
  //         console.log(config);
  //         const originalRequest = config;
  //         const refreshToken = await EncryptedStorage.getItem('refreshToken');
  //         // token refresh 요청
  //         const {data} = await axios.post(
  //           'http://146.56.190.78:8002/users/auth/refresh', // token refresh api
  //           {},
  //           {
  //             headers: {
  //               Authorization: `Bearer ${accessToken}`,
  //               Refresh: `${refreshToken}`,
  //             },
  //           },
  //         );
  //         // 새로운 토큰 저장
  //         dispatch(userActions.setAccessToken(data.data.accessToken));
  //         EncryptedStorage.setItem('refreshToken', data.data.refreshToken);
  //         originalRequest.headers.Authorization = `${data.data.accessToken}`;
  //         // 419로 요청 실패했던 요청 새로운 토큰으로 재요청
  //         return axios(originalRequest);
  //       }
  //       return Promise.reject(error);
  //     },
  //   );
  // }, [accessToken, dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="InitialPage">
        <Stack.Screen name="InitialPage" component={InitialPage} />
        <Stack.Screen name="SignInPage" component={SignInPage} />
        <Stack.Screen name="SignUpPage" component={SignUpPage} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="CalculatePage" component={CalculatePage} />
        <Stack.Screen name="CreateGroupPage" component={CreateGroupPage} />
        <Stack.Screen
          name="CreateGroupSecondPage"
          component={CreateGroupSecondPage}
        />
        <Stack.Screen
          name="CreateGroupFinalPage"
          component={CreateGroupFinalPage}
        />
        <Stack.Screen name="AlarmPage" component={AlarmPage} />
        <Stack.Screen name="SettingPage" component={SettingPage} />
        <Stack.Screen
          name="ExpenseHistoryPage"
          component={ExpenseHistoryPage}
        />
        <Stack.Screen name="ReceiptInfoPage" component={ReceiptInfoPage} />
        <Stack.Screen name="SelectReceiptPage" component={SelectReceiptPage} />
        <Stack.Screen name="ReceiptUploadPage" component={ReceiptUploadPage} />
        <Stack.Screen
          name="NotificationSettingPage"
          component={NotificationSettingPage}
        />
        <Stack.Screen name="PreMyPage" component={PreMyPage} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="ReceiptResultPage" component={ReceiptResultPage} />
        <Stack.Screen
          name="RegisterAccountPage"
          component={RegisterAccountPage}
        />
        <Stack.Screen name="MyAccountPage" component={MyAccountPage} />
        <Stack.Screen
          name="AccountHistoryPage"
          component={AccountHistoryPage}
        />
        <Stack.Screen
          name="AccountReceiptUploadPage"
          component={AccountReceiptUploadPage}
        />
        <Stack.Screen name="FindPassWordPage" component={FindPassWordPage} />
        <Stack.Screen name="ResetPasswordPage" component={ResetPasswordPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppInner;
