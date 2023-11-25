import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Theme } from '../../constant/theme';

const CustomDropDown = (props: any) => {
  let { ddTitle, categoryData, dataShow, searchData, searchFunc, subject, search, headingStyle, categoryShow, dropdownPlace, dropdownContainerStyle, setSelectedSubject, selectedSubject } = props




  const [selectedServicedata, setSelectedServicedata]: any = useState({});
  const [serviceDD, setServiceDD] = useState(false);
  const SelectedServices = (item: any) => {

    setSelectedSubject(item);

    setServiceDD(!serviceDD);
  };

  const filterSearchData = (text: string) => {

    if (text.length > 0) {
      searchFunc(text, search)
    }


  }

  return (
    <View>
      <View style={{ borderRadius: 5, overflow: 'hidden', marginHorizontal: 0, marginVertical: 5 }}>
        {ddTitle &&
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: Theme.gray,
              fontSize: 14,
              // fontWeight: 'bold',
              marginVertical: 5,
              marginHorizontal: 5,
              ...headingStyle

            }}>
            {ddTitle}
          </Text>
        }
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setServiceDD(!serviceDD)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomWidth: serviceDD ? 0 : 1,
            borderBottomLeftRadius: serviceDD ? 1 : 5,
            borderBottomRightRadius: serviceDD ? 1 : 5,
            borderColor: Theme.gray,
            alignItems: 'center',
            ...dropdownContainerStyle
          }}>
          {selectedServicedata &&
            Object.keys(selectedServicedata).length > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                }}>
                {selectedServicedata.complain_name &&
                  selectedServicedata.complain_name > 10
                  ? selectedServicedata.complain_name.slice(0, 10)
                  : selectedServicedata.complain_name}
              </Text>
              {serviceDD ? (
                <Image source={require('../../Assets/Images/up.png')} style={{ width: 20, height: 20 }} />
              ) : (
                <Image source={require('../../Assets/Images/down.png')} style={{ width: 20, height: 20 }} />
              )}
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text
                style={{
                  color: Theme.gray,
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                }}>
                {selectedSubject ? selectedSubject?.subject : dropdownPlace ?? ddTitle}
              </Text>
              {serviceDD ? (
                <Image source={require('../../Assets/Images/up.png')} style={{ width: 15, height: 20 }} resizeMode='contain' />
              ) : (
                <Image source={require('../../Assets/Images/down.png')} style={{ width: 20, height: 20 }} />
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
      {categoryData &&
        <View
          style={{
            borderBottomEndRadius: 5,
            borderBottomStartRadius: 5,
            borderWidth: !serviceDD ? 0 : 1,
            borderTopWidth: !serviceDD ? 0 : 1,
            borderColor: Theme.gray,
            top: -14,
          }}>
          <ScrollView style={{ maxHeight: 100 }} nestedScrollEnabled={true}>
            {serviceDD == true &&
              Array.from(
                new Set(categoryData && categoryData.map((item: any) => item.complain_name)),
              ).map((e: any, i: number) => {

                return (
                  <TouchableOpacity
                    onPress={() =>
                      SelectedServices(
                        categoryData.find(
                          (item: any) => item.complain_name === e,
                        ),
                      )
                    }
                    key={i}
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      marginVertical: 5,
                      gap: 10,
                    }}>
                    <Text
                      style={{
                        color: Theme.gray,
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 14,
                      }}>
                      {e}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>
      }
      {subject &&
        <View
          style={{
            borderBottomEndRadius: 5,
            borderBottomStartRadius: 5,
            borderWidth: !serviceDD ? 0 : 1,
            borderTopWidth: !serviceDD ? 0 : 1,
            borderColor: Theme.gray,
            top: -10,
          }}>
          <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled={true}>

            {serviceDD == true &&
              <View>
                {search && <TextInput onChangeText={(e) => filterSearchData(e)} style={{
                  paddingHorizontal: 10,
                  marginVertical: 0,
                  color: 'black',
                  backgroundColor: "white",
                  borderBottomWidth: 1,
                  gap: 0,
                  height: 38,
                }}
                  placeholder={"SEARCH"}
                  placeholderTextColor={"black"}

                />}
                {searchData && searchData.length > 0 ? Array.from(
                  new Set(searchData && searchData.map((item: any) => item?.subject)),
                ).map((e: any, i: number) => {

                  return (
                    <TouchableOpacity
                      onPress={() =>
                        SelectedServices(
                          subject.find(
                            (item: any) => `${item?.subject}` === e,
                          ),
                        )
                      }
                      key={i}
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        marginVertical: 5,
                        gap: 10,
                      }}>
                      <Text
                        style={{
                          color: Theme.gray,
                          fontFamily: 'Poppins-SemiBold',
                          fontSize: 14,
                        }}>
                        {e ?? selectedSubject}
                      </Text>
                    </TouchableOpacity>
                  );

                }).filter(Boolean)
                  :
                  Array.from(
                    new Set(subject && subject.map((item: any) => item?.subject)),
                  ).map((e: any, i: number) => {
                    if (i < 5) {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            SelectedServices(
                              subject.find(
                                (item: any) => `${item?.subject}` === e,
                              ),
                            )
                          }
                          key={i}
                          style={{
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                            marginVertical: 5,
                            gap: 10,
                          }}>
                          <Text
                            style={{
                              color: Theme.gray,
                              fontFamily: 'Poppins-SemiBold',
                              fontSize: 14,
                            }}>
                            {e ?? selectedSubject}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  }).filter(Boolean)


                }

              </View>


            }
          </ScrollView>
        </View>
      }
    </View>
  )
}

export default CustomDropDown

const styles = StyleSheet.create({})