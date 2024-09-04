import React, { useState, useEffect } from "react";
import axios from "axios";
import InstructorSidebar from "../../utilities/InstructorSidebar";
import PageNameAndDate from "../../utilities/PageNameAndDate";
import CircularProgress from "@mui/material/CircularProgress";

function Availability() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Days of the week
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  function convertLocalToUTC(localTime) {
    // Example: localTime is '12:00'
    const [hours, minutes] = localTime.split(":").map(Number);

    // Create a new Date object for today with the local time
    const localDate = new Date();
    localDate.setHours(hours, minutes, 0, 0);

    // Get the UTC equivalent
    const utcDate = new Date(localDate.toUTCString());

    return utcDate.toISOString(); // This is the UTC time in ISO format
  }

  // Example usage

  useEffect(() => {
    axios
      .get(`http://localhost:5000/auth/verifyAuth`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        if (response.data.user.userType === "instructor") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        setIsAuthenticated(false);
        console.log(error);
      });
  }, []);

  const fetchAvailabilityData = () => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/instructor/dashboard/getAvailability`, {
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false)
        console.log(response);
        setAvailabilityData(response.data.availability || []);
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error fetching dashboard data:", error);
      });
  };
  useEffect(() => {
    fetchAvailabilityData();
  }, []);

  const handleAddAvailability = () => {
    if (selectedDays.length === 0 || !startTime || !endTime) {
      setError(
        "Please select at least one day and provide both start and end times."
      );
      return;
    }
    if (startTime >= endTime) {
      setError("End time should be greater than start time.");
      return;
    }

    // Convert startTime and endTime to UTC for comparison
    const utcStartTime = convertLocalToUTC(startTime);
    const utcEndTime = convertLocalToUTC(endTime);

    // Check if availability already exists for the selected days
    const isDuplicate = availabilityData.some(
      (daySlot) =>
        selectedDays.includes(daySlot.day) &&
        daySlot.times.some(
          (slot) =>
            new Date(slot.start).toISOString() === utcStartTime &&
            new Date(slot.end).toISOString() === utcEndTime
        )
    );

    if (isDuplicate) {
      setError("Availability already set for this day and time.");
      return;
    }

    const newAvailability = {
      days: selectedDays,
      startTime: utcStartTime,
      endTime: utcEndTime,
    };
    console.log(newAvailability);
    setLoading(true);
    axios
      .post(
        `http://localhost:5000/instructor/dashboard/setAvailability`,
        newAvailability,
        { withCredentials: true }
      )
      .then((response) => {
        setLoading(false)
        console.log("Availability set successfully:", response.data);
        fetchAvailabilityData();
        setStartTime("");
        setEndTime("");
        setSelectedDays([]);
        setError("");
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error setting availability:", error);
      });
  };

  const handleDayChange = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
  };

  const handleDeleteAvailability = (slotId, bookedBy) => {
    if (bookedBy.studentId) {
      setError("Cannot delete a slot that is already booked by a student.");
      return;
    }
setLoading(true);
    axios
      .delete(
        `http://localhost:5000/instructor/dashboard/deleteAvailability/${slotId}`,
        { withCredentials: true }
      )
      .then((response) => {
        setLoading(false)
        console.log("Availability deleted successfully:", response.data);
        fetchAvailabilityData();
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error deleting availability:", error);
      });
  };

  const dropdownOptions = availabilityData.flatMap((daySlot) =>
    daySlot.times.map((slot) => ({
      label: `${daySlot.day}: ${new Date(slot.start).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${new Date(slot.end).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      value: slot._id,
    }))
  );

  return isAuthenticated === null ? (
   
      <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
        <CircularProgress style={{ color: "blue" }} />
      </div>
  

  ) : isAuthenticated ? (
    <div className="flex flex-col md:flex-row h-screen">
      <InstructorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 mt-4">
          <PageNameAndDate pageName="Availability" />
          <div>
            <h1 className="text-md font-bold mb-2 text-center">
              Set Availability
            </h1>
            {loading && (
              <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
                <CircularProgress style={{ color: "blue" }} />
              </div>
            )}

            <div className="flex flex-col text-sm gap-4 rounded-xl border shadow-xl p-4 h-[440px] overflow-auto">
              {/* Display Error Message */}
              {error && (
                <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
                  {error}
                </div>
              )}

              {/* Display Current Availability */}

              {/* Form to Add New Availability */}
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {daysOfWeek.map((day, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        onChange={() => handleDayChange(day)}
                        className="mr-2"
                      />
                      {day}
                    </label>
                  ))}
                </div>
                <label className="flex flex-col">
                  Start Time:
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="p-2 border rounded"
                  />
                </label>
                <label className="flex flex-col">
                  End Time:
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="p-2 border rounded"
                  />
                </label>
                <button
                  onClick={handleAddAvailability}
                  className="px-4 py-2 w-1/2 self-center bg-blue-600 text-white rounded hover:bg-blue-400 active:text-blue-600 active:bg-white"
                >
                  Set Availability
                </button>

                <div className="flex flex-col gap-2">
                  <h2 className="text-md font-semibold text-center">
                    Current Availability
                  </h2>
                 

                  {/* Display Availability in Detail */}
                  {availabilityData.length > 0 ? (
                    availabilityData.map((daySlot, index) => (
                      <div key={index} className="flex flex-col gap-2 mb-4">
                        <h3 className="font-semibold">{daySlot.day}</h3>
                        {daySlot.times.length > 0 ? (
                          daySlot.times.map((slot, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center p-2 border-b"
                            >
                              <span className="time-date-container">
  <div className="time-range">
    {new Date(slot.start).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}{" "}
    -{" "}
    {new Date(slot.end).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </div>
  <div className="date">
    {new Date(slot.start).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}
  </div>
</span>

                              {slot.bookedBy.studentId ? (
                                <span>
                                  Booked by: {slot.bookedBy.studentEmail}
                                </span>
                              ) : (
                                <span>Available</span>
                              )}
                              <button
                                onClick={() =>
                                  handleDeleteAvailability(
                                    slot._id,
                                    slot.bookedBy
                                  )
                                }
                                className={`ml-4 px-2 py-1 ${
                                  slot.bookedBy.studentId
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-600"
                                } text-white rounded`}
                                disabled={!!slot.bookedBy.studentId}
                              >
                                Delete
                              </button>
                            </div>
                          ))
                        ) : (
                          <p>No slots available for this day.</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No availability set.</p>
                  )}
                </div>
              </div>
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
}

export default Availability;
