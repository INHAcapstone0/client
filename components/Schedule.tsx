/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Component, useState} from 'react';
import {TouchableOpacity,View, Text, StyleSheet, Image,Dimensions, Alert } from 'react-native';


import {Card, Button, Menu, Provider as PaperProvider} from 'react-native-paper';

import Icon from 'react-native-vector-icons'

interface ScheduleProps{
  item: any
}
function Schedule({item}:ScheduleProps) {
  var startDate = item.startAt.substring(0,10);
  var endDate = item.endAt.substring(0,10);
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => {setVisible(false);};
  return (
    <Card onPress={closeMenu} >
    <View style={styles.a}>
    <View style={styles.b}>
      <Text style={styles.title}>{item.name}</Text>
      <PaperProvider >
      <View style={styles.menu}>
      <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Button onPress={openMenu} icon="dots-vertical" style={{width:10}} children={undefined}></Button>}
          >
          <Menu.Item onPress={() => {closeMenu(); Alert.alert('1');}} title="지출 요약 확인하기" />
          <Menu.Item onPress={() => {closeMenu(); Alert.alert(`2`)}} title="멤버 확인하기" />
          <Menu.Item onPress={() => {closeMenu(); Alert.alert('알림',
    '정말 그룹을 떠나시겠습니까?',
    [
      {text: '아니오', onPress: () => {}, style: 'cancel'},
      {
        text: '예',
        onPress: () => {
          console.log('그룹떠나는 요청 보내기');
        },
        style: 'destructive',
      },
    ],
    {
      cancelable: true,
      onDismiss: () => {},
    },)}} title="그룹 떠나기" />
      </Menu>
      </View>
      </PaperProvider>
      </View>
      <Text style={styles.date}>{startDate} ~ {endDate}</Text>
    </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  a: {
        borderWidth : 2,
        borderRadius: 20,
        borderColor: '#4D483D',
        backgroundColor: 'white',
        width: Dimensions.get('window').width*0.9, 
        height: 200,
        marginBottom: 20
      },
  b:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title:{
        fontSize: 16,
        fontFamily: 'Jalnan',
        color: '#4D483D',
        marginLeft: 7,
        marginTop: 10
      },
  date:{
    fontSize: 13,
    fontFamily: 'Jalnan',
    marginLeft: 7,
    color: '#4D483D'
    },
    menu:{
      width: 12,
      zIndex: 15,
      marginLeft: 190,
    }
});

export default Schedule;
