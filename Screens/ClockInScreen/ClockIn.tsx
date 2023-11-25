import React, { useEffect, useState } from "react"
import MapView, { Marker } from "react-native-maps"
import { View, Text, TouchableOpacity, Image, PermissionsAndroid, ToastAndroid, ActivityIndicator } from "react-native"
import { Theme } from "../../constant/theme"
import Header from "../../Component/Header"
import { launchCamera } from "react-native-image-picker"
import Geolocation from "@react-native-community/geolocation"
import axios from "axios"
import { Base_Uri } from "../../constant/BaseUri"
import AsyncStorage from "@react-native-async-storage/async-storage"

function ClockIn({ navigation, route }: any) {

    let item = route.params


    const [loading, setLoading] = useState(false)


    const [currentLocation, setCurrentLocation] = useState<any>({
        latitude: null,
        longitude: null
    })


    const getCurrentLocation = () => {


        Geolocation.getCurrentPosition(e => setCurrentLocation({
            ...currentLocation,
            latitude: e.coords.latitude,
            longitude: e.coords.longitude

        }))

    }


    useEffect(() => {

        getCurrentLocation()

    }, [])


    const handleClockInPress = async () => {


        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {


            const options: any = {
                title: 'Select Picture',
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
                maxWidth: 250,
                maxHeight: 250,
                quality: 0.3,
            };

            launchCamera(options, (res: any) => {

                if (res.didCancel) {
                    console.log('User cancelled image picker');
                } else if (res.error) {
                    console.log('ImagePicker Error:', res.error);
                } else {

                    let { assets } = res

                    let startMinutes = new Date().getHours()
                    let startSeconds = new Date().getMinutes()

                    let data: any = {
                        id: item.id,
                        class_schedule_id: item?.class_schedule_id,
                        startMinutes: startMinutes,
                        startSeconds: startSeconds,
                        hasIncentive: item?.hasIncentive ? item?.hasIncentive : 0
                    }

                    let formData = new FormData()

                    formData.append("id", data.id)
                    formData.append("class_schedule_id", data.class_schedule_id)
                    formData.append("startMinutes", data.startMinutes)
                    formData.append("startSeconds", data.startSeconds)
                    formData.append("hasIncentive", data.hasIncentive)
                    formData.append('startTimeProofImage', {
                        uri: assets[0].uri,
                        type: assets[0].type,
                        name: assets[0].fileName,
                    });
                    setLoading(true)
                    axios.post(`${Base_Uri}api/attendedClassClockInTwo`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }).then((res) => {
                        setLoading(false)
                        data.data = res.data
                        data.item = item

                        let storageData: any = { ...data }
                        storageData = JSON.stringify(storageData)
                        AsyncStorage.setItem("classInProcess", storageData)
                        navigation.replace("ClassTimerCount", data)
                    }).catch((error) => {
                        setLoading(false)
                        console.log(error, "error")


                    })
                }
            }

            )



        }

    }


    return (
        loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <ActivityIndicator size={"large"} color={"Black"} /></View>
            :
            <View style={{ flex: 1, alignItems: "center" }} >
                <Header backBtn navigation={navigation} title={"Clock In"} />
                {currentLocation.latitude && currentLocation.longitude && <MapView
                    style={{ height: "100%", width: "100%" }}
                    region={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                        }}

                    />



                </MapView>}

                <TouchableOpacity style={{ borderWidth: 1, borderColor: Theme.lightGray, padding: 20, backgroundColor: Theme.white, bottom: 20, borderRadius: 10, position: "absolute", width: "90%" }} >
                    <View style={{ flexDirection: "row", alignItems: "center" }} >
                        <View style={{ borderWidth: 1, borderColor: Theme.lightGray, borderRadius: 100, width: 70, height: 70, alignItems: "center", justifyContent: "center", backgroundColor: Theme.darkGray }} >
                            <Image source={item.imageUrl} style={{ width: 45, height: 45 }} />
                        </View>
                        <Text style={{ fontSize: 14, color: Theme.gray, marginLeft: 10 }} >{item.studentName}</Text>
                    </View>

                    <View style={{ marginTop: 10, flexDirection: "row" }} >
                        <Text style={{ fontSize: 16, color: Theme.black, fontWeight: "600", textTransform: "uppercase" }} >{item.subjectName}</Text>

                    </View>

                    <View style={{ flexDirection: "row" }} >

                        <Text style={{ color: Theme.gray }} >{(item.startTime).toString()} - {(item.endTime).toString()} | </Text>

                        <Text style={{ color: Theme.gray }} >{(item.date.slice(0, 10)).toString()}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleClockInPress()} style={{ backgroundColor: Theme.darkGray, width: "100%", padding: 10, borderRadius: 10, marginTop: 10 }} >
                        <Text style={{ textAlign: "center", fontSize: 16, color: 'white' }} >
                            Clock In
                        </Text>
                    </TouchableOpacity>

                </TouchableOpacity>


            </View>
    )
}

export default ClockIn