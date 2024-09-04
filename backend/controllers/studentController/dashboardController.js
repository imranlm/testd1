const { ObjectId } = require('mongodb');
const { Student, Course, Simulator, Meeting } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

const getStudentDashboardData = async (req, res) => {
    try {
        // Extract studentId from req.user and convert it to ObjectId
        const studentId = new ObjectId(req.user.id);

        // Connect to MongoDB
        await connectToMongoDB();

        // Fetch student data by studentId
        const student = await Student.findById(studentId).lean(); // Using lean() for a plain JS object

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Fetch course details for enrolled courses
        const courseIds = student.coursesEnrolled.map(course => course.courseId);
        const courses = await Course.find({ _id: { $in: courseIds } }).lean();

        // Fetch simulator details for purchased simulators
        const simulatorIds = student.simulatorsPurchased.map(sim => sim.simulatorId);
        const simulatorsData = await Simulator.find({ _id: { $in: simulatorIds } }).lean();

        // Create maps for course and simulator details
        const courseMap = courses.reduce((acc, course) => {
            acc[course._id.toString()] = {
                title: course.title,
                description: course.description
            };
            return acc;
        }, {});

        const simulatorMap = simulatorsData.reduce((acc, simulator) => {
            acc[simulator._id.toString()] = {
                title: simulator.title,
                description: simulator.description
            };
            return acc;
        }, {});

        // Organize enrolled courses data
        const enrolledCourses = student.coursesEnrolled.map(course => ({
            courseId: course.courseId,
            manualCourseId: course.manualCourseId,
            title: courseMap[course.courseId.toString()]?.title || 'Unknown',
            description: courseMap[course.courseId.toString()]?.description || 'No description available',
            progress: course.progress,
            startDate: course.startDate,
            endDate: course.endDate
        }));

        // Organize purchased simulators data
        const simulators = student.simulatorsPurchased.map(sim => ({
            simulatorId: sim.simulatorId,
            manualSimulatorId: sim.manualSimulatorId,
            title: simulatorMap[sim.simulatorId.toString()]?.title || 'Unknown',
            description: simulatorMap[sim.simulatorId.toString()]?.description || 'No description available',
            modules: sim.modules.map(module => ({
                moduleId: module.moduleId,
                moduleName: module.moduleName,
                totalQuestions: module.totalQuestions || 0,
                questionsSolved: module.questionsSolved?.length || 0,
                questionsRemaining: module.questionsRemaining || 0,
            }))
        }));

        // Fetch upcoming meetings (Assuming Meetings includes meeting IDs)
        const upcomingMeetings = await Meeting.find({ student: studentId, date: { $gte: new Date() } }).lean();

        const meetingsData = upcomingMeetings.map(meeting => ({
            meetingId: meeting._id,
            title: meeting.title,
            date: meeting.date,
            time: meeting.time,
            meetingLink: meeting.meetingLink,
            instructor: meeting.instructor,
        }));

        res.status(200).json({
            enrolledCourses,
            simulators,
            completedCourses: enrolledCourses.filter(course => course.progress === 100).length,
            upcomingMeetings: meetingsData // Include the meeting details in the response
        });
    } catch (error) {
        console.error('Error fetching student dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getStudentDashboardData
};
