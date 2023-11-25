import React, { useState } from "react"
import Students from "../Screens/Students"
import BannerContext from "./bannerContext"


const BannerState = (prop) => {

    const [homePageBanner, setHomePageBanner] = useState([])
    const [schedulePageBannner, setSchedulePageBanner] = useState([])
    const [jobTicketBanner, setJobTicketBanner] = useState([])
    const [profileBanner, setProfileBanner] = useState([])
    const [paymentHistoryBanner, setPaymentHistoryBanner] = useState([])
    const [reportSubmissionBanner, setReportSubmissionBanner] = useState([])
    const [inboxBanner, setInboxBanner] = useState([])
    const [faqBanner, setFaqBanner] = useState([])
    const [studentBanner, setStudentBanner] = useState([])


    return (
        <BannerContext.Provider value={{ homePageBanner, setHomePageBanner, schedulePageBannner, setSchedulePageBanner, jobTicketBanner, setJobTicketBanner, profileBanner, setProfileBanner, paymentHistoryBanner, setPaymentHistoryBanner, reportSubmissionBanner, setReportSubmissionBanner, inboxBanner, setInboxBanner, faqBanner, setFaqBanner, studentBanner, setStudentBanner }} >
            {prop.children}
        </BannerContext.Provider>
    )



}

export default BannerState