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

function Signin()
{
    return (
        <SafeAreaView>
        <StatusBar />
        <ScrollView
            contentInsetAdjustmentBehavior="automatic">
            <View style={styles.container}>
              <Text>회원가입 페이지</Text>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
     flex: 1,
     justifyContent: "center",
     alignItems: "center",
    },
    text:{
     color:"#3E382F",
     fontSize: 24,
     fontWeight: 'bold',
     marginTop:90,
     marginBottom:60,
    },
    socialLoginTitle:{
      color: '#B0A69D',
      fontSize: 14,
      marginTop: 100,
      marginBottom: 20,
    },
    socialLoginIcons:{
     justifyContent: "center",
     flex:1,
     flexDirection:"row",
    }
  });
  
export default Signin