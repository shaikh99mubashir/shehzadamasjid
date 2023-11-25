
import React, { useState } from "react";
import UpcomingClassContext from "./upcomingClassContext";





const UpcomingClassState = (prop) => {
    
    const [upcomingClass, setUpcomingClass] = useState("")
    

    return (

    <UpcomingClassContext.Provider value={{ upcomingClass, setUpcomingClass }} >

        {prop.children}


    </UpcomingClassContext.Provider>

)

}


export default UpcomingClassState
