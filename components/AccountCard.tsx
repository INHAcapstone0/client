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
import {Menu, MenuItem} from 'react-native-material-menu';
import BottomSheet from 'reanimated-bottom-sheet';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../store/Store';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {accountAction} from '../slices/Account';
import axiosInstance from '../utils/interceptor';

interface ScheduleCardProps {
  item: any;
  setSelectedScheduleId: (scheduleId: any) => void;
  setBottomModalType: (modalType: string) => void;
  openBottomModal: () => void;
  doRefresh: () => void;
  openModal: () => void;
  closeModal: () => void;
  deleteAccount: () => void;
  navigation: any;
  dateStart: any;
  dateEnd: any;
  setFinNum: (finNum: any) => void;
}
function AccountCard({
  item,
  setSelectedScheduleId,
  setBottomModalType,
  openBottomModal,
  doRefresh,
  openModal,
  closeModal,
  deleteAccount,
  setFinNum,
  navigation: {navigate},
  dateStart,
  dateEnd,
}: ScheduleCardProps) {
  const accessToken = useSelector(
    (state: RootState) => state.persist.user.accessToken,
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const userId = useSelector((state: RootState) => state.persist.user.id);

  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState('0');

  const openMenu = () => setVisible(true);
  const closeMenu = () => {
    setVisible(false);
  };
  const [ownerFlag, setOwnerFlag] = useState(false);

  const [visible, setVisible] = useState(false);
  const dispatch = useAppDispatch();

  const moveToAccountHistoryPage = () => {
    console.log('dateStart', dateStart);
    const startDate = dateStart.replace(/\-/g, '');
    const endDate = dateEnd.replace(/\-/g, '');

    console.log(startDate);
    console.log(endDate);

    dispatch(
      accountAction.setAccount({
        finNum: item.fintech_use_num,
        start: startDate,
        end: endDate,
        name: item.bank_name,
      }),
    );
    setTimeout(() => {
      navigate('AccountHistoryPage');
    }, 1000);
  };

  // const deleteAccount = async () => {
  //   try {
  //     const response = await axiosInstance.post(
  //       'http://146.56.190.78/extra/account/cancel',
  //       {
  //         fintech_use_num: item.fintech_use_num,
  //       },
  //     );
  //     console.log('response', response);
  //     return response.data;
  //   } catch (err: any) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   console.log('item.id', item.id);
  //   if (userId === item.owner_id) {
  //     setOwnerFlag(true);
  //   }

  //   if (item.total_pay != null) {
  //     setTotalPrice(
  //       item.total_pay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  //     );
  //   }
  //   setStartDate(item.startAt.substring(0, 10));
  //   setEndDate(item.endAt.substring(0, 10));
  // }, []);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <View>
            <Text style={styles.cardTitleText}>
              <Image
                source={
                  item.bank_name.includes('카카오')
                    ? require('../resources/icons/KaKaoBank.png')
                    : null
                }
              />
              &nbsp;{item.bank_name}
            </Text>
          </View>
          <View style={styles.cardDateArea}>
            <Text style={styles.cardDateText}>
              {/* {dateStart} ~ {dateEnd} */}
              2022-11.01~2022-11.03
            </Text>
          </View>
        </View>
        <Menu
          visible={visible}
          anchor={
            <Pressable onPress={openMenu}>
              <FontAwesomeIcon style={styles.cardMenuIcon} icon={faEllipsisV} />
            </Pressable>
          }
          onRequestClose={closeMenu}>
          <MenuItem
            onPress={() => {
              setFinNum(item.fintech_use_num);
              openModal();
              // closeMenu();
              // setSelectedScheduleId(item.id);
              // setBottomModalType('멤버목록_호스트');
              // openBottomModal();
            }}>
            <Text style={styles.cardMenuItem}>계좌 삭제하기</Text>
          </MenuItem>
          <MenuItem
            onPress={() => {
              moveToAccountHistoryPage();
            }}>
            <Text style={styles.cardMenuItem}>지출 내역보기</Text>
          </MenuItem>
        </Menu>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTotalPriceArea}>
          <Text style={styles.cardTotalPriceComment}>계좌번호</Text>
          <Text style={styles.cardTotalPrice}>{item.account_num_masked}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainerForMember: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    width: 325,
    height: 195,
  },
  modalButtonArea: {
    marginTop: 20,
    flexDirection: 'row',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
  },
  modalButton: {
    width: 80,
    height: 40,
    backgroundColor: '#21B8CD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  modalComment: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: 'black',
  },
  card: {
    borderRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
    shadowColor: '#bebaba',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardHeader: {
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F0F0',
  },
  cardBody: {
    height: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTotalPriceComment: {
    color: 'black',
    fontFamily: 'Roboto',
    fontSize: 12,
    marginLeft: 5,
  },
  cardTotalPrice: {
    color: '#21B8CD',
    fontFamily: 'Roboto',
    marginLeft: 5,
    paddingBottom: 5,
    fontWeight: 'bold',
    fontSize: 20,
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

export default AccountCard;
