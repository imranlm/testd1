const mongoose = require('mongoose');
const Schema = mongoose.Schema;



// Define Question schema for embedding within Simulator schema
const questionSchema = new Schema({
  question_id: Schema.Types.ObjectId,
  question_text: String,
  options: [String],
  correct_option: String,
  explanation: String,
  created_at: Date,
  updated_at: Date
});

const paymentSchema = new mongoose.Schema({
  courseName: [{
    title: { type: String, required: true }, // Course or simulator title
    type: { type: String, enum: ['course', 'simulator'], required: true } // Type for each course or simulator
  }],
  email: { type: String, required: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true },
  paidStatus: { type: String },
  dateTime: { type: Date, default: Date.now },
  paymentType: { type: String },
  duration: [{
    course: String,
    duration: String,
    type: { type: String, enum: ['course', 'simulator'] } // Type for each duration entry
  }],
  courseId: [{
    id: { type: mongoose.Schema.Types.ObjectId, refPath: 'courseName.type' }, // Ref to either Course or Simulator
    type: { type: String, enum: ['course', 'simulator'] } // Type for each courseId entry
  }],
  expiryDate: [{
    course: String,
    date: Date,
    type: { type: String, enum: ['course', 'simulator'] } // Type for each expiry date entry
  }]
});

const simulatorSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    simulatorId: String, // e.g., 'S001'
    title: String,
    courseId: mongoose.Schema.Types.ObjectId,
    noOfMCQs:Number,
    duration:String,
    price:String,
    img: {
      data: Buffer, // Use Buffer for binary data
      contentType: String // MIME type for the image
    },
    modules: [
      {
        title: String,
        maxTime:String,
        questions: [
          {
            // _id: mongoose.Schema.Types.ObjectId,
            questionText: String,
            options: [String],
            correctOption: String,
            explanation: String
          }
        ],
        completionStatus: [
          {
            studentId: mongoose.Schema.Types.ObjectId,
            percentageCompleted: Number, // e.g., 40 for 40%
            completedQuestions: [
              {
                questionId: mongoose.Schema.Types.ObjectId,
                answeredOption: String,
                isCorrect: Boolean,
                timeTaken: Number,
                solvedAt: Date
              }
            ]
          }
        ]
      }
    ]
  });
  

// Define Course schema
const courseSchema = new Schema({
  title: String,
  description: String,
  courseId: String, // e.g., '001', '002'
  simulators: [{ type: Schema.Types.ObjectId, ref: 'Simulator' }],
  price: Number,
  mode:String,//online
  duration:String,  
  img: {
    data: Buffer, // Use Buffer for binary data
    contentType: String // MIME type for the image
  }
});

// const studentSchema = new mongoose.Schema({
//     // _id: mongoose.Schema.Types.ObjectId,
//     name: String,
//     email: String,
//     password: String,
//     contact:String,
//     coursesEnrolled: [
//       {
//         courseId: mongoose.Schema.Types.ObjectId,
//         manualCourseId: String, // e.g., '001', '002'
//         progress: Number, // e.g., 100 for complete
//         startDate:Date,
//         endDate:Date,
//         simulatorsPurchased: [
//           {
//             simulatorId: mongoose.Schema.Types.ObjectId,
//             manualSimulatorId: String, // e.g., 'S001'
//             modules: [
//               {
//                 moduleId: mongoose.Schema.Types.ObjectId,
//                 moduleName: String,
//                 totalQuestions: Number,
//                 questionsSolved: [
//                   {
//                     questionId: mongoose.Schema.Types.ObjectId,
//                     questionText: String,
//                     answeredOption: String,
//                     isCorrect: Boolean,
//                     correctOption: String,
//                     explanation: String,
//                     timeTaken: Number, // Optional
//                     solvedAt: Date // Optional
//                   }
//                 ],
//                 questionsRemaining: Number
//               }
//             ]
//           }
//         ],
//         simulatorsCompleted: [
//           {
//             simulatorId: mongoose.Schema.Types.ObjectId,
//             manualSimulatorId: String, // e.g., 'S001'
//             modulesCompleted: [
//               {
//                 moduleId: mongoose.Schema.Types.ObjectId,
//                 moduleName: String,
//                 percentageCompleted: Number, // e.g., 100 for complete
//                 totalQuestions: Number,
//                 completedQuestions: [
//                   {
//                     questionId: mongoose.Schema.Types.ObjectId,
//                     questionText: String,
//                     answeredOption: String,
//                     isCorrect: Boolean,
//                     correctOption: String,
//                     explanation: String
//                   }
//                 ]
//               }
//             ]
//           }
//         ]
//       }
//     ],
//     pastMeetings: [mongoose.Schema.Types.ObjectId],
//     Meetings:[
//      { date:String,
//       day:String,
//       time:String,
//       meetingLink:String}
//     ]
//   });

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  contact: String,
  coursesEnrolled: [
    {
      courseId: mongoose.Schema.Types.ObjectId,
      manualCourseId: String, // e.g., '001', '002'
      progress: Number, // e.g., 100 for complete
      startDate: Date,
      endDate: Date,
    }
  ],
  simulatorsPurchased: [
    {
      simulatorId: mongoose.Schema.Types.ObjectId,
      manualSimulatorId: String, // e.g., 'S001'
      modules: [
        {
          moduleId: mongoose.Schema.Types.ObjectId,
          moduleName: String,
          totalQuestions: Number,
          questionsSolved: [
            {
              questionId: mongoose.Schema.Types.ObjectId,
              questionText: String,
              answeredOption: String,
              isCorrect: Boolean,
              correctOption: String,
              explanation: String,
              timeTaken: Number, // Optional
              solvedAt: Date // Optional
            }
          ],
          questionsRemaining: Number,
          pastResults: [
            {
              date: Date,
              questions: [
                {
                  questionId: mongoose.Schema.Types.ObjectId,
                  questionText: String,
                  answeredOption: String,
                  isCorrect: Boolean,
                  correctOption: String,
                  explanation: String,
                  timeTaken: Number, // Optional
                  solvedAt: Date // Optional
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  simulatorsCompleted: [
    {
      simulatorId: mongoose.Schema.Types.ObjectId,
      manualSimulatorId: String, // e.g., 'S001'
      modulesCompleted: [
        {
          moduleId: mongoose.Schema.Types.ObjectId,
          moduleName: String,
          percentageCompleted: Number, // e.g., 100 for complete
          totalQuestions: Number,
          completedQuestions: [
            {
              questionId: mongoose.Schema.Types.ObjectId,
              questionText: String,
              answeredOption: String,
              isCorrect: Boolean,
              correctOption: String,
              explanation: String
            }
          ]
        }
      ]
    }
  ],
  pastMeetings: [mongoose.Schema.Types.ObjectId],
  Meetings: [
    {
      date: String,
      day: String,
      time: String,
      meetingLink: String
    }
  ]
});


// module.exports = mongoose.model('Student', studentSchema);

  

// Define Instructor schema
const instructorSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    availableSlots: [
      {
        day: {
          type: String, // e.g., 'Monday'
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday','Sunday']
        },
        times: [
          {
            start: Date,
            end: Date,
            bookedBy: {
              studentId: {
                type: mongoose.Schema.Types.ObjectId,
                default: null // Set default value to null
              },
              studentEmail: {
                type: String,
                default: null // Set default value to null
              },
              date: {
                type: Date,
                default: null // Set default value to null
              },
              courseTitle: {
                type: String,
                default: null // Set default value to null
              },
              meetingId: {
                type: mongoose.Schema.Types.ObjectId,
                default: null // Set default value to null
              },
            }
          }
        ]
      }
    ],
    meetingsScheduled: [] // Array of scheduled meeting IDs
  });
  
  const meetingSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    date: Date,
    time: String,
    meetingLink: String,
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor'
    }
  });
  
// Models
const Student = mongoose.model('Student', studentSchema);
const Instructor = mongoose.model('Instructor', instructorSchema);
const Course = mongoose.model('Course', courseSchema);
const Simulator = mongoose.model('Simulator', simulatorSchema);
const Question = mongoose.model('Question', questionSchema);
const Meeting = mongoose.model('Meeting', meetingSchema);
const Payment = mongoose.model('Payment', paymentSchema);

// Export models
module.exports = { Student, Instructor, Course, Simulator, Question,Meeting,Payment};
