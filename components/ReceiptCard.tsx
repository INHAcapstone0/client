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
  category: any;
  navigation: any;
}
function ReceiptCard({
  item,
  route,
  category,
  navigation: {navigate},
}: ReceiptCardProps) {
  const [payDate, setPayDate] = useState('2022-01-02T15:01:10.000Z');
  const pressReceipt = () => {
    navigate('ReceiptInfoPage', {
      receiptId: item.id,
    });
  };
  const [totalPrice, setTotalPrice] = useState(
    item.total_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  );
  useEffect(() => {
    setPayDate(item.payDate.substring(0, 10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    (category === '전체' || category === '음식점') &&
    item.category === '음식점'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon icon={faUtensils} style={styles.icon} size={35} />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '카페') &&
    item.category === '카페'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon icon={faMugHot} style={styles.icon} size={35} />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '숙박') &&
    item.category === '숙박'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon icon={faHotel} style={styles.icon} size={35} />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '대형마트') &&
    item.category === '대형마트'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon
            icon={faCartShopping}
            style={styles.icon}
            size={35}
          />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '편의점') &&
    item.category === '편의점'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon icon={faStore} style={styles.icon} size={35} />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '어린이집, 유치원') &&
    item.category === '어린이집, 유치원'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon icon={faSchool} style={styles.icon} size={35} />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '주유소, 충전소') &&
    item.category === '주유소, 충전소'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon icon={faSchool} style={styles.icon} size={35} />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '지하철역') &&
    item.category === '지하철역'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon icon={faTrainSubway} style={styles.icon} size={35} />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '주차장') &&
    item.category === '주차장'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon
            icon={faSquareParking}
            style={styles.icon}
            size={35}
          />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '은행') &&
    item.category === '은행'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon icon={faMoneyBills} style={styles.icon} size={35} />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '문화시설') &&
    item.category === '문화시설'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon icon={faPalette} style={styles.icon} size={35} />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    ((category === '전체' ||
      category === '중개업소' ||
      category === '공공기관') &&
      item.category === '중개업소') ||
    item.category === '공공기관'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon icon={faBuilding} style={styles.icon} size={35} />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '관광명소') &&
    item.category === '관광명소'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon icon={faMountainSun} style={styles.icon} size={35} />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '병원') &&
    item.category === '병원'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon icon={faHospital} style={styles.icon} size={35} />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '약국') &&
    item.category === '약국'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon icon={faCapsules} style={styles.icon} size={35} />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else if (
    (category === '전체' || category === '기타') &&
    item.category === '기타'
  ) {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          pressReceipt();
        }}>
        <View style={styles.card}>
          <FontAwesomeIcon
            icon={faCircleQuestion}
            style={styles.icon}
            size={35}
          />
          <View style={styles.content}>
            <Text style={styles.place}>{item.place}</Text>

            <View style={styles.detailContent}>
              <Text style={styles.date}>{payDate}</Text>
              <Text style={styles.price}>
                {totalPrice} <Text style={styles.won}>원</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.borderLine} />
      </Pressable>
    );
  } else {
    //기타
    return <View />;
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

export default ReceiptCard;
