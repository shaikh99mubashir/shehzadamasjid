import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../Component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import {Theme} from '../../constant/theme';
import {Base_Uri} from '../../constant/BaseUri';
import axios from 'axios';

const Verification = ({navigation, route}: any) => {
  let data = route.params;

  const [user, setUser] = useState(false);
  const CELL_COUNT = 6;
  // const { confirmation, phoneNum } = route.params;
  const [code, setCode] = useState('');
  const [uploading, setUploading] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const Verify = () => {
    if (value.length < 6) {
      ToastAndroid.show('Invalid Code', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);

    axios
      .get(`${Base_Uri}verificationCode/${value}`)
      .then(({data}) => {
        if (data?.status !== 200) {
          setLoading(false);
          ToastAndroid.show(data?.errorMessage, ToastAndroid.SHORT);
          return;
        }
        if (data?.status == 200) {
          setLoading(false);
          ToastAndroid.show('Login Successfully', ToastAndroid.SHORT);
          let mydata = JSON.stringify(data);
          AsyncStorage.setItem('loginAuth', mydata);

          axios
            .get(`${Base_Uri}getTutorDetailByID/${data.tutorID}`)
            .then(res => {
              let tutorData = res.data;
              console.log(tutorData, 'data');

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
            });
        }
      })
      .catch(error => {
        ToastAndroid.show('Invalid Code', ToastAndroid.SHORT);
        setLoading(false);
      });
  };

  const handleResendPress = () => {
    let {UserDetail} = data;

    setResendLoading(true);

    axios
      .get(`${Base_Uri}loginAPI/${UserDetail.phoneNumber}`)
      .then(({data}) => {
        if (data?.status == 200) {
          setResendLoading(false);
          ToastAndroid.show(
            'Verification Code Successfully resend',
            ToastAndroid.SHORT,
          );
          return;
        }
        if (data?.status !== 200) {
          setResendLoading(false);
          ToastAndroid.show(data.errorMessage, ToastAndroid.SHORT);
        }
      })
      .catch(error => {
        setResendLoading(false);
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  return (
    <View
      style={{
        backgroundColor: Theme.white,
        height: '100%',
      }}>
      <Header
        navigation={navigation}
        user={user}
        backBtn
        noSignUp
        title="Verification"
      />
      <View style={{marginVertical: 10, paddingHorizontal: 15}}>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            color: Theme.gray,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Enter Verification Code
        </Text>
      </View>
      <View style={{paddingHorizontal: 15}}>
        <CodeField
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>
      <View style={{alignItems: 'center', marginVertical: 20}}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleResendPress()}>
          <Text
            style={{
              color: Theme.gray,
              fontSize: 15,
              fontFamily: 'Poppins-Regular',
            }}>
            If you didn,t receive a code!
            {resendLoading ? (
              <ActivityIndicator color={Theme.black} size="small" />
            ) : (
              <Text
                style={{
                  color: Theme.darkGray,
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                }}>
                {' '}
                Resend{' '}
              </Text>
            )}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Verify Button */}
      <View
        style={{
          // width: Dimensions.get('window').width / 1.1,
          borderWidth: 1,
          borderRadius: 5,
          marginHorizontal: 15,
          marginVertical: 20,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => !resendLoading && Verify()}
          style={{
            alignItems: 'center',
            padding: 10,
            backgroundColor: Theme.darkGray,
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
              Verify
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Verification;

const styles = StyleSheet.create({
  digitbtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 4,
    backgroundColor: Theme.darkGray,
    borderWidth: 1,
    borderColor: Theme.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeFieldRoot: {
    marginTop: 20,
    justifyContent: 'center',
  },
  cell: {
    width: Dimensions.get('window').width / 7.5,
    height: 60,
    color: Theme.black,
    padding: 10,
    alignItems: 'center',
    lineHeight: 38,
    fontSize: 24,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: Theme.darkGray,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: Theme.darkGray,
  },
});
