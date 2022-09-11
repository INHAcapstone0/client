/* eslint-disable @typescript-eslint/no-unused-vars */
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {Component, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {TouchableOpacity, View,Text, StyleSheet, Image, Alert,  TextInput, Button} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {Card, Menu, Provider as PaperProvider} from 'react-native-paper';
import { cos } from 'react-native-reanimated';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../store/Store';
import ParticipantCard from './ParticipantCard';
import ReceiptCard from './ReceiptCard';

interface BottomComponentProps{
  selectedScheduleId: any;
  bottomModalType: any;
}
function BottomComponent({selectedScheduleId, bottomModalType}:BottomComponentProps) {
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const [approvedAllMembersInfo, setApprovedAllMembersInfo] = useState([]);
  const [allReceiptsInfo, setAllReceiptsInfo] = useState([]);

  const getAllApprovedMembers = async () => {
    try{
      const params ={
        schedule_id: selectedScheduleId,
        status:"승인"
      };
    
      const headers ={
        Authorization : `Bearer ${accessToken}`
      }
      
      const response = await axios.get("http://10.0.2.2:8002/participants", {params,headers});

      setApprovedAllMembersInfo(response.data);
    } catch (err){
      console.log(err);
    }
  }

  const getAllReceipts = async () => {
    try{
      const params ={
        schedule_id: selectedScheduleId,
      };
    
      const headers ={
        Authorization : `Bearer ${accessToken}`
      }
      
      const response = await axios.get("http://10.0.2.2:8002/receipts", {params,headers});

      setAllReceiptsInfo(response.data);
    } catch (err){
      console.log(err);
    }
  }

  if(bottomModalType === '지출요약'){
    useEffect(() => {
      getAllReceipts();
      
    },[]);
    return (
      <View>
        <Text style={styles.modalTitle}>지출 요약 확인하기</Text>
         {
              allReceiptsInfo.map((item: any) =>{
                
                if(item != null)
                  return(
                    <ReceiptCard key={item.id} item = {item}/>
                  )
              })
              
          }
      </View>
    );

  }else if(bottomModalType==='멤버목록_멤버'){
    useEffect(() => {
      getAllApprovedMembers();
    },[]);

  return (
    <View>
      <Text style={styles.modalTitle}>멤버 확인하기</Text>
       {
            approvedAllMembersInfo.map((item: any) =>{
              
              if(item != null)
                return(
                  <ParticipantCard key={item.participant_id} item={item}/>
                )
            })
            
        }
    </View>
  );
  } else{
    return (
      <View></View>
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
    modalTitle:{
      fontFamily: 'Jalnan',
      fontSize: 24,
      marginLeft: 20,
      marginBottom:10,
      color: '#4D483D'
    }
  });

export default BottomComponent;
