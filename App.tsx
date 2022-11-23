/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React, {useEffect, useState} from 'react';

import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import store from './store/Store';
import AppInner from './AppInner';
import ForegroundHandler from './utils/foreground_handler';
import SplashScreen from 'react-native-splash-screen';
import {
  requestUserPermission,
  notificationListner,
} from './utils/push_notification_helper';
const persistor = persistStore(store);

function App() {
  useEffect(() => {
    console.log(1);
    requestUserPermission();
    try {
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ForegroundHandler />
        <AppInner />
      </PersistGate>
    </Provider>
  );
}
export default App;
