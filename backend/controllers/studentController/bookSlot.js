const { Instructor } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

// Helper function to parse DD/MM/YYYY string to a Date object
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(Date.UTC(year, month - 1, day)); // Month is zero-based
};

// Book a Slot for a Student
const bookSlot = async (req, res) => {
  try {
    // Connect to the database
    await connectToMongoDB();

    // Extract the day, time, studentId, and studentEmail from the request body
    const { day, time, dayId, timeId, date, courseTitle } = req.body;
    const studentId = req.user.id;
    const studentEmail = req.user.email;

    console.log('Day:', day);
    console.log('Time:', time);
    console.log('Day ID:', dayId);
    console.log('Time ID:', timeId);
    console.log('Date:', date);

    // Parse the date from DD/MM/YYYY format to a Date object
    const bookingDate = parseDate(date);

    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Find the instructor
    const instructor = await Instructor.findOne({});

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    // Find the day in the availableSlots array
    const daySlot = instructor.availableSlots.find(slot => slot.day === day);

    if (!daySlot) {
      return res.status(404).json({ message: 'Day not available' });
    }

    // Find the specific time slot
    const timeSlot = daySlot.times.find(
      t => new Date(t.start).getTime() === new Date(time).getTime()
    );

    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not available' });
    }

    // Check if the slot is already booked
    if (timeSlot.bookedBy.studentId) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    // Update the time slot with the student's details
    timeSlot.bookedBy = {
      studentId,
      studentEmail,
      date: bookingDate,
      courseTitle,
    };

    // Save the updated instructor document
    await instructor.save();

    // Respond with success
    res.status(200).json({ message: 'Slot booked successfully' });
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  bookSlot,
};
