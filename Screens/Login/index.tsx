import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {Theme} from '../../constant/theme';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import {convertArea} from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = ({navigation}: any) => {
  let [phoneNumber, setPhoneNumber] = useState('');

  const [loading, setLoading] = useState(false);

  const phoneInput = useRef(null);

  const handleLoginPress = () => {
    setLoading(true);
    axios
      .get(`${Base_Uri}loginAPI/${phoneNumber}`)
      .then(({data}) => {
        if (data.status == 404) {
          setLoading(false);
          ToastAndroid.show(data.errorMessage, ToastAndroid.SHORT);
          return;
        }
        if (data.status == 200) {
          ToastAndroid.show(
            'Verification Code Successfully send to your registered email',
            ToastAndroid.SHORT,
          );
          navigation.navigate('Verification', data);
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log("error",error);
        
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 15,
      }}>
      <Text style={{fontSize: 25, color: 'black'}}>
        Enter your{'\n'}mobile number
      </Text>
      <Text style={{fontSize: 14, color: 'black', marginTop: 14}}>
        A verification code will be sent{'\n'}to your registered email
      </Text>
      <View style={styles.container}>
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
        <View
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
        </View>
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
