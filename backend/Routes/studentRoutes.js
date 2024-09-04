const express = require('express');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const {getStudentDashboardData}=require('../controllers/studentController/dashboardController');
const {getCourses}=require('../controllers/studentController/coursesController');
const {getSimulators}=require('../controllers/studentController/simulatorController')
const {getInstructorAvailability}=require('../controllers/studentController/getInstructorAvailability');
const {bookSlot}=require('../controllers/studentController/bookSlot')
const {getCourseDetail}=require('../controllers/studentController/getCourseDetails')
const {getSimulatorDetails}=require('../controllers/studentController/simulatorController')
const {getModuleDetails}=require('../controllers/studentController/simulatorController')
const {updateQuestion}=require('../controllers/studentController/updateQuestion')
const{getPaymentDetails}=require('../controllers/studentController/paymentController')
const {resetStudentModuleQuestions}=require('../controllers/studentController/updateQuestion');

const router = express.Router();

// Public routes
router.get('/dashboard', authenticateJWT, getStudentDashboardData);
router.get('/dashboard/payments',authenticateJWT,getPaymentDetails);
router.get('/dashboard/simulators', authenticateJWT, getSimulators);
router.get('/dashboard/simulators/:title', authenticateJWT, getSimulatorDetails);
router.get('/dashboard/simulators/:title/:moduleTitle', authenticateJWT, getModuleDetails);
router.post('/dashboard/simulator/updateQuestion', authenticateJWT, updateQuestion);
router.post('/dashboard/simulator/resetQuestions', authenticateJWT, resetStudentModuleQuestions);


router.get('/dashboard/courses', authenticateJWT, getCourses);
router.get('/dashboard/getInstructorAvailability', authenticateJWT, getInstructorAvailability);
router.post('/dashboard/bookSlot', authenticateJWT, bookSlot);
router.get('/dashboard/course/courseDetail', authenticateJWT, getCourseDetail);




module.exports = router;
