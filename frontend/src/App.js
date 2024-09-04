import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import Payment from "./Components/Payment/Payment";
import LandingPage from "./Components/LandingPage/LandingPage";
import CoursesPage from "./Components/Courses/CoursesPage";
import RegisterPage from "./Components/Authentication/Register/RegisterPage";
import LoginPage from "./Components/Authentication/Register/LoginPage";
import CourseDetailPage from "./Components/Courses/CourseDetail/CourseDetailPage";
import StudentDashboard from './Components/Dashboard/StudentDashboard/StudentDashboard';
import Courses from './Components/Dashboard/Courses/Courses';
import Simulators from './Components/Dashboard/StudentDashboard/Simulator/Simulators';
import CourseDetail from './Components/Dashboard/Courses/CourseDetail/CourseDetail';
import InstructorDashboard from './Components/Dashboard/InstructorDashboard/InstructorDashboard';
import StudentsList from './Components/Dashboard/InstructorDashboard/Students/StudentsList';
import StudentDetail from './Components/Dashboard/InstructorDashboard/Students/StudentDetail';
import Availability from './Components/Dashboard/InstructorDashboard/Availability/Availability';
import Sessions from './Components/Dashboard/InstructorDashboard/Sessions/Sessions';
import SimulatorModuleList from './Components/Dashboard/StudentDashboard/Simulator/SimulatorDetail/SimulatorModulesList';
import SimulatorModule from './Components/Dashboard/StudentDashboard/Simulator/SimulatorDetail/SimulatorModule';
import PaymentsAndBilling from './Components/Dashboard/StudentDashboard/Payment/Payments';
import InstructorCourses from './Components/Dashboard/InstructorDashboard/Courses/InstructorCourses';
import InstructorSimulatorDetail from './Components/Dashboard/InstructorDashboard/Courses/SimulatorModules';
import SimulatorModuleDetail from './Components/Dashboard/InstructorDashboard/Courses/SimulatorModuleDetail';
import Success from './Success';
import Cancel from './Cancel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Default route */}
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/Payments" element={<Payment />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/courses/courseDetail/:type/:courseName" element={<CourseDetailPage />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/dashboard/courses" element={<Courses />} />
          <Route path="/student/dashboard/payments-and-billing" element={<PaymentsAndBilling/>} />
          <Route path="/student/dashboard/simulators" element={<Simulators />} />
          <Route path="/student/dashboard/simulators/modules/:simulatorTitle" element={<SimulatorModuleList />} />
          <Route path="/student/dashboard/simulators/modules/:simulatorTitle/:moduleTitle" element={<SimulatorModule />} />
          <Route path="/student/dashboard/course/detail/:courseId" element={<CourseDetail />} />


          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/dashboard/students" element={<StudentsList />} />
          <Route path="/instructor/dashboard/students/studentDetail/:id" element={<StudentDetail />} />
          <Route path="/instructor/dashboard/courses" element={<InstructorCourses/>} />
          <Route path="/instructor/dashboard/availability" element={<Availability />} />
          <Route path="/instructor/dashboard/sessions" element={<Sessions />} />
          <Route path="/instructor/dashboard/simulator/detail/:id" element={<InstructorSimulatorDetail />} />
          <Route path="/instructor/dashboard/simulator/detail/module/:id" element={<SimulatorModuleDetail />} />


          <Route path="/Success" element={<Success />} />
          <Route path="/Cancel" element={<Cancel />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
