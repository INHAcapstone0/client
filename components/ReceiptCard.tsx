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
import {faCircleQuestion} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

interface ReceiptCardProps {
  item: any;
}
function ReceiptCard({item}: ReceiptCardProps) {
  const [payDate, setPayDate] = useState('');
  const [iconType, setIconType] = useState();

  useEffect(() => {
    setPayDate(item.payDate.substring(0, 10));
  }, [item.payDate]);

  if (item.category === '기타') {
    return (
      <View style={styles.card}>
        <FontAwesomeIcon
          icon={faCircleQuestion}
          style={styles.icon}
          size={35}
        />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </View>
    );
  } else {
    return <View />;
  }
}

const styles = StyleSheet.create({
  card: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    width: Dimensions.get('window').width * 0.8,
    flexDirection: 'row',
  },
  content: {
    marginLeft: 10,
  },
  detailContent: {
    width: Dimensions.get('window').width * 0.7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    marginTop: 7,
    color: '#4D483D',
  },
  place: {
    fontSize: 18,
    color: '#4D483D',
    fontFamily: 'Jalnan',
  },
  date: {
    color: '#4D483D',
    fontFamily: 'Jalnan',
  },
  price: {
    color: '#4D483D',
    fontFamily: 'Jalnan',
  },
});

export default ReceiptCard;
