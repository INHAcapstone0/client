/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable handle-callback-err */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Component, useEffect, useRef, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCrown, faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {
  Card,
  Button as PaperButton,
  Menu as PaperMenu,
  Provider as PaperProvider,
} from 'react-native-paper';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import BottomSheet from 'reanimated-bottom-sheet';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {string} from 'prop-types';

interface ScheduleCardProps {
  item: any;
  setSelectedScheduleId: any;
  setBottomModalType: any;
  openBottomModal: any;
  doRefresh: any;
}
function ScheduleCard({
  item,
  setSelectedScheduleId,
  setBottomModalType,
  openBottomModal,
  doRefresh,
}: ScheduleCardProps) {
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  /*
  const [userId,setUserId] = useSelector(
    (state: RootState) => state.persist.user.id,
  );
  */

  var userId: string;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(item.total_pay);

  const openMenu = () => setVisible(true);
  const closeMenu = () => {
    setVisible(false);
  };
  const [ownerFlag, setOwnerFlag] = useState(false);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('user_id', (err, result1) => {
      if (result1 !== undefined && result1 !== null) {
        userId = result1;
        if (userId === item.owner_id) {
          setOwnerFlag(true);
        }
      }
    });

    if (totalPrice == null) {
      setTotalPrice(0);
    }
    setStartDate(item.startAt.substring(0, 10));
    setEndDate(item.endAt.substring(0, 10));
  }, []);

  if (ownerFlag) {
    //내가 호스트인 스케줄 카드
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>
              {item.name}{' '}
              <FontAwesomeIcon icon={faCrown} style={styles.cardHostIcon} />
            </Text>
          </View>
          <Menu
            visible={visible}
            anchor={
              <Text onPress={openMenu} style={styles.cardMenuIcon}>
                {' '}
                <FontAwesomeIcon icon={faEllipsisV} />
              </Text>
            }
            onRequestClose={closeMenu}>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedScheduleId(item.id);
                setBottomModalType('지출요약');
                openBottomModal();
              }}>
              <Text style={styles.cardMenuItem}>지출 요약 확인하기</Text>
            </MenuItem>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedScheduleId(item.id);
                setBottomModalType('멤버목록_호스트');
                openBottomModal();
              }}>
              <Text style={styles.cardMenuItem}>멤버 추가하기</Text>
            </MenuItem>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedScheduleId(item.id);
                setBottomModalType('정산');
                Alert.alert('추후 업데이트 예정입니다');
              }}>
              <Text style={styles.cardMenuItem}>정산하기</Text>
            </MenuItem>
            <MenuItem
              onPress={() => {
                closeMenu();
                Alert.alert(
                  '알림',
                  '당신이 만든 그룹을 떠나면 그룹이 영원히 삭제됩니다 정말 떠나시겠습니까?',
                  [
                    {text: '아니오', onPress: () => {}, style: 'cancel'},
                    {
                      text: '예',
                      onPress: async () => {
                        try {
                          const headers = {
                            Authorization: `Bearer ${accessToken}`,
                          };
                          const response = await axios.delete(
                            `http://10.0.2.2:8002/schedules/${item.id}`,
                            {headers},
                          );
                          //doRefresh();
                        } catch (err) {
                          console.log(err);
                        }
                        //refresh 필요
                      },
                      style: 'destructive',
                    },
                  ],
                  {
                    cancelable: true,
                    onDismiss: () => {},
                  },
                );
              }}>
              <Text style={styles.cardMenuItem}>그룹 떠나기</Text>
            </MenuItem>
          </Menu>
        </View>
        <Text style={styles.cardDate}>
          {startDate} ~ {endDate}
        </Text>
        <Text style={styles.cardTotalPrice}>{totalPrice} 원</Text>
      </View>
    );
  } else {
    //내가 참가자인 스케줄 카드
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Menu
            visible={visible}
            anchor={
              <Text onPress={openMenu} style={styles.cardMenuIcon}>
                <FontAwesomeIcon icon={faEllipsisV} />
              </Text>
            }
            onRequestClose={closeMenu}>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedScheduleId(item.id);
                setBottomModalType('지출요약');
                openBottomModal();
              }}>
              <Text style={styles.cardMenuItem}>지출 요약 확인하기</Text>
            </MenuItem>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedScheduleId(item.id);
                setBottomModalType('멤버목록_멤버');
                openBottomModal();
              }}>
              <Text style={styles.cardMenuItem}>멤버 확인하기</Text>
            </MenuItem>
            <MenuItem
              onPress={() => {
                closeMenu();
                Alert.alert(
                  '알림',
                  '정말 그룹을 떠나시겠습니까?',
                  [
                    {text: '아니오', onPress: () => {}, style: 'cancel'},
                    {
                      text: '예',
                      onPress: async () => {
                        try {
                          const headers = {
                            Authorization: `Bearer ${accessToken}`,
                          };
                          console.log('user_id : ', userId);

                          AsyncStorage.getItem(
                            'user_id',
                            async (err, result1) => {
                              //user_id에 담긴 아이디 불러오기
                              const response = await axios.delete(
                                `http://10.0.2.2:8002/participants/${result1}/${item.id}`,
                                {headers},
                              );
                              doRefresh();
                            },
                          );
                        } catch (err) {
                          console.log(err);
                        }
                        //refresh 필요
                      },
                      style: 'destructive',
                    },
                  ],
                  {
                    cancelable: true,
                    onDismiss: () => {},
                  },
                );
              }}>
              <Text style={styles.cardMenuItem}>그룹 떠나기</Text>
            </MenuItem>
          </Menu>
        </View>
        <Text style={styles.cardDate}>
          {startDate} ~ {endDate}
        </Text>
        <Text style={styles.cardTotalPrice}>{totalPrice} 원</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#4D483D',
    backgroundColor: 'white',
    width: Dimensions.get('window').width * 0.9,
    height: 200,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Jalnan',
    color: '#4D483D',
    marginLeft: 7,
    marginTop: 10,
  },
  cardDate: {
    fontSize: 13,
    fontFamily: 'Jalnan',
    marginLeft: 7,
    color: '#4D483D',
  },
  cardMenu: {
    width: 12,
    fontFamily: 'Jalnan',
  },
  cardMenuItem: {
    fontFamily: 'Jalnan',
  },
  cardHostIcon: {
    color: '#FFB900',
    marginTop: 12,
  },
  cardTotalPrice: {
    color: '#4D483D',
    marginLeft: 7,
    fontFamily: 'Jalnan',
  },
  cardMenuIcon: {
    color: '#4D483D',
    marginTop: 12,
    marginRight: 8,
  },
});

export default ScheduleCard;
