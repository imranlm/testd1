const { Simulator } = require('../../../model/dbModel');
const { connectToMongoDB } = require('../../../services/authService');
const {ObjectId}=require('mongodb');

// Add questions from JSON to a specific module
exports.addQuestionsFromJSON = async (req, res) => {
  const { id, moduleTitle } = req.params; // Expect simulatorId as ObjectId
  const { questions } = req.body;
console.log(req.body)

  const simulatorId=new ObjectId(id);
  try {
    await connectToMongoDB();

    // Find the simulator by its ID
    const simulator = await Simulator.findById(simulatorId);

    if (!simulator) {
      return res.status(404).json({ message: 'Simulator not found' });
    }

    // Find the module in the simulator
    const module = simulator.modules.find(mod => mod.title === moduleTitle);

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Add questions to the module
    module.questions.push(...questions);

    await simulator.save();

    res.status(200).json({ message: 'Questions added successfully' });
  } catch (error) {
    console.error('Error adding questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a specific question
exports.updateQuestion = async (req, res) => {
  const { id, moduleTitle, questionId } = req.params; // Expect simulatorId as ObjectId
  const { questionText, options, correctOption, explanation } = req.body;
const simulatorId=new ObjectId(id);

  try {
    await connectToMongoDB();

    // Find the simulator by its ID
    const simulator = await Simulator.findById(simulatorId);

    if (!simulator) {
      return res.status(404).json({ message: 'Simulator not found' });
    }

    // Find the module in the simulator
    const module = simulator.modules.find(mod => mod.title === moduleTitle);

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Find and update the specific question
    const question = module.questions.id(questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.questionText = questionText || question.questionText;
    question.options = options || question.options;
    question.correctOption = correctOption || question.correctOption;
    question.explanation = explanation || question.explanation;

    await simulator.save();

    res.status(200).json({ message: 'Question updated successfully' });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Delete a specific question
exports.deleteQuestion = async (req, res) => {
  const { id, moduleTitle, questionId } = req.params; // Expect simulatorId as ObjectId
  const simulatorId = new ObjectId(id);

  try {
    await connectToMongoDB();

    // Find the simulator by its ID
    const simulator = await Simulator.findById(simulatorId);

    if (!simulator) {
      return res.status(404).json({ message: 'Simulator not found' });
    }

    // Find the module in the simulator
    const module = simulator.modules.find(mod => mod.title === moduleTitle);

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Find and remove the specific question
    const questionIndex = module.questions.findIndex(q => q._id.toString() === questionId);

    if (questionIndex === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }

    module.questions.splice(questionIndex, 1);

    await simulator.save();

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
