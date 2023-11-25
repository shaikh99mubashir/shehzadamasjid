import React, { useState } from "react"
import Students from "../Screens/Students"
import NotificationContext from "./notificationContext"


const NotificationState = (prop) => {

    const [notification, setNotification] = useState([])

    return (
        <NotificationContext.Provider value={{ notification, setNotification}} >
            {prop.children}
        </NotificationContext.Provider>
    )



}

export default NotificationState