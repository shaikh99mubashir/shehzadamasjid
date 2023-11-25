import React, { useState } from 'react';
import {
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,

  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Theme } from '../../constant/theme';
import CustomHeader from '../../Component/Header';
import DocumentPicker from 'react-native-document-picker';
import AntDesign from 'react-native-vector-icons/EvilIcons';
import axios, { AxiosError } from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

function EditAttendedClass({ navigation, route }: any) {
  let data = route.params?.data;

  const [loading, setLoading] = useState(false)

  const [file, setFile] = useState<any>({});


  console.log(data, "dataaa")

  console.log(file, "fileee")

  const changeStatus = () => {

    if (Object.keys(file).length == 0) {
      ToastAndroid.show("Kindly attach file", ToastAndroid.SHORT)
      return
    }

    setLoading(true)

    let formData = new FormData()

    formData.append("id", data?.id)
    formData.append("status", "attended")
    formData.append('attendedStatusAttachment', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    });



    axios.post(`${Base_Uri}api/classScheduleAttendedStatusWithImage`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      ToastAndroid.show(res?.data?.SuccessMessage, ToastAndroid.SHORT)
      navigation.navigate("Schedule", data.id)
      setLoading(false)
      setFile({})

    }).catch((error) => {
      setLoading(false)


      ToastAndroid.show("You have not attended this class yet", ToastAndroid.SHORT)

    })

  };


  const FilePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      setFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled file selection');
      } else {
        console.log('Error while picking the file:', err);
      }
    }
  };

  return (
    loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
      <ActivityIndicator size="large" color={Theme.black} />
    </View> : <KeyboardAvoidingView
      behavior="height"
      style={{ flex: 1, backgroundColor: Theme.white }}>
      <View>
        <CustomHeader title="Edit Class" backBtn navigation={navigation} />
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ color: Theme.black, fontSize: 18, fontWeight: '600' }}>
            Student
          </Text>
          <Text
            style={{
              color: Theme.gray,
              fontSize: 16,
              fontWeight: '500',
              marginTop: 5,
            }}>
            {data?.studentName}
          </Text>
          <Text
            style={{
              color: Theme.black,
              fontSize: 18,
              fontWeight: '600',
              marginTop: 20,
            }}>
            Subject
          </Text>
          <Text
            style={{
              color: Theme.gray,
              fontSize: 16,
              fontWeight: '500',
              marginTop: 5,
            }}>
            {data?.subjectName}
          </Text>

          <Text
            style={{
              color: Theme.black,
              fontSize: 18,
              fontWeight: '600',
              marginTop: 20,
            }}>
            Class
          </Text>
          <View
            style={{
              backgroundColor: Theme.lightGray,
              padding: 20,
              borderRadius: 10,
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{ color: Theme.gray, fontSize: 16, fontWeight: '500' }}>
                Date
              </Text>

              <Text
                style={{ color: Theme.black, fontSize: 14, fontWeight: '500' }}>
                {(data?.date).toString()}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{ color: Theme.gray, fontSize: 16, fontWeight: '500' }}>
                Start Time
              </Text>

              <Text
                style={{ color: Theme.black, fontSize: 14, fontWeight: '500' }}>
                {(data?.startTime).toString()}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{ color: Theme.gray, fontSize: 16, fontWeight: '500' }}>
                End Time
              </Text>

              <Text
                style={{ color: Theme.black, fontSize: 14, fontWeight: '500' }}>
                {(data?.endTime).toString()}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: Theme.black,
              fontSize: 18,
              fontWeight: '600',
              marginTop: 20,
            }}>
            Status
          </Text>
          <View
            style={{
              backgroundColor: Theme.lightGray,
              padding: 20,
              borderRadius: 10,
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{ color: Theme.black, fontSize: 16, fontWeight: '500' }}>
                {route?.params?.schedule
                  ? 'Scheduled'
                  : route?.params?.postpond
                    ? 'Postponed'
                    : route?.params?.cancelled
                      ? 'Cancelled'
                      : 'Attended'}
              </Text>

              {/* <AntDesign name="chevron-down" color={Theme.black} size={30} /> */}
            </View>
          </View>

          <View>
            <Text
              style={{
                color: Theme.black,
                fontSize: 16,
                fontWeight: '600',
                marginTop: 5,
              }}>
              Attachment
            </Text>

            <TouchableOpacity
              onPress={FilePicker}
              style={{
                padding: 20,
                backgroundColor: Theme.lightGray,
                borderRadius: 5,
                marginTop: 5,
              }}>
              <Text style={{ fontSize: 14, color: Theme.gray }}>
                {file.name ?? 'Select File'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={{ width: '92%', alignItems: 'center', marginBottom: 20, alignSelf: 'center' }}>
        <TouchableOpacity
          onPress={() => changeStatus()}
          style={{
            backgroundColor: Theme.darkGray,
            padding: 15,
            borderRadius: 10,
            width: '95%',
          }}>
          <Text style={{ textAlign: 'center', fontSize: 16, color: Theme.white }}>
            Confirm Class
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default EditAttendedClass;
