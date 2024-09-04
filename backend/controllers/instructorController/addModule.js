const {connectToMongoDB}=require('../../services/authService');
const {Simulator}=require('../../model/dbModel')
const {ObjectId}=require('mongodb');

// Add a new module to the simulator
const addModule = async (req, res) => {
  try {
    const {id} = req.params;
    const { title, maxTime, numberOfQuestions } = req.body;

    await connectToMongoDB();
    
    const simulatorId=new ObjectId(id)
    const simulator = await Simulator.findById(simulatorId);

    if (!simulator) {
      return res.status(404).json({ message: "Simulator not found" });
    }

    // Create the new module
    const newModule = {
      title,
      maxTime,
      numberOfQuestions
    };

    // Add the new module to the simulator's modules array
    simulator.modules.push(newModule);
    await simulator.save();

    res.status(201).json({ module: newModule });
  } catch (error) {
    console.error("Error adding new module:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addModule,
};
