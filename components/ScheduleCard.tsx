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
  Pressable,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCrown, faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import BottomSheet from 'reanimated-bottom-sheet';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

interface ScheduleCardProps {
  item: any;
  setSelectedScheduleId: (scheduleId: any) => void;
  setBottomModalType: (modalType: string) => void;
  openBottomModal: () => void;
  doRefresh: () => void;
  openModal: () => void;
  navigation: any;
}
function ScheduleCard({
  item,
  setSelectedScheduleId,
  setBottomModalType,
  openBottomModal,
  doRefresh,
  openModal,
  navigation: {navigate},
}: ScheduleCardProps) {
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const [isModalVisible, setModalVisible] = useState(false);

  const userId = useSelector((state: RootState) => state.persist.user.id);

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
    if (userId === item.owner_id) {
      setOwnerFlag(true);
    }

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
            <View>
              <Text style={styles.cardTitleText}>
                {item.name}{' '}
                <FontAwesomeIcon icon={faCrown} style={styles.cardHostIcon} />
              </Text>
            </View>
            <View style={styles.cardDateArea}>
              <Text style={styles.cardDateText}>
                {startDate} ~ {endDate}
              </Text>
            </View>
          </View>
          <Menu
            visible={visible}
            anchor={
              <Pressable onPress={openMenu}>
                <FontAwesomeIcon
                  style={styles.cardMenuIcon}
                  size={25}
                  icon={faEllipsisV}
                />
              </Pressable>
            }
            onRequestClose={closeMenu}>
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
                setBottomModalType('멤버목록_멤버');
                openBottomModal();
              }}>
              <Text style={styles.cardMenuItem}>멤버 확인하기</Text>
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
                openModal();
              }}>
              <Text style={styles.cardMenuItem}>그룹 떠나기</Text>
            </MenuItem>
          </Menu>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardTotalPriceArea}>
            <Text style={styles.cardTotalPriceComment}>지출 금액</Text>
            <Text style={styles.cardTotalPrice}>
              {totalPrice}
              <Text style={styles.cardTotalPriceWon}> 원</Text>
            </Text>
          </View>
          <View style={styles.borderLine} />
          <View style={styles.buttonArea}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={() => {
                navigate('SelectReceiptPage');
              }}>
              <Text style={styles.buttonText}>영수증 등록</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={() => {
                navigate('ExpenseHistoryPage', {
                  scheduleId: item.id,
                });
              }}>
              <Text style={styles.buttonText}>지출 내역</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  } else {
    //내가 참가자인 스케줄 카드
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View>
              <Text style={styles.cardTitleText}>{item.name} </Text>
            </View>
            <View style={styles.cardDateArea}>
              <Text style={styles.cardDateText}>
                {startDate} ~ {endDate}
              </Text>
            </View>
          </View>
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

                          const response = await axios.delete(
                            `http://146.56.188.32:8002/participants/${userId}/${item.id}`,
                            {headers},
                          );
                          doRefresh();
                        } catch (err) {
                          console.log(err);
                        }
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
        <View style={styles.cardBody}>
          <View style={styles.cardTotalPriceArea}>
            <Text style={styles.cardTotalPriceComment}>지출 금액</Text>
            <Text style={styles.cardTotalPrice}>
              {totalPrice}
              <Text style={styles.cardTotalPriceWon}> 원</Text>
            </Text>
          </View>
          <View style={styles.borderLine} />
          <View style={styles.buttonArea}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={() => {
                navigate('SelectReceiptPage');
              }}>
              <Text style={styles.buttonText}>영수증 등록</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={() => {
                navigate('ExpenseHistoryPage', {
                  scheduleId: item.id,
                });
              }}>
              <Text style={styles.buttonText}>지출 내역</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    width: Dimensions.get('window').width * 0.9,
    height: 210,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardHeader: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 62,
    backgroundColor: '#F0F0F0',
  },
  cardBody: {
    height: 150,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitleSection: {},
  cardTitleText: {
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#000000',
    marginLeft: 7,
    marginTop: 10,
    fontWeight: 'bold',
  },
  cardDateArea: {},
  cardDateText: {
    fontSize: 13,
    fontFamily: 'Roboto',
    marginLeft: 7,
    color: '#4D483D',
  },
  cardMenu: {
    width: 12,
    fontFamily: 'Roboto',
  },
  cardMenuItem: {
    fontFamily: 'Roboto',
  },
  cardHostIcon: {
    color: '#FFB900',
    marginTop: 12,
  },
  cardTotalPriceArea: {
    width: Dimensions.get('window').width * 0.8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardTotalPriceComment: {
    color: 'black',
    fontFamily: 'Roboto',
    fontSize: 12,
  },
  cardTotalPrice: {
    color: '#21B8CD',
    fontFamily: 'Roboto',

    fontWeight: 'bold',
    fontSize: 16,
  },
  cardTotalPriceWon: {
    color: 'black',
    fontFamily: 'Roboto',
    fontSize: 12,
  },
  cardMenuIcon: {
    color: '#4D483D',
    marginTop: 12,
    marginRight: 8,
  },
  buttonArea: {
    width: Dimensions.get('window').width * 0.75,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: 140,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#21B8CD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 16,
  },
  borderLine: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    width: Dimensions.get('window').width * 0.85,
  },
});

export default ScheduleCard;
