import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {Theme} from '../../constant/theme';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import {convertArea} from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Signup = ({navigation}: any) => {
  let [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const phoneInput = useRef(null);

  const handleLoginPress = () => {
    if (!email) {
      ToastAndroid.show('Kindly Enter Email Address', ToastAndroid.SHORT);
      return;
    }

    if (!phoneNumber) {
      ToastAndroid.show('Kindly Enter Phonenumber', ToastAndroid.SHORT);
      return;
    }

    let emailReg = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

    let testEmail = emailReg.test(email);

    if (!testEmail) {
      ToastAndroid.show('Invalid Email Address', ToastAndroid.SHORT);
      return;
    }

    const formData = new FormData();

    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);

    setLoading(true);

    axios
      .post(`${Base_Uri}api/appTutorRegister`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({data}) => {
        if (data.status == 200) {
          ToastAndroid.show(
            'You have been successfully registered as tutor Login to continue',
            ToastAndroid.SHORT,
          );
          navigation.navigate('Login', data);
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  console.log(phoneNumber);

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 15,
      }}>
      <Text style={{fontSize: 25, color: 'black'}}>
        Get Yourself Registered
      </Text>
      <Text
        style={{fontSize: 14, color: 'black', marginTop: 14, paddingRight: 15}}>
        Fill out phoneNumber and email field to get yourself registered with
        sifuTutor.
      </Text>
      <View style={styles.container}>
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
      </View>
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
      </View>
    </View>
  );
};

export default Signup;

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
