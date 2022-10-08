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
      <Pressable onPress={() => {}}>
        <Text>카메라</Text>
      </Pressable>
      <Pressable onPress={() => {}}>
        <Text>갤러리</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          console.log(route);
          route.navigation.navigate('ReceiptUploadPage');
        }}>
        <Text>영수증 수동 등록 페이지</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({});
export default SelectReceiptPage;
