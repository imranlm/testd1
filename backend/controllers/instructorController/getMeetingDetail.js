const { Instructor, Meeting, Student } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');
const { ObjectId } = require('mongodb');

const getMeetingDetails = async (req, res) => {
  const instructorId = new ObjectId(req.user.id);

  await connectToMongoDB();
  const instructor = await Instructor.findById(instructorId).lean();

  if (!instructor) {
    return res.status(404).json({ message: "Instructor not found" });
  }

  const bookedSlots = [];

  // Iterate over available slots
  for (const slot of instructor.availableSlots) {
    for (const time of slot.times) {
      if (time.bookedBy && time.bookedBy.studentId) {
        // Initialize the record with bookedBy details
        const bookedSlot = {
          slotDay: slot.day,
        //   studentEmail:time.studentEmail,
        //   studentId:time.studentId,
        //   courseTitle:time.courseTitle,
        //   date:time.date,

          timeStart: time.start,
          timeEnd: time.end,
          bookedBy: time.bookedBy,
        };

        // If a meetingId exists, fetch the meeting details
        if (time.bookedBy.meetingId) {
          try {
            const meeting = await Meeting.findById(time.bookedBy.meetingId).lean();
            if (meeting) {
              bookedSlot.meetingDetails = meeting;
            }
          } catch (err) {
            console.error("Error fetching meeting details:", err);
          }
        }

        bookedSlots.push(bookedSlot);
      }
    }
  }

  // After processing all slots, send the response
  if (bookedSlots.length > 0) {
    return res.status(200).json({ bookedSlots });
  } else {
    return res.status(200).json({ message: "No booked slots available" });
  }
};

module.exports = {
  getMeetingDetails
};
