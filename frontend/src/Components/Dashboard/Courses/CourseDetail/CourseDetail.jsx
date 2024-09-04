import React, { useState, useEffect } from "react";
import Sidebar from "../../utilities/Sidebar";
import PageNameAndDate from "../../utilities/PageNameAndDate";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDayId, setSelectedDayId] = useState("");
  const [selectedTimeId, setSelectedTimeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const [courseData, setCourseData] = useState("");
  const params = useParams();
  const courseId = params.courseId;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/auth/verifyAuth`, { withCredentials: true })
      .then((response) => {
        setLoading(false);
        if (response.data.user.userType === "student") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setIsAuthenticated(false);
        console.log(error);
      });
  }, []);
  const getCourseData = async () => {
    setLoading(true);
    const response = await axios.get(
      `http://localhost:5000/student/dashboard/course/courseDetail`,
      {
        params: {
          courseId: courseId,
        },
        withCredentials: true,
      }
    );
    setLoading(false);
    console.log(response.data);
    setCourseData(response.data.course);
  };

  useEffect(() => {
    const fetchAvailabilityData = async () => {
      setLoading(true);
      axios
        .get(
          `http://localhost:5000/student/dashboard/getInstructorAvailability`,
          { withCredentials: true }
        )
        .then((response) => {
          console.log(response)
          setLoading(false);
          setAvailabilityData(response.data.availability || []);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching availability data:", error);
        });
    };

    fetchAvailabilityData();
    getCourseData();
  }, []);

  // const formatTime = (timeString) => {
  //   const date = new Date(timeString);
  //   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  // };

  const getDateForDay = (day) => {
    const today = new Date();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = daysOfWeek.indexOf(day);

    // Calculate the difference in days
    const diff = (dayIndex - today.getDay() + 7) % 7;
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + diff);

    return nextDay.toLocaleDateString();
  };

  const handleDayChange = (event) => {
    const day = event.target.value;
    setSelectedDay(day);
    setSelectedTime(""); // Reset the time when the day changes
    setSelectedTimeId(""); // Reset the time ID when the day changes

    const daySlot = availabilityData.find((slot) => slot.day === day);
    if (daySlot) {
      setSelectedDayId(daySlot._id); // Set the selected day ID
    }
  };

  const availableTimes = selectedDay
  ? availabilityData
      .find((slot) => slot.day === selectedDay)
      ?.times.filter((time) => {
        // Check if the time slot is booked
        console.log(new Date(time.bookedBy.date))
        console.log(new Date())
        const isBooked = time.bookedBy && new Date(time.bookedBy.date) <= new Date();
        console.log(isBooked);
        return isBooked || new Date(time.start) >= new Date();
      })
  : [];


  const handleTimeChange = (event) => {
    const timeId = event.target.value;
    const timeSlot = availableTimes.find((time) => time._id === timeId);
  
    if (timeSlot) {
      setSelectedTime(timeSlot.start); // Set the selected time
      setSelectedTimeId(timeId); // Set the selected time ID
    } else {
      console.error("Time slot not found for the selected ID:", timeId);
      setSelectedTime("");
      setSelectedTimeId("");
    }
  };
  

  const handleSubmit = () => {
    if (selectedDay && selectedTime) {
      setIsSubmitting(true);

      // Calculate the date for the selected day
      const selectedDate = getDateForDay(selectedDay);
      setLoading(true);
      axios
        .post(
          `http://localhost:5000/student/dashboard/bookSlot`,
          {
            day: selectedDay,
            time: selectedTime,
            dayId: selectedDayId, // Send the day ID
            timeId: selectedTimeId, // Send the time ID
            date: selectedDate, // Send the date
            courseId: courseId,
            courseTitle: courseData.title,
          },
          { withCredentials: true }
        )
        .then((response) => {
          setLoading(false);
          alert("Slot booked successfully!");
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error booking slot:", error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return isAuthenticated === null ? (
    <div>Loading...</div> // Show loading state while checking authentication
  ) : isAuthenticated ? (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="fixed flex flex-col md:flex-row h-screen">
        <Sidebar />
      </div>

      <div className="md:ml-[268px] sm:ml-44 flex flex-col w-full">
        <div className="w-full p-6 mt-4">
          <PageNameAndDate pageName={"Courses"} />
          <div className="flex flex-col gap-6 text-sm">
            {loading && (
              <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
                <CircularProgress style={{ color: "blue" }} />
              </div>
            )}

            <div className="flex gap-4 w-full">
              <div className="flex flex-col gap-6 w-1/2 border border-gray-400 rounded-xl p-4 shadow-lg">
                <div className="text-center">
                  <h2 className="font-semibold">Course Info</h2>
                </div>
                <div className="flex justify-between">
                  <p>Duration</p>
                  <p>{courseData.duration ? courseData.duration : "N/A"}</p>
                </div>
                <div className="flex justify-between">
                  <p>Ending</p>
                  <p>
                    {courseData.endDate && !isNaN(new Date(courseData.endDate))
                      ? new Date(courseData.endDate).toLocaleDateString([], {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Training</p>
                  <p>PMI PMP</p>
                </div>
                <div className="flex justify-between">
                  <p>Mode</p>
                  <p>{courseData.mode ? courseData.mode : ""}</p>
                </div>
              </div>
              <div className="w-1/2 flex flex-col gap-3 border border-gray-400 rounded-xl p-3 shadow-lg">
                <p className="self-center font-semibold">Available Slots</p>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="day-select" className="font-semibold">
                      Select Day:
                    </label>
                    <select
                      id="day-select"
                      value={selectedDay}
                      onChange={handleDayChange}
                      className="p-2 border rounded-md"
                    >
                      <option value="">Select a day</option>
                      {availabilityData.map((slot) => (
                        <option key={slot._id} value={slot.day}>
                          {slot.day} ({getDateForDay(slot.day)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedDay && (
                    <div className="flex flex-col gap-2">
                      <label htmlFor="time-select" className="font-semibold">
                        Select Time:
                      </label>
                      <select
                        id="time-select"
                        value={selectedTimeId}
                        onChange={handleTimeChange}
                        className="p-2 border rounded-md"
                      >
                        <option value="">Select a time</option>
                        {availableTimes.map((time) => (
                          <option
                            key={time._id}
                            value={time._id}
                            selected={
                              !time.bookedBy ||
                              !time.bookedBy.date ||
                              new Date(time.bookedBy.date) < new Date()
                            }
                          >
                            <span>
                              {new Date(time.start).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {new Date(time.end).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <button
                  className={`mt-4 p-2 rounded-md ${
                    selectedDay && selectedTime
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={handleSubmit}
                  disabled={!selectedDay || !selectedTime || isSubmitting}
                >
                  {isSubmitting ? "Booking..." : "Book Slot"}
                </button>
              </div>
            </div>
            <div className="w-4/5 m-auto flex flex-col gap-4 border border-gray-400 rounded-xl shadow-lg text-sm p-4">
              <div className="text-xl font-semibold text-center">
                <h2>Past Meetings</h2>
              </div>
              {courseData.meetings && courseData.meetings.length > 0 ? (
                courseData.meetings.filter(
                  (meeting) => new Date(meeting.date) < new Date()
                ).length > 0 ? (
                  courseData.meetings
                    .filter((meeting) => new Date(meeting.date) < new Date())
                    .map((meeting, index) => (
                      <div key={index} className="flex justify-between">
                        <p>{meeting.title}</p>
                        <p className="text-gray-600">
                          {new Date(meeting.date).toLocaleDateString([], {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          | {meeting.time}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="text-center text-gray-600">
                    <p>No meetings to show</p>
                  </div>
                )
              ) : (
                <div className="text-center text-gray-600">
                  <p>No meetings to show</p>
                </div>
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

export default CourseDetail;
