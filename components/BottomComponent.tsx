/* eslint-disable @typescript-eslint/no-unused-vars */
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {Component, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {TouchableOpacity, View,Text, StyleSheet, Image, Alert,  TextInput, Button} from 'react-native';
import {Card, Menu, Provider as PaperProvider} from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../store/Store';

interface BottomComponentProps{
  selectedScheduleId: any;
  bottomModalType: any;
}
function BottomComponent({selectedScheduleId, bottomModalType}:BottomComponentProps) {
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const [approvedMemberInfo, setApprovedMemberInfo] = useState([]);

  const getApprovedMember = async () => {
    try{
      const params ={
        schedule_id: selectedScheduleId
      };
    
      const headers ={
        Authorization : `Bearer ${accessToken}`
      }
      

      axios.get("http://10.0.2.2:8002/participants", {params,headers})
      .then(res=>setApprovedMemberInfo(res.data))
      .catch(err=>console.log(err));
    } catch (err){
      console.log(err);
    }
  }
  
  if(bottomModalType === '지출요약'){
  return (
    <View>
       {
            approvedMemberInfo.map((item: any) =>{
              
              if(item != null)
                return(
                  <View>
                    <Text>{item.participant_id}</Text>
                    <Text>--------------------------</Text>
                  </View>
                )
            })
            
        }
    </View>
  );
  }else if(bottomModalType==='멤버목록_멤버'){
    useEffect(() => {
      getApprovedMember();
    });

  return (
    <View>
       {
            approvedMemberInfo.map((item: any) =>{
              
              if(item != null)
                return(
                  <View>
                    <Text>{item.participant_id}</Text>
                    <Text>--------------------------</Text>
                  </View>
                )
            })
            
        }
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
