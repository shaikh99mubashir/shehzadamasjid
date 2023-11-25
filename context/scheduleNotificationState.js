import React, { useState } from "react"
import Students from "../Screens/Students"
import ScheduleNotificationContext from "./scheduleNotificationContext"

const ScheduleNotificationState = (prop) => {

    const [scheduleNotification, setScheduleNotification] = useState([])


    return (
        <ScheduleNotificationContext.Provider value={{ scheduleNotification, setScheduleNotification }} >
            {prop.children}
        </ScheduleNotificationContext.Provider>
    )



}

export default ScheduleNotificationState