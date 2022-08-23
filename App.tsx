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
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import InitialPage from './screen/InitialPage';
import SignInPage from './screen/SignInPage';
import SignUpPage from './screen/SignUpPage';
import HomePage from './screen/HomePage';
import SettingPage from './screen/SettingPage';
import CalculatePage from './screen/CalculatePage';
import AlarmPage from './screen/AlarmPage';
import CreateGroupPage from './screen/CreateGroupPage';
import store from './store/Store';
const Stack = createStackNavigator();
const persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
            <Stack.Screen name="AlarmPage" component={AlarmPage} />
            <Stack.Screen name="SettingPage" component={SettingPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
export default App;
