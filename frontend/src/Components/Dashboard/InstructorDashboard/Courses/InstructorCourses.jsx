import React, { useEffect, useState } from "react";
import PageNameAndDate from "../../utilities/PageNameAndDate";
import CourseCard from "../../Courses/CourseCard";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import InstructorSidebar from "../../utilities/InstructorSidebar";

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [simulators, setSimulators] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState("courses"); // "courses" or "simulators"

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/auth/verifyAuth`, { withCredentials: true })
      .then((response) => {
        if (response.data.user.userType === "instructor") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        setIsAuthenticated(false);
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated && viewType === "courses") {
      setLoading(true);
      axios
        .get(`http://localhost:5000/courses/getAllCourses`, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          setCourses(
            Array.isArray(response.data.courses) ? response.data.courses : []
          );
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (isAuthenticated && viewType === "simulators") {
      setLoading(true);
      axios
        .get(`http://localhost:5000/courses/getAllSimulators`, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          setSimulators(Array.isArray(response.data) ? response.data : []);
        })
        .catch((error) => {
          console.error("Error fetching simulators:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isAuthenticated, viewType]);

  if (loading) {
    return (
      <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
        <CircularProgress style={{ color: "blue" }} />
      </div>
    );
  }

  return isAuthenticated === null ? (
    <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
      <CircularProgress style={{ color: "blue" }} />
    </div>
  ) : isAuthenticated ? (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="fixed flex flex-col md:flex-row h-screen">
        <InstructorSidebar />
      </div>

      <div className="md:ml-[268px] sm:ml-44 flex flex-col w-full">
        <div className="w-full p-6 mt-4">
          <PageNameAndDate pageName={"Courses"} />

          <div className="flex justify-center gap-8 rounded-md w-full my-3">
            <div
              onClick={() => setViewType("courses")}
              className={`cursor-pointer px-4 py-2 rounded-lg ${
                viewType === "courses"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              } transition-colors duration-300`}
            >
              Courses
            </div>
            <div
              onClick={() => setViewType("simulators")}
              className={`cursor-pointer px-4 py-2 rounded-lg ${
                viewType === "simulators"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              } transition-colors duration-300`}
            >
              Simulators
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 h-full w-full p-4 flex-wrap">
          {viewType === "courses" ? (
            courses.length > 0 ? (
              courses.map((course, index) => (
                <div key={index} className="w-72">
                  <CourseCard
                    Id={index + 1}
                    courseTitle={course.title}
                    duration={course.duration}
                    mode={course.mode}
                    courseId={course.id}
                    userType="instructor"
                    type='course'
                   
                  />
                </div>
              ))
            ) : (
              <p>No courses available</p>
            )
          ) : viewType === "simulators" ? (
            simulators.length > 0 ? (
              simulators.map((simulator, index) => (
                <div key={index} className="w-72">
                  <CourseCard
                    Id={index + 1}
                    courseTitle={simulator.title}
                    duration={simulator.duration}
                    mode={simulator.noOfModules + " Module"}
                    courseId={simulator.id}
                    userType="instructor"
                    type='simulator'
                    
                  />
                </div>
              ))
            ) : (
              <p>No simulators available</p>
            )
          ) : null}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold">You are not logged in</h1>
    </div>
  );
};

export default InstructorCourses;
