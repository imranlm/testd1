import React from "react";
import SchoolIcon from "@mui/icons-material/School"; // Icon representing a course/education
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Icon representing duration/time
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import { Link } from "react-router-dom";

const CourseCard = ({
  Id,
  mode,
  courseTitle,
  duration,
  courseId
}) => {
  return (
    <div className="flex flex-col border border-gray-300 shadow-md shadow-gray-300 hover:shadow-blue-300 rounded-xl overflow-hidden cursor-pointer transition-transform transform hover:scale-105">
      <div className="p-1 border-b border-gray-300 bg-blue-100">
        <p className="text-md text-center font-bold">{Id}</p>
      </div>

      <div className="flex flex-col p-4">
        <h2 className="text-xl font-bold mb-4 self-center">{courseTitle}</h2>
        <div className="flex items-center mb-2">
          <SchoolIcon className="mr-2 p-1" /> {/* Icon for course/education */}
          <p className="text-gray-400 text-sm">{mode}</p>
        </div>
        <div className="flex items-center mb-2">
          <AccessTimeIcon className="mr-2 p-1" /> {/* Icon for duration/time */}
          <p className="text-gray-400 text-sm">{duration}</p>
        </div>
        <Link to={`/student/dashboard/course/detail/${courseId}`}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-1 py-1.5 rounded-lg mt-3 w-full">
            <LaunchRoundedIcon
              className="mr-2"
              style={{ fontSize: "1.2rem" }}
            />
            Open
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
