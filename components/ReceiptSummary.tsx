import React, {Component, useState, useRef} from 'react';
import {TouchableOpacity,View, Text, StyleSheet, Image,Dimensions, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import {Card, Button as PaperButton, Menu, Provider as PaperProvider} from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons'
import RBSheet from "react-native-raw-bottom-sheet";
import { ScrollView } from 'react-native-gesture-handler';
import { any } from 'prop-types';
import BottomSheet from 'reanimated-bottom-sheet';

interface ReceiptSummaryProps{
  item: any
}
function ReceiptSummary({item}:ReceiptSummaryProps) {
  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 450,
      }}
    >
      <Text>Swipe down to close</Text>
    </View>
  );
  const sheetRef = useRef<BottomSheet>(null);

    return(
      <>
      <View
        style={{
          flex: 1,
          backgroundColor: 'papayawhip',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          title="Open Bottom Sheet"
          onPress={() => sheetRef.current!.snapTo(0)}
        />
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[450, 300, 0]}
        borderRadius={10}
        renderContent={renderContent}
      />
    </>

  );
    
}

export default ReceiptSummary;
