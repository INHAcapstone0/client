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
  item: any;
  route: any;
}
function ReceiptCard({item, route}: ReceiptCardProps) {
  const [payDate, setPayDate] = useState('2022-01-02T15:01:10.000Z');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPayDate(item.payDate.substring(0, 10));
  });

  if (item.category === '음식점') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faUtensils} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '카페') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faMugHot} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '숙박업소' || item.category === '숙박') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faHotel} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '대형마트') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faCartShopping} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '편의점') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faStore} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '어린이집, 유치원') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faSchool} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '주유소, 충전소') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faGasPump} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '지하철역') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faTrainSubway} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '주차장') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faSquareParking} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '은행') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faMoneyBills} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '문화시설') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faPalette} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '중개업소' || item.category === '공공기관') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faBuilding} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '관광명소') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faMountainSun} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '병원') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faHospital} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else if (item.category === '약국') {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
        <FontAwesomeIcon icon={faCapsules} style={styles.icon} size={35} />
        <View style={styles.content}>
          <Text style={styles.place}>{item.place_of_payment}</Text>

          <View style={styles.detailContent}>
            <Text style={styles.date}>{payDate}</Text>
            <Text style={styles.price}>{item.total_price} 원</Text>
          </View>
        </View>
      </Pressable>
    );
  } else {
    //기타
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          route.navigation.navigate('ReceiptInfoPage', {
            receiptId: item.id,
          });
        }}>
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
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    width: Dimensions.get('window').width * 0.95,
    flexDirection: 'row',
  },
  content: {
    marginLeft: 10,
  },
  detailContent: {
    width: Dimensions.get('window').width * 0.8,
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
