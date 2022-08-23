/* eslint-disable @typescript-eslint/no-unused-vars */
import { iteratorSymbol } from 'immer/dist/internal';
import React, {Component} from 'react';
import {TouchableOpacity, View,Text, StyleSheet, Image} from 'react-native';
import Schedule from './Schedule';


interface ScheduleAreaProps {
    info: any;
  }

function ScheduleArea({info}:ScheduleAreaProps) {
  
  const infoj = JSON.stringify(info);
  return (
    <View>
        {
            info.map((item: any) =>{
                return(
                    <Schedule key={item.id} item={item}/>
                )
            })
            
        }
    </View>
  );
}


const styles = StyleSheet.create({
    a:{
      alignItems: 'center'
    }
});

export default ScheduleArea;
