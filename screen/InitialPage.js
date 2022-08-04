import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import CustomButton from './CustomButton';

function InitialPage({navigation}) {
  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <Text style={styles.text}>어플을 처음 이용하시나요?</Text>
          <CustomButton
            title={'회원가입'}
            onPress={() => navigation.navigate('Signin')}
          />
          <Text style={styles.text}>계정을 이미 등록하셨나요?</Text>
          <CustomButton
            title={'로그인'}
            onPress={() => navigation.navigate('Login')}
          />
          <Text style={styles.socialLoginTitle}>소셜 로그인</Text>
        </View>
        <View style={styles.socialLoginIcons}>
          <CustomButton title={'NaverIcon'} />
          <CustomButton title={'KakaoIcon'} />
          <CustomButton title={'AppleIcon'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#3E382F',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 90,
    marginBottom: 60,
  },
  socialLoginTitle: {
    color: '#B0A69D',
    fontSize: 14,
    marginTop: 100,
    marginBottom: 20,
  },
  socialLoginIcons: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
  },
});

export default InitialPage;
