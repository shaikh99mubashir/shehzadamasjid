import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
  Platform,
  Linking,
  PermissionsAndroid,
  RefreshControl,
  NativeModules,
  Dimensions,
  ToastAndroid,
  Modal,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {Theme} from '../../constant/theme';
import Header from '../../Component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Base_Uri} from '../../constant/BaseUri';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';
import reportSubmissionContext from '../../context/reportSubmissionContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import bannerContext from '../../context/bannerContext';
import TutorDetailsContext from '../../context/tutorDetailsContext';
const ReportSubmissionHistory = ({navigation}: any) => {
  // const [reportSubmission, setreportSubmission] = useState([]);
  // const [progressReport, setProgressReport] = useState([]);

  let context = useContext(reportSubmissionContext);
  let bannerCont = useContext(bannerContext);

  let {reportSubmissionBanner, setReportSubmissionBanner} = bannerCont;
  const tutorDetailsContext = useContext(TutorDetailsContext);
  let {tutorDetails} = tutorDetailsContext;

  let {
    reportSubmission,
    setreportSubmission,
    progressReport,
    setProgressReport,
  } = context;

  const [foundName, setFoundName] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfUri, setPdfUri] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [refresh, setRefresh] = useState(false);
  const [openPPModal, setOpenPPModal] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setRefresh(!refresh);
      setOpenPPModal(true);
    }, 2000);
  }, [refresh]);

  const getReportSubmissionHistory = async () => {
    if (refresh) {
      setLoading(true);

      let data: any = await AsyncStorage.getItem('loginAuth');

      data = JSON.parse(data);

      let {tutorID} = data;

      axios
        .get(`${Base_Uri}api/tutorFirstReportListing/${tutorID}`)
        .then(({data}) => {
          let {tutorReportListing} = data;
          setreportSubmission(tutorReportListing);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.log('error');
        });
    }
  };

  const getProgressReportHistory = async () => {
    if (refresh) {
      setLoading(true);

      let data: any = await AsyncStorage.getItem('loginAuth');

      data = JSON.parse(data);

      let {tutorID} = data;

      axios
        .get(`${Base_Uri}api/progressReportListing`)
        .then(({data}) => {
          let {progressReportListing} = data;

          let tutorReport =
            progressReportListing &&
            progressReportListing.length > 0 &&
            progressReportListing.filter((e: any, i: number) => {
              return e.tutorID == tutorID;
            });

          // console.log(tutorReport, "reoirt")
          setProgressReport(
            tutorReport && tutorReport.length > 0 ? tutorReport : [],
          );
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.log('error');
        });
    }
  };

  useEffect(() => {
    getReportSubmissionHistory();
    getProgressReportHistory();
  }, [refresh]);

  let allReports = [...reportSubmission, ...progressReport];

  const [searchText, setSearchText] = useState('');
  const searchStudent = (e: any) => {
    setSearchText(e);

    console.log(e, 'eee');

    if (e.length == 0) {
      setSearchText('');
      setFoundName([]);
      return;
    }

    let filteredItems: any = allReports.filter((x: any) => {
      if (x?.studentID?.toString().toLowerCase().includes(e?.toLowerCase())) {
        return x;
      } else if (
        x?.studentName?.toString().toLowerCase().includes(e?.toLowerCase())
      ) {
        return x;
      }
    });
    setFoundName(filteredItems);
  };
  const closeBannerModal = async () => {
    if (reportSubmissionBanner.displayOnce == 'on') {
      let bannerData = {...reportSubmissionBanner};

      let stringData = JSON.stringify(bannerData);

      let data = await AsyncStorage.setItem('reportBanner', stringData);
      setReportSubmissionBanner([]);
      setOpenPPModal(false);
    } else {
      setOpenPPModal(false);
    }
  };

  const generateAndDownalodPdf = async (
    item: any,
  ): Promise<string | undefined> => {
    try {
      const options = {
        html: `<html>
        <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
            padding:0;
            margin:0;
          }
        </style>
      </head>
        <body>
        <div>
        <div>
       
        <div style="display: flex; justify-content: space-between;">
          <div style="display: flex; flex-direction: column; width: 45%">
            <img src=${item.logo} alt="logo" style="width: 150px" />
            <span style="color: blue";margin-top: 15px;>Sifu Edu & Learning Sdn Bhd (1270698-W)</span>
            <span style="margin-top: 15px;">1-1F, Jalan Setia Perdana BE U13/BE Setia Alam, Shah Alam, 40170,
              Selangor Tel: 603-5888 4827</span>
          </div>
          <div style="display: flex; flex-direction: column; width: 50%">
            <p
              style="font-size: 25px; background-color: orangered;
               color: white; padding: 8px; white-space: pre; font-weight: 700;margin-top: 20px;"
              >${item.tutorReportType}</p>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: row;">
        <div style="display: flex; align-items: center;gap: 10px; width:50%;">
        <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Student</h3>
        <h3 style='white-space: pre;'>${item.studentName}</h3>
      </div>
  
      <div style="display: flex; align-items: center;gap:5px;width:50%;">
      <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Tutor</h3>
      <h3 style='white-space: pre;'>${item.tutorName}</h3>
    </div>
    </div>



    <div style="display: flex; flex-direction: row;">
          
          <div style="display: flex; align-items: center;gap:5px;width:50%">
            <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Subject</h3>
            <h3 style='white-space: pre;'>${item.subjectName}</h3>
          </div>
          <div style="display: flex; align-items: center;gap:5px;width:50%">
            <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Month</h3>
            <h3 style='white-space: pre;'>${item.month}</h3>
          </div>
        </div>
      </div>

      <div>
      <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; marginTop: 10px;">A. KNOWLEDGE</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin: 0px;">1. What can you tell us about the student’s knowledge of this subject?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.knowledge ===
          'Poor - Able to recall basic facts after giving hints about the subject matter.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px;background-color: ${
          item.knowledge ===
          'Poor - Able to recall basic facts after giving hints about the subject matter.'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.knowledge ===
          'Poor - Able to recall basic facts after giving hints about the subject matter.'
            ? 'Poor - Able to recall basic facts after giving hints about the subject matter.'
            : 'Poor - Able to recall basic facts after giving hints about the subject matter.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.knowledge ===
          'Average - Able to recall some basic facts independently.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px;background-color: ${
          item.knowledge ===
          'Average - Able to recall some basic facts independently.'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.knowledge ===
          'Average - Able to recall some basic facts independently.'
            ? 'Average - Able to recall some basic facts independently.'
            : 'Average - Able to recall some basic facts independently.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.knowledge ===
          'Good - Able to recall basic facts with ease and little error.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px;background-color: ${
          item.knowledge ===
          'Good - Able to recall basic facts with ease and little error.'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.knowledge ===
          'Good - Able to recall basic facts with ease and little error.'
            ? 'Good - Able to recall basic facts with ease and little error.'
            : 'Good - Able to recall basic facts with ease and little error.'
        }</p>
      </div>
      
      
     
  </div>
  </div>
  <div style="margin-top: 20px;">
      <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">B. UNDERSTANDING</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin: 0px;">1. What can you tell about the student’s understanding of this subject?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.understanding ===
          'Poor - Able to explain/demonstrate facts with difficulty.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px;background-color: ${
          item.understanding ===
          'Poor - Able to explain/demonstrate facts with difficulty.'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.understanding ===
          'Poor - Able to explain/demonstrate facts with difficulty.'
            ? 'Poor - Able to explain/demonstrate facts with difficulty.'
            : 'Poor - Able to explain/demonstrate facts with difficulty.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.understanding ===
          'Average - Able to explain/demonstrate facts with some error.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px;background-color: ${
          item.understanding ===
          'Average - Able to explain/demonstrate facts with some error.'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.understanding ===
          'Average - Able to explain/demonstrate facts with some error.'
            ? 'Average - Able to explain/demonstrate facts with some error.'
            : 'Poor - Able to explain/demonstrate facts with difficulty.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.understanding ===
          'Good - Able to explain/demonstrate facts concisely with little error'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px;background-color: ${
          item.understanding ===
          'Good - Able to explain/demonstrate facts concisely with little error'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.understanding ===
          'Good - Able to explain/demonstrate facts concisely with little error'
            ? 'Good - Able to explain/demonstrate facts concisely with little error'
            : 'Poor - Able to explain/demonstrate facts with difficulty.'
        }</p>
      </div>
  </div>
  <div style="margin-top: 20px;">
      <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">C. ANALYSIS</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin: 0px;">1. What can you tell about the student’s understanding of this subject?</p>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.analysis ===
          'Poor - Able to solve different types of problems with guidance.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px;background-color: ${
          item.analysis ===
          'Poor - Able to solve different types of problems with guidance.'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.analysis ===
          'Poor - Able to solve different types of problems with guidance.'
            ? 'Poor - Able to solve different types of problems with guidance.'
            : 'Poor - Able to solve different types of problems with guidance.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.analysis ===
          'Average - Able to solve different types of problems with some hint.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px;background-color: ${
          item.analysis ===
          'Average - Able to solve different types of problems with some hint.'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.analysis ===
          'Average - Able to solve different types of problems with some hint.'
            ? 'Average - Able to solve different types of problems with some hint.'
            : 'Average - Able to solve different types of problems with some hint.'
        }</p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
        <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.analysis === 'Good - Able to solve problems with different ways.'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
        <p style="margin: 0px;background-color: ${
          item.analysis === 'Good - Able to solve problems with different ways.'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.analysis === 'Good - Able to solve problems with different ways.'
            ? 'Good - Able to solve problems with different ways.'
            : 'Good - Able to solve problems with different ways.'
        }</p>
      </div>
  </div>
  <div style="margin-top: 20px;">
  <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">D. ADDITIONAL ASSESMENT</p>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
  <p style="color: rgb(0, 0, 95); margin: 0px;">1. What is the current score for the subject?</p>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
      <p style="margin: 0px;">${item.additionalAssisment}</p>
  </div>
  </div>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
  <p style="color: rgb(0, 0, 95); margin: 0px;">2. Elaborate your plan to help the student?</p>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
      <p style="margin: 0px;">${item.plan}</p>
  </div>
  </div>
</div>
  </div>
        
        </body></html>`,
        fileName: `report${Math.random()}`,
        directory: 'Downloads',
        base64: false,
      };
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('Permission denied for writing to external storage.');
          return;
        }
      }

      const pdfFile = await RNHTMLtoPDF.convert(options);
      const {filePath}: any = pdfFile;
      return filePath;
    } catch (error) {
      console.log('Error generating and downloading the PDF:', error);
      throw error;
    }
  };

  const handleGenerateAndDownloadPdf = async (item: any) => {
    try {
      const pdfUri: any = await generateAndDownalodPdf(item);
      setPdfUri(pdfUri); // Set the local file URI of the downloaded PDF
    } catch (error) {
      console.log('Error generating and downloading the PDF:', error);
    }
  };

  const generateDownloadProgressReport = async (
    item: any,
  ): Promise<string | undefined> => {
    try {
      const options = {
        html: `        <html>
        <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
          }
        </style>
      </head>
        <body>
        <div>
        <div>
       
        <div style="display: flex; justify-content: space-between;">
          <div style="display: flex; flex-direction: column; width: 45%">
            <img src=${item.logo} alt="logo" style="width: 150px" />
            <p style="color: blue";margin-top: 20px;>Sifu Edu & Learning Sdn Bhd (1270698-W)</p>
            <p style="margin-top: 5px;">1-1F, Jalan Setia Perdana BE U13/BE Setia Alam, Shah Alam, 40170,
              Selangor Tel: 603-5888 4827</p>
          </div>
          <div style="display: flex; flex-direction: column; width: 50%">
            <span
              style="font-size: 25px; background-color: orangered;
               color: white; padding: 8px; white-space: pre; font-weight: 700;margin-top: 20px;"
              >${item.reportType}</span>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: row;gap:10px;">
        <div style="display: flex; align-items: center;gap: 10px;width:50%;">
        <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Student</h3>
        <h3 style='white-space: pre;'>${item.studentID}</h3>
        </div>

        <div style="display: flex; align-items: center;gap:5px;width:50%;">
        <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Tutor</h3>
        <h3 style='white-space: pre;'>${item.tutorID}</h3>
      </div>
      </div>

        <div style="display: flex; flex-direction: row;gap:10px;">
         
          <div style="display: flex; align-items: center;gap:5px;width:50%;">
            <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Subject</h3>
            <h3 style='white-space: pre;'>${item.subjectID}</h3>
          </div>
          <div style="display: flex; align-items: center;gap:5px;width:50%;">
            <h3 style="background-color: orangered; padding: 10px;margin-right: 5px;color: white;width:80px;">Month</h3>
            <h3 style='white-space: pre;'>${item.month}</h3>
          </div>
        </div>
      </div>

      <div>
      <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">A. PERFOMANCE</p>
      <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
      <p style="color: rgb(0, 0, 95); margin-top: 5px;">1. Rate student understanding on this subject?</p>
      <div style='display:flex; flex-direction:row; justify-content: space-between;'>
      <div style="display: flex; align-items: center; gap: 15px; padding-bottom: 0px; padding-top: 0px;">
      <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
        item.rate_student_understanding_on_this_subject === 'Excellent'
          ? 'rgb(0, 0, 95)'
          : 'white'
      };border: 2px solid rgb(0, 0, 95);"></div>
      <p style="margin: 0px;background-color: ${
        item.rate_student_understanding_on_this_subject === 'Excellent'
          ? 'orange'
          : 'white'
      }; padding: 0px;">${
          item.rate_student_understanding_on_this_subject === 'Excellent'
            ? 'Excellent'
            : 'Excellent'
        }</p>
    </div>

      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
      <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
        item.rate_student_understanding_on_this_subject === 'Good'
          ? 'rgb(0, 0, 95)'
          : 'white'
      };border: 2px solid rgb(0, 0, 95);"></div>
      <p style="margin: 0px;background-color: ${
        item.rate_student_understanding_on_this_subject === 'Good'
          ? 'orange'
          : 'white'
      }; padding: 0px;">${
          item.rate_student_understanding_on_this_subject === 'Good'
            ? 'Good'
            : 'Good'
        }</p>
    </div>

    <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
    <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
      item.rate_student_understanding_on_this_subject === 'Satisfactory'
        ? 'rgb(0, 0, 95)'
        : 'white'
    };border: 2px solid rgb(0, 0, 95);"></div>
    <p style="margin: 0px;background-color: ${
      item.rate_student_understanding_on_this_subject === 'Satisfactory'
        ? 'orange'
        : 'white'
    }; padding: 0px;">${
          item.rate_student_understanding_on_this_subject === 'Satisfactory'
            ? 'Satisfactory'
            : 'Satisfactory'
        }</p>
  </div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.rate_student_understanding_on_this_subject === 'Average'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.rate_student_understanding_on_this_subject === 'Average'
      ? 'orange'
      : 'white'
  }; padding: 0px;">${
          item.rate_student_understanding_on_this_subject === 'Average'
            ? 'Average'
            : 'Average'
        }</p>
</div>

</div>


<p style="color: rgb(0, 0, 95); margin-top: 10px;">2. how is the student performance on homework?</p>
<div style='display:flex; flex-direction:row; justify-content: space-between;'>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
      <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
        item.how_is_the_student_performance_on_homework === 'Excellent'
          ? 'rgb(0, 0, 95)'
          : 'white'
      };border: 2px solid rgb(0, 0, 95);"></div>
      <p style="margin: 0px;background-color: ${
        item.how_is_the_student_performance_on_homework === 'Excellent'
          ? 'orange'
          : 'white'
      }; padding: 5px;">${
          item.how_is_the_student_performance_on_homework === 'Excellent'
            ? 'Excellent'
            : 'Excellent'
        }</p>
    </div>

      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
      <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
        item.how_is_the_student_performance_on_homework === 'Good'
          ? 'rgb(0, 0, 95)'
          : 'white'
      };border: 2px solid rgb(0, 0, 95);"></div>
      <p style="margin: 0px;background-color: ${
        item.how_is_the_student_performance_on_homework === 'Good'
          ? 'orange'
          : 'white'
      }; padding: 5px;">${
          item.how_is_the_student_performance_on_homework === 'Good'
            ? 'Good'
            : 'Good'
        }</p>
    </div>

    <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
    <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
      item.how_is_the_student_performance_on_homework === 'Satisfactory'
        ? 'rgb(0, 0, 95)'
        : 'white'
    };border: 2px solid rgb(0, 0, 95);"></div>
    <p style="margin: 0px;background-color: ${
      item.how_is_the_student_performance_on_homework === 'Satisfactory'
        ? 'orange'
        : 'white'
    }; padding: 5px;">${
          item.how_is_the_student_performance_on_homework === 'Satisfactory'
            ? 'Satisfactory'
            : 'Satisfactory'
        }</p>
  </div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_is_the_student_performance_on_homework === 'Average'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_is_the_student_performance_on_homework === 'Average'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.how_is_the_student_performance_on_homework === 'Average'
            ? 'Average'
            : 'Average'
        }</p>
</div>
</div>


<p style="color: rgb(0, 0, 95); margin-top: 10px;">3. How well student participates in learning session?</p>
<div style='display:flex; flex-direction:row; justify-content: space-between;'>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
      <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
        item.how_well_student_answers === 'Excellent'
          ? 'rgb(0, 0, 95)'
          : 'white'
      };border: 2px solid rgb(0, 0, 95);"></div>
      <p style="margin: 0px;background-color: ${
        item.how_well_student_answers === 'Excellent' ? 'orange' : 'white'
      }; padding: 5px;">${
          item.how_well_student_answers === 'Excellent'
            ? 'Excellent'
            : 'Excellent'
        }</p>
    </div>

      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
      <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
        item.how_well_student_answers === 'Good' ? 'rgb(0, 0, 95)' : 'white'
      };border: 2px solid rgb(0, 0, 95);"></div>
      <p style="margin: 0px;background-color: ${
        item.how_well_student_answers === 'Good' ? 'orange' : 'white'
      }; padding: 5px;">${
          item.how_well_student_answers === 'Good' ? 'Good' : 'Good'
        }</p>
    </div>

    <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
    <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
      item.how_well_student_answers === 'Satisfactory'
        ? 'rgb(0, 0, 95)'
        : 'white'
    };border: 2px solid rgb(0, 0, 95);"></div>
    <p style="margin: 0px;background-color: ${
      item.how_well_student_answers === 'Satisfactory' ? 'orange' : 'white'
    }; padding: 5px;">${
          item.how_well_student_answers === 'Satisfactory'
            ? 'Satisfactory'
            : 'Satisfactory'
        }</p>
  </div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_well_student_answers === 'Average' ? 'rgb(0, 0, 95)' : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_well_student_answers === 'Average' ? 'orange' : 'white'
  }; padding: 5px;">${
          item.how_well_student_answers === 'Average' ? 'Average' : 'Average'
        }</p>
</div>
</div>



<p style="color: rgb(0, 0, 95); margin-top: 10px;">4. How well student's answer/explain/eleborates questions givenby tutor?</p>
<div style='display:flex; flex-direction:row; justify-content: space-between;'>
      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
      <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
        item.how_well_student_answers === 'Excellent'
          ? 'rgb(0, 0, 95)'
          : 'white'
      };border: 2px solid rgb(0, 0, 95);"></div>
      <p style="margin: 0px;background-color: ${
        item.how_well_student_answers === 'Excellent' ? 'orange' : 'white'
      }; padding: 5px;">${
          item.how_well_student_answers === 'Excellent'
            ? 'Excellent'
            : 'Excellent'
        }</p>
    </div>

      <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
      <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
        item.how_well_student_answers === 'Good' ? 'rgb(0, 0, 95)' : 'white'
      };border: 2px solid rgb(0, 0, 95);"></div>
      <p style="margin: 0px;background-color: ${
        item.how_well_student_answers === 'Good' ? 'orange' : 'white'
      }; padding: 5px;">${
          item.how_well_student_answers === 'Good' ? 'Good' : 'Good'
        }</p>
    </div>

    <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
    <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
      item.how_well_student_answers === 'Satisfactory'
        ? 'rgb(0, 0, 95)'
        : 'white'
    };border: 2px solid rgb(0, 0, 95);"></div>
    <p style="margin: 0px;background-color: ${
      item.how_well_student_answers === 'Satisfactory' ? 'orange' : 'white'
    }; padding: 5px;">${
          item.how_well_student_answers === 'Satisfactory'
            ? 'Satisfactory'
            : 'Satisfactory'
        }</p>
  </div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_well_student_answers === 'Average' ? 'rgb(0, 0, 95)' : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_well_student_answers === 'Average' ? 'orange' : 'white'
  }; padding: 5px;">${
          item.how_well_student_answers === 'Average' ? 'Average' : 'Average'
        }</p>
</div>
</div>



  </div>
  </div>
  <div style="margin-top: 10px;">
  <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">B. ATTITUDE</p>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 10px;">
  <p style="color: rgb(0, 0, 95); margin-top: 10px;">1. How can you rate the student attendence for 3 months</p>
  <div style='display:flex; flex-direction:row; justify-content: space-between;'>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_you_can_rate_student_attendance_for_3_months === 'Excellent'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_you_can_rate_student_attendance_for_3_months === 'Excellent'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.how_you_can_rate_student_attendance_for_3_months === 'Excellent'
            ? 'Excellent'
            : 'Excellent'
        }</p>
</div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_you_can_rate_student_attendance_for_3_months === 'Good'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_you_can_rate_student_attendance_for_3_months === 'Good'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.how_you_can_rate_student_attendance_for_3_months === 'Good'
            ? 'Good'
            : 'Good'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.how_you_can_rate_student_attendance_for_3_months ===
          'Satisfactory'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.how_you_can_rate_student_attendance_for_3_months ===
          'Satisfactory'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.how_you_can_rate_student_attendance_for_3_months ===
          'Satisfactory'
            ? 'Satisfactory'
            : 'Satisfactory'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.how_you_can_rate_student_attendance_for_3_months === 'Average'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.how_you_can_rate_student_attendance_for_3_months === 'Average'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.how_you_can_rate_student_attendance_for_3_months === 'Average'
            ? 'Average'
            : 'Average'
        }</p>
</div>
</div>


<p style="color: rgb(0, 0, 95); margin-top: 10px;">2. How well do you intrect/communicate with student during/after class?</p>
<div style='display:flex; flex-direction:row; justify-content: space-between;'>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_well_do_you_interact_with_studyent_during_class === 'Excellent'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_well_do_you_interact_with_studyent_during_class === 'Excellent'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.how_well_do_you_interact_with_studyent_during_class ===
          'Excellent'
            ? 'Excellent'
            : 'Excellent'
        }</p>
</div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_well_do_you_interact_with_studyent_during_class === 'Good'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_well_do_you_interact_with_studyent_during_class === 'Good'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.how_well_do_you_interact_with_studyent_during_class === 'Good'
            ? 'Good'
            : 'Good'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.how_well_do_you_interact_with_studyent_during_class ===
          'Satisfactory'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.how_well_do_you_interact_with_studyent_during_class ===
          'Satisfactory'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.how_well_do_you_interact_with_studyent_during_class ===
          'Satisfactory'
            ? 'Satisfactory'
            : 'Satisfactory'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.how_well_do_you_interact_with_studyent_during_class === 'Average'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.how_well_do_you_interact_with_studyent_during_class === 'Average'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.how_well_do_you_interact_with_studyent_during_class === 'Average'
            ? 'Average'
            : 'Average'
        }</p>
</div>
</div>


<p style="color: rgb(0, 0, 95); margin-top: 10px;">3. How well the student manage his/her time to complete his/her homework?</p>
<div style='display:flex; flex-direction:row; justify-content: space-between;'>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_well_the_student_manages_his_time_tomplete_his_homework ===
    'Excellent'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_well_the_student_manages_his_time_tomplete_his_homework ===
    'Excellent'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.how_well_the_student_manages_his_time_tomplete_his_homework ===
          'Excellent'
            ? 'Excellent'
            : 'Excellent'
        }</p>
</div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_well_the_student_manages_his_time_tomplete_his_homework === 'Good'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_well_the_student_manages_his_time_tomplete_his_homework === 'Good'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.how_well_the_student_manages_his_time_tomplete_his_homework ===
          'Good'
            ? 'Good'
            : 'Good'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.how_well_the_student_manages_his_time_tomplete_his_homework ===
          'Satisfactory'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.how_well_the_student_manages_his_time_tomplete_his_homework ===
          'Satisfactory'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.how_well_the_student_manages_his_time_tomplete_his_homework ===
          'Satisfactory'
            ? 'Satisfactory'
            : 'Satisfactory'
        }</p>
</div>


<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 5px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.how_well_the_student_manages_his_time_tomplete_his_homework ===
          'Average'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.how_well_the_student_manages_his_time_tomplete_his_homework ===
          'Average'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.how_well_the_student_manages_his_time_tomplete_his_homework ===
          'Average'
            ? 'Average'
            : 'Average'
        }</p>
</div>
</div>



<p style="color: rgb(0, 0, 95); margin-top: 10px;">4. How well the student response were corrected?</p>
<div style='display:flex; flex-direction:row; justify-content: space-between;'>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_well_the_student_respondes_when_corrected === 'Excellent'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_well_the_student_respondes_when_corrected === 'Excellent'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.how_well_the_student_respondes_when_corrected === 'Excellent'
            ? 'Excellent'
            : 'Excellent'
        }</p>
</div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_well_the_student_respondes_when_corrected === 'Good'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_well_the_student_respondes_when_corrected === 'Good'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.how_well_the_student_respondes_when_corrected === 'Good'
            ? 'Good'
            : 'Good'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.how_well_the_student_respondes_when_corrected === 'Satisfactory'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.how_well_the_student_respondes_when_corrected === 'Satisfactory'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.how_well_the_student_respondes_when_corrected === 'Satisfactory'
            ? 'Satisfactory'
            : 'Satisfactory'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.how_well_the_student_respondes_when_corrected === 'Average'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.how_well_the_student_respondes_when_corrected === 'Average'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.how_well_the_student_respondes_when_corrected === 'Average'
            ? 'Average'
            : 'Average'
        }</p>
</div>
  </div>
  </div>


  <div style="margin-top: 10px;">
  <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">C. RESULT</p>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 10px;">
  <p style="color: rgb(0, 0, 95); margin-top: 10px;">1. Rate the student's performance in the quizes</p>
  <div style='display:flex; flex-direction:row; justify-content: space-between;'>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.rate_the_student_performance_in_quizzes === 'Excellent'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.rate_the_student_performance_in_quizzes === 'Excellent'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.rate_the_student_performance_in_quizzes === 'Excellent'
            ? 'Excellent'
            : 'Excellent'
        }</p>
</div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.rate_the_student_performance_in_quizzes === 'Good'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.rate_the_student_performance_in_quizzes === 'Good' ? 'orange' : 'white'
  }; padding: 5px;">${
          item.rate_the_student_performance_in_quizzes === 'Good'
            ? 'Good'
            : 'Good'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.rate_the_student_performance_in_quizzes === 'Satisfactory'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.rate_the_student_performance_in_quizzes === 'Satisfactory'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.rate_the_student_performance_in_quizzes === 'Satisfactory'
            ? 'Satisfactory'
            : 'Satisfactory'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.rate_the_student_performance_in_quizzes === 'Average'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.rate_the_student_performance_in_quizzes === 'Average'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.rate_the_student_performance_in_quizzes === 'Average'
            ? 'Average'
            : 'Average'
        }</p>
</div>
</div>


<p style="color: rgb(0, 0, 95); margin-top: 10px;">2. How well the student prepare for the test and assignment?</p>
<div style='display:flex; flex-direction:row; justify-content: space-between;'>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_well_the_student_prepares_for_test_and_assignment === 'Excellent'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_well_the_student_prepares_for_test_and_assignment === 'Excellent'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.how_well_the_student_prepares_for_test_and_assignment ===
          'Excellent'
            ? 'Excellent'
            : 'Excellent'
        }</p>
</div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_well_the_student_prepares_for_test_and_assignment === 'Good'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_well_the_student_prepares_for_test_and_assignment === 'Good'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.how_well_the_student_prepares_for_test_and_assignment === 'Good'
            ? 'Good'
            : 'Good'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.how_well_the_student_prepares_for_test_and_assignment ===
          'Satisfactory'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.how_well_the_student_prepares_for_test_and_assignment ===
          'Satisfactory'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.how_well_the_student_prepares_for_test_and_assignment ===
          'Satisfactory'
            ? 'Satisfactory'
            : 'Satisfactory'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.how_well_the_student_prepares_for_test_and_assignment ===
          'Average'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.how_well_the_student_prepares_for_test_and_assignment ===
          'Average'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.how_well_the_student_prepares_for_test_and_assignment ===
          'Average'
            ? 'Average'
            : 'Average'
        }</p>
</div>
</div>


<p style="color: rgb(0, 0, 95); margin-top: 10px;">3. How student's test score at school?</p>
<div style='display:flex; flex-direction:row; justify-content: space-between;'>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_is_the_student_test_score_at_school === 'Excellent'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_is_the_student_test_score_at_school === 'Excellent'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.how_is_the_student_test_score_at_school === 'Excellent'
            ? 'Excellent'
            : 'Excellent'
        }</p>
</div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.how_is_the_student_test_score_at_school === 'Good'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.how_is_the_student_test_score_at_school === 'Good' ? 'orange' : 'white'
  }; padding: 5px;">${
          item.how_is_the_student_test_score_at_school === 'Good'
            ? 'Good'
            : 'Good'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.how_is_the_student_test_score_at_school === 'Satisfactory'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.how_is_the_student_test_score_at_school === 'Satisfactory'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.how_is_the_student_test_score_at_school === 'Satisfactory'
            ? 'Satisfactory'
            : 'Satisfactory'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.how_is_the_student_test_score_at_school === 'Average'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.how_is_the_student_test_score_at_school === 'Average'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.how_is_the_student_test_score_at_school === 'Average'
            ? 'Average'
            : 'Average'
        }</p>
</div>
</div>



<p style="color: rgb(0, 0, 95); margin-top: 10px;">4. How student's learning prefrences, willingness to learn, and interest towords the subject?</p>
<div style='display:flex; flex-direction:row; justify-content: space-between;'> 
<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.rate_student_learning_preferences_willingness_to_learn_and_inter ===
    'Excellent'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.rate_student_learning_preferences_willingness_to_learn_and_inter ===
    'Excellent'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.rate_student_learning_preferences_willingness_to_learn_and_inter ===
          'Excellent'
            ? 'Excellent'
            : 'Excellent'
        }</p>
</div>

  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
  <div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
    item.rate_student_learning_preferences_willingness_to_learn_and_inter ===
    'Good'
      ? 'rgb(0, 0, 95)'
      : 'white'
  };border: 2px solid rgb(0, 0, 95);"></div>
  <p style="margin: 0px;background-color: ${
    item.rate_student_learning_preferences_willingness_to_learn_and_inter ===
    'Good'
      ? 'orange'
      : 'white'
  }; padding: 5px;">${
          item.rate_student_learning_preferences_willingness_to_learn_and_inter ===
          'Good'
            ? 'Good'
            : 'Good'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.rate_student_learning_preferences_willingness_to_learn_and_inter ===
          'Satisfactory'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.rate_student_learning_preferences_willingness_to_learn_and_inter ===
          'Satisfactory'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.rate_student_learning_preferences_willingness_to_learn_and_inter ===
          'Satisfactory'
            ? 'Satisfactory'
            : 'Satisfactory'
        }</p>
</div>

<div style="display: flex; align-items: center; gap: 10px; padding-bottom: 0px; padding-top: 0px;">
<div style="border-radius: 50%; height: 13px; width: 13px; background-color: ${
          item.rate_student_learning_preferences_willingness_to_learn_and_inter ===
          'Average'
            ? 'rgb(0, 0, 95)'
            : 'white'
        };border: 2px solid rgb(0, 0, 95);"></div>
<p style="margin: 0px;background-color: ${
          item.rate_student_learning_preferences_willingness_to_learn_and_inter ===
          'Average'
            ? 'orange'
            : 'white'
        }; padding: 5px;">${
          item.rate_student_learning_preferences_willingness_to_learn_and_inter ===
          'Average'
            ? 'Average'
            : 'Average'
        }</p>
</div>
</div>
  </div>
  <div style="margin-top: 10px;">
  <p style="background-color: orangered;color: white;font-weight: 700;padding: 5px; margin: 0px;">D. OBSERVATION</p>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
  <p style="color: rgb(0, 0, 95); margin: 0px;">1.  Did you (tutor) hold or carried out any form of eximination/test/quiz for student within this 3 months?</p>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
      <p style="margin: 0px;">${
        item.did_you_hold_or_carried_out_any_form_of_examination_for_the_stud
      }</p>
  </div>
  </div>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
  <p style="color: rgb(0, 0, 95); margin: 0px;">2. How do you rate student's performance based on this test?</p>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
      <p style="margin: 0px;">${
        item.how_do_you_rate_student_performance_based_on_this_test
      }</p>
  </div>
  </div>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
  <p style="color: rgb(0, 0, 95); margin: 0px;">3. which topic(s) has the students showed some significant improvement?</p>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
      <p style="margin: 0px;">${
        item.which_topic_has_the_student_showed_some_significant_improvement
      }</p>
  </div>
  </div>
  <div style="margin-top:5px;border: 1px solid rgb(0, 0, 95);padding: 5px;">
  <p style="color: rgb(0, 0, 95); margin: 0px;">4. Can you determine and name the topic(s) that the student should improve and focus on?</p>
  <div style="display: flex; align-items: center; gap: 10px; padding-bottom: 10px; padding-top: 5px;">
      <p style="margin: 0px;">${
        item.can_you_determine_and_name_the_topic_that_the_student_should_imp
      }</p>
  </div>
  </div>
</div>
  </div>
        
        </body></html>`,
        fileName: `report${Math.random()}`,
        directory: 'Downloads',
        base64: false,
      };
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error('Permission denied for writing to external storage.');
          return;
        }
      }

      const pdfFile = await RNHTMLtoPDF.convert(options);
      const {filePath}: any = pdfFile;
      return filePath;
    } catch (error) {
      console.log('Error generating and downloading the PDF:', error);
      throw error;
    }
  };

  const handleGenerateProgressReport = async (item: any) => {
    try {
      const pdfUri: any = await generateDownloadProgressReport(item);
      setPdfUri(pdfUri); // Set the local file URI of the downloaded PDF
    } catch (error) {
      console.log('Error generating and downloading the PDF:', error);
    }
  };

  const displayBanner = async () => {
    setOpenPPModal(true);
    axios
      .get(`${Base_Uri}api/bannerAds`)
      .then(({data}) => {})
      .catch(error => {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    displayBanner();
  }, []);

  const linkToOtherPage = () => {
    if (reportSubmissionBanner.callToActionType == 'Open URL') {
      Linking.openURL(reportSubmissionBanner.urlToOpen);
    } else if (reportSubmissionBanner.callToActionType == 'Open Page')
      if (reportSubmissionBanner.pageToOpen == 'Dashboard') {
        navigation.navigate('Home');
      } else if (reportSubmissionBanner.pageToOpen == 'Faq') {
        navigation.navigate('FAQs');
      } else if (reportSubmissionBanner.pageToOpen == 'Class Schedule List') {
        navigation.navigate('Schedule');
      } else if (reportSubmissionBanner.pageToOpen == 'Student List') {
        navigation.navigate('Students');
      } else if (reportSubmissionBanner.pageToOpen == 'Inbox') {
        navigation.navigate('inbox');
      } else if (reportSubmissionBanner.pageToOpen == 'Profile') {
        navigation.navigate('Profile');
      } else if (reportSubmissionBanner.pageToOpen == 'Payment History') {
        navigation.navigate('PaymentHistory');
      } else if (reportSubmissionBanner.pageToOpen == 'Job Ticket List') {
        navigation.navigate('Job Ticket');
      } else if (reportSubmissionBanner.pageToOpen == 'Submission History') {
        navigation.navigate('ReportSubmissionHistory');
      }
  };

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color={Theme.black} />
    </View>
  ) : pdfUri ? (
    <View style={{flex: 1}}>
      <Pdf
        source={{uri: pdfUri}}
        style={{flex: 1, backgroundColor: 'gray', marginBottom: 5}}
      />
      <TouchableOpacity
        onPress={() => setPdfUri('')}
        style={{
          width: '100%',
          alignSelf: 'center',
          padding: 10,
          backgroundColor: 'black',
        }}>
        <Text style={{fontSize: 16, textAlign: 'center', color: 'white'}}>
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={{backgroundColor: Theme.white, height: '100%'}}>
      <Header title="Student Reports" backBtn navigation={navigation} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled>
        <View style={{paddingHorizontal: 15}}>
          {/* Search */}
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                width: '100%',
                backgroundColor: Theme.lightGray,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 4,
                paddingHorizontal: 10,
                marginVertical: 15,
              }}>
              <TextInput
                placeholder="Search"
                placeholderTextColor="black"
                onChangeText={e => searchStudent(e)}
                style={{width: '90%', padding: 8, color: 'black'}}
              />
              <TouchableOpacity onPress={() => navigation}>
                <Image
                  source={require('../../Assets/Images/search.png')}
                  style={{width: 20, height: 20}}
                />
              </TouchableOpacity>
            </View>
          </View>

          {allReports && allReports.length > 0 ? (
            <FlatList
              data={foundName.length > 0 ? foundName : allReports}
              nestedScrollEnabled
              keyExtractor={(item: any) => item.id}
              renderItem={({item, index}: any) => {
                return (
                  <View
                    key={index}
                    style={{
                      borderWidth: 1,
                      paddingHorizontal: 15,
                      marginTop: 10,
                      paddingVertical: 15,
                      borderRadius: 10,
                      gap: 10,
                      marginRight: 10,
                      borderColor: '#eee',
                      width: '100%',
                    }}>
                    {/* Avaiable Subject */}
                    <View style={{}}>
                      <Text
                        style={{
                          color: Theme.black,
                          fontSize: 12,
                          fontWeight: '600',
                        }}>
                        {item.studentID}
                      </Text>
                      <Text
                        style={{
                          color: Theme.gray,
                          fontSize: 12,
                          fontWeight: '600',
                          paddingVertical: 10,
                        }}>
                        {item.studentName}
                      </Text>
                      <Text
                        style={{
                          color: Theme.black,
                          fontSize: 12,
                          fontWeight: '600',
                        }}>
                        Subimited on {item.created_at}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            color: Theme.gray,
                            fontSize: 12,
                            fontWeight: '600',
                            paddingTop: 10,
                          }}>
                          {item?.tutorReportType ?? item.reportType}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            item.reportType
                              ? handleGenerateProgressReport(item)
                              : handleGenerateAndDownloadPdf(item)
                          }
                          style={{alignItems: 'center'}}>
                          <Image
                            source={require('../../Assets/Images/inbox.png')}
                            style={{width: 25, height: 25}}
                            resizeMode="contain"
                          />
                          <Text style={{fontSize: 10, color: 'black'}}>
                            Download
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <View style={{marginTop: 35}}>
              <Text
                style={{color: Theme.black, fontSize: 12, textAlign: 'center'}}>
                No Record Found...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      {Object.keys(reportSubmissionBanner).length > 0 &&
        (reportSubmissionBanner.tutorStatusCriteria == 'All' ||
          tutorDetails.status == 'verified') && (
          <View style={{flex: 1}}>
            <Modal
              visible={openPPModal}
              animationType="fade"
              transparent={true}
              onRequestClose={() => closeBannerModal()}>
              <TouchableOpacity
                onPress={() => linkToOtherPage()}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 5,
                    marginHorizontal: 20,
                  }}>
                  <TouchableOpacity onPress={() => closeBannerModal()}>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        paddingVertical: 10,
                        paddingRight: 15,
                      }}>
                      <AntDesign
                        name="closecircleo"
                        size={20}
                        color={'black'}
                      />
                    </View>
                  </TouchableOpacity>
                  {/* <Image source={{uri:}} style={{width:Dimensions.get('screen').width/1.1,height:'80%',}} resizeMode='contain'/> */}
                  <Image
                    source={{uri: reportSubmissionBanner.bannerImage}}
                    style={{
                      width: Dimensions.get('screen').width / 1.1,
                      height: '80%',
                    }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        )}
    </View>
  );
};

export default ReportSubmissionHistory;

const styles = StyleSheet.create({});
