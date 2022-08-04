/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
 import React, {type PropsWithChildren} from 'react';
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

 import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
 
 import CustomButton from './screen/CustomButton';

 import InitialPage from './screen/InitialPage';

 import Login from './screen/Login';

 import Signin from './screen/Signin';
 
 const Stack = createStackNavigator();
 
 function App() {
 
   return (
          <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown : false}} initialRouteName="InitialPage">
            <Stack.Screen name="InitialPage" component={InitialPage} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signin" component={Signin} />
            </Stack.Navigator>
          </NavigationContainer>
   );
 };

 
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
 
 export default App;
/*
import React, {type PropsWithChildren} from 'react';
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

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="">
          <Text>어플을 처음 이용하시나요?</Text>
          <Button title="회원 가입" color="#4D483D" onPress={()=>{

          }}/>
          </Section>
          <Section title="">
          <Text>계정을 이미 등록하셨나요?</Text>
          <Button title="로그인" color="#4D483D" onPress={()=>{

          }}/>
          </Section>
          <Section title="">
            <Text style={styles.socialLoginTitle}>소셜 로그인</Text>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#4D483D',
  },
  socialLoginTitle:{
    color: '#B0A69D',
    fontSize: 14,
  }
});

export default App;
*/
