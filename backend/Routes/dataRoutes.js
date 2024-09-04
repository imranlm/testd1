const express = require('express');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const {getAllCourses}=require('../controllers/CourseDataController/getAllCourses');
const{getAllSimulators}=require('../controllers/CourseDataController/getAllSimulators');
const {getCourseDetails}=require('../controllers/CourseDataController/getCourseDetail');
const router = express.Router();

router.get('/getAllCourses', getAllCourses);
router.get('/getAllSimulators', getAllSimulators);
router.get('/getCourseDetails', getCourseDetails);


module.exports = router;
