/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from 'axios';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import ScheduleCard from '../components/ScheduleCard';
import BottomComponent from '../components/BottomComponent';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlaneDeparture, faSuitcase} from '@fortawesome/free-solid-svg-icons';
import ReceiptCard from '../components/ReceiptCard';
import {faReceipt} from '@fortawesome/free-solid-svg-icons';
import {configureStore} from '@reduxjs/toolkit';

function SelectReceiptPage(route: any) {
  return (
    <View>
      <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
        <Text>카메라</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
        <Text>갤러리</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  schedule: {
    backgroundColor: '#4D483D',
    height: 100,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errIcon: {
    color: '#4D483D',
  },
  scheduleName: {
    fontSize: 17,
    fontFamily: 'Jalnan',
    color: '#FFFFFF',
    marginTop: 10,
    marginLeft: 10,
  },
  scheduleDate: {
    fontSize: 15,
    fontFamily: 'Jalnan',
    color: '#FFFFFF',
    marginTop: 10,
    marginRight: 10,
  },
  scheduleTotalPrice: {
    fontSize: 25,
    fontFamily: 'Jalnan',
    color: '#FFFFFF',
  },
  errScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.6,
  },
  errMsg: {
    fontSize: 20,
    fontFamily: 'Jalnan',
    color: '#4D483D',
  },
});
export default SelectReceiptPage;
