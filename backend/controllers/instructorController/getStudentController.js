const { Student, Meeting, Course, Simulator } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

const getStudentDetails = async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log('Fetching details for student ID:', studentId);

    await connectToMongoDB();

    const student = await Student.findById(studentId)
      .populate({
        path: 'coursesEnrolled.courseId', 
        model: 'Course',
        select: 'title price duration', 
      })
      .populate({
        path: 'simulatorsPurchased.simulatorId', 
        model: 'Simulator', 
        select: 'title price duration', 
      })
      .exec();

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const meetings = await Meeting.find({ student: studentId }).lean();

    const now = new Date();
    const pastMeetings = [];
    const upcomingMeetings = [];

    meetings.forEach(meeting => {
      if (new Date(meeting.date) < now) {
        pastMeetings.push(meeting);
      } else {
        upcomingMeetings.push(meeting);
      }
    });

    
    const response = {
      name: student.name,
      email: student.email,
      contact: student.contact,
      courses: student.coursesEnrolled.map(enrollment => ({
        courseId: enrollment.courseId._id, 
        courseTitle: enrollment.courseId.title, 
        coursePrice: enrollment.courseId.price, 
        courseDuration: enrollment.courseId.duration, 
        manualCourseId: enrollment.manualCourseId,
        startDate: enrollment.startDate,
        endDate: enrollment.endDate,
      })),
      simulatorsPurchased: student.simulatorsPurchased.map(simulator => ({
        simulatorId: simulator.simulatorId._id, 
        simulatorTitle: simulator.simulatorId.title, 
        simulatorPrice: simulator.simulatorId.price, 
        simulatorDuration: simulator.simulatorId.duration, 
        modules: simulator.modules.map(module => ({
          moduleId: module.moduleId,
          moduleName: module.moduleName,
          totalQuestions: module.totalQuestions,
          questionsSolved: module.questionsSolved.map(question => ({
            questionId: question.questionId,
            questionText: question.questionText,
            answeredOption: question.answeredOption,
            isCorrect: question.isCorrect,
            correctOption: question.correctOption,
            explanation: question.explanation,
            timeTaken: question.timeTaken,
            solvedAt: question.solvedAt
          })),
          questionsRemaining: module.questionsRemaining
        })),
        startDate: simulator.startDate,
        endDate: simulator.endDate
      })),
      pastMeetings: pastMeetings.map(meeting => ({
        _id: meeting._id,
        title: meeting.title,
        date: meeting.date,
        time: meeting.time,
        meetingLink: meeting.meetingLink
      })),
      upcomingMeetings: upcomingMeetings.map(meeting => ({
        _id: meeting._id,
        title: meeting.title,
        date: meeting.date,
        time: meeting.time,
        meetingLink: meeting.meetingLink
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStudentDetails };
