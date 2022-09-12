/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Component, useRef, useState} from 'react';
import {TouchableOpacity,View, Text, StyleSheet, Image,Dimensions, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCrown, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {Card, Button as PaperButton, Menu as PaperMenu, Provider as PaperProvider} from 'react-native-paper';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import BottomSheet from 'reanimated-bottom-sheet';

interface ScheduleCardProps{
  item: any;
  getSelectedScheduleId: any;
  getBottomModalType: any;
  onPress: any;

}
function ScheduleCard({item, getSelectedScheduleId, getBottomModalType, onPress}:ScheduleCardProps) {

  var startDate = item.startAt.substring(0,10);
  var endDate = item.endAt.substring(0,10);
  var totalPrice = item.total_pay;
  if(totalPrice == null){
    totalPrice = 0;
  }
  const openMenu = () => setVisible(true);
  const closeMenu = () => {setVisible(false);};
  const [ownerFlag, setOwnerFlag] = useState(0);

  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);
  
  const onMenuClick = () => {
    getSelectedScheduleId(item.id);
  }

  const setModalType = (modalType: string) =>{
    getBottomModalType(modalType);
  }
  
  const sheetRef = useRef<BottomSheet>(null);

  AsyncStorage.getItem('user_id', (err, result1) => { 
    if(result1 == item.owner_id){
      setOwnerFlag(1);
    }
  });

  if(ownerFlag == 1){ //내가 호스트인 스케줄 카드
    return (
      <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
        <Text style={styles.cardTitle}>{item.name}  <FontAwesomeIcon icon={faCrown} style={styles.cardHostIcon} /></Text>
        </View>
        <Menu
        visible={visible}
        anchor={<Text onPress={showMenu}  style={styles.cardMenuIcon}> <FontAwesomeIcon icon={faEllipsisV} /></Text>}
        onRequestClose={hideMenu}
      >
        <MenuItem onPress={() => {closeMenu(); getSelectedScheduleId(item.id); getBottomModalType('지출요약'); onPress();}}>지출 요약 확인하기</MenuItem>
        <MenuItem onPress={() => {closeMenu(); getSelectedScheduleId(item.id); getBottomModalType('멤버목록_호스트'); onPress();}}>멤버 추가하기</MenuItem>
        <MenuItem onPress={() => {closeMenu(); getSelectedScheduleId(item.id); getBottomModalType('정산'); Alert.alert(`추후 업데이트 예정입니다`)}}>정산하기</MenuItem>
        <MenuItem onPress={() => {closeMenu();
        Alert.alert('알림',
        '당신이 만든 그룹을 떠나면 그룹이 영원히 삭제됩니다 정말 떠나시겠습니까?',
        [
          {text: '아니오', onPress: () => {}, style: 'cancel'},
          {
            text: '예',
            onPress: () => {
              console.log('그룹 삭제 요청');

              AsyncStorage.getItem('user_id', (err, result1) => { //user_id에 담긴 아이디 불러오기
                //추후수정
                AsyncStorage.getItem('accessToken', (err, result2) => {
                  const headers ={
                  Authorization : `Bearer ${result2}`
                }
                
                console.log("user id : ", result1);
                console.log("schedule_id : ",item.id);
              axios.delete(`http://10.0.2.2:8002/schedules/${item.id}`, {headers})
              .then(res=>console.log(res.data)
              //refresh 추가하기
              )
              .catch(err=>console.log('호스트가 스케줄 나가는데서 오류 : ',err));

            });
              
          });
            },
            style: 'destructive',
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {},
          },)}}>그룹 떠나기</MenuItem>
      </Menu>
      </View>
        <Text style={styles.cardDate}>{startDate} ~ {endDate}</Text>
        <Text style={styles.cardTotalPrice}>{totalPrice} 원</Text>
      </View>
    );
  } else{ //내가 참가자인 스케줄 카드
    return (
      <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Menu
        visible={visible}
        anchor={<Text onPress={showMenu} style={styles.cardMenuIcon}><FontAwesomeIcon icon={faEllipsisV} /></Text>}
        onRequestClose={hideMenu}
      >
<MenuItem onPress={() => {closeMenu(); getSelectedScheduleId(item.id); getBottomModalType('지출요약'); onPress()}}>지출 요약 확인하기</MenuItem>
        <MenuItem onPress={() => {closeMenu(); getSelectedScheduleId(item.id); getBottomModalType('멤버목록_멤버'); onPress()}}>멤버 확인하기</MenuItem>
        <MenuItem onPress={() => {closeMenu(); Alert.alert('알림',
            '정말 그룹을 떠나시겠습니까?',
            [
              {text: '아니오', onPress: () => {}, style: 'cancel'},
              {
                text: '예',
                onPress: () => {
                  console.log('그룹떠나는 요청 보내기');
                  AsyncStorage.getItem('user_id', (err, result1) => { //user_id에 담긴 아이디 불러오기
                    //추후수정
                    AsyncStorage.getItem('accessToken', (err, result2) => {
                      //result2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQwMDhiNWNiLWM2MjYtNGEzYS05NDkwLTA4NTcyMjQ5Y2NmNCIsIm5hbWUiOiLthYzsiqTtirjsnKDsoIAwIiwiaWF0IjoxNjYxODQ3MTcwLCJleHAiOjE2NjMwNTY3NzB9.DO02grsZ2zwzIPj0-2s2AJAtzgoAcmJv_vQDL2Biqg4';
                      const headers ={
                      Authorization : `Bearer ${result2}`
                    }
                    console.log("user id : ", result1);
                    console.log("schedule_id : ",item.id);
                    axios.delete(`http://10.0.2.2:8002/participants/${result1}/${item.id}`, {headers})
                    .then(res=>console.log('참가자가 스케줄 나가는데 성공 : ',result1, item.id))
                    .catch(err=>console.log('참가자가 스케줄 나가는데 오류 : ',err));

                  });
                  
                    });

                },
                style: 'destructive',
              },
            ],
            {
              cancelable: true,
              onDismiss: () => {},
              },)}}>그룹 떠나기</MenuItem>
      </Menu>
      
      </View>
        <Text style={styles.cardDate}>{startDate} ~ {endDate}</Text>
        <Text style={styles.cardTotalPrice}>{totalPrice} 원</Text>
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  card: {
        borderWidth : 2,
        borderRadius: 20,
        borderColor: '#4D483D',
        backgroundColor: 'white',
        width: Dimensions.get('window').width*0.9, 
        height: 200,
        marginBottom: 20
      },
  cardHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardTitle:{
        fontSize: 16,
        fontFamily: 'Jalnan',
        color: '#4D483D',
        marginLeft: 7,
        marginTop: 10
      },
  cardDate:{
    fontSize: 13,
    fontFamily: 'Jalnan',
    marginLeft: 7,
    color: '#4D483D'
    },
    cardMenu:{
      width: 12,
      fontFamily: 'Jalnan',
    },
    cardMenuItem:{
      fontFamily: 'Jalnan',
    },
    cardHostIcon:{
    color: '#FFB900',
    marginTop: 12
    },
    cardTotalPrice:{
      color: '#4D483D',
      marginLeft: 7,
      fontFamily: 'Jalnan'
    },
    cardMenuIcon:{
      color: '#4D483D',
      marginTop: 12,
      marginRight: 8
    }
});

export default ScheduleCard;
