import React,{useState} from "react"
import TutorDetailsContext from "./tutorDetailsContext"



const TutorDetailsState = (prop) => {

    const [tutorDetails,setTutorDetail] = useState("")


    const updateTutorDetails = (details) => {

        setTutorDetail(details)


    }


    return (
        <TutorDetailsContext.Provider value={{tutorDetails,updateTutorDetails,setTutorDetail}} >

            {prop.children}

        </TutorDetailsContext.Provider>
    )


}

export default TutorDetailsState