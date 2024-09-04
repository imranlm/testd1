// const { Student, Course, Simulator, Meeting } = require('../../model/dbModel');
// const { connectToMongoDB } = require('../../services/authService');

// // Controller to get all students
// const getAllStudents = async (req, res) => {
//     try {
//         // Connect to MongoDB
//         await connectToMongoDB();

//         // Fetch all students from the database
//         const students = await Student.find()
//             .populate({
//                 path: 'coursesEnrolled.courseId',
//                 select: 'title description price duration img',
//                 model: Course
//             })
//             .populate({
//                 path: 'coursesEnrolled.simulatorsPurchased.simulatorId',
//                 select: 'title noOfMCQs duration price img',
//                 model: Simulator
//             })
//             .populate({
//                 path: 'Meetings', // Ensure this path matches your schema
//                 select: 'title date time meetingLink',
//                 model: Meeting
//             })
//             .lean();

//         // If no students found, return an empty array
//         if (!students || students.length === 0) {
//             return res.status(200).json({ students: [] });
//         }

//         // Map the students to include necessary fields and details
//         const studentDetails = students.map(student => ({
//             studentId: student._id,
//             name: student.name,
//             email: student.email,
//             contact: student.contact,
//             enrolledCourses: student.coursesEnrolled.map(course => ({
//                 courseId: course.courseId._id,
//                 manualCourseId: course.manualCourseId,
//                 title: course.courseId.title,
//                 description: course.courseId.description,
//                 price: course.courseId.price,
//                 duration: course.courseId.duration,
//                 img: course.courseId.img ? {
//                     data: course.courseId.img.data.toString('base64'),
//                     contentType: course.courseId.img.contentType
//                 } : null,
//                 progress: course.progress,
//                 startDate: course.startDate,
//                 endDate: course.endDate,
//                 simulatorsPurchased: course.simulatorsPurchased.map(simulator => ({
//                     simulatorId: simulator.simulatorId._id,
//                     manualSimulatorId: simulator.manualSimulatorId,
//                     title: simulator.simulatorId.title,
//                     noOfMCQs: simulator.simulatorId.noOfMCQs,
//                     duration: simulator.simulatorId.duration,
//                     price: simulator.simulatorId.price,
//                     img: simulator.simulatorId.img ? {
//                         data: simulator.simulatorId.img.data.toString('base64'),
//                         contentType: simulator.simulatorId.img.contentType
//                     } : null,
//                     modules: simulator.modules
//                 })),
//                 simulatorsCompleted: course.simulatorsCompleted.map(simulator => ({
//                     simulatorId: simulator.simulatorId._id,
//                     manualSimulatorId: simulator.manualSimulatorId,
//                     modulesCompleted: simulator.modulesCompleted
//                 }))
//             })),
//             completedCourses: student.completedCourses,
//             upcomingMeetings: student.Meetings.map(meeting => ({
//                 meetingId: meeting._id,
//                 title: meeting.title,
//                 date: meeting.date,
//                 time: meeting.time,
//                 meetingLink: meeting.meetingLink
//             })),
//             avatar: student.avatar ? {
//                 data: student.avatar.data.toString('base64'),
//                 contentType: student.avatar.contentType
//             } : null
//         }));

//         // Return the students in the response
//         res.status(200).json({ students: studentDetails });
//     } catch (error) {
//         console.error('Error fetching students:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// module.exports = { getAllStudents };


// const { Student, Course } = require('../../model/dbModel');
// const { connectToMongoDB } = require('../../services/authService');

// // Function to get other course details for a student
// const getStudentCourses = async (studentId) => {
//     try {
//         // Connect to MongoDB
//         await connectToMongoDB();

//         // Fetch the student from the database and populate course details
//         const student = await Student.findById(studentId)
//             .populate({
//                 path: 'coursesEnrolled.courseId',
//                 select: 'title description price duration img',
//                 model: Course
//             })
//             .lean();

//         if (!student) {
//             throw new Error('Student not found');
//         }

//         const courses = student.coursesEnrolled.map(course => ({
//             courseId: course.courseId._id,
//             manualCourseId: course.manualCourseId,
//             title: course.courseId.title,
//             description: course.courseId.description,
//             price: course.courseId.price,
//             duration: course.courseId.duration,
//             img: course.courseId.img ? {
//                 data: course.courseId.img.data.toString('base64'),
//                 contentType: course.courseId.img.contentType
//             } : null,
//             progress: course.progress,
//             startDate: course.startDate,
//             endDate: course.endDate
//         }));

//         return { studentId: student._id, courses };
//     } catch (error) {
//         console.error('Error fetching student courses:', error);
//         throw new Error('Internal server error');
//     }
// };

// module.exports = { getStudentCourses };

// const { Student, Course } = require('../../model/dbModel');
// const { connectToMongoDB } = require('../../services/authService');

// // Function to get student details and calculate course duration completed
// const getStudentDetails = async (studentId) => {
//     try {
//         // Connect to MongoDB
//         await connectToMongoDB();

//         // Fetch the student from the database
//         const student = await Student.findById(studentId)
//             .populate({
//                 path: 'coursesEnrolled.courseId',
//                 select: 'title duration',
//                 model: Course
//             })
//             .lean();

//         if (!student) {
//             throw new Error('Student not found');
//         }

//         // Calculate the duration completed for each course
//         const calculateCourseDuration = (startDate, endDate, courseDuration) => {
//             const start = new Date(startDate);
//             const end = new Date(endDate || new Date());
//             const durationInMs = end - start;
//             const totalDurationInHours = courseDuration ? parseFloat(courseDuration) : 0;
//             const completedPercentage = (durationInMs / (totalDurationInHours * 3600000)) * 100;
//             return Math.min(completedPercentage, 100);
//         };

//         const studentDetails = {
//             studentId: student._id,
//             name: student.name,
//             email: student.email,
//             contact: student.contact,
//             courses: student.coursesEnrolled.map(course => ({
//                 courseId: course.courseId._id,
//                 title: course.courseId.title,
//                 progress: calculateCourseDuration(course.startDate, course.endDate, course.courseId.duration)
//             }))
//         };

//         return studentDetails;
//     } catch (error) {
//         console.error('Error fetching student details:', error);
//         throw new Error('Internal server error');
//     }
// };

// module.exports = { getStudentDetails };

const { Student } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

// Controller to get basic student details
const getAllStudents = async (req, res) => {
    try {
        // Connect to MongoDB
        await connectToMongoDB();

        // Fetch all students and only select the required fields
        const students = await Student.find({}, 'name email contact')
            .lean();

        // If no students found, return an empty array
        if (!students || students.length === 0) {
            return res.status(200).json({ students: [] });
        }

        // Return the students in the response
        res.status(200).json({ students });
    } catch (error) {
        console.error('Error fetching basic student details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getAllStudents };
