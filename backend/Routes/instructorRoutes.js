const express = require('express');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const {getInstructorDashboardData}=require('../controllers/instructorController/dashboardController');
const{getAllStudents}=require('../controllers/instructorController/getAllStudentsController')
const {getStudentDetails}=require('../controllers/instructorController/getStudentController')
const{setAvailability}=require('../controllers/instructorController/setAvailability');
const {getAvailability}=require('../controllers/instructorController/getAvailability');
const {deleteAvailability}=require('../controllers/instructorController/deleteAvailability');
const{getMeetingDetails}=require('../controllers/instructorController/getMeetingDetail')
const {setMeetingDetails}=require('../controllers/instructorController/setMeetingDetails');
const{getSimulatorByModule}=require('../controllers/instructorController/getSimulatorDetail')
const{getModuleAndQuestions}=require('../controllers/instructorController/getSimulatorDetail');
const {addQuestionsFromJSON}=require('../controllers/instructorController/add/deleteQuestions');
const {updateQuestion}=require('../controllers/instructorController/add/deleteQuestions')
const {updateSimulator}=require('../controllers/instructorController/updateSimulatorModule');
const {updateModuleMaxTime}=require('../controllers/instructorController/updateSimulatorModule')
const {addModule}=require('../controllers/instructorController/addModule')
const{deleteQuestion}=require('../controllers/instructorController/add/deleteQuestions')


const router = express.Router();

// Public routes
router.get('/dashboard', authenticateJWT, getInstructorDashboardData);
// router.get('/dashboard/students', authenticateJWT, getAllStudents);
router.get('/dashboard/students', authenticateJWT, getAllStudents);
router.get('/dashboard/student/:id', authenticateJWT, getStudentDetails);
router.post('/dashboard/setAvailability', authenticateJWT, setAvailability);
router.get('/dashboard/getAvailability', authenticateJWT, getAvailability);
router.delete('/dashboard/deleteAvailability/:slotId', authenticateJWT, deleteAvailability);
router.get('/dashboard/getMeetingDetails', authenticateJWT, getMeetingDetails);
router.post('/dashboard/addMeetingLink', authenticateJWT, setMeetingDetails);
router.get('/dashboard/getSimulatorModules/:id', authenticateJWT, getModuleAndQuestions);
router.get('/dashboard/getSimulatorDetail/:id/:moduleTitle', authenticateJWT, getSimulatorByModule);
router.post('/dashboard/addQuestions/:id/:moduleTitle', authenticateJWT, addQuestionsFromJSON);
router.put('/dashboard/updateQuestion/:id/:moduleTitle/:questionId', authenticateJWT, updateQuestion);
router.put('/dashboard/updateSimulator/:id', authenticateJWT, updateSimulator);
router.put('/dashboard/updateModuleTime/:id/:moduleTitle', authenticateJWT, updateModuleMaxTime);
router.post('/dashboard/addModule/:id', authenticateJWT, addModule);
router.delete('/dashboard/deleteQuestion/:id/:moduleTitle/:questionId', authenticateJWT, deleteQuestion);





module.exports = router;
