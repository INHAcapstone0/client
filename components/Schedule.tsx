/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Component, useState} from 'react';
import {TouchableOpacity,View, Text, StyleSheet, Image,Dimensions } from 'react-native';

interface ScheduleProps{
  item: any
}
function Schedule({item}:ScheduleProps) {
  var startDate = item.startAt.substring(0,10);
  var endDate = item.endAt.substring(0,10);

  return (
    <View style={styles.a}>
    <View style={styles.b}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.date}>{startDate} ~ {endDate}</Text>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  a: {
        borderWidth : 3,
        borderRadius: 20,
        borderColor: '#4D483D',
        backgroundColor: 'white',
        width: Dimensions.get('window').width*0.9, 
        height: 200,
      },
  b:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title:{
        fontSize: 18,
        color: '#4D483D',
        marginLeft: 7,
        marginTop: 7
      },
  date:{
    fontSize: 14,
    color: '#4D483D',
    paddingRight: 7,
    marginTop: 7
    }
});

export default Schedule;
