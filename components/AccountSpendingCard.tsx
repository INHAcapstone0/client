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
} from 'react-native';
import {faCircleQuestion} from '@fortawesome/free-regular-svg-icons';
import {
  faMugHot,
  faUtensils,
  faHotel,
  faCartShopping,
  faStore,
  faSchool,
  faSquareParking,
  faGasPump,
  faTrainSubway,
  faMoneyBills,
  faCapsules,
  faPalette,
  faBuilding,
  faMountainSun,
  faHospital,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

interface ReceiptCardProps {
  // item: any;
  // scheduleId: any;
  // category: any;
  navigation: any;
}
function AccountSpendingCard({
  // item,
  // scheduleId,
  // // category,
  navigation: {navigate},
}: any) {
  const [payDate, setPayDate] = useState('2022-01-02T15:01:10.000Z');
  const pressReceipt = () => {
    // navigate('ReceiptInfoPage', {
    //   receiptId: item.id,
    // });
  };
  // const [totalPrice, setTotalPrice] = useState(
  //   item.total_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  // );
  useEffect(() => {
    // setPayDate(item.payDate.substring(0, 10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveToAccountReceiptUploadPage = () => {
    // navigate('AccountReceiptUploadPage', {
    //   data: null,
    //   // scheduleId: scheduleId,
    // });
    navigate('AccountReceiptUploadPage');
  };

  return (
    <Pressable
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={() => {
        moveToAccountReceiptUploadPage();
      }}>
      <View style={styles.card}>
        {/* <FontAwesomeIcon icon={faUtensils} style={styles.icon} size={35} /> */}
        <View style={styles.content}>
          {/* <Text style={styles.place}>{item.place}</Text> */}
          <Text style={styles.place}>투썸플레이스 인하대</Text>

          <View style={styles.detailContent}>
            {/* <Text style={styles.date}>{payDate}</Text> */}
            <Text style={styles.date}>2022-11-2</Text>
            <Text style={styles.price}>
              {/* {totalPrice} <Text style={styles.won}>원</Text> */}
              4500 <Text style={styles.won}>원</Text>
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.borderLine} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    // marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    width: Dimensions.get('window').width * 0.95,
    flexDirection: 'row',
  },
  content: {
    marginLeft: 10,
  },
  detailContent: {
    width: Dimensions.get('window').width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    marginTop: 7,
    color: '#21B8CD',
  },
  place: {
    paddingTop: 5,
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Roboto',
  },
  date: {
    fontSize: 12,
    color: '#7C7C7C',
    fontFamily: 'Roboto',
  },
  price: {
    fontSize: 16,
    color: '#21B8CD',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  won: {
    color: '#000000',
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  borderLine: {
    height: 1,
    backgroundColor: '#E1E1E1',
    width: Dimensions.get('window').width * 0.9,
  },
});

export default AccountSpendingCard;
