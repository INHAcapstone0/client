/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React from 'react';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import InitialPage from './screen/InitialPage';
import SignInPage from './screen/SignInPage';
import SignUpPage from './screen/SignUpPage';
import HomePage from './screen/HomePage';
import SettingPage from './screen/SettingPage';
import store from './store';
const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="InitialPage">
          <Stack.Screen name="InitialPage" component={InitialPage} />
          <Stack.Screen name="SignInPage" component={SignInPage} />
          <Stack.Screen name="SignUpPage" component={SignUpPage} />
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="SettingPage" component={SettingPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
export default App;
