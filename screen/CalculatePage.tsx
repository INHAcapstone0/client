/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

const dummyData1 = [
  {
    img: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
    message: '관리자님께 제주도여행 모임에서 15,000원 입금 받으세요',
    check: false,
    id: 1,
  },
  {
    img: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
    message: '관리자님께 제주도여행 모임에서 15,000원 입금 받으세요',
    check: false,
    id: 2,
  },
  {
    img: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
    message: '관리자님께 제주도여행 모임에서 15,000원 입금 받으세요',
    check: false,
    id: 3,
  },
];

const dummyData2 = [
  {
    img: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
    message: '관리자님께 제주도여행 모임에서 15,000원 입금 하세요',
    check: false,
    id: 1,
  },
  {
    img: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
    message: '관리자님께 제주도여행 모임에서 15,000원 입금 하세요',
    check: false,
    id: 2,
  },
  {
    img: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
    message: '관리자님께 제주도여행 모임에서 15,000원 입금 하세요',
    check: false,
    id: 3,
  },
];

function CalculatePage({navigation}: any) {
  return (
    <ScrollView style={styles.calculatePage}>
      <View style={styles.calculateContainer}>
        <Text style={styles.calculateLabel}>입금 받아야해요</Text>
        {dummyData1.map((data: any) => (
          <TouchableOpacity
            style={styles.calculateWrapper}
            // onPress={removeToGroupMember(user)}
            key={data.id}>
            <Image
              key={data.id}
              style={styles.calculateImage}
              source={{
                uri: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
              }}
            />
            <Text style={styles.calculateText} key={data.id}>
              {data.message}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.calculateBorder} />
      <View style={styles.calculateContainer}>
        <Text style={styles.calculateLabel}>입금 해야해요</Text>
        {dummyData2.map((data: any) => (
          <TouchableOpacity
            style={styles.calculateWrapper}
            // onPress={removeToGroupMember(user)}
            key={data.id}>
            <Image
              key={data.id}
              style={styles.calculateImage}
              source={{
                uri: 'https://lh5.googleusercontent.com/p/AF1QipM_lDM0kwc5PF7mehKIdu4UyMyUTzBYlrl8IAsB=w408-h544-k-no',
              }}
            />
            <Text style={styles.calculateText} key={data.id}>
              {data.message}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  calculatePage: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  calculateContainer: {
    paddingBottom: 20,
  },
  calculateLabel: {
    fontSize: 20,
    color: '#3E382F',
    fontWeight: '400',
    paddingTop: 20,
    paddingBottom: 10,
  },
  calculateBorder: {
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  calculateWrapper: {
    paddingTop: 8,
    paddingBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  calculateImage: {
    width: 54,
    height: 54,
    borderRadius: 30,
  },
  calculateText: {
    width: '100%',
    paddingLeft: 15,
    fontSize: 13,
    fontWeight: '400',
    color: '#000000',
    flexShrink: 1,
  },
});
export default CalculatePage;
