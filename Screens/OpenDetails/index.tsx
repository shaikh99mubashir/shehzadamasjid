import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Uri } from '../../constant/BaseUri';

const OpenDetails = ({ route, navigation }: any) => {
  const data = route.params;
  console.log("data",data);
  
  const [openDetailItem, setopenDetailItem] = useState({
    comment: "",
  });
  const [loading, setLoading] = useState(false)



  // console.log(openDetailItem.comment, "comment")


  // console.log(data, "dataaa")
  // console.log('idddddddddddddd',data)
  const sendOpenDetailData = async () => {

    let tutorData: any = await AsyncStorage.getItem("loginAuth")

    tutorData = await JSON.parse(tutorData)

    let subjectId = data?.subject_id
    // let ticket_id = data?.ticket_id
    let ticket_id = data?.id
    // let id = data?.id
    let tutor_id = tutorData?.tutorID
    let comment = openDetailItem.comment ? openDetailItem.comment : null
    // console.log('idddddddddddddd',data.id)
    // console.log(subjectId)
    // console.log(subjectId)
    // console.log(tutor_id)
    // console.log(comment, "comment")

    setLoading(true)
    axios.get(`${Base_Uri}offerSendByTutor/${subjectId}/${tutor_id}/${ticket_id}/${comment}`).then(({ data }) => {

      if (data?.result?.status == "Applied") {
        setLoading(false)
        ToastAndroid.show("You have successfully applied for this ticket", ToastAndroid.SHORT)
        navigation.navigate("Job Ticket", ticket_id)
      } else {
        console.log(data, "dataaa")
        ToastAndroid.show(data?.result, ToastAndroid.SHORT)
        setLoading(false)
      }

    }).catch((error) => {
      setLoading(false)
      console.log(error, "error")
      ToastAndroid.show("Internal Server Error", ToastAndroid.SHORT)
    })
  };
console.log('data=============>',data);

  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title={data.uid} backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ paddingHorizontal: 15 }}>
          <Text
            style={{
              color: 'green',
              fontSize: 15,
              fontWeight: '500',
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderColor: '#eee',
            }}>
            {data?.studentAddress1} {data?.studentAddress2}
          </Text>
          <View>
            <Text
              style={{
                color: Theme.black,
                fontSize: 14,
                fontWeight: '600',
                marginTop: 10,
              }}>
              Details
            </Text>
            <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600' }}>
              {data?.classDay} at {data?.classTime} for {data?.hours} hour(s) of each class.</Text>
            <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600' }}>
              {data?.studentGender} Student ({data?.studentAge}y/o)</Text>
            <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600' }}>
              {data?.subject_name} - {data?.session} sessions {data?.quantity}
            </Text>
            {data?.mode == 'physical'?
            <>
            <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600' }}>
            {data?.classAddress}
          </Text>
            <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600' }}>
            {data?.classCity}
          </Text>
            <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600' }}>
            {data?.classState}
          </Text>
            <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600' }}>
            {data?.classPostalCode}
          </Text>
          </>
          :''
            }
            
            {/* <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600' }}>
              - Tutor Gender: {data?.tutorGender}
            </Text> */}
            <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600' }}>
              - PreferredDay/Time: {data?.classDay}
            </Text>
            <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600' }}>
              - Mode: {data?.mode}
            </Text>
            {data?.remarks &&
              <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600' }}>
                - Remarks: {data?.remarks}
              </Text>
            }
            {data?.first8Hour &&
              <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600' }}>
                {data?.first8Hour}
              </Text>
            }
            {data?.above9Hour &&
              <Text style={{ color: Theme.gray, fontSize: 16, fontWeight: '600' }}>
                {data?.above9Hour}
              </Text>
            }
            <View style={{ marginVertical: 15 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 15,
                  fontWeight: '600',
                }}>
                Estimated Commission
              </Text>
              <Text
                style={{
                  color: 'green',
                  fontSize: 17,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                RM {data.receiving_account}/subject
              </Text>
            </View>
            {/* Avaiable Subject */}
            <View style={{ marginVertical: 15 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 15,
                  fontWeight: '600',
                }}>
                Available Subjects
              </Text>
              <View
                style={{
                  backgroundColor: Theme.lightGray,
                  paddingHorizontal: 10,
                  paddingVertical: 12,
                  borderRadius: 10,
                  marginVertical: 5,
                }}>
                <Text
                  style={{
                    color: Theme.black,
                    fontSize: 14,
                    fontWeight: '600',
                    marginTop: 5,
                  }}>
                  {data.subject_name}
                </Text>
                <Text
                  style={{
                    color: Theme.gray,
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 5,
                  }}>
                  {/* {data.subject_id} */}
                </Text>
              </View>
            </View>
            {/* Avaiable student */}
            <View style={{ marginVertical: 15 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 15,
                  fontWeight: '600',
                }}>
                Extra Students
              </Text>
              {data?.jobTicketExtraStudents?.map((e:any,i:number)=>
              <View
                style={{
                  backgroundColor: Theme.lightGray,
                  paddingHorizontal: 10,
                  paddingVertical: 12,
                  borderRadius: 10,
                  marginVertical: 5,
                }}>
                  
                <Text
                  style={{
                    color: Theme.black,
                    fontSize: 14,
                    fontWeight: '400',
                    marginTop: 5,
                  }}>
                  Student Name : {e?.student_name}
                </Text>
                <Text
                  style={{
                    
                    color: Theme.black,
                    fontSize: 14,
                    fontWeight: '400',
                    marginTop: 5,
                  }}>
                  Age : {e?.student_age}
                </Text>
                <Text
                  style={{
                    
                    color: Theme.black,
                    fontSize: 14,
                    fontWeight: '400',
                    marginTop: 5,
                  }}>
                  Gender : {e?.student_gender}
                </Text>
                <Text
                  style={{
                    
                    color: Theme.black,
                    fontSize: 14,
                    fontWeight: '400',
                    marginTop: 5,
                  }}>
                  Birth Year : {e?.year_of_birth}
                </Text>
                <Text
                  style={{
                    
                    color: Theme.black,
                    fontSize: 14,
                    fontWeight: '400',
                    marginTop: 5,
                  }}>
                  Special Need : {e?.special_need}
                </Text>
                
                
              </View>
               )}
            </View>
            {/* Comment */}
            <View style={{ marginBottom: 100 }}>
              <Text
                style={{
                  color: Theme.black,
                  fontSize: 15,
                  fontWeight: '600',
                }}>
                Comment
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
                  placeholder="Enter Your Comment For The First Time, Let us Know your Teaching Experience"
                  multiline={true}
                  maxLength={300}
                  onChangeText={e =>
                    setopenDetailItem({ ...openDetailItem, comment: e })
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
            onPress={sendOpenDetailData}
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: Theme.darkGray,
              borderRadius: 10,
            }}>
            {loading ? <ActivityIndicator size={"small"} color={"white"} /> : <Text
              style={{
                color: 'white',
                fontSize: 18,
                fontFamily: 'Poppins-Regular',
              }}>
              Send
            </Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OpenDetails;

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
