import { StyleSheet, Text, View,TouchableOpacity,ActivityIndicator,ToastAndroid, FlatList } from 'react-native'
import React,{useState} from 'react'
import Header from '../../Component/Header'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Theme } from '../../constant/theme';
import axios from 'axios';
import { Base_Url } from '../../constant/BaseUri';

const ShowAttendence = ({navigation}:any) => {
    const [startDate, setStartDate]:any = useState(null);
  const [endDate, setEndDate]:any = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [value, setValue] = useState(new Date());
  const [loading, setLoading] = useState(false)
  const showStartDatepicker = () => {
    setShowStartDatePicker(true);
    setShowEndDatePicker(false);
  };

  const showEndDatepicker = () => {
    if (!startDate) {
        ToastAndroid.show('Please select the start date first', ToastAndroid.SHORT);
        return;
      }
    setShowEndDatePicker(true);
    setShowStartDatePicker(false);
  };

  
  const onChange = (event:any, selectedDate:any) => {
    if (selectedDate) {
      if (showStartDatePicker) {
        let formattedDate:any = new Date(selectedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
        setStartDate(formattedDate);
      } else if (showEndDatePicker) {
        let formattedDate:any = new Date(selectedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
          if (formattedDate < startDate) {
            // Handle the case where the end date is earlier than the start date
            ToastAndroid.show('End date cannot be earlier than start date', ToastAndroid.SHORT);
            setShowEndDatePicker(false);
            return;
          }
        setEndDate(formattedDate);
      }
    }

    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
  };

  const [attendanceData, setAttendanceData] = useState([]);

  console.log("data====>",attendanceData);
  const getAttendenceData = () => {
    setLoading(true);
    if (startDate === null && endDate === null) {
      ToastAndroid.show('Kindly Select Start Date & Ending Date', ToastAndroid.SHORT);
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append('endDate', endDate);
    formData.append('startDate', startDate);
    console.log("Request Payload:", { startDate, endDate });
    axios
      .get(`${Base_Url}getAttendanceReport/1`,  {
        params: {
          startDate:startDate,
          endDate:endDate
        },
      })
      .then(({data}) => {
        setAttendanceData(data.attendanceReport);
        setLoading(false);
        
        
      })
      .catch(( error ) => {
        console.log("error.response",error.response);
        console.log("error.message",error.message);
        console.log("error.code",error.code);
        setLoading(false);
      })
  }

  function convertDateFormat(date: string): string {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();

    return `${day} ${monthNames[monthIndex]} ${year}`;
  }
  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* <View style={{ flexDirection: 'column' }}>
          <Text style={{ color: 'black', fontWeight: '600' }}>
          Date
          </Text>
          <Text style={{ color: 'grey', }}>
          {convertDateFormat(item.creation_date)}
          </Text>
        </View> */}
        <View style={{ flexDirection: 'column' }}>
          <Text style={{ color: 'black', fontWeight: '600' }}>
            Date
          </Text>
          <Text style={{ color: 'grey', }}>
          {convertDateFormat(item.creation_date)}
          </Text>
        </View>

      </View>
      <Text style={{ marginTop: 5, color: 'black', fontWeight: '600' }}>
      Clock In Time : <Text style={{ color: 'grey', }}>{item.clockintime}</Text>
      </Text>
      <Text style={{ marginTop: 5, color: 'black', fontWeight: '600' }}>
      Clock Out Time :<Text style={{ color: 'grey', }}> {item.clockouttime}</Text>
      </Text>
      <Text style={{ marginTop: 5, color: 'black', fontWeight: '600' }}>
      Clockin Latitude : <Text style={{ color: 'grey', }}>{item.clockinlatitude}</Text>
      </Text>
      <Text style={{ marginTop: 5, color: 'black', fontWeight: '600' }}>
      Clockin Longitude :<Text style={{ color: 'grey', }}> {item.clockinlongitude}</Text>
      </Text>
      <Text style={{ marginTop: 5, color: 'black', fontWeight: '600' }}>
      Clock Out Latitude : <Text style={{ color: 'grey', }}>{item.clockoutlatitude}</Text>
      </Text>
      <Text style={{ marginTop: 5, color: 'black', fontWeight: '600' }}>
      Clock Out Longitude :<Text style={{ color: 'grey', }}> {item.clockoutlongitude}</Text>
      </Text>
      <Text style={{ marginTop: 5, color: 'black', fontWeight: '600' }}>
      Location Name Clockin : <Text style={{ color: 'grey', }}>{item.locationNameClockin}</Text>
      </Text>
      <Text style={{ marginTop: 5, color: 'black', fontWeight: '600' }}>
      Location Name Clockout :<Text style={{ color: 'grey', }}> {item.locationNameClockout}</Text>
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white', }}>
      <Header title="Attendence" navigation={navigation} backBtn />
      <View style={{paddingHorizontal:15}}>
      <View style={{display:"flex", justifyContent:"space-between", flexDirection:'row', marginTop:20,  }}>
      <View style={{alignItems:'center'}}>
        {startDate &&
        <Text style={{fontSize:16, color:'black', marginBottom:5}}>Starting From</Text>
        }
      <TouchableOpacity style={{borderWidth:1, paddingVertical:10,paddingHorizontal:30,borderRadius:10}} onPress={showStartDatepicker}>
        <Text style={{fontSize:16, color:'black'}}>{startDate ? startDate : 'Select Start Date'}</Text>
      </TouchableOpacity>
      </View>
      <View style={{alignItems:'center'}}>
      {startDate &&
      <Text style={{fontSize:16, color:'black', marginBottom:5}}>Ending To</Text>
      }
      <TouchableOpacity style={{borderWidth:1, paddingVertical:10,paddingHorizontal:30,borderRadius:10}}  onPress={showEndDatepicker}>
        <Text style={{fontSize:16, color:'black'}}>{endDate ? endDate : 'Select End Date'}</Text>
      </TouchableOpacity>
      </View>
      </View>
     
      <TouchableOpacity  onPress={() => getAttendenceData()} style={{ backgroundColor: Theme.darkGray, width: "100%", padding: 10, borderRadius: 10, marginTop: 20, }} >
      {loading ? (
            <ActivityIndicator color={Theme.white} size="small" />
          ) : (
            <Text style={{ textAlign: "center", fontSize: 16, color: 'white',  }} >
              Generate
            </Text>
          )}
          </TouchableOpacity>
        </View>

        <FlatList
              data={attendanceData}
              renderItem={renderItem}
              
            />
      {showStartDatePicker && (
        <DateTimePicker
          testID="startDatePicker"
          value={value}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          testID="endDatePicker"
          value={value}
          mode="date"
          is24Hour={true}
          display="default"
        //   minimumDate={startDate}
          onChange={onChange}
        />
      )}
    </View>
  )
}

export default ShowAttendence

const styles = StyleSheet.create({
  container: {},
  itemContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 5,
    padding: 16,
    borderWidth: 1,
    borderColor: 'silver',
    elevation: 1
  },
});