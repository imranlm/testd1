import React, { useState, useEffect } from "react";
import axios from "axios";
import InstructorSidebar from "../../utilities/InstructorSidebar";
import PageNameAndDate from "../../utilities/PageNameAndDate";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from "@mui/material/CircularProgress";

function Sessions() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [editLinkId, setEditLinkId] = useState(null); // Track which slot is being edited
  const [inputLink, setInputLink] = useState(""); // Store the new meeting link for the current slot
  const [editSlotDetails, setEditSlotDetails] = useState({}); // Store details of the slot being edited
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMeetingsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/instructor/dashboard/getMeetingDetails`,
        { withCredentials: true }
      );
      setLoading(false);
      console.log(response.data);
      setBookedSlots(response.data.bookedSlots || []);
    } catch (error) {
      setLoading(false)
      console.error("Error fetching meetings data:", error);
    }
  };
  const handleAddMeetingLink = async (slot) => {
    const date = new Date(slot.bookedBy.date);
    
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", slot.bookedBy.date);
    } else {
      const day = date.toLocaleDateString("en-US", { weekday: "long" });
  
      // Format the date properly as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based, so add 1
      const dayOfMonth = String(date.getDate()).padStart(2, '0'); // getDate() returns the day
  
      const formattedDate = `${year}-${month}-${dayOfMonth}`; // Send as YYYY-MM-DD
  
      const data = {
        day,
        date: formattedDate,
        timeStart: slot.timeStart,
        timeEnd: slot.timeEnd,
        title: slot.bookedBy.courseTitle,
        studentId: slot.bookedBy.studentId,
      };
      setEditSlotDetails(data);
  
      console.log("Sending data to backend:", {
        slotId: editLinkId,
        newLink: inputLink,
        ...data,
      });

      try {
        setLoading(true)
        const response = await axios.post(
          `http://localhost:5000/instructor/dashboard/addMeetingLink`,
          {
            slotId: editLinkId,
            newLink: inputLink,
            ...data,
          },
          { withCredentials: true }
        );
        if (response) {
          setLoading(false);
          setMessage(response.data.message);
          alert(response.data.message);
        }
        setInputLink("");
        setEditSlotDetails({});
        fetchMeetingsData();
      } catch (error) {
        setLoading(false)
        // setError(error.data.message);
        console.error("Error adding meeting link:", error);
      }
    }
  };

  const handleInputChange = (event) => {
    setInputLink(event.target.value);
    const isValidUrl = (url) => {
      const regex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
      return regex.test(url);
    };
    if (!isValidUrl(event.target.value)) {
      setError("Please enter a valid URL");
    } else {
      setError("");
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/auth/verifyAuth`, { withCredentials: true })
      .then((response) => {
        setLoading(false)
        if (response.data.user.userType === "instructor") {
          setIsAuthenticated(true);
          fetchMeetingsData();
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

  return isAuthenticated === null ? (

      <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
        <CircularProgress style={{ color: "blue" }} />
      </div>


  ) : isAuthenticated ? (
    <div className="flex flex-col md:flex-row h-screen">
      <InstructorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 mt-4">
          <PageNameAndDate pageName="Sessions" />
          <div className="w-11/12 m-auto flex flex-col gap-4 border border-gray-400 rounded-xl shadow-lg text-sm p-4">
            <div className="text-xl font-semibold text-center">
              <h2>Booked Slots</h2>
            </div>
            {loading && (
              <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
                <CircularProgress style={{ color: "blue" }} />
              </div>
            )}

            {error && <p className="text-center text-red-500">{error}</p>}
            {bookedSlots.length > 0 ? (
              bookedSlots.map((slot, index) => {
                const slotDay = slot.slotDay;
                const slotDate = new Date(
                  slot.bookedBy.date
                ).toLocaleDateString("en-US");
                const timeStart = new Date(slot.timeStart).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" }
                );
                const timeEnd = new Date(slot.timeEnd).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Tooltip title="Calendar">
                          <CalendarTodayIcon className="mr-2 text-gray-600" />
                        </Tooltip>
                        <div>
                          <p className="font-semibold">
                            {slot.bookedBy.courseTitle}
                          </p>
                          <p className="text-gray-600">
                            {slotDay} | {slotDate} | {timeStart} to {timeEnd}
                          </p>
                          <p className="text-gray-600">
                            Student: {slot.bookedBy.studentEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                      <Tooltip title="Copy link">
                          <IconButton
                            onClick={() => handleCopyLink(slot.meetingDetails?.meetingLink)}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                        <input
                          type="text"
                          placeholder={
                            slot.meetingDetails?.meetingLink
                              ? slot.meetingDetails.meetingLink
                              : ""
                          }
                          className="border-2 border-gray-400 rounded px-2 py-1 w-56"
                          onChange={handleInputChange}
                        />
                       
                        <button
                          onClick={() => handleAddMeetingLink(slot)}
                          disabled={error || !inputLink}
                          className="bg-blue-600 text-white rounded-xl px-2  text-sm py-1"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-600">
                <p>No booked slots available</p>
              </div>
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

export default Sessions;
