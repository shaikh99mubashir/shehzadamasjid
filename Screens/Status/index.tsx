import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import CustomDropDown from '../../Component/CustomDropDown';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';
import StudentContext from '../../context/studentContext';

const Status = ({ navigation, route }: any) => {


  let data = route.params

  const context = useContext(StudentContext)

  let { students, updateStudent } = context


  const [status, setStatus] = useState([
    {
      subject: "active"
    },
    {
      subject: "inActive"
    }

  ])

  interface ISelected {
    subject: string
  }


  const [selectedStatus, setSelectedStatus] = useState<any>("")

  const [loading, setLoading] = useState(false)


  const [editStatus, seteditStatus] = useState({
    reason: '',
  });

  const handleEditStatus = () => {
    if (!selectedStatus) {
      ToastAndroid.show("Kindly select Status", ToastAndroid.SHORT)
      return
    }
    if (!editStatus.reason) {
      ToastAndroid.show("Kindly Write Reason", ToastAndroid.SHORT)
      return
    }
    setLoading(true)
    let formData = new FormData()
    formData.append("studentID", data.studentID)
    formData.append("reasonStatus", editStatus.reason)
    formData.append("status", selectedStatus?.subject)

    console.log(formData, "formData")

    axios.post(`${Base_Uri}api/editStatus`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {



      setLoading(false)
      ToastAndroid.show(res?.data?.response, ToastAndroid.SHORT)


      let updateData = students && students.length > 0 && students.map((e: any, i: number) => {

        if (e.studentID == data.studentID) {
          return {
            ...e,
            studentStatus: selectedStatus.subject
          }
        } else {
          return e
        }

      })

      console.log(updateData, "updated")

      updateStudent(updateData)
      data.studentStatus = selectedStatus.subject
      setSelectedStatus("")
      navigation.navigate("StudentsDetails", data)


    }).catch((error) => {
      setLoading(false)
      console.log(error, "error")
    })
  }


  return (
    loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
      <ActivityIndicator size={"large"} color={Theme.black} />
    </View> : <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="Status" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15 }}>
          <View style={{ paddingVertical: 10, }}>
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
              {data?.studentName}
            </Text>
          </View>


          <CustomDropDown
            setSelectedSubject={setSelectedStatus}
            selectedSubject={selectedStatus}
            ddTitle="Status" headingStyle={{ color: Theme.black, fontWeight: "700" }}
            dropdownPlace={"Select Status"}
            dropdownContainerStyle={{ paddingVertical: 15, backgroundColor: Theme.lightGray }}
            subject={status} categoryShow={"subject"} />


          {/* Comment */}
          <View style={{ marginBottom: 100 }}>
            <Text
              style={{
                color: Theme.black,
                fontSize: 15,
                fontWeight: '600',
              }}>
              Reason
            </Text>
            <View
              style={[
                styles.textAreaContainer,
                {
                  // borderWidth: 1,
                  marginTop: 5,
                  borderRadius: 10,
                  marginHorizontal: 2,
                },
              ]}>
              <TextInput
                placeholder="Enter Your Reason"
                multiline={true}
                maxLength={300}
                onChangeText={e =>
                  seteditStatus({ ...editStatus, reason: e })
                }
                style={[
                  styles.textArea,
                  {
                    backgroundColor: Theme.lightGray,
                    padding: 12,
                    color: Theme.black
                  },
                ]}
                underlineColorAndroid="transparent"
                placeholderTextColor="grey"
              />
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
            onPress={handleEditStatus}
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
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Status;

const styles = StyleSheet.create({
  textAreaContainer: {
    // borderColor: COLORS.grey20,
    // borderWidth: 1,
    // padding: 5,
    borderRadius: 10,
  },
  textArea: {
    borderRadius: 10,
    height: 150,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
