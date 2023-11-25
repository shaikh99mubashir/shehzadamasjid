import React, { useEffect, useState, } from "react";
import NoteContext from "./noteContext";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment, { min } from "moment";

const NoteState = (prop) => {


    const [time, setTime] = useState({
        seconds: 0,
        minutes: 0,
        hour: 0
    })


    let { seconds, minutes, hour } = time

    // const [hour, setHour] = useState(0)
    // const [seconds, setSeconds] = useState(0)
    // const [minutes, setMinutes] = useState(0)
    const [tutorID, setTutorId] = useState("")
    const [firstTimeIn, setFirstTimeIn] = useState(false)


    const handleAppStateChange = async (newAppState) => {
        if (newAppState === 'active' && firstTimeIn) {
            console.log(newAppState, "APPsTATE")
            let myData = await AsyncStorage.getItem("timer")
            let date = JSON.parse(myData)
            if (date) {

                let convertDate = moment(date)
                let convertGetTime = convertDate.toDate().getTime()
                let nowDate = new Date().getTime()
                let diff = nowDate - convertGetTime
                let totalHourDiff = diff / 1000 / 60 / 60
                if (totalHourDiff.toString().includes(".")) {
                    let splitHours = totalHourDiff.toString().split(".")
                    let hours = Number(splitHours[0])
                    let remainingHours = splitHours[1]
                    let minutesDiff = Number(`0.${remainingHours}`) * 60
                    if (minutesDiff.toString().includes(".")) {
                        let minutesSplit = minutesDiff.toString().split(".")

                        let myMinutes = Number(minutesSplit[0])
                        let remainingMinutes = minutesSplit[1]
                        let secondsDiff = Number(`0.${remainingMinutes}`) * 60
                        let Myseconds = Number(Math.ceil(secondsDiff))

                        console.log(Myseconds, "SECONRDS")
                        console.log(myMinutes, "MINUTES")

                        setTime({
                            ...time,
                            seconds: Myseconds,
                            minutes: myMinutes,
                            hour: hours
                        })
                    } else {
                        setTime({
                            ...time,
                            minutes: minutesDiff,
                            hour: hours
                        })
                    }
                } else {
                    setTime({
                        ...time,
                        hour: totalHourDiff
                    })
                }

            } else {

                let time = new Date()
                let stringTime = JSON.stringify(time)
                AsyncStorage.setItem("timer", stringTime)
            }
            // App is coming back from the background
            // Place your code here that you want to run
        }
    };






    const getTutorId = async () => {

        let data = await AsyncStorage.getItem('loginAuth');
        data = JSON.parse(data);
        let { tutorID } = data;
        setTutorId(tutorID)
    }

    useEffect(() => {

        getTutorId()

    }, [])


    useEffect(() => {
        // ...


        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => subscription.remove();

    }, []);


    const update = () => {


        if (seconds < 59) {
            setTime({
                ...time,
                seconds: seconds + 1
            })
        }
        if (seconds == 59) {
            setTime({
                ...time,
                seconds: 0,
                minutes: minutes + 1
            })
        }
        if (minutes == 59) {
            setTime({
                ...time,
                minutes: 0,
                hour: hour + 1
            })
        }
        if (hour == 23) {
            setTime({
                ...time,
                hour: 0
            })
        }

    }




    const cleanTime = () => {

        setTime({
            ...time,
            seconds: 0,
            minutes: 0,
            hour: 0
        })

    }


    return (
        <NoteContext.Provider value={{ hour, seconds, minutes, update, cleanTime, tutorID, setTime, time, setFirstTimeIn }} >

            {prop.children}

        </NoteContext.Provider>
    )

}

export default NoteState