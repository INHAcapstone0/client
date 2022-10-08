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
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCrown, faEllipsisV} from '@fortawesome/free-solid-svg-icons';

interface ParticipantCardProps {
  item: any;
}
function ParticipantCard({item}: ParticipantCardProps) {
  return (
    <View style={styles.card}>
      <Image style={styles.userImage} source={{uri: item.User.img_url}} />
      <Text style={styles.userName}>
        {'   '}
        {item.User.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginLeft: 20,
    flexDirection: 'row',
  },
  userName: {
    height: 60,
    color: '#4D483D',
    fontFamily: 'Roboto',
    fontSize: 16,
    marginTop: 10,
  },
  forRadius: {
    borderRadius: 30,
  },
  userImage: {
    borderRadius: 30,
    width: 54,
    height: 54,
  },
});

export default ParticipantCard;
