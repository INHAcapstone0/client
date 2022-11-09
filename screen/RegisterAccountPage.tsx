/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View, Dimensions} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {userActions} from '../slices/user';
import {useAppDispatch} from '../store/Store';
import axios from 'axios';
import {RootState} from '../store/Store';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal/dist/modal';
import DatePicker from 'react-native-date-picker';

function RegisterAccountPage({navigation}: any) {
  const dispatch = useAppDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const id = useSelector((state: RootState) => state.persist.user.id);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  useEffect(() => {}, []);

  return (
    <View>
      <Pressable
        onPress={() => {
          //리다이렉션 시키기
        }}>
        <Text>새 계좌 등록하기</Text>
      </Pressable>
      <Pressable onPress={() => setOpen(true)}>
        <Text>open</Text>
      </Pressable>
      <DatePicker date={date} onDateChange={setDate} />
    </View>
  );
}

const styles = StyleSheet.create({});
export default RegisterAccountPage;
