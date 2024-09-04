const { ObjectId } = require('mongodb');
const { Course, Student, Meeting } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

const getCourseDetail = async (req, res) => {
    try {
        const { courseId } = req.query; // Get the courseId from the query parameters
        const studentId = new ObjectId(req.user.id); // Assuming req.user contains authenticated user's ID
        
        // Connect to MongoDB
        await connectToMongoDB();

        // Fetch the student data
        const student = await Student.findById(studentId).lean();
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if the student is enrolled in the course
        const enrolledCourse = student.coursesEnrolled.find(course => course.courseId.toString() === courseId);
        if (!enrolledCourse) {
            return res.status(404).json({ message: 'Course not found in enrolled courses' });
        }

        // Fetch the course details
        const course = await Course.findById(courseId).lean();
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Fetch the meetings related to the student
        const meetings = await Meeting.find({ student: studentId }).lean();

        // Prepare the course details to be sent back
        const courseDetail = {
            courseId: course._id,
            studentId:req.user.id,
            title: course.title,
            description: course.description,
            duration: course.duration,
            mode: course.mode,
            startDate: enrolledCourse.startDate,
            endDate: enrolledCourse.endDate,
            meetings: meetings.map(meeting => ({
                title: meeting.title,
                date: meeting.date,
                time: meeting.time,
                meetingLink: meeting.meetingLink,
            })),
        };

        // Send the course detail response
        res.status(200).json({ course: courseDetail });
    } catch (error) {
        console.error('Error fetching course detail:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getCourseDetail };
