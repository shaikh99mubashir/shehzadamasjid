import React, { useState } from "react"
import Students from "../Screens/Students"
import ScheduleContext from "./scheduleContext"

const ScheduleState = (prop) => {

    const [scheduleData, setScheduleData] = useState([])
    const [upcomingClass, setUpcomingClass] = useState([])


    return (
        <ScheduleContext.Provider value={{ scheduleData, setScheduleData, upcomingClass, setUpcomingClass }} >
            {prop.children}
        </ScheduleContext.Provider>
    )



}

export default ScheduleState