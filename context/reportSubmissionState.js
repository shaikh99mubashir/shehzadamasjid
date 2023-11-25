import React, { useState } from "react"
import Students from "../Screens/Students"
import ReportSubmissionContext from "./reportSubmissionContext"

const ReportSubmissionState = (prop) => {

    const [reportSubmission, setreportSubmission] = useState([]);
    const [progressReport, setProgressReport] = useState([]);

    return (

        <ReportSubmissionContext.Provider value={{ reportSubmission, setreportSubmission, progressReport, setProgressReport }} >
            {prop.children}
        </ReportSubmissionContext.Provider>
    )



}

export default ReportSubmissionState