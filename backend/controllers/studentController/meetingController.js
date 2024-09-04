const { ObjectId } = require('mongodb');
const { Student } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

const getUpcomingMeetings = async (req, res) => {
    try {
        const studentId = new ObjectId(req.user.id);
        
        await connectToMongoDB();

        const student = await Student.findById(studentId).lean();
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const upcomingMeetings = student.pastMeetings.length > 0 ? student.pastMeetings : [];

        res.status(200).json({ upcomingMeetings });
    } catch (error) {
        console.error('Error fetching upcoming meetings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getUpcomingMeetings };
