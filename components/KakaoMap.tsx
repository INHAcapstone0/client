/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';

class KakaoMap extends Component {
  render() {
    return (
      <WebView
        source={{
          // uri: 'http://192.168.56.1:3000/',
          uri: 'https://www.naver.com/',
        }}
        style={styles.webview}
      />
    );
  }
}

// function KakaoMap() {
//   return (
//     <View style={styles.container}>
//       <WebView
//         source={{uri: 'https://www.google.co.kr/'}}
//         style={styles.webview}
//       />
//     </View>
//   );
// }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    width: '100%',
    height: '100%',
  },
  webview: {
    height: 500,
    width: '100%',
  },
});

export default KakaoMap;
