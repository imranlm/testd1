import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course,type,courseImage }) => {
  const imgSrc = course.img
    ? window.URL.createObjectURL(new Blob([Uint8Array.from(atob(course.img.data), c => c.charCodeAt(0))], { type: course.img.contentType }))
    : '';
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 ease-in-out duration-300">
      {imgSrc? (
        <img
          src={imgSrc}
          alt="Course"
          className="w-full"
          onLoad={() => URL.revokeObjectURL(imgSrc)} // Clean up URL object when image is loaded
        />
      ):(
        <img
          src={courseImage}
          alt="Simulator"
          className="w-full"
          // onLoad={() => URL.revokeObjectURL(imgSrc)} // Clean up URL object when image is loaded
        />
      )}
      <div className="p-4">
        <h2 className="text-md font-semibold mb-2">{course.title}</h2>
        <p className="text-gray-600 mb-4 text-sm">Duration: {course.duration}</p>
        <p className="text-gray-600 mb-4 text-sm">Price: ${course.price}</p>
        <Link 
          to={`/courses/courseDetail/${type}/${encodeURIComponent(course.title)}`} 
          className="text-center text-blue-500 cursor-pointer hover:underline"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
