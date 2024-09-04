import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../styles/Navbar";
import Footer from "../../LandingPage/Footer";
// import Cookies from "js-cookie";
import { useCookies } from "react-cookie";
import CircularProgress from "@mui/material/CircularProgress";


const CourseDetailPage = () => {
  const { type, courseName } = useParams(); // Extract type and name from URL
  console.log(type, courseName);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie] = useCookies(["PMI-cart"]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/courses/getCourseDetails`, // Update with the correct endpoint
          {
            params: { type, courseName },
          }
        );
        // console.log(response.data)
        setCourse(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [type, courseName]);
  const handleAddToCart = async () => {
    if (course) {
      const existingCart = cookies['PMI-cart'] ? cookies['PMI-cart'] : [];

      // Check if the existingCart is an array, if not, initialize it as an array
      const updatedCart = Array.isArray(existingCart) ? [...existingCart, course] : [course];

      // Update the cookie with the new cart value
      setCookie('PMI-cart', JSON.stringify(updatedCart), { path: '/' });

      alert("Item added to cart");
    }
  };

  // if (loading) {
  //   return <div>Loading...</div>;
    
  // }

  // if (!course) {
  //   return <div>Course not found</div>;
  // }
  return (
    <div>
      <Navbar textColor="text-blue-800" />
      <div className="relative">
    
        <div
          style={{
            background: "linear-gradient(to right, #131F4B 42%, #2C49B1 97%)",
            width: "100%",
          }}
          className="relative flex flex-col lg:flex-row items-center justify-between px-4 lg:px-8 text-white h-[450px]"
        >
          {/* Text Content */}
          

          <div className="flex flex-col w-full lg:w-1/2 z-10 text-center lg:text-left">
            <h1 className="text-lg lg:text-xl font-bold mb-2 mt-8 sm:mt-0">
              PMP Exam Prep Online Training Course
              <br /> “1-1 sessions”
            </h1>
            <p className="mb-2 text-gray-200 text-xs lg:text-sm">
              Get your PMI PMP certification now
            </p>
            <p className="my-4 text-sm lg:text-lg">
              The PrepCast PMP Exam Simulator™ Deluxe - Pass the PMP Exam with
              Confidence & Competence - 2,070 Sample Questions - Updated to the
              Current Exam - Realistic Exam - 90 Day Access
            </p>
            <p className="mb-4">
              <span className="font-bold">Price:</span> $1000
            </p>
            <div className="sm:text-center md:text-start">
              <button
                className="w-2/3 lg:w-1/5 bg-blue-100 text-gray-900 text-md font-semibold py-2 px-2 mt-6 rounded-lg hover:bg-gray-100 active:bg-blue-200"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* PMP Image */}
          <img
            src={`${process.env.PUBLIC_URL}/images/PMP-img.png`}
            alt="PMP Exam Prep"
            className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full object-cover z-0 hidden lg:block"
            style={{ zIndex: 5 }}
          />

          {/* Right Image */}
          <div className="w-full lg:w-[40%] flex justify-center lg:justify-end z-10 mt-4 lg:mt-0">
            <img
              src={`${process.env.PUBLIC_URL}/images/courseDetail-main-img.png`}
              alt="Course Detail Main"
              className="w-4/5 lg:w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-center text-xl lg:text-2xl font-bold my-8 text-blue-800">
          What Included
        </h1>
      </div>

      {/* What Included Cards with Hover Effect */}
      <div className="flex flex-wrap justify-evenly w-full my-8 gap-4 lg:gap-0">
        <div className="w-2/3 lg:w-1/5 flex flex-col gap-6 border rounded-xl shadow-xl items-center p-4 transform transition-transform duration-300 hover:scale-105 cursor-pointer">
          <img
            src={`${process.env.PUBLIC_URL}/images/Online-icon.png`}
            alt="online"
            className="w-1/5 m-auto"
          />
          <h2 className="text-sm lg:text-md text-center w-1/2">
            1-1 Training Sessions
          </h2>
        </div>
        <div className="w-2/3 lg:w-1/5 flex flex-col gap-6 border rounded-xl shadow-xl items-center p-4 transform transition-transform duration-300 hover:scale-105 cursor-pointer">
          <img
            src={`${process.env.PUBLIC_URL}/images/working-hour-icon.png`}
            alt="working-hour"
            className="w-1/5 m-auto"
          />
          <h2 className="text-sm lg:text-md text-center w-1/2">
            35 hour Training
          </h2>
        </div>
        <div className="w-2/3 lg:w-1/5 flex flex-col gap-6 border rounded-xl shadow-xl items-center p-4 transform transition-transform duration-300 hover:scale-105 cursor-pointer">
          <img
            src={`${process.env.PUBLIC_URL}/images/certificate-icon.png`}
            alt="certificate"
            className="w-1/5 m-auto"
          />
          <h2 className="text-sm lg:text-md text-center w-1/2">
            Certificate at End
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-8 items-center my-12 w-11/12 lg:w-4/5 m-auto text-sm lg:text-base">
        <h1 className="font-bold text-xl lg:text-2xl text-blue-800">
          About the Course
        </h1>
        <p className="text-justify">
          With The PrepCast PMP Exam Simulator™ Deluxe, you will achieve the
          confidence and competence necessary to pass your PMP exam. Track your
          progress, identify knowledge gaps, practice under realistic exam
          conditions, and test yourself on a question pool that is fully updated
          to the current exam. You'll study the most relevant topics, plus the
          30-day money-back guarantee is additional peace of mind.
        </p>
        <div className="self-start">
          <p>Key Features:</p>
          <p>
            2,070+ PMP® exam sample questions developed by a certified PMP team
            for the current exam
          </p>
          <p>
            4 complete exams plus a separate quiz pool - both with unlimited
            repeats
          </p>
          <p>Includes PMBOK® Guide seventh edition questions and references</p>
        </div>
        <h1 className="font-bold text-xl lg:text-2xl text-blue-800">
          About the PMP Certification
        </h1>
        <p className="text-justify">
          PMI’s Project Management Professional (PMP)® credential is the most
          important industry-recognized certification for project managers.
          Globally recognized and demanded, the PMP® demonstrates that you have
          the experience, education, and competency to lead and direct projects.
        </p>
        <h1 className="font-bold text-xl lg:text-2xl text-blue-800">
          Who Should Apply?
        </h1>
        <p className="text-justify">
          PMI’s Project Management Professional (PMP)® credential is the most
          important industry-recognized certification for project managers.
          Globally recognized and demanded, the PMP® demonstrates that you have
          the experience, education, and competency to lead and direct projects.
          If you’re an experienced project manager looking to solidify your
          skills, stand out to employers, and maximize your earning potential,
          the PMP credential is the right choice for you.
        </p>
        <h1 className="font-bold text-xl lg:text-2xl text-blue-800">
          PMP Requirements
        </h1>
        <p className="text-justify">
          A secondary degree (high school diploma, associate’s degree, or the
          global equivalent) with at least five years of project management
          experience, with 7,500 hours leading and directing projects and 35
          hours of project management education.
        </p>
        <p className="text-center lg:text-left">OR</p>
        <p className="text-justify">
          A four-year degree (bachelor’s degree or the global equivalent) and at
          least three years of project management experience, with 4,500 hours
          leading and directing projects and 35 hours of project management
          education.
        </p>
        <h1 className="font-bold text-xl lg:text-2xl text-blue-800">
          PMP Certification Exam Information
        </h1>
        <p className="self-start text-justify">
          The PMP EXAM is an online test conducted at designated Test Centers.
          <br />
          Duration of Exam: 4 Hours
          <br />
          Number of Questions: 200 (Multiple Choice 4 options). Out of this, 25
          questions are randomly placed pretest/dummy questions.
          <br />
          Instant Results after 4 Hours – Breakup of percentage marks obtained
          for each topic is given with overall Pass/Fail
        </p>
        <h1 className="font-bold text-xl lg:text-2xl text-blue-800">
          PMP Certification Exam: Application Process
        </h1>

        <div className="self-start">
          <p className="text-justify">
            Register to become a member of the Project Management Institute
            (PMI).
          </p>
          <ul className="text-justify">
            <li>
              It costs $139 to become a member, but it saves you money on exam
              fees.
            </li>
            <li>
              The standard non-member price to take the exam is $555. The PMI
              member price for the exam is $405.
            </li>
          </ul>
          <p className="text-justify">
            Take our PMP Course to satisfy the required 35 hours (PDUs) of
            formal project management education.
          </p>
          <ul className="text-justify">
            <li>
              Complete the exam application at PMI.org. Upon acceptance of your
              application, you have one year to pay the exam fee and take the
              exam. PMI will notify you via email of the acceptance.
            </li>
          </ul>
        </div>
        {loading && (
              <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
                <CircularProgress style={{ color: "blue" }} />
              </div>
            )}
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
