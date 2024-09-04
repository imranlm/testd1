// const { ObjectId } = require('mongodb');
// const { Student, Course, Simulator } = require('../../model/dbModel');
// const { connectToMongoDB } = require('../../services/authService');

// const getCourses = async (req, res) => {
//     try {
//         // Extract studentId from req.user and convert it to ObjectId
//         const studentId = new ObjectId(req.user.id);

//         // Connect to MongoDB
//         await connectToMongoDB();

//         // Fetch student data by studentId
//         const student = await Student.findById(studentId).lean(); // Using lean() for a plain JS object

//         if (!student) {
//             return res.status(404).json({ message: 'Student not found' });
//         }

//         // Fetch course details for each enrolled course
//         const courseIds = student.coursesEnrolled.map(course => course.courseId);
//         const courses = await Course.find({ _id: { $in: courseIds } }).lean();

//         // Create a map of courseId to course details, including duration and mode
//         const courseMap = courses.reduce((acc, course) => {
//             acc[course._id.toString()] = {
//                 title: course.title,
//                 description: course.description,
//                 duration: course.duration,
//                 mode: course.mode
//             };
//             return acc;
//         }, {});

//         // Extract and organize the data for the dashboard
//         const enrolledCourses = student.coursesEnrolled.map(course => ({
//             courseId: course.courseId,
//             manualCourseId: course.manualCourseId,
//             title: courseMap[course.courseId.toString()]?.title || 'Unknown',
//             description: courseMap[course.courseId.toString()]?.description || 'No description available',
//             duration: courseMap[course.courseId.toString()]?.duration || 'N/A',
//             mode: courseMap[course.courseId.toString()]?.mode || 'N/A',
//             progress: course.progress,
//         }));

//         // Fetch simulator details for each purchased simulator
//         const simulatorIds = student.coursesEnrolled.flatMap(course => 
//             course.simulatorsPurchased.map(sim => sim.simulatorId)
//         );
//         const simulators = await Simulator.find({ _id: { $in: simulatorIds } }).lean();

//         // Create a map of simulatorId to simulator details
//         const simulatorMap = simulators.reduce((acc, simulator) => {
//             acc[simulator._id.toString()] = simulator;
//             return acc;
//         }, {});

//         const purchasedSimulators = student.coursesEnrolled.flatMap(course => 
//             course.simulatorsPurchased.map(sim => {
//                 const simulator = simulatorMap[sim.simulatorId.toString()] || {};
//                 const modules = simulator.modules || [];

//                 return {
//                     simulatorId: sim.simulatorId,
//                     manualSimulatorId: sim.manualSimulatorId,
//                     title: simulator.title || 'Unknown',
//                     modules: sim.modules.map(module => {
//                         const matchedModule = modules.find(m => m._id.equals(module.moduleId)) || {};
//                         return {
//                             moduleId: module.moduleId,
//                             moduleName: module.moduleName,
//                             totalQuestions: matchedModule.totalQuestions || 0,
//                             questionsSolved: module.questionsSolved.length,
//                             questionsRemaining: module.questionsRemaining,
//                         };
//                     })
//                 };
//             })
//         );

//         const completedCourses = student.coursesEnrolled.filter(course => course.progress === 100);

//         // Assuming you have a Meeting model to populate meeting details
//         const upcomingMeetings = student.pastMeetings.length > 0 ? student.pastMeetings : [];

//         res.status(200).json({
//             enrolledCourses,
//             simulators: purchasedSimulators,
//             completedCourses: completedCourses.length,
//             upcomingMeetings
//         });
//     } catch (error) {
//         console.error('Error fetching student dashboard data:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// module.exports = {
//     getCourses
// };
const { ObjectId } = require('mongodb');
const { Course, Student } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

const getCourses = async (req, res) => {
    try {
        const studentId = new ObjectId(req.user.id);
        
        await connectToMongoDB();

        const student = await Student.findById(studentId).lean();
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const courseIds = student.coursesEnrolled.map(course => course.courseId);
        const courses = await Course.find({ _id: { $in: courseIds } }).lean();

        const courseMap = courses.reduce((acc, course) => {
            acc[course._id.toString()] = {
                title: course.title,
                description: course.description,
                duration: course.duration,
                mode: course.mode
            };
            return acc;
        }, {});

        const enrolledCourses = student.coursesEnrolled.map(course => ({
            courseId: course.courseId,
            manualCourseId: course.manualCourseId,
            title: courseMap[course.courseId.toString()]?.title || 'Unknown',
            description: courseMap[course.courseId.toString()]?.description || 'No description available',
            duration: courseMap[course.courseId.toString()]?.duration || 'N/A',
            mode: courseMap[course.courseId.toString()]?.mode || 'N/A',
            progress: course.progress,
        }));

        res.status(200).json({ courses: enrolledCourses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getCourses };


