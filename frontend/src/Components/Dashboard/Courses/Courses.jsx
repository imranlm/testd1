import React, { useEffect, useState } from "react";
import Sidebar from "../utilities/Sidebar";
import CourseCard from "./CourseCard";
import PageNameAndDate from "../utilities/PageNameAndDate";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initial state set to null
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/auth/verifyAuth`, { withCredentials: true })
      .then((response) => {
        if (response.data.user.userType === "student") {
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
    if (isAuthenticated) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/student/dashboard/courses/`, {
          withCredentials: true,
        })
        .then((response) => {
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
    }
  }, [isAuthenticated]);
  

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
        <Sidebar />
      </div>

      <div className="md:ml-[268px] sm:ml-44 flex flex-col w-full">
        <div className="w-full p-6 mt-4">
          <PageNameAndDate pageName={"Courses"} />

          <div className="flex justify-between rounded-md w-full my-3"></div>
        </div>

        <div className="flex justify-center gap-8 h-full w-full p-4 flex-wrap">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <div key={index} className="w-72">
                <CourseCard
                  Id={index + 1}
                  courseTitle={course.title}
                  duration={course.duration}
                  mode={course.mode}
                  courseId={course.courseId}
                  userType={'student'}
                />
              </div>
            ))
          ) : (
            <p>No courses available</p>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold">You are not logged in</h1>
    </div>
  );
};

export default Courses;
