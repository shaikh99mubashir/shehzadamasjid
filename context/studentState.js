import React, { useState } from "react"
import StudentContext from "./studentContext"
import Students from "../Screens/Students"



const StudentState = (prop) => {

    const [students, setStudents] = useState("")
    const [subjects, setSubjects] = useState("")


    const updateStudent = (students) => {

        setStudents(students)

    }

    const updateSubject = (subject) => {

        setSubjects(subject)
    }


    return (
        <StudentContext.Provider value={{ students, updateStudent, subjects, updateSubject }} >
            {prop.children}
        </StudentContext.Provider>
    )



}

export default StudentState