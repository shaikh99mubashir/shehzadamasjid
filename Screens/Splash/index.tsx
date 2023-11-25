import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';

const Splash = ({navigation}: any) => {
  const navigateToHomeScreen = () => {
    setTimeout(async () => {
      let data = await AsyncStorage.getItem('login');
      let authData = await AsyncStorage.getItem('loginAuth');

      if (authData) {
        let tutorData = JSON.parse(authData);
        console.log(tutorData);

        axios
          .get(`${Base_Uri}getTutorDetailByID/${tutorData?.tutorID}`)
          .then(res => {
            console.log("res---->");
            
            let tutorData = res.data;

            if (
              !tutorData.tutorDetailById[0].full_name &&
              !tutorData.tutorDetailById[0].displayName
            ) {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'TutorDetails',
                    params: {
                      tutorData,
                    },
                  },
                ],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Main',
                    params: {
                      data,
                    },
                  },
                ],
              });
            }
          }).catch((error)=>{
            console.log('error',error);
            
          })
        return;
      }

      if (data) {
        navigation.replace('Login');
        return;
      }
      navigation.replace('OnBoarding');
    }, 3000);
    
  };
  useEffect(() => {
    navigateToHomeScreen();
  }, []);
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
        paddingHorizontal: 15,
        alignItems: 'center',
      }}>
      <Image
        source={require('../../Assets/Images/logo.png')}
        resizeMode="contain"
        style={styles.logo}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width / 1.1,
  },
});
