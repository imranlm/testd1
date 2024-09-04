const { Simulator } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

// Controller to get all simulators
const getAllSimulators = async (req, res) => {
  try {
    await connectToMongoDB();

    const simulators = await Simulator.find()
      .select('title noOfMCQs duration modules price') // Ensure 'img' is selected
      .populate('courseId') // Populate course details if needed
      .exec();

    if (!simulators || simulators.length === 0) {
      return res.status(404).json({ message: 'No simulators found' });
    }
    // Transform the data to include the length of modules
    const transformedSimulators = simulators.map(simulator => ({
      title: simulator.title,
      noOfModules: simulator.modules.length,
      noOfMCQs: simulator.noOfMCQs,
      duration: simulator.duration,
      price: simulator.price,
      id:simulator._id
      // img: simulator.img ? {
      //   data: simulator.img.data.toString('base64'),
      //   contentType: simulator.img.contentType
      // } : null
    }));

    res.status(200).json(transformedSimulators);
  } catch (error) {
    console.error('Error fetching simulators:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getAllSimulators };
