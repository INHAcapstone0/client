/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Component, useRef, useState} from 'react';
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
import {faCrown, faEllipsisV} from '@fortawesome/free-solid-svg-icons';

interface ParticipantCardProps {
  item: any;
}
function ParticipantCard({item}: ParticipantCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.userName}>
        <Image style={styles.userImage} source={{uri: item.User.img_url}} />
        {'   '}
        {item.User.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginLeft: 20,
  },
  userName: {
    height: 60,
    color: '#4D483D',
    fontFamily: 'Jalnan',
  },
  userImage: {
    width: 40,
    height: 40,
  },
});

export default ParticipantCard;
