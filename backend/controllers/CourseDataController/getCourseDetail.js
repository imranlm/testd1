const { connectToMongoDB } = require('../../services/authService');
const { Course, Simulator } = require('../../model/dbModel');

const getCourseDetails = async (req, res) => {
  const { type, courseName } = req.query;
  try {
    await connectToMongoDB();
    let model;
    if (type === 'courses') {
      model = Course;
    } else if (type === 'simulators') {
      model = Simulator;
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    // Find the course in the selected collection
    const course = await model.findOne({ title: courseName });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create a copy of the course object excluding the img field
    const { img, ...courseWithoutImg } = course.toObject();

    res.json(courseWithoutImg);
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCourseDetails,
};
