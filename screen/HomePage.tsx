/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BottomSheet, {BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import ScheduleCard from "../components/ScheduleCard"
import BottomComponent from "../components/BottomComponent"


function HomePage({navigation}: any) {
  const [info, setInfo] = useState([]);

  const [data, setData] = useState([]);

  const sheetRef = useRef<BottomSheet>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedScheduleId, setSelectedScheduleId ] = useState('');

  const [bottomModalType, setBottomModalType ] = useState('');

  const testPress = () => {-
      setIsModalOpen(true);
  };

  const testPress2 = () => {
      setIsModalOpen(false);
  };

  const getSelectedScheduleId = (id : string) => {
    setSelectedScheduleId(id);
  }

  const getBottomModalType = (modalType : string) => {
    setBottomModalType(modalType);
  }


    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

   /* 
  const openBottomModal = () => {
    bottomSheetModalRef.current?.present();
  }
  */

  const openBottomModal = () => {
    bottomSheetModalRef.current?.present();
  };

    const snapPoints = useMemo(() => ['80%'], []);
    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);


  useEffect(() => {

    
    AsyncStorage.getItem('user_id', (err, result1) => { //user_id에 담긴 아이디 불러오기

      
      result1 = '4008b5cb-c626-4a3a-9490-08572249ccf4'; //test0 계정
      const params ={
        status: "승인"
      };
    
      //엑세스토큰 먼저 확인하고 id 가져오기 - 추후수정
      //엑세스 토큰 만료되면 refresh로 액세스토큰 만들어주기
      AsyncStorage.getItem('accessToken', (err, result2) => {
        result2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQwMDhiNWNiLWM2MjYtNGEzYS05NDkwLTA4NTcyMjQ5Y2NmNCIsIm5hbWUiOiLthYzsiqTtirjsnKDsoIAwIiwiaWF0IjoxNjYyMjEyNDI3LCJleHAiOjE2NjM0MjIwMjd9.WOdLOl4a2WRCzqobCuuCLj5HE9fCtcGb2c2NUFZxHLA';
        const headers ={
        Authorization : `Bearer ${result2}`
      }
      
      axios.get("http://10.0.2.2:8002/schedules/status", {params,headers})
      .then(res=>setInfo(res.data))
      .catch(err=>console.log('3 : ',err));


      const getData = async () => {
      const response = await axios.get("http://10.0.2.2:8002/schedules/status", {params,headers});
      };
    });

    
    /*
    //엑세스토큰 먼저 확인하고 id 가져오기 - 추후수정
    //엑세스 토큰 만료되면 refresh로 액세스토큰 만들어주기
    AsyncStorage.getItem('accessToken', (err, result2) => {
      //result2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQwMDhiNWNiLWM2MjYtNGEzYS05NDkwLTA4NTcyMjQ5Y2NmNCIsIm5hbWUiOiLthYzsiqTtirjsnKDsoIAwIiwiaWF0IjoxNjYxODQ3MTcwLCJleHAiOjE2NjMwNTY3NzB9.DO02grsZ2zwzIPj0-2s2AJAtzgoAcmJv_vQDL2Biqg4';
      const headers ={
      Authorization : `Bearer ${result2}`
    }

    
    const params ={
      owner_id: result1
    };
    
    axios.get("http://10.0.2.2:8002/schedules", {params,headers})
    .then(res=>setInfo(res.data))
    .catch(err=>console.log('3 : ',err));
    

  });*/
    //<ScrollView style={styles.inputWrapper}>
      });
    },[]);
  return (
    <BottomSheetModalProvider>
    <ScrollView style={styles.inputWrapper}>
       {
            info.map((item: any) =>{
              
              if(item != null)
                return(
                    <ScheduleCard key={item.id} item={item} getSelectedScheduleId={getSelectedScheduleId} getBottomModalType={getBottomModalType} onPress={openBottomModal}/>
                )
            })
            
        }
      <View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          style={styles.bottomModal}
        >
          <View>
          <BottomComponent selectedScheduleId={selectedScheduleId} bottomModalType={bottomModalType}/>
          </View>
        </BottomSheetModal>
        
      </View>
      

</ScrollView>
    </BottomSheetModalProvider>
      
  );
}

  /*
  
 
  
  */
const styles = StyleSheet.create({
  inputWrapper: {
    padding: 20
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 24,
    height: 500
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
bottomModal:{
  backgroundColor: 'white',  // <==== HERE
borderRadius: 24,
shadowColor: 'black',
shadowOffset: {
  width: 0,
  height: -15,
},
shadowOpacity: 1,
shadowRadius: 24,
elevation: 24,
}
});
export default HomePage;

