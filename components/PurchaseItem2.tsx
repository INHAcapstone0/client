/* eslint-disable react-hooks/exhaustive-deps */
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
  TextInput,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCrown, faEllipsisV} from '@fortawesome/free-solid-svg-icons';

interface PurchaseItemProps {
  item: any;
  deleteItem: (id: string) => void;
  setTotalPrice: any;
  totalPrice: string;
  calculateTotalPrice: any;
}
function PurchaseItem2({
  item,
  deleteItem,
  setTotalPrice,
  totalPrice,
  calculateTotalPrice,
}: PurchaseItemProps) {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [price, setPrice] = useState(item.price);

  useEffect(() => {
    calculateTotalPrice();
  }, [quantity, price]);
  return (
    <View key={item.id} style={styles.itemCard}>
      <View style={styles.nameSection}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.nameTitle}>이름</Text>
          <Pressable
            onPress={() => {
              deleteItem(item.id);
            }}
            style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>삭제</Text>
          </Pressable>
        </View>
        <View style={styles.nameContainer}>
          <TextInput
            onChangeText={text => {
              setName(text);
              item.name = text;
            }}
            placeholder="결제 항목을 입력해주세요. ex) 샌드위치"
            style={styles.nameContent}
            value={name}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: Dimensions.get('window').width * 0.8,
          marginLeft: 10,
          marginRight: 10,
        }}>
        <View style={styles.quantitySection}>
          <Text style={styles.quantityTitle}>수량</Text>
          <View style={styles.quantityContainer}>
            <TextInput
              onChangeText={text => {
                setQuantity(text);
                item.quantity = text;
              }}
              placeholder="수량"
              style={styles.quantityContent}
              value={quantity}
              keyboardType="number-pad"
            />
          </View>
        </View>
        <View style={styles.priceSection}>
          <Text style={styles.priceTitle}>가격</Text>
          <View style={styles.priceContainer}>
            <TextInput
              onChangeText={text => {
                setPrice(text);
                item.price = text;
                console.log(1);
              }}
              placeholder="가격"
              style={styles.priceContent}
              value={price}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {fontFamily: 'Roboto', fontSize: 18, color: 'black', marginBottom: 10},
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    borderRadius: 8,
    backgroundColor: '#21B8CD',
    width: 50,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: 'white',
  },
  itemCard: {
    width: Dimensions.get('window').width * 0.9,
    borderWidth: 1,
    borderColor: '#F4F4F4',
    borderRadius: 5,
    marginBottom: 15,
  },
  nameTitle: {fontFamily: 'Roboto', fontSize: 13, color: 'black'},
  nameSection: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  nameContainer: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#F6F8FA',
  },
  nameContent: {
    fontFamily: 'Roboto',
    fontSize: 13,
    color: 'black',
    marginLeft: 10,
  },
  quantityTitle: {fontFamily: 'Roboto', fontSize: 13, color: 'black'},
  quantitySection: {
    width: Dimensions.get('window').width * 0.4,
    marginLeft: 5,
    marginRight: 5,
  },
  quantityContainer: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#F6F8FA',
  },
  quantityContent: {
    fontFamily: 'Roboto',
    fontSize: 13,
    color: 'black',
    marginLeft: 10,
  },
  priceTitle: {fontFamily: 'Roboto', fontSize: 13, color: 'black'},
  priceSection: {
    width: Dimensions.get('window').width * 0.4,
    marginLeft: 5,
    marginRight: 5,
  },
  priceContainer: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#F6F8FA',
  },
  priceContent: {
    fontFamily: 'Roboto',
    fontSize: 13,
    color: 'black',
    marginLeft: 10,
  },
});

export default PurchaseItem2;
