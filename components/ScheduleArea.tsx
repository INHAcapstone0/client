/* eslint-disable @typescript-eslint/no-unused-vars */
import { iteratorSymbol } from 'immer/dist/internal';
import React, {Component} from 'react';
import {TouchableOpacity, ScrollView,View,Text, StyleSheet, Image} from 'react-native';
import ScheduleCard from './ScheduleCard';



interface ScheduleAreaProps {
    info: any;
  }

function ScheduleArea({info}:ScheduleAreaProps) {
  
  const infoj = JSON.stringify(info);
  return (
    <ScrollView>
        {
            info.map((item: any) =>{
              
              if(item != null)
                return(
                    <ScheduleCard key={item.id} item={item}/>
                )
            })
            
        }
    </ScrollView>
  );
}


const styles = StyleSheet.create({
    a:{
      alignItems: 'center'
    }
});

export default ScheduleArea;
