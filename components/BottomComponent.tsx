/* eslint-disable @typescript-eslint/no-unused-vars */
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {Component, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {TouchableOpacity, View,Text, StyleSheet, Image, Alert,  TextInput, Button} from 'react-native';
import {Card, Menu, Provider as PaperProvider} from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';

interface BottomComponentProps{
  selectedScheduleId: any;
  bottomModalType: any;
}
function BottomComponent({selectedScheduleId, bottomModalType}:BottomComponentProps) {
  //
  //지출요약
  //멤버목록_호스트
  if(bottomModalType === '지출요약'){


  return (
    <View>
      <Text>
    {
      selectedScheduleId
    }, {
      bottomModalType
    }
      </Text>

    </View>
  );
  }else if(bottomModalType==='멤버목록_멤버'){
    const [info, setInfo] = useState([]);
    useEffect(() => {
    AsyncStorage.getItem('user_id', (err, result1) => { //user_id에 담긴 아이디 불러오기

      
      result1 = '4008b5cb-c626-4a3a-9490-08572249ccf4'; //test0 계정
      const params ={
        schedule_id : selectedScheduleId
      };
    
      //엑세스토큰 먼저 확인하고 id 가져오기 - 추후수정
      //엑세스 토큰 만료되면 refresh로 액세스토큰 만들어주기
      AsyncStorage.getItem('accessToken', (err, result2) => {
        result2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQwMDhiNWNiLWM2MjYtNGEzYS05NDkwLTA4NTcyMjQ5Y2NmNCIsIm5hbWUiOiLthYzsiqTtirjsnKDsoIAwIiwiaWF0IjoxNjYyMjEyNDI3LCJleHAiOjE2NjM0MjIwMjd9.WOdLOl4a2WRCzqobCuuCLj5HE9fCtcGb2c2NUFZxHLA';
        const headers ={
        Authorization : `Bearer ${result2}`
      }
      
      axios.get("http://10.0.2.2:8002/participants", {params,headers})
      .then(res=>setInfo(res.data))
      .catch(err=>console.log('3 : ',err));
    });
  });
},[]);
    return (

      <View>
      <Text>
    {
      JSON.stringify(info)
    }
      </Text>

    </View>
    );
  } else{
    return (
      <View>
      <Text>{selectedScheduleId}, {bottomModalType}</Text>

    </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      backgroundColor: 'grey',
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
    },
  });

export default BottomComponent;
