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
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import {faCircleQuestion} from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import {Menu, MenuItem} from 'react-native-material-menu';
import BottomSheet from 'reanimated-bottom-sheet';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../store/Store';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {accountAction} from '../slices/Account';
import axiosInstance from '../utils/interceptor';

interface AccountSettingCardProps {
  item: any;
  setSelectedFinNum: (funNum: any) => void;
  openDeleteModal: () => void;
  //doRefresh: () => void;
  //openModal: () => void;
  //closeModal: () => void;
  //deleteAccount: () => void;
  //navigation: any;
  //setFinNum: (finNum: any) => void;
}
function AccountSettingCard({
  item,
  setSelectedFinNum,
  openDeleteModal,
}: //doRefresh,
//openModal,
//closeModal,
//deleteAccount,
//setFinNum,
//navigation: {navigate},
AccountSettingCardProps) {
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
  if (item.bank_name === '하나은행') {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 15,
                  height: 15,
                  marginLeft: 7,
                  marginTop: 10,
                }}
                source={require('../resources/bankIcon/Hana.png')}
              />
              <Text style={styles.cardAccountName}>{item.account_alias}</Text>
            </View>
          </View>
          <Menu
            visible={visible}
            anchor={
              <Pressable onPress={openMenu}>
                <FontAwesomeIcon
                  style={styles.cardMenuIcon}
                  icon={faEllipsisV}
                />
              </Pressable>
            }
            onRequestClose={closeMenu}>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedFinNum(item.fintech_use_num);
                openDeleteModal();
              }}>
              <Text style={styles.cardMenuItem}>계좌 삭제하기</Text>
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
  } else if (item.bank_name === '카카오은행') {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 15,
                  height: 15,
                  marginLeft: 7,
                  marginTop: 10,
                }}
                source={require('../resources/bankIcon/KakaoBank.png')}
              />
              <Text style={styles.cardAccountName}>{item.account_alias}</Text>
            </View>
          </View>
          <Menu
            visible={visible}
            anchor={
              <Pressable onPress={openMenu}>
                <FontAwesomeIcon
                  style={styles.cardMenuIcon}
                  icon={faEllipsisV}
                />
              </Pressable>
            }
            onRequestClose={closeMenu}>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedFinNum(item.fintech_use_num);
                openDeleteModal();
              }}>
              <Text style={styles.cardMenuItem}>계좌 삭제하기</Text>
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
  } else if (item.bank_name === '우체국') {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 20,
                  height: 10,
                  marginLeft: 7,
                  marginTop: 10,
                }}
                source={require('../resources/bankIcon/Epost.png')}
              />
              <Text style={styles.cardAccountName}>{item.account_alias}</Text>
            </View>
          </View>
          <Menu
            visible={visible}
            anchor={
              <Pressable onPress={openMenu}>
                <FontAwesomeIcon
                  style={styles.cardMenuIcon}
                  icon={faEllipsisV}
                />
              </Pressable>
            }
            onRequestClose={closeMenu}>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedFinNum(item.fintech_use_num);
                openDeleteModal();
              }}>
              <Text style={styles.cardMenuItem}>계좌 삭제하기</Text>
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
  } else if (item.bank_name === 'IBK기업은행') {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: 7,
                  marginTop: 10,
                }}
                source={require('../resources/bankIcon/IBK.png')}
              />
              <Text style={styles.cardAccountName}>{item.account_alias}</Text>
            </View>
          </View>
          <Menu
            visible={visible}
            anchor={
              <Pressable onPress={openMenu}>
                <FontAwesomeIcon
                  style={styles.cardMenuIcon}
                  icon={faEllipsisV}
                />
              </Pressable>
            }
            onRequestClose={closeMenu}>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedFinNum(item.fintech_use_num);
                openDeleteModal();
              }}>
              <Text style={styles.cardMenuItem}>계좌 삭제하기</Text>
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
  } else if (item.bank_name === 'KB국민은행') {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 18,
                  height: 12,
                  marginLeft: 7,
                  marginTop: 10,
                }}
                source={require('../resources/bankIcon/KbStar.png')}
              />
              <Text style={styles.cardAccountName}>{item.account_alias}</Text>
            </View>
          </View>
          <Menu
            visible={visible}
            anchor={
              <Pressable onPress={openMenu}>
                <FontAwesomeIcon
                  style={styles.cardMenuIcon}
                  icon={faEllipsisV}
                />
              </Pressable>
            }
            onRequestClose={closeMenu}>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedFinNum(item.fintech_use_num);
                openDeleteModal();
              }}>
              <Text style={styles.cardMenuItem}>계좌 삭제하기</Text>
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
  } else if (item.bank_name === '농협은행') {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 24,
                  height: 8,
                  marginLeft: 7,
                  marginTop: 10,
                }}
                source={require('../resources/bankIcon/NH.png')}
              />
              <Text style={styles.cardAccountName}>{item.account_alias}</Text>
            </View>
          </View>
          <Menu
            visible={visible}
            anchor={
              <Pressable onPress={openMenu}>
                <FontAwesomeIcon
                  style={styles.cardMenuIcon}
                  icon={faEllipsisV}
                />
              </Pressable>
            }
            onRequestClose={closeMenu}>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedFinNum(item.fintech_use_num);
                openDeleteModal();
              }}>
              <Text style={styles.cardMenuItem}>계좌 삭제하기</Text>
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
  } else if (item.bank_name === '신한은행') {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 15,
                  height: 15,
                  marginLeft: 7,
                  marginTop: 10,
                }}
                source={require('../resources/bankIcon/Shinhan.png')}
              />
              <Text style={styles.cardAccountName}>{item.account_alias}</Text>
            </View>
          </View>
          <Menu
            visible={visible}
            anchor={
              <Pressable onPress={openMenu}>
                <FontAwesomeIcon
                  style={styles.cardMenuIcon}
                  icon={faEllipsisV}
                />
              </Pressable>
            }
            onRequestClose={closeMenu}>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedFinNum(item.fintech_use_num);
                openDeleteModal();
              }}>
              <Text style={styles.cardMenuItem}>계좌 삭제하기</Text>
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
  } else if (item.bank_name === '우리은행') {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 15,
                  height: 15,
                  marginLeft: 7,
                  marginTop: 10,
                }}
                source={require('../resources/bankIcon/Woori.png')}
              />
              <Text style={styles.cardAccountName}>{item.account_alias}</Text>
            </View>
          </View>
          <Menu
            visible={visible}
            anchor={
              <Pressable onPress={openMenu}>
                <FontAwesomeIcon
                  style={styles.cardMenuIcon}
                  icon={faEllipsisV}
                />
              </Pressable>
            }
            onRequestClose={closeMenu}>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedFinNum(item.fintech_use_num);
                openDeleteModal();
              }}>
              <Text style={styles.cardMenuItem}>계좌 삭제하기</Text>
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
  } else {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <FontAwesomeIcon
                style={styles.cardOtherAccountIcon}
                icon={faCircleQuestion}
              />
              <Text style={styles.cardAccountName}>{item.account_alias}</Text>
            </View>
          </View>
          <Menu
            visible={visible}
            anchor={
              <Pressable onPress={openMenu}>
                <FontAwesomeIcon
                  style={styles.cardMenuIcon}
                  icon={faEllipsisV}
                />
              </Pressable>
            }
            onRequestClose={closeMenu}>
            <MenuItem
              onPress={() => {
                closeMenu();
                setSelectedFinNum(item.fintech_use_num);
                openDeleteModal();
              }}>
              <Text style={styles.cardMenuItem}>계좌 삭제하기</Text>
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
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
  },
  cardHeader: {
    height: 40,
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
  cardAccountLogo: {
    marginLeft: 7,
    marginTop: 10,
  },
  cardAccountName: {
    fontSize: 13,
    fontFamily: 'Roboto',
    color: '#000000',
    marginLeft: 7,
    marginTop: 10,
    fontWeight: 'bold',
  },
  cardAccountNumberArea: {},
  cardAccountNumber: {
    fontSize: 11,
    fontFamily: 'Roboto',
    marginTop: 2,
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
    fontWeight: 'bold',
    fontSize: 15,
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
  cardOtherAccountIcon: {
    color: '#4D483D',
    marginTop: 12,
    marginLeft: 7,
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

export default AccountSettingCard;
