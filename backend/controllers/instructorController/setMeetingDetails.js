const { Instructor, Meeting } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');
const { ObjectId } = require('mongodb');
const { mongoose } = require('mongoose');

const setMeetingDetails = async (req, res) => {
  const { studentId, day, date, timeStart, timeEnd, newLink, title } = req.body;
  const instructorId = new ObjectId(req.user.id);

  console.log(date)
  // Validate the input
  if (!studentId || !day || !timeStart || !timeEnd || !newLink || !title) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await connectToMongoDB();

    // Check if a meeting already exists for the same date and time
    const existingMeeting = await Meeting.findOne({
      student: new ObjectId(studentId),
      instructor: instructorId,
      date: date,
      time: `${new Date(timeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(timeEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    });

    if (existingMeeting) {
      // Update the meetingLink of the existing meeting
      existingMeeting.meetingLink = newLink;
      await existingMeeting.save();
      
      return res.status(200).json({ message: "Meeting link updated successfully", meetingId: existingMeeting._id });
    } else {
      // Create a new meeting document if no existing meeting is found
      const newMeeting = new Meeting({
        _id: new mongoose.Types.ObjectId(),
        student: new ObjectId(studentId),
        title: title,
        date: new Date(date),
        time: `${new Date(timeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(timeEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        meetingLink: newLink,
        instructor: instructorId,
      });

      const savedMeeting = await newMeeting.save();

      // Update the instructor's available slots
      const result = await Instructor.updateOne(
        { 
          _id: instructorId, 
          'availableSlots.day': day, 
          'availableSlots.times.start': timeStart 
        },
        {
          $set: {
            'availableSlots.$.times.$[time].bookedBy': {
              studentId: new ObjectId(studentId),
              studentEmail: req.user.email,
              date: new Date(date),
              courseTitle: title,
              meetingId: savedMeeting._id
            }
          }
        },
        {
          arrayFilters: [{ 'time.start': timeStart }],
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(400).json({ message: "Slot update failed" });
      }

      return res.status(200).json({ message: "Meeting set successfully", meetingId: savedMeeting._id });
    }
  } catch (error) {
    console.error("Error setting meeting details:", error);
    return res.status(500).json({ message: "Error setting meeting details" });
  }
};

module.exports = {
  setMeetingDetails
};
