import React from "react";
import Navbar from "../styles/Navbar";
import { useSpring, animated } from "@react-spring/web";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FAQ from "./FAQ";
import EastIcon from "@mui/icons-material/East";
import ContactUs from "./ContactUs";
import Footer from "./Footer";

const LandingPage = () => {
  // Animation for text
  const textAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { duration: 1000 },
  });

  // Animation for image
  const imageAnimation = useSpring({
    from: { opacity: 0, transform: "scale(0.9)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { duration: 1000 },
    delay: 300,
  });

  const faqs = [
    "What devices can I use to login?",
    "How can I reset my password?",
    "Is there a mobile app available?",
    "What payment methods are accepted?",
  ];

  const answers = [
    "You can log in using any device that has internet access, including computers, tablets, and smartphones.",
    "To reset your password, go to the login page and click on 'Forgot Password'. Follow the instructions to reset your password.",
    "Yes, there is a mobile app available for both iOS and Android. You can download it from the App Store or Google Play.",
    "We accept various payment methods, including credit/debit cards, PayPal, and more.",
  ];

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-[#152354] via-[#1B2D6B] to-[#2F4DBA]">
        <Navbar />

        <div className="flex flex-col md:flex-row justify-around gap-8 md:gap-12 mt-12 md:mt-24">
          {/* Animated text content */}
          <animated.div
            style={textAnimation}
            className="flex flex-col gap-4 w-full md:w-1/3 mt-4 md:mt-8 px-4 md:px-12"
          >
            <h1 className="text-white font-bold text-3xl md:text-4xl">
              <span className="text-yellow">PMI Training</span> Online is
            </h1>
            <h1 className="text-white font-bold text-3xl md:text-4xl">
              now much easier
            </h1>
            <p className="text-white text-sm md:text-base mt-2">
              Access the World’s Most Popular PMP® VideoTraining Course Anywhere
              and Anytime With PMAcademy
            </p>
            <div className="w-full md:w-28 mt-4 text-center font-semibold bg-white text-black rounded-full px-3 py-2 hover:bg-gray-200 cursor-pointer active:text-white active:bg-blue-500">
              Join Now
            </div>
          </animated.div>

          {/* Animated image */}
          <animated.div
            style={imageAnimation}
            className="w-full md:w-1/2 px-4"
          >
            <img
              src={`${process.env.PUBLIC_URL}/images/LandingPageImage.png`}
              alt="Landing"
              className="w-full h-64 md:h-96 object-cover"
            />
          </animated.div>
        </div>
      </div>

      <div className="bg-bg_gray flex flex-col md:flex-row justify-center gap-8 md:gap-12 min-h-96 py-8 md:py-16 px-4 md:px-12">
      <div className="flex flex-col w-full md:w-1/3 gap-2 self-center">
  <h2 className="text-yellow font-bold text-xl md:text-2xl">Features</h2>
  <h1 className="text-2xl md:text-3xl font-bold">Get PMI Certified</h1>
  <p className="text-sm md:text-xl text-gray-700">
    Prepare to Pass Your PMP Certification Exam on the First Try With The
    PMP Academy
  </p>
  <div className="w-full md:w-32 mt-4 text-center font-semibold bg-blue-900 text-white rounded-full px-3 py-2 hover:bg-blue-600 cursor-pointer active:text-white active:bg-blue-500">
    Get Started
  </div>
</div>

<div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full md:w-1/2 justify-center">
  <div className="flex flex-col items-center md:items-end w-full md:w-1/2 gap-4">
    <div className="w-full md:w-4/5 p-4 gap-2 flex flex-col border border-black rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer ">
      <img
        src={`${process.env.PUBLIC_URL}/images/play-icon.png`}
        alt="Feature1"
        className="w-12"
      />
      <h2 className="text-sm font-bold text-center md:text-left">
        1-1 Training Sessions
      </h2>
      <p className="text-xs text-center md:text-left">
        Watch 50 hours worth of video-based training to master the
        knowledge, skills, tools, and techniques required to pass.
      </p>
    </div>
    <div className="w-full md:w-4/5 p-4 gap-2 flex flex-col border border-black rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer">
      <img
        src={`${process.env.PUBLIC_URL}/images/notepad-icon.png`}
        alt="Feature1"
        className="w-12"
      />
      <h2 className="text-sm font-bold text-center md:text-left">
        Advance Exam Strategies
      </h2>
      <p className="text-xs text-center md:text-left">
        Learn from the experience of different PMP exam experts and
        former students to adapt your approach for exam success.
      </p>
    </div>
  </div>

  <div className="flex flex-col gap-4 mt-4 md:mt-8 w-full md:w-1/2">
    <div className="w-full md:w-4/5 p-4 gap-2 flex flex-col border border-black rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer">
      <img
        src={`${process.env.PUBLIC_URL}/images/Discussion-icon.png`}
        alt="Feature1"
        className="w-12"
      />
      <h2 className="text-sm font-bold text-center md:text-left">
        35 Contact Hours Certificate
      </h2>
      <p className="text-xs text-center md:text-left">
        Get a certificate for 35 Contact Hours from a trusted and
        experienced education provider.
      </p>
    </div>
    <div className="w-full md:w-4/5 p-4 gap-2 flex flex-col border border-black rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer">
      <img
        src={`${process.env.PUBLIC_URL}/images/Exam-icon.png`}
        alt="Feature1"
        className="w-12"
      />
      <h2 className="text-sm font-bold text-center md:text-left">
        The PMI Exam checklist
      </h2>
      <p className="text-xs text-center md:text-left">
        Get helpful resources on exam prep tips, study activities and
        additional lessons on how to boost your studies.
      </p>
    </div>
  </div>
</div>

      </div>

      <div className="flex flex-col md:flex-row justify-around my-12 px-4 md:px-12">
        <div className="w-full md:w-1/2 h-64 md:h-96">
          <img
            src={`${process.env.PUBLIC_URL}/images/LandingPage-Section2.png`}
            alt="Feature1"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-4 w-full md:w-1/3 justify-center">
          <h1 className="text-2xl md:text-3xl font-bold">Useful Features</h1>
          <h2 className="text-lg md:text-xl font-bold text-yellow_light">
            Need More PMP Exam Prep Learning sources?
          </h2>
          <p className="text-gray-700 text-sm md:text-base">
            Access our wide range of learning resources and PMP exam prep
            materials to help enhance your review and improve exam confidence.
          </p>

          <div className="text-gray-700 text-sm md:text-md">
            <p>
              <CheckCircleIcon className="text-green-500 mr-2" />
              PM Preparation
            </p>
            <p>
              <CheckCircleIcon className="text-green-500 mr-2" />
              PM Exam Simulation
            </p>
            <p>
              <CheckCircleIcon className="text-green-500 mr-2" />
              Over 1000+ PMP Exam Question
            </p>
            <p>
              <CheckCircleIcon className="text-green-500 mr-2" />
              Exam Outline
            </p>
            <p>
              <CheckCircleIcon className="text-green-500 mr-2" />
              1-1 Mentorship Sessions
            </p>
            <p>
              <CheckCircleIcon className="text-green-500 mr-2" />
              PMI Study Tools
            </p>
            <p>
              <CheckCircleIcon className="text-green-500 mr-2" />
              Detailed Answers and Explanations
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Component */}
      <div className="flex flex-col md:flex-row w-full justify-around my-12 px-4 md:px-12">
        <div className="w-full md:w-1/3 flex flex-col pl-4 md:pl-16 justify-center">
          <p className="text-yellow_light text-sm md:text-base">Questions & Answers</p>
          <h1 className="text-2xl md:text-3xl font-bold">
            Frequently Asked
            <br /> Questions
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold pt-4">Don't get answer</h2>
          <p className="text-gray-700 text-sm md:text-base">
            We will answer you in less than 24 hours.
          </p>
          <p className="text-blue-500 font-semibold text-lg md:text-xl pt-4">
            Leave us a message <EastIcon />
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <FAQ faqs={faqs} answers={answers} />
        </div>
      </div>

      {/* Contact Us form */}
      <ContactUs />
      <Footer />
    </div>
  );
};

export default LandingPage;
