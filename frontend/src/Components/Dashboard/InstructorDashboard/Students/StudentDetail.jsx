import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import InstructorSidebar from "../../utilities/InstructorSidebar";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';
import PageNameAndDate from "../../utilities/PageNameAndDate";
import CircularProgress from "@mui/material/CircularProgress";

const StudentDetail = () => {
  const { id } = useParams(); // Extract studentId from URL
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated,setIsAuthenticated]=useState('');

  useEffect(() => {
    setLoading(true)
    axios
      .get(`http://localhost:5000/auth/verifyAuth`, { withCredentials: true })
      .then((response) => {
        setLoading(false)
        console.log(response);
        if (response.data.user.userType === "instructor") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        setLoading(false)
        setIsAuthenticated(false);
        console.log(error);
      });
  }, []);


  useEffect(() => {
    if (id) {
      setLoading(true)
      axios
        .get(`http://localhost:5000/instructor/dashboard/student/${id}`, { withCredentials: true })
        .then((response) => {
          setLoading(false)
          console.log(response.data)
          setStudent(response.data); // Updated to reflect the correct data structure
        })
        .catch((error) => {
          setLoading(false)
          console.error("Error fetching student details:", error);
        });
    }
  }, [id]);

  if (!student) {
    return  
      <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
        <CircularProgress style={{ color: "blue" }} />
      </div>
   
  }

  return isAuthenticated === null ? (
  
      <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
        <CircularProgress style={{ color: "blue" }} />
      </div>
   
  ) : isAuthenticated ? (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="fixed flex flex-col md:flex-row h-screen">
        <InstructorSidebar />
      </div>

      <div className="md:ml-[268px] sm:ml-44 flex flex-col w-full">
        <div className="w-full p-6 mt-4">
          <PageNameAndDate pageName={"students"} />
        </div>
        <div className=" overflow-auto h-[450px] w-full">
        <div className="text-sm flex flex-col justify-center gap-4 p-4 ml-8 w-11/12 rounded-xl shadow-xl border flex-wrap">
          {/* Student Profile */}
          <div className="flex flex-col"> {/* Fixed height and overflow handling */}
            <h1 className=" font-semibold text-md mb-4">Student Profile</h1>
            <div className="flex gap-4">
            {loading && (
              <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
                <CircularProgress style={{ color: "blue" }} />
              </div>
            )}
              <div className="item-center self-center">
                <AccountCircleIcon fontSize="large" sx={{ color: 'gray' }} />
              </div>
              <div className="flex flex-col">
                <p>{student.name}</p>
                <p>{student.email}</p>
                <p>Contact: {student.contact}</p>
              </div>
            </div>
          </div>
          <hr />

          {/* Courses */}
          <div className="flex flex-col">
            {/* <h1 className=" font-semibold text-md">Courses</h1> */}
            {student.courses.length > 0 ? (
              student.courses.map((course, index) => (
                <div key={index} className="flex justify-between mt-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-semibold">Course Name</h2>
                    <p>{course.courseTitle}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-semibold">Price</h2>
                    <p>${course.coursePrice}</p>
                  </div>
                  {/* <div className="flex flex-col gap-2">
                    <h2 className="font-semibold">Start Date</h2>
                    <p>{new Date(course.startDate).toLocaleDateString()}</p>
                  </div> */}
                  <div className="flex flex-col gap-2">
                    <h2 className="font-semibold">Duration</h2>
                    <p>{course.courseDuration}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No courses found.</p>
            )}
          </div>
          <hr />

          {/* Simulators */}
          <div className="flex flex-col">
            {/* <h1 className=" font-semibold text-md">Simulators</h1> */}
            {student.simulatorsPurchased.length > 0 ? (
              student.simulatorsPurchased.map((simulator, index) => (
                <div key={index} className="flex justify-between mt-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-semibold">Simulator Name</h2>
                    <p>{simulator.simulatorTitle}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-semibold">Price</h2>
                    <p>${simulator.simulatorPrice}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-semibold">Duration</h2>
                    <p>{simulator.simulatorDuration}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No simulators found.</p>
            )}
          </div>
          <hr />

          {/* Upcoming Meetings */}
          <div className="flex flex-col">
            <h1 className=" font-semibold text-md mb-4">Upcoming Meetings</h1>
            {student.upcomingMeetings.length > 0 ? (
              student.upcomingMeetings.map((meeting, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarTodayIcon fontSize="small" sx={{ color: 'gray' }} />
                    <p>{new Date(meeting.date).toLocaleDateString()} | {meeting.time}</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <LinkIcon sx={{ color: 'darkBlue' }} />
                    <p>{meeting.meetingLink}</p>
                    <button className="bg-blue-600 text-white px-2 py-1 text-xs rounded-xl">Join</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No upcoming meetings.</p>
            )}
          </div>
          <hr />

          {/* Past Meetings */}
          <div className="flex flex-col">
            <h1 className=" font-semibold text-md mb-4">Past Meetings</h1>
            {student.pastMeetings.length > 0 ? (
              student.pastMeetings.map((meeting, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CalendarTodayIcon fontSize="small" sx={{ color: 'gray' }} />
                  <p>{new Date(meeting.date).toLocaleDateString()} | {meeting.time}</p>
                </div>
              ))
            ) : (
              <p>No past meetings.</p>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
     ) : (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-semibold">You are not logged in</h1>
      </div>
  );
};

export default StudentDetail;
