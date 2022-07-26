/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
  Dimensions,
  Image,
  Touchable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from 'axios';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import ScheduleCard from '../components/ScheduleCard';
import BottomComponent from '../components/BottomComponent';
import {useSelector} from 'react-redux';
import {RootState} from '../store/Store';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlaneDeparture, faSuitcase} from '@fortawesome/free-solid-svg-icons';
import ReceiptCard from '../components/ReceiptCard';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {configureStore} from '@reduxjs/toolkit';
import Modal from 'react-native-modal';
import WebView from 'react-native-webview';
import AutoHeightImage from '../components/AutoHeightImage';
import EncryptedStorage from 'react-native-encrypted-storage';
import axiosInstance from '../utils/interceptor';

function ReceiptInfoPage(route: any) {
  const userId = useSelector((state: RootState) => state.persist.user.id);
  const [modalVisible, setModalVisible] = useState(false);
  const [receiptId, setReceiptId] = useState(route.route.params.receiptId);
  const [receiptImg, setReceiptImg] = useState('');
  const [receiptInfo, setReceiptInfo] = useState<{
    address: string;
    category: string;
    place: string;
    total_price: number;
    memo: string;
    payDate: string;
    tel: string;
    img_url: string;
  }>({
    address: '',
    category: '',
    place: '',
    total_price: 0,
    memo: '',
    tel: '정보없음',
    payDate: '2022-03-04T00:09:09.000Z',
    img_url: '', //대체 이미지 추가
  });

  const [itemInfo, setItemInfo] = useState([]);

  const [totalPrice, setTotalPrice] = useState('0');

  useEffect(() => {
    getReceiptInfo();
    getItemInfo();
    //setTimeout(() => drawMap(receiptInfo.address), 1000);
  }, [receiptImg]);

  const getReceiptInfo = async () => {
    try {
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axiosInstance.get(
        `http://146.56.190.78/receipts/${receiptId}`,
        {
          headers,
        },
      );
      console.log('receipt info ', response.data);
      console.log('response.data.img_url ', response.data.img_url);
      setReceiptInfo(response.data);
      setReceiptImg(response.data.img_url);
      //setReceiptImg('https://t1.daumcdn.net/cfile/tistory/991AFB395BACD90735');
      setTotalPrice(
        response.data.total_price
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      );
      drawMap(response.data.address);
    } catch (err: AxiosError | any) {
      console.log(err);
    }
  };

  const getItemInfo = async () => {
    try {
      console.log('receiptId is ', receiptId);
      const accessToken = await EncryptedStorage.getItem('accessToken');
      const params = {
        receipt_id: receiptId,
      };
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axiosInstance.get('http://146.56.190.78/items', {
        params,
        headers,
      });
      console.log('item data ', response.data);
      setItemInfo(response.data);
    } catch (err: AxiosError | any) {
      console.log('item error');
      console.log(err);
    }
  };

  const mapViewRef = useRef<WebView>(null);
  const drawMap = (address: string) => {
    setTimeout(() => mapViewRef.current?.postMessage(address), 500);
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>지출 상세정보</Text>
      </View>
      <ScrollView style={styles.window} removeClippedSubviews={true}>
        <View style={styles.titleSection}>
          <View style={styles.titleTextSection}>
            <Text style={styles.itemTitle}>{receiptInfo.place}</Text>
            <Text style={styles.memo}>
              {'\n'}
              {receiptInfo.memo}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              console.log('[' + receiptImg + ']');
              if (receiptImg !== '') {
                setModalVisible(true);
              }
            }}>
            {receiptImg !== '' && (
              <Image style={styles.receiptImage} source={{uri: receiptImg}} />
            )}
            {receiptImg === '' && (
              <Image
                style={styles.receiptImage}
                source={require('../resources/icons/noReceiptImage.png')}
              />
            )}
          </Pressable>
        </View>
        <Modal isVisible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Pressable onPress={() => setModalVisible(false)}>
                  <FontAwesomeIcon
                    style={styles.modalCloseButton}
                    icon={faXmark}
                    size={30}
                  />
                </Pressable>
              </View>
              <AutoHeightImage path={receiptImg} />
            </View>
          </View>
        </Modal>
        <View style={styles.centerSection}>
          <View style={styles.borderLine} />
        </View>
        <View style={styles.itemSection}>
          <View style={styles.itemAlign}>
            <Text style={styles.itemText}>결제 시각</Text>
            <View style={styles.item}>
              <Text style={styles.itemText}>
                {receiptInfo.payDate.substring(0, 10)}{' '}
                {receiptInfo.payDate.substring(11, 19)}
              </Text>
            </View>
          </View>
          <View style={styles.itemAlign}>
            <Text style={styles.itemText}>결제 금액</Text>
            <View style={styles.item}>
              <Text style={styles.itemText}>{totalPrice}원</Text>
            </View>
          </View>
        </View>
        <View style={styles.centerSection}>
          <View style={styles.borderLine} />
        </View>
        <View style={styles.itemSection}>
          <View style={styles.itemAlign}>
            <Text style={styles.itemText}>결제처</Text>
            <View style={styles.item}>
              <Text style={styles.itemText}>{receiptInfo.place}</Text>
            </View>
          </View>
          <View style={styles.itemAlign}>
            <Text style={styles.itemText}>결제처 구분</Text>
            <View style={styles.item}>
              <Text style={styles.itemText}>{receiptInfo.category}</Text>
            </View>
          </View>
          <View style={styles.itemAlign}>
            <Text style={styles.itemText}>주소</Text>
            <View style={styles.item}>
              <Text style={styles.itemText}>{receiptInfo.address}</Text>
            </View>
          </View>
          <View style={styles.itemAlign}>
            <Text style={styles.itemText}>전화번호</Text>
            <View style={styles.item}>
              <Text style={styles.itemText}>{receiptInfo.tel}</Text>
            </View>
          </View>
        </View>
        <View style={styles.centerSection}>
          <View
            style={{
              borderWidth: 2,
              borderRadius: 3,
              borderColor: '#21B8CD',
              width: Dimensions.get('window').width * 0.9,
              height: 195,
              marginBottom: 20,
            }}>
            <WebView
              ref={mapViewRef}
              source={{uri: 'http://146.56.190.78/webview/'}}
              style={{
                width: Dimensions.get('window').width * 0.9,
                height: 200,
                opacity: 0.99,
              }}
            />
          </View>
        </View>
        <View style={styles.centerSection}>
          <View style={styles.borderLine} />
        </View>
        {itemInfo.length != 0 && (
          <View>
            <View style={styles.itemAlign}>
              <Text style={styles.itemText}>구매 목록</Text>
            </View>
            <View style={styles.itemAlign}>
              <Text style={styles.itemText}>품명</Text>
              <Text style={styles.itemText}>수량</Text>
              <Text style={styles.itemText}>가격</Text>
            </View>
            <View style={styles.receiptItemSection}>
              {itemInfo.map((item: any) => {
                return (
                  <View
                    key={item.name + item.quantity + item.price}
                    style={styles.receiptItemRight}>
                    <View style={styles.receiptItemLeft}>
                      <Text style={styles.itemText}>{item.name}</Text>
                      <Text style={styles.itemText}>{item.quantity}</Text>
                    </View>
                    <Text style={styles.itemText}>{item.price}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
        <View style={styles.centerSection}>
          <View style={styles.borderLine} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  headerTitle: {color: 'black', fontSize: 16, fontFamily: 'Roboto'},
  window: {
    backgroundColor: '#FFFFFF',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
  },
  titleSection: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleTextSection: {
    width: Dimensions.get('window').width * 0.55,
    marginLeft: 30,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  receiptImage: {
    backgroundColor: 'white',
    width: 95,
    height: 95,
    marginLeft: 10,
    marginRight: 30,
    marginTop: 20,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  centerSection: {
    alignItems: 'center',
  },
  borderLine: {
    height: 1,
    backgroundColor: '#21B8CD',
    width: Dimensions.get('window').width * 0.9,
  },
  itemSection: {
    width: Dimensions.get('window').width,
  },
  itemAlign: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 15,
  },
  item: {
    width: Dimensions.get('window').width * 0.6,
  },
  itemTitle: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: '#000000',
  },
  itemText: {
    fontFamily: 'Roboto',
    fontSize: 15,
    color: '#000000',
    textAlign: 'right',
  },
  receiptItemSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  receiptItemLeft: {
    width: Dimensions.get('window').width * 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptItemRight: {
    width: Dimensions.get('window').width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  memo: {
    fontFamily: 'Roboto',
    fontSize: 15,
    color: '#000000',
  },
  bigReceipt: {
    height: Dimensions.get('window').width * 0.7,
    marginTop: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: Dimensions.get('window').width * 0.8,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: Dimensions.get('window').width * 0.7,
    flexDirection: 'row-reverse',
  },
  modalCloseButton: {
    color: '#21B8CD',
  },
  webview: {},
});
export default ReceiptInfoPage;
