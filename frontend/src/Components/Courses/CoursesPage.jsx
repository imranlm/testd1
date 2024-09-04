import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import Navbar from "../styles/Navbar";
import CourseCard from "./CourseCard";
import Footer from "../LandingPage/Footer";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";



const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [fetchedSimulators, setFetchedSimulators] = useState([]);
    // const [courseImages, setCourseImages] = useState([]);
    // const [simulatorImages, setSimulatorImages] = useState([]);
  const [loading, setLoading] = useState(true);


  // Typing animation for the heading
  const headingProps = useSpring({
    from: { width: "0%" },
    to: { width: "100%" },
    config: { duration: 4000 },
    reset: true,
  });

  // Typing animation for the paragraph
  const paragraphProps = useSpring({
    from: { width: "0%" },
    to: { width: "100%" },
    config: { duration: 5000 },
    reset: true,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/courses/getAllCourses`);
        if(response){
          setLoading(false);
          setFetchedCourses(response.data.courses);
        }
       
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchSimulators = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/courses/getAllSimulators`);
        if(response){
          setLoading(false);
          console.log(response.data)
          setFetchedSimulators(response.data);
        }
      } catch (error) {
        console.error("Error fetching simulators:", error);
      }
    };

    fetchCourses();
    fetchSimulators();
  }, []);
  const simulatorImages = [
    `${process.env.PUBLIC_URL}/images/Course-img-3.png`,
    `${process.env.PUBLIC_URL}/images/Course-img-4.png`,
];
  
  // Choose the appropriate images and content based on the active tab
  const contentToDisplay = activeTab === "courses" ? fetchedCourses : fetchedSimulators;

  return (
    <div>
      <Navbar textColor="text-blue-800" />

      <div className="relative">
        <img
          src={`${process.env.PUBLIC_URL}/images/Courses-page-main-image.png`}
          alt="Landing"
          className="w-full h-[500px] object-cover"
        />

        {/* Overlay text and button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <animated.h1
            style={headingProps}
            className="text-xl sm:text-4xl md:h-12 font-bold mb-4 overflow-hidden whitespace-nowrap"
          >
            All Project Management Training Courses
          </animated.h1>

          <animated.p
            style={paragraphProps}
            className="text-xs w-4/5 sm:text-xl mb-8 overflow-hidden whitespace-nowrap"
          >
            Explore comprehensive courses to enhance your project management skills.
          </animated.p>

          <div className="w-1/2 md:w-32 mt-4 text-center font-semibold bg-blue-900 text-white rounded-full px-3 py-2 hover:bg-blue-600 cursor-pointer hover:shadow-lg active:text-white active:bg-blue-500">
            Get Started
          </div>
        </div>
      </div>

      {/* Tabs for filtering */}
      <div className="flex flex-wrap justify-center gap-4 my-8 px-4">
        <div
          onClick={() => setActiveTab("courses")}
          className={`cursor-pointer px-4 py-2 rounded-lg ${
            activeTab === "courses" ? "bg-blue-500 text-white" : "bg-gray-200"
          } transition-colors duration-300`}
        >
          Courses
        </div>
        <div
          onClick={() => setActiveTab("simulators")}
          className={`cursor-pointer px-4 py-2 rounded-lg ${
            activeTab === "simulators"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          } transition-colors duration-300`}
        >
          Simulators
        </div>
      </div>

      {/* Filtered content */}
      {loading && (
              <div className=" flex items-center justify-center">
                <CircularProgress style={{ color: "blue" }} />
              </div>
            )}


      <div className="p-4 px-4 sm:px-8 flex flex-wrap gap-6 justify-center mb-12">

        {contentToDisplay.map((item, index) => (
          
          <div
            key={index}
            className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-[23%]"
          >
            <CourseCard
              course={item}
              type={activeTab} // Pass the type to CourseCard
              courseImage={simulatorImages[index]}
            />
          </div>

        ))}
      </div>

      <Footer />
    </div>
  );
};

export default CoursesPage;
