import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Header from '../../Component/Header';
import { Theme } from '../../constant/theme';
import CustomDropDown from '../../Component/CustomDropDown';
import { Base_Uri } from '../../constant/BaseUri';
import axios from "axios"
import { Callout } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobTicket from '../JobTicket';
import filterContext from '../../context/filterContext';
import { stat } from 'react-native-fs';
import DropDownModalView from '../../Component/DropDownModalView';


const Filter = ({ navigation, route }: any) => {



  let data = route.params



  const filter = useContext(filterContext)

  let { subjects, city, state, category } = filter


  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchCategoryData, setSearchCategoryData] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [searchSubjectData, setSearchSubjectData] = useState([])
  const [selectedMode, setSelectedMode] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [searchStateData, setSearchStateData] = useState([])
  const [selectedCity, setSelectedCity] = useState('')
  const [searchCityData, setSearchCityData] = useState([])


  const [status, setStatus] = useState([
    {
      option: "Approved"
    },
    {
      option: "Pending"
    },
    {
      option: "Rejected"
    }
  ])

  const [selectedStatus, setSelectedStatus] = useState("")



  const [classMode, setClassMode] = useState([
    {
      id: 1,
      subject: 'Physical',
    },
    {
      id: 2,
      subject: 'Online',
    },

  ]);

  const applyFilter = async () => {

    let jobFilter = {
      Category: selectedCategory,
      subject: selectedSubject,
      mode: selectedMode,
      state: selectedState,
      city: selectedCity
    }

    let myFilter = JSON.stringify(jobFilter)
    navigation.navigate("Job Ticket", jobFilter)
    await AsyncStorage.setItem('filter', myFilter)
    ToastAndroid.show('your data has been successfully filtered', ToastAndroid.SHORT)

  }

  const resetFilter = async () => {
    await AsyncStorage.removeItem('filter').then((res) => {
      navigation.navigate("Job Ticket", "remove filter")
      ToastAndroid.show('Filtered has been Successfully reset', ToastAndroid.SHORT)

    }).catch((error) => {
      ToastAndroid.show('Filter reset unsuccessfull', ToastAndroid.SHORT)
    })

  }

  const handleSearchData = (text: string, type: string) => {

    if (type == "category") {
      let myData = category && category.length > 0 && category.filter((e: any, i: number) => {

        if (e?.subject?.toLowerCase()?.includes(text?.toLowerCase())) {
          return e
        }
      })
      setSearchCategoryData(myData)
    }
    else if (type == "subject") {

      let myData = subjects && subjects.length > 0 && subjects.filter((e: any, i: number) => {



        if (e?.subject?.toLowerCase()?.includes(text?.toLowerCase())) {
          return e
        }
      })

      setSearchSubjectData(myData)

    }
    else if (type == "state") {

      let myData = state && state.length > 0 && state.filter((e: any, i: number) => {



        if (e?.subject?.toLowerCase()?.includes(text?.toLowerCase())) {
          return e
        }
      })

      console.log(myData, "dataa")

      setSearchStateData(myData)

    }
    else {

      let myData = city && city.length > 0 && city.filter((e: any, i: number) => {



        if (e?.subject?.toLowerCase()?.includes(text?.toLowerCase())) {
          return e
        }
      })


      setSearchCityData(myData)


    }
  }

  const applyStatusFilter = async () => {

    if (!selectedStatus) {

      ToastAndroid.show("Kindly Select Status", ToastAndroid.SHORT)
      return
    }

    let data = JSON.stringify(selectedStatus)

    await AsyncStorage.setItem("statusFilter", data)

    ToastAndroid.show("Filter has been succesfully Applied", ToastAndroid.SHORT)

    navigation.navigate("Job Ticket", selectedStatus)


  }

  const resetStatusFilter = async () => {


    await AsyncStorage.removeItem("statusFilter")
    ToastAndroid.show("Filter has been succesfully reset", ToastAndroid.SHORT)


    navigation.navigate("Job Ticket", "reset")



  }




  return (
    <View style={{ backgroundColor: Theme.white, height: '100%' }}>
      <Header title="Filter" backBtn navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {data ? <View style={{ paddingHorizontal: 15 }} >
          <DropDownModalView
            title="Status"
            selectedValue={setSelectedStatus}
            placeHolder="Select Status"
            option={status}
            modalHeading="Select Status"
          />
        </View>
          : <View style={{ paddingHorizontal: 15 }}>
            <CustomDropDown
              setSelectedSubject={setSelectedCategory}
              search={"category"}
              dataShow={5}
              searchData={searchCategoryData}
              searchFunc={handleSearchData}
              selectedSubject={selectedCategory}
              ddTitle="Category"
              headingStyle={{ color: Theme.black, fontWeight: "700" }}
              dropdownPlace={"Select Category"}
              dropdownContainerStyle={{
                paddingVertical: 15,
              }}
              subject={category}
              categoryShow={"complain_name"} />
            <CustomDropDown
              setSelectedSubject={setSelectedSubject}
              search={"subject"}
              searchData={searchSubjectData}
              searchFunc={handleSearchData}
              selectedSubject={selectedSubject}
              ddTitle="Subject" headingStyle={{ color: Theme.black, fontWeight: "700" }} dropdownPlace={"Select Subject"}
              dropdownContainerStyle={{ paddingVertical: 15, }} subject={subjects} categoryShow={"subject"} />
            <CustomDropDown
              setSelectedSubject={setSelectedMode}
              selectedSubject={selectedMode}
              ddTitle="Mode" headingStyle={{ color: Theme.black, fontWeight: "700" }} dropdownPlace={"Select Mode"} dropdownContainerStyle={{ paddingVertical: 15, }} subject={classMode} categoryShow={"subject"} />
            <CustomDropDown setSelectedSubject={setSelectedState}
              selectedSubject={selectedState} search={"state"} searchData={searchStateData}
              searchFunc={handleSearchData} ddTitle="State" headingStyle={{ color: Theme.black, fontWeight: "700" }} dropdownPlace={"Select State"} dropdownContainerStyle={{ paddingVertical: 15, }} subject={state} categoryShow={"subject"} />
            <CustomDropDown ddTitle="City"
              search={"city"} searchData={searchCityData}
              searchFunc={handleSearchData}
              setSelectedSubject={setSelectedCity}

              selectedSubject={selectedCity}
              headingStyle={{ color: Theme.black, fontWeight: "700" }} dropdownPlace={"Select City"} dropdownContainerStyle={{ paddingVertical: 15, }} subject={city} categoryShow={"subject"} />
          </View>}
      </ScrollView>
      <View style={{ width: "100%", alignItems: "center" }} >
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            justifyContent: "center",
            gap: 10,
            marginTop: 20,
            marginBottom: 40
          }}>
          <TouchableOpacity
            style={{
              width: '48%',
              alignItems: 'center',
              backgroundColor: Theme.darkGray,
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => data ? applyStatusFilter() : applyFilter()}
          >
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 12 }}>
              Apply
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '48%',
              alignItems: 'center',
              backgroundColor: Theme.gray,
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => data ? resetStatusFilter() : resetFilter()}
          >
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 12 }}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({});
