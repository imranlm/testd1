const { Simulator } = require("../../model/dbModel");
const { connectToMongoDB } = require("../../services/authService");
const { ObjectId } = require("mongodb");

exports.updateSimulator = async (req, res) => {
  const { id } = req.params;
  const { price, duration, modules } = req.body;

  const simulatorId = new ObjectId(id);
  try {
    await connectToMongoDB();
    const simulator = await Simulator.findById(simulatorId);

    if (!simulator) {
      return res.status(404).json({ error: "Simulator not found" });
    }

    // Update simulator details
    simulator.price = price !== undefined ? price : simulator.price;
    simulator.duration = duration !== undefined ? duration : simulator.duration;

    if (modules && Array.isArray(modules)) {
      // Iterate over the modules to update only the necessary fields
      modules.forEach((newModule, index) => {
        const existingModule = simulator.modules[index];
        if (existingModule) {
          // Update fields of the existing module
          existingModule.title = newModule.title || existingModule.title;
          existingModule.maxTime = newModule.maxTime || existingModule.maxTime;
          existingModule.numberOfQuestions =
            newModule.numberOfQuestions !== undefined
              ? newModule.numberOfQuestions
              : existingModule.numberOfQuestions;
        } else {
          // If it's a new module, add it
          simulator.modules.push(newModule);
        }
      });
    }

    await simulator.save();

    res.status(200).json(simulator);
  } catch (error) {
    console.error("Error updating simulator:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateModuleMaxTime = async (req, res) => {
    try {
      await connectToMongoDB();
      const { id, moduleTitle } = req.params;
      const { time } = req.body;
      const simulatorId = new ObjectId(id);
  
      // Find the simulator by ID
      const simulator = await Simulator.findById(simulatorId);
      if (!simulator) {
        return res.status(404).json({ message: "Simulator not found" });
      }
  
      // Find the module by title within the simulator's modules array
      const module = simulator.modules.find(mod => mod.title === moduleTitle);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
  
      // Update the maxTime of the found module
      module.maxTime = time;
      await simulator.save();
  
      res.json(simulator);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  