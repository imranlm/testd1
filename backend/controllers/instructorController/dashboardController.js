const mongoose = require('mongoose');
const { Instructor, Course, Simulator, Student, Meeting } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

const getInstructorDashboardData = async (req, res) => {
    try {
        // Connect to MongoDB
        await connectToMongoDB();

        // Fetch the instructor data (assuming there's only one instructor)
        const instructor = await Instructor.findOne().lean();

        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        // Fetch counts for total students, courses, and simulators
        const totalStudents = await Student.countDocuments();
        const totalCourses = await Course.countDocuments();
        const totalSimulators = await Simulator.countDocuments();

        // Calculate the total past meetings based on the availableSlots
        const totalPastMeetings = instructor.availableSlots.reduce((count, slot) => {
            return count + slot.times.filter(time => time.end < new Date()).length;
        }, 0);

        // Fetch the meetings scheduled by the instructor
        const meetings = await Meeting.find({ instructor: instructor._id }).lean();

        // Calculate the number of upcoming meetings
        const upcomingMeetings = meetings.filter(meeting => meeting.start > new Date()).length;

        // Respond with all the collected data
        res.status(200).json({
            instructor,
            totalStudents,
            totalCourses,
            totalSimulators,
            totalPastMeetings,
            meetingsScheduled: upcomingMeetings, // Only include the number of upcoming meetings
            meetings // Include the meetings in the response
        });
    } catch (error) {
        console.error('Error fetching instructor dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getInstructorDashboardData
};
