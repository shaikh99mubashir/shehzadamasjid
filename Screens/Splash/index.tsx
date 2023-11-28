import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {Base_Uri, Base_Url} from '../../constant/BaseUri';

const Splash = ({navigation}: any) => {
  let data =  AsyncStorage.getItem('login');
  AsyncStorage.getItem('loginAuth')
  .then((authData:any) => {
    let tutorData = JSON.parse(authData);
    console.log(tutorData);
  })
  .catch((error) => {
    // Handle errors here
    console.error('Error retrieving loginAuth data:', error);
  });
  // const navigateToHomeScreen = () => {
  //   setTimeout(async () => {
  //     AsyncStorage.getItem('loginAuth')
  //     .then((authData:any) => {
  //       let tutorData = JSON.parse(authData);
  //       console.log(tutorData);
  //         axios
  //           .get(`${Base_Url}getteachersdata`, {
  //             params: {
  //               userid: tutorData?.user_id,
  //             },
  //           })
  //           .then((response) => {
  //             let tutorData = response.data;
  //             let teacherdata = JSON.stringify(tutorData.teacherdata);
  //             let teachers = JSON.stringify(tutorData.teachers);
  //             AsyncStorage.setItem('teacherData', teacherdata);
  //             AsyncStorage.setItem('teachers', teachers);
  //             console.log("teacherdata",teacherdata);
  //             navigation.replace('Main')
  //           })
  //           .catch((error) => {
  //             console.log("error", error);
  //           });
  //     })
  //     .catch((error) => {
  //       // Handle errors here
  //       console.error('Error retrieving loginAuth data:', error);
  //     });

  //     navigation.replace('OnBoarding');
  //   }, 3000);
    
  // };
 
  const checkLoginAuthAndNavigate = async () => {
    try {
      const authData = await AsyncStorage.getItem('loginAuth');
  
      if (authData) {
        // If loginAuth exists, check if onboarding has been completed
        const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
  
        if (onboardingCompleted) {
          // Onboarding completed, proceed to the Main screen
          navigateToMain();
        } else {
          // Onboarding not completed, show the Onboarding screen
          navigateToOnboarding();
        }
      } else {
        // If there is no loginAuth, navigate to the Login screen
        navigateToLogin();
      }
    } catch (error) {
      // Handle errors here
      console.error('Error retrieving data or making API request:', error);
      // Navigate to the login screen in case of an error
      navigateToLogin();
    }
  };
  
  const navigateToOnboarding = () => {
    navigation.replace('Onboarding');
    // Mark onboarding as completed to skip it in the future
    AsyncStorage.setItem('onboardingCompleted', 'true');
  };
  
  const navigateToMain = () => {
    navigation.replace('Main');
  };
  
  const navigateToLogin = () => {
    navigation.replace('Login');
  };
  
  // Call the function after a delay of 3000 milliseconds

  useEffect(() => {
    // navigateToHomeScreen();
    setTimeout(checkLoginAuthAndNavigate, 3000);
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
        source={require('../../Assets/Images/MasjidShehzada.png')}
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
