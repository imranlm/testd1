import React, { useState, useEffect } from "react";
import axios from "axios";
import InstructorSidebar from "../utilities/InstructorSidebar";
import DashboardCard from "../utilities/DashboardCard";
import PageNameAndDate from "../utilities/PageNameAndDate";
import CircularProgress from "@mui/material/CircularProgress";

function InstructorDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/auth/verifyAuth`, { withCredentials: true })
      .then((response) => {
        if (response.data.user.userType === "instructor") {
          setIsAuthenticated(true);
          fetchDashboardData();
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        setIsAuthenticated(false);
        console.log("Error verifying authentication:", error);
      });
  }, []);

  const fetchDashboardData = () => {
    axios
      .get(`http://localhost:5000/instructor/dashboard`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response)
        setLoading(false);
        setDashboardData(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching dashboard data:", error);
      });
  };

  // Destructure values from dashboardData
  const totalStudents = dashboardData ? dashboardData.totalStudents : 0;
  const totalCourses = dashboardData ? dashboardData.totalCourses : 0;
  const totalSimulators = dashboardData ? dashboardData.totalSimulators : 0;
  const meetingsScheduled = dashboardData ? dashboardData.meetingsScheduled : 0;

  console.log(dashboardData?.meetings);
  // Function to format date as MM/DD/YYYY
  // const formatDate = (date) => {
  //   const day = String(date.getDate()).padStart(2, '0');  // Ensures two digits for day
  //   const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are zero-based
  //   const year = date.getFullYear();

  //   return `${month}/${day}/${year}`;
  // };
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const formatMeetingDate = (dateString) => {
    // Parse the date string to a Date object
    const date = new Date(dateString);

    // Extract the date parts
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getUTCFullYear();

    return `${month}/${day}/${year}`;
  };
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const upcomingMeetings =
    dashboardData && dashboardData.meetings
      ? dashboardData.meetings.filter((meeting) => {
          // Convert meeting date from UTC to local time
          const meetingDate = new Date(meeting.date);

          const today = new Date();
          const formattedCurrentDate = formatDate(today);
          const formattedMeetingDate = formatDate(meetingDate);

          // Parse formatted dates back to Date objects for comparison
          const currentDateObject = parseDate(formattedCurrentDate);
          const meetingDateObject = parseDate(formattedMeetingDate);

      

          return meetingDateObject >= currentDateObject;
        })
      : [];

  console.log("Upcoming Meetings:", upcomingMeetings);

  return isAuthenticated === null ? (
    <div>Loading...</div> // Show loading state while checking authentication
  ) : isAuthenticated ? (
    <div className="flex flex-col md:flex-row h-screen">
      <InstructorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 mt-4">
          <PageNameAndDate pageName="Dashboard" />
          {loading && (
            <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
              <CircularProgress style={{ color: "blue" }} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <DashboardCard label="Total Students" value={totalStudents} />
            <DashboardCard label="Total Courses" value={totalCourses} />
            <DashboardCard label="Total Simulators" value={totalSimulators} />
            <DashboardCard
              label="Meetings Scheduled"
              value={upcomingMeetings.length}
            />
          </div>
          <div className="flex flex-col gap-3 items-center w-11/12 h-52 overflow-auto m-auto mt-12 bg-gray-100 rounded-xl p-4 shadow-md shadow-gray-200">
            <h2 className="text-xl font-semibold">Notice Board</h2>
            <p>Upcoming Sessions</p>
            <hr className="w-full border" />
            <div className="flex justify-between w-full">
              <p className="font-bold">Link</p>
              <p className="font-bold">Date</p>
              <p className="font-bold">Time</p>
            </div>
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((meeting, index) => {
                const meetingDate = new Date(meeting.date);
                const formattedDate = meetingDate.toLocaleDateString("en-US");
                const formattedTime = meeting.time;

                return (
                  <div key={index} className="flex justify-between w-full mt-4">
                    <div className="flex flex-col gap-2 w-12">
                      <p className="w-full break-words">
                        <a
                          href={meeting.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-500 underline"
                          style={{
                            width: "150px",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {meeting.meetingLink || "N/A"}
                        </a>
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="pl-24">{formattedDate}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p>{formattedTime}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No upcoming sessions.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold">You are not logged in</h1>
    </div>
  );
}
export default InstructorDashboard;
