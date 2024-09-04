const { ObjectId } = require('mongodb');
const { Simulator, Student } = require('../../model/dbModel');
const { connectToMongoDB } = require('../../services/authService');

const getSimulators = async (req, res) => {
    try {
        // Ensure the studentId is correctly formatted
        const studentId = new ObjectId(req.user.id);
        
        // Connect to MongoDB
        await connectToMongoDB();

        // Fetch student details
        const student = await Student.findById(studentId).lean();
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Extract simulator IDs from the student's purchased simulators
        const simulatorIds = student.simulatorsPurchased.map(sim => sim.simulatorId);

        // Fetch simulators based on extracted IDs
        const simulators = await Simulator.find({ _id: { $in: simulatorIds } }).lean();

        // Create a map of simulators by their ID
        const simulatorMap = simulators.reduce((acc, simulator) => {
            acc[simulator._id.toString()] = simulator;
            return acc;
        }, {});

        // Construct the purchased simulators list
        const purchasedSimulators = student.simulatorsPurchased.map(sim => {
            const simulator = simulatorMap[sim.simulatorId.toString()] || {};
            const modules = simulator.modules || [];

            return {
                simulatorId: sim.simulatorId,
                manualSimulatorId: sim.manualSimulatorId,
                title: simulator.title || 'Unknown',
                duration: simulator.duration || 'N/A',  // Include duration
                noOfMCQs: simulator.noOfMCQs || 'N/A',  // Include number of MCQs
                modules: sim.modules.map(module => {
                    const matchedModule = modules.find(m => m._id.toString() === module.moduleId.toString()) || {};
                    return {
                        moduleId: module.moduleId,
                        moduleName: module.moduleName,
                        totalQuestions: matchedModule.totalQuestions || 0,
                        questionsSolved: module.questionsSolved || 0, // Ensure questionsSolved is a number
                        questionsRemaining: module.questionsRemaining || 0, // Ensure questionsRemaining is a number
                    };
                })
            };
        });

        // Send the response with the list of purchased simulators
        res.status(200).json({ simulators: purchasedSimulators });
    } catch (error) {
        console.error('Error fetching simulators:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




const getSimulatorDetails = async (req, res) => {
    try {
      // Connect to MongoDB
      await connectToMongoDB();
  
      // Extract simulator title from the request
      const { title } = req.params;
      if (!title) {
        return res.status(400).json({ message: 'Simulator title is required' });
      }
  
      // Fetch the simulator by title
      const simulator = await Simulator.findOne({ title }).lean();
      if (!simulator) {
        return res.status(404).json({ message: 'Simulator not found' });
      }
  
      // Fetch student details
      const studentId = new ObjectId(req.user.id);
      const student = await Student.findById(studentId).lean();
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Initialize a map to track solved questions for each module
      const solvedQuestionsMap = {};
  
      // Loop through the student's purchased simulators
      student.simulatorsPurchased.forEach((sim) => {
        if (sim.manualSimulatorId === simulator.title) {
          sim.modules.forEach((module) => {
            console.log(module.questionsSolved.length)
            solvedQuestionsMap[module.moduleName] = module.questionsSolved.length;
          });
        }
      });
  
      // Prepare the response data
      const detailedModules = simulator.modules.map((module) => {
      
      
        // Attempt to fetch solved questions from the map
        const solvedQuestions = solvedQuestionsMap[module.title] || 0;
      
        // Debugging: Log the number of solved questions
      
        return {
          moduleId: module._id,
          moduleName: module.title,
          maxTime:module.maxTime,
          totalQuestions: module.questions.length,
          questionsSolved: solvedQuestions,
        };
      });
      
  
      res.status(200).json({
        simulatorTitle: simulator.title,
        modules: detailedModules,
      });
    } catch (error) {
      console.error('Error fetching simulator details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

const getModuleDetails = async (req, res) => {
    try {
        // Connect to MongoDB
        await connectToMongoDB();

        // Extract simulator title and module title from the request parameters
        const { title, moduleTitle } = req.params;
        console.log(title, moduleTitle);

        if (!title || !moduleTitle) {
            return res.status(400).json({ message: 'Simulator title and module title are required' });
        }

        // Fetch the simulator by title
        const simulator = await Simulator.findOne({ title }).lean();
        if (!simulator) {
            return res.status(404).json({ message: 'Simulator not found' });
        }

        // Fetch the module from the simulator by module title
        const module = simulator.modules.find(m => m.title === moduleTitle);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        // Fetch student details
        console.log(module)
        const studentId = new ObjectId(req.user.id);
        const student = await Student.findById(studentId).lean();
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Create a map of questions solved by the student
        console.log(student.simulatorsPurchased)
        // const solvedQuestionsMap = student.simulatorsPurchased.reduce((acc, sim) => {
        //     if (sim.simulatorId.toString() === simulator._id.toString()) {
        //         sim.modules.forEach(mod => {
        //             if (mod.moduleId.toString() === module._id.toString()) {
        //                 mod.questionsSolved.forEach(q => {
        //                     acc[q.questionId.toString()] = {
        //                         answeredOption: q.answeredOption,
        //                         isCorrect: q.isCorrect,
        //                         timeTaken: q.timeTaken,
        //                         solvedAt: q.solvedAt
        //                     };
        //                 });
        //             }
        //         });
        //     }
        //     return acc;
        // }, {});

        const solvedQuestionsMap = student.simulatorsPurchased.reduce((acc, sim) => {
                sim.modules.forEach(mod => {
                    if (mod.moduleName === module.title) {
                        mod.questionsSolved.forEach(q => {
                            acc[q.questionId.toString()] = {
                                answeredOption: q.answeredOption,
                                isCorrect: q.isCorrect,
                                timeTaken: q.timeTaken,
                                solvedAt: q.solvedAt
                            };
                        });
                    }
                });
         
            return acc;
        }, {});

        // Check if the map is being populated correctly
        console.log('Solved Questions Map:', solvedQuestionsMap);

        // Prepare the response data
        const detailedQuestions = module.questions.map(question => {
            const solvedQuestion = solvedQuestionsMap[question._id.toString()];
            return {
                questionId: question._id,
                questionText: question.questionText,
                options: question.options,
                correctOption: question.correctOption,
                explanation: question.explanation,
                isSolved: !!solvedQuestion,
                answeredOption: solvedQuestion ? solvedQuestion.answeredOption : null,
                isCorrect: solvedQuestion ? solvedQuestion.isCorrect : null,
                timeTaken: solvedQuestion ? solvedQuestion.timeTaken : null,
                solvedAt: solvedQuestion ? solvedQuestion.solvedAt : null
            };
        });

        res.status(200).json({
            moduleName: module.title,
            maxTime:module.maxTime,
            totalQuestions: module.questions.length,
            questions: detailedQuestions
        });
    } catch (error) {
        console.error('Error fetching module details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { getSimulators, getSimulatorDetails, getModuleDetails };
