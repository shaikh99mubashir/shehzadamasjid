import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Theme } from '../../constant/theme';
import Header from '../../Component/Header';
import { Base_Uri } from '../../constant/BaseUri';
import ClockIn from '../ClockInScreen/ClockIn';
import { useIsFocused } from "@react-navigation/native"
const AttendedDetails = ({ navigation, route }: any) => {

  let item = route?.params

  const [data, setData] = useState(item)


  console.log(data, "dataaa")

  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)

  const focus = useIsFocused()

  useEffect(() => {
    setData(item)
  }, [focus])

  const handleLoadComplete = () => {

    console.log("helllo")

    setLoading1(false)
    setLoading2(false)

  }


  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="Attended Detail" navigation={navigation} backBtn />
      {/* <ScrollView style={{height:'100%'}}>  */}
      <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
        {/* name */}
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <Text style={{ color: Theme.gray, fontSize: 15, fontWeight: 'bold' }}>
            Name :
          </Text>
          <Text
            style={{ color: Theme.black, fontSize: 15, fontWeight: 'bold' }}>
            {data?.studentName}
          </Text>
        </View>
        {/* Subject */}
        <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
          <Text style={{ color: Theme.gray, fontSize: 15, fontWeight: 'bold' }}>
            Subject :
          </Text>
          <Text
            style={{ color: Theme.black, fontSize: 15, fontWeight: 'bold' }}>
            {data?.subjectName}
          </Text>
        </View>
        {/* Start Time End Time */}
        <View style={{ flexDirection: 'column', gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 5, marginTop: 10 }}>
            <Text
              style={{ color: Theme.gray, fontSize: 15, fontWeight: 'bold' }}>
              Start Time :
            </Text>
            <Text
              style={{ color: Theme.black, fontSize: 15, fontWeight: 'bold' }}>
              {data?.startTime}
            </Text>
          </View>
          {/* <Text
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 25,
            }}>
            |
          </Text> */}
          <View style={{ flexDirection: 'row', gap: 5, marginTop: 0 }}>
            <Text
              style={{ color: Theme.gray, fontSize: 15, fontWeight: 'bold' }}>
              End Time :
            </Text>
            <Text
              style={{ color: Theme.black, fontSize: 15, fontWeight: 'bold' }}>
              {data?.endTime}
            </Text>
          </View>
        </View>
        {/* Clock IN Image */}
        <Text
          style={{
            color: Theme.gray,
            fontSize: 15,
            fontWeight: 'bold',
            marginTop: 10,
          }}>
          Clock In
        </Text>
        {loading1 ? <View style={{ width: "100%", height: '30%' }}  >
          <ActivityIndicator color={"black"} size={'large'} />
        </View>
          :
          <Image
            source={{ uri: data.startTimeProofImage }}
            style={{ width: "100%", height: '30%' }}
            resizeMode="cover"
            onLoad={() => handleLoadComplete()}
            // onLoadEnd={() => setLoading1(false)}
            onError={(error) => {
              console.log(error, "erorrr")
              // Handle image loading error here
              setLoading1(false);
            }}
          />}
        {/* Clock Out Image */}
        <Text
          style={{
            color: Theme.gray,
            fontSize: 15,
            fontWeight: 'bold',
            marginTop: 10,
          }}>
          Clock Out
        </Text>
        {loading2 ? <View style={{ width: '100%', height: '30%' }}  >
          <ActivityIndicator color={"black"} size={'large'} />
        </View>
          :
          <Image
            source={{ uri: data.endTimeProofImage }}
            style={{ width: '100%', height: '30%' }}
            resizeMode="cover"
            onError={(error) => {
              setLoading2(false);
            }}
          />}
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

export default AttendedDetails;

const styles = StyleSheet.create({});
