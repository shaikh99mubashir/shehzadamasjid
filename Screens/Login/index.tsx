import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import { Theme } from '../../constant/theme';
import axios from 'axios';
import { Base_Uri, Base_Url } from '../../constant/BaseUri';
import { convertArea } from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = ({ navigation }: any) => {
  let [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const phoneInput = useRef(null);

  const handleLoginPress = () => {
    setLoading(true);
    if (!email) {
      ToastAndroid.show('Kindly Enter Email Address', ToastAndroid.SHORT);
      setLoading(false);
      return;
    }

    let emailReg = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    let testEmail = emailReg.test(email);

    if (!testEmail) {
      ToastAndroid.show('Invalid Email Address', ToastAndroid.SHORT);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    console.log('email',email,password);
    
    axios
      .post(`${Base_Url}login`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => {
        // console.log("data=====>", data);

        if (data?.message !== 'Login successful') {
          setLoading(false);
          ToastAndroid.show(data?.message, ToastAndroid.SHORT);
          return;
        }
        if (data?.message == 'Login successful') {
          setLoading(false);
          ToastAndroid.show(data?.message, ToastAndroid.SHORT);
          let mydata = JSON.stringify(data);
          AsyncStorage.setItem('loginAuth', mydata);
          formData.append('userid', data?.user_id);
          axios
            .get(`${Base_Url}getteachersdata`, {
              params: {
                userid: data?.user_id,
              },
            })
            .then((response) => {
              let tutorData = response.data;
              // console.log("tutorData.teacherdata",tutorData.teacherdata, 'data');
              // console.log("tutorData.teachers",tutorData.teachers, 'data');
              let teacherdata = JSON.stringify(tutorData.teacherdata);
              let teachers = JSON.stringify(tutorData.teachers);
              AsyncStorage.setItem('teacherData', teacherdata);
              AsyncStorage.setItem('teachers', teachers);
              console.log("teacherdata",teacherdata);
              navigation.replace('Main')
            })
            .catch((error) => {
              console.log("error", error);
            });
        }
      })
      .catch(error => {
        console.log("error",error);
        ToastAndroid.show('Server is Down Try Again', ToastAndroid.SHORT);
        setLoading(false);
      });

  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 10,
      }}>
      <Image
        source={require('../../Assets/Images/logo.png')}
        resizeMode="contain"
        style={{ width: "100%", marginTop: -60 }}
      />
      <Text style={{ fontSize: 25, color: 'black', display: "flex", alignSelf: 'center', marginVertical: 20 }}>
        Enter your Credentials
      </Text>
      {/* <Text style={{fontSize: 14, color: 'black', marginTop: 14}}>
        A verification code will be sent{'\n'}to your registered email
      </Text> */}
      {/* <View style={styles.container}>
        <PhoneInput
          ref={phoneInput}
          placeholder="Enter Your Number"
          defaultValue={phoneNumber}
          defaultCode="PK"
          layout="first"
          autoFocus={true}
          textInputStyle={{color: Theme.black, height: 50}}
          textInputProps={{placeholderTextColor: Theme.gray}}
          codeTextStyle={{marginLeft: -15, paddingLeft: -55, color: 'black'}}
          containerStyle={styles.phoneNumberView}
          textContainerStyle={{
            height: 60,
            backgroundColor: 'white',
            borderRadius: 10,
            borderColor: 'transparent',
          }}
          onChangeFormattedText={text => {
            setPhoneNumber(text);
          }}
        />
      </View> */}
      <TextInput
        placeholder="Enter Your Email"
        placeholderTextColor={Theme.gray}
        style={{
          height: 60,
          backgroundColor: 'white',
          borderRadius: 10,
          fontSize: 16,
          borderColor: Theme.black,
          marginBottom: 10,
          borderWidth: 1,
          padding: 10,
          color: Theme.black,
        }}
        onChangeText={text => {
          setEmail(text);
        }}
      />
      <TextInput
        placeholder="Enter Your Password"
        placeholderTextColor={Theme.gray}
        secureTextEntry={true}
        style={{
          height: 60,
          backgroundColor: 'white',
          borderRadius: 10,
          fontSize: 16,
          borderColor: Theme.black,
          marginBottom: 10,
          borderWidth: 1,
          padding: 10,
          color: Theme.black,
        }}
        onChangeText={text => {
          setPassword(text);
        }}
      />

      {/* Submit Button */}

      <View
        style={{
          borderWidth: 1,
          borderColor: Theme.white,

          marginVertical: 20,
          width: '100%',
        }}>
        <TouchableOpacity
          onPress={() => handleLoginPress()}
          style={{
            alignItems: 'center',
            padding: 10,
            backgroundColor: Theme.darkGray,
            borderRadius: 10,
          }}>
          {loading ? (
            <ActivityIndicator color={Theme.white} size="small" />
          ) : (
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontFamily: 'Poppins-Regular',
              }}>
              Continue
            </Text>
          )}
        </TouchableOpacity>
        {/* <View
          style={{
            width: '100%',
            alignItems: 'center',
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: Theme.black,
              fontSize: 14,
              fontWeight: '400',
            }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{color: Theme.black, fontWeight: 'bold'}}>Signup</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    autoFocus: true,
    // flex: 1,
    marginTop: 20,
  },
  phoneNumberView: {
    // height: 70,
    width: '100%',
    backgroundColor: 'white',
    borderColor: Theme.gray,
    borderRadius: 10,
    borderWidth: 1,
    color: '#E5E5E5',
    flexShrink: 22,
    autoFocus: true,
  },
});
