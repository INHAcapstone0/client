/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Component, useRef} from 'react';
import {TouchableOpacity, View,Text, StyleSheet, Image, Alert,  TextInput} from 'react-native';
import {Card, Button, Menu, Provider as PaperProvider} from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';


function DropMenu() {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => {setVisible(false);};
  return (
    <PaperProvider>
    <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu}> Menu </Button>}
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
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  menuItem: {
  },
});

export default DropMenu;
