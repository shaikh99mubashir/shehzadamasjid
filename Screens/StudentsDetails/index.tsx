import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,

  ScrollView,
  Touchable,
  Linking,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import { useIsFocused } from "@react-navigation/native"
const StudentsDetails = ({ navigation, route }: any) => {
  const data = route.params;

  const [refresh, setRefresh] = useState(false)

  const focus = useIsFocused()


  React.useEffect(() => {

    setRefresh(!refresh)

  }, [focus])

  const makeCall = () => {

    const url = `tel:${data.studentPhone}`;
    Linking.openURL(url);
  }

  const makeWhatappCall = () => {

    const url = Platform.OS === 'ios'
      ? `whatsapp://send?phone=${data.studentWhatsapp}`
      : `whatsapp://send?text=Hello&phone=${"+921234567890"}`;

    Linking.openURL(url);
  }

  const GoToStudentDirection = () => {

    let url = '';
    // let latitude = 40.712776
    // let longitude = -74.005974

    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?ll=${data.studentLatitude},${data.studentLongitude}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${data.studentLatitude},${data.studentLongitude}`;
    }

    Linking.openURL(url);


  }

  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="Student Details" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15 }}>
          <Text
            style={{
              paddingVertical: 10,
              fontSize: 18,
              fontWeight: '700',
              color: Theme.darkGray,
            }}>
            Profile
          </Text>
          <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#eee' }}>
            {/* Student Name */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Student Name
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.studentName}
              </Text>
            </View>
            {/* Student Id */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Student ID
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.studentID}
              </Text>
            </View>
            {/* Gender */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Gender
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.studentGender ? data.studentGender : "not provided"}
              </Text>
            </View>
            {/* Age */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Age
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.studentAge ? data.studentAge : "not provided"}
              </Text>
            </View>
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Status
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.studentStatus ? data.studentStatus : "Newly Active"}
              </Text>
            </View>
            {/* Registration Date */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Redistration Date
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.studentRegisterDate ? data.studentRegisterDate : "not provided"}
              </Text>
            </View>
          </View>
          <Text
            style={{
              paddingVertical: 10,
              fontSize: 18,
              fontWeight: '700',
              color: Theme.darkGray,
              marginTop: 10,
            }}>
            Contact Person
          </Text>
          <View style={{ borderWidth: 1, borderRadius: 5, borderColor: '#eee', marginBottom: 100 }}>
            {/*  Name */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Name
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.studentName}
              </Text>
            </View>
            {/* Email */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Email
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.studentEmail ? data.studentEmail : "not provided"}
              </Text>
            </View>
            {/* Contact */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Contact No
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data?.studentPhone ? data.studentPhone : "not provided"}
              </Text>
            </View>
            {/* Adress */}
            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                Address
              </Text>
              <Text
                style={{
                  color: Theme.gray,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                {data.studentAddress1 ?? data.studentAddress2}
              </Text>
            </View>
            {/* Images */}
            <View
              style={{
                flexDirection: 'row',
                gap: 15,
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => makeCall()}
                style={{
                  backgroundColor: Theme.lightGray,
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/call.png')}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={makeWhatappCall}
                style={{
                  backgroundColor: 'lightgreen',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/whatsapp.png')}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={GoToStudentDirection}
                style={{
                  backgroundColor: 'pink',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Image
                  source={require('../../Assets/Images/direction.png')}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Submit Button */}
      <View
        style={{
          backgroundColor: Theme.white,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
        }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: Theme.white,
            marginVertical: 20,
            width: '94%',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Status', data)}
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: Theme.darkGray,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontFamily: 'Poppins-Regular',
              }}>
              Edit Status
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StudentsDetails;

const styles = StyleSheet.create({});
