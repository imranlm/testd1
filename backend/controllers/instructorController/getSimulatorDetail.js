const { Simulator } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');
const { ObjectId } = require('mongodb');

// Get Simulator Details by Module Title
const getSimulatorByModule = async (req, res) => {
  try {
    // Connect to the database
    await connectToMongoDB();

    // Extract simulator ID and module title from the request parameters
    const { moduleTitle, id } = req.params;
    const simulatorId = new ObjectId(id);

    // Find the simulator by its ID
    const simulator = await Simulator.findById(simulatorId);

    if (!simulator) {
      return res.status(404).json({ message: 'Simulator not found' });
    }

    // Find the specific module by its title
    const module = simulator.modules.find(mod => mod.title === moduleTitle);

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Respond with the simulator and the specific module details
    res.status(200).json({ simulator, module });
  } catch (error) {
    console.error('Error retrieving simulator details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get Module and Number of Questions in Module by Simulator ID
const getModuleAndQuestions = async (req, res) => {
    try {
      // Connect to the database
      await connectToMongoDB();
  
      // Extract simulator ID from the request parameters
      const { id } = req.params;
      const simulatorId = new ObjectId(id);
  
      // Find the simulator by its ID
      const simulator = await Simulator.findById(simulatorId, 'modules price duration maxTime');
  
      if (!simulator) {
        return res.status(404).json({ message: 'Simulator not found' });
      }
  
      // Map through modules and get the module title and the number of questions
      const modulesWithQuestionCount = simulator.modules.map((module) => ({
        title: module.title,
        numberOfQuestions: module.questions.length,
        maxTime: module.maxTime
      }));
  
      // Respond with the simulator details and module titles with their respective number of questions
      res.status(200).json({
        price: simulator.price,
        duration: simulator.duration,
        modules: modulesWithQuestionCount,
      });
    } catch (error) {
      console.error('Error retrieving module and questions:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = {
    getSimulatorByModule,
    getModuleAndQuestions,
  };
  