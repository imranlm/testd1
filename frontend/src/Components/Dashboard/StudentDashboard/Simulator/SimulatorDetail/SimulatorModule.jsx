import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../../utilities/Sidebar";
import PageNameAndDate from "../../../utilities/PageNameAndDate";
import axios from "axios";
import ApexCharts from "react-apexcharts";
import Modal from "../../../../styles/Modal";
import CircularProgress from "@mui/material/CircularProgress";

const SimulatorModule = () => {
  const [moduleDetails, setModuleDetails] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [view, setView] = useState("questions"); // View mode: 'questions' or 'results'
  const { simulatorTitle, moduleTitle } = useParams(); // Extract simulatorTitle and moduleId from URL
  const [showModal, setShowModal] = useState(false);
  let [solvedQuestion, setSolvedQuestions] = useState(0);
  let [correctNumber, setCorrectNumber] = useState(0);
  let [inCorrectNumber, setInCorrectNumber] = useState(0);

  useEffect(() => {
    if (simulatorTitle && moduleTitle) {
      setLoading(true);
      axios
        .get(
          `http://localhost:5000/student/dashboard/simulators/${simulatorTitle}/${moduleTitle}`,
          { withCredentials: true }
        )
        .then((response) => {
          setLoading(false);
          const data = response.data;
          setModuleDetails(data);

          // Initialize answered questions and selected answers with previously solved data
          const initialAnsweredQuestions = {};
          const initialSelectedAnswers = {};
          let initialTime = data.maxTime * 60;

          data.questions.forEach((question) => {
            if (question.isSolved) {
              initialAnsweredQuestions[question.questionId] = true;
              initialSelectedAnswers[question.questionId] =
                question.answeredOption;
              // initialTime += data.maxTime*60; // Add previously taken time
            }
          });

          setAnsweredQuestions(initialAnsweredQuestions);
          setSelectedAnswers(initialSelectedAnswers);
          setTimer(initialTime); // Start the timer with the total time already spent
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching module details:", error);
        });
    }
  }, [simulatorTitle, moduleTitle]);
  const handleResetQuestions = () => {
    if(timerActive){
      return;
    }
    setLoading(true); // Show loader while resetting
    axios
      .post(
        'http://localhost:5000/student/dashboard/simulator/resetQuestions',
        {
          simulatorTitle,
          moduleTitle,
        },
        { withCredentials: true }
      )
      .then((response) => {
        setLoading(false);
        setAnsweredQuestions({});
        setSelectedAnswers({});
        setSolvedQuestions(0);
        setCorrectNumber(0);
        setInCorrectNumber(0);
        setTimer(moduleDetails.maxTime*60); // Optionally reset the timer if needed
        console.log("Questions reset successfully:", response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error resetting questions:", error);
      });
  };
  
  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setShowModal(true); // Show modal when timer ends
            setTimerActive(false); // Stop the timer
            return 0; // Ensure timer is set to 0
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    } else if (!timerActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const handleCloseModal = () => {
    setSolvedQuestions(0);
    setCorrectNumber(0);
    setInCorrectNumber(0);
    setShowModal(false);
    setView('results')
  };

  const handleOptionClick = (questionId, option) => {
    setSolvedQuestions((solvedQuestion += 1));
  
    if (answeredQuestions[questionId]) {
      return; // Prevent re-answering
    }

    // const timeTaken = timer;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionId]: true,
    }));

    const isCorrect =
      option ===
      moduleDetails.questions.find((q) => q.questionId === questionId)
        .correctOption;
    console.log(isCorrect);
    if (isCorrect) {
      setCorrectNumber((correctNumber += 1));
    } else {
      setInCorrectNumber((inCorrectNumber += 1));
    }
    // Show loader before the API call
    setLoading(true);

    axios
      .post(
        `http://localhost:5000/student/dashboard/simulator/updateQuestion`,
        {
          simulatorTitle,
          moduleTitle,
          questionId,
          answeredOption: option,
          isCorrect,
          // timeTaken,
        },
        { withCredentials: true }
      )
      .then((response) => {
        // Hide loader after the API call completes successfully
        setLoading(false);
      })
      .catch((error) => {
        // Hide loader if there's an error
        setLoading(false);
        console.error("Error updating question details:", error);
      });
  };

  const handleStartTimer = () => {
    setTimerActive(true);
  };

  const handleStopTimer = () => {
    setShowModal(true);

    setTimerActive(false);
  };

  const handleShowResults = () => {
    setView("results");
  };

  const handleBackToMCQs = () => {
    setView("questions");
  };

  const getChartData = () => {
    const totalQuestions = moduleDetails.questions.length;
    const solvedQuestions = moduleDetails.questions.filter(
      (q) => answeredQuestions[q.questionId]
    ).length;
    const correctAnswers = Object.entries(selectedAnswers).filter(
      ([qId, ans]) => {
        const question = moduleDetails.questions.find(
          (q) => q.questionId === qId
        );
        return question && ans === question.correctOption;
      }
    ).length;
    const wrongAnswers = solvedQuestions - correctAnswers;

    return {
      pieChartOptions: {
        chart: {
          type: "pie",
        },
        labels: ["Unsolved", "Correct", "Wrong"],
        colors: ["#818589", "#00E396", "#FF4560"],
      },
      pieChartSeries: [
        totalQuestions - solvedQuestions,
        correctAnswers,
        wrongAnswers,
      ],
      barChartOptions: {
        chart: {
          type: "bar",
        },
        xaxis: {
          categories: ["Total", "Solved", "Correct", "Incorrect"],
        },
      },
      barChartSeries: [
        {
          name: "Questions",
          data: [
            totalQuestions,
            solvedQuestions,
            correctAnswers,
            wrongAnswers,
          ],
        },
      ],
    };
  };

  if (!moduleDetails) {
    return;
    <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
      <CircularProgress style={{ color: "blue" }} />
    </div>;
  }

  const { pieChartOptions, pieChartSeries, barChartOptions, barChartSeries } =
  getChartData();
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="fixed flex flex-col md:flex-row h-screen">
        <Sidebar />
      </div>
      {loading && (
        <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
          <CircularProgress style={{ color: "blue" }} />
        </div>
      )}
      <div className="md:ml-[268px] sm:ml-44 flex flex-col w-full">
        <div className="w-full p-6 mt-4">
          <PageNameAndDate pageName={"Module Details"} />
          {showModal && (
            <Modal
              message={`Time in Out you have solved ${solvedQuestion} questions from which ${correctNumber} are correct and ${inCorrectNumber} are incorrect`}
              onClose={handleCloseModal}
              title={"Result"}
            />
          )}

          {view === "questions" ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-bold">
                  Timer: {Math.floor(timer / 60)}:
                  {("0" + (timer % 60)).slice(-2)}
                </div>
                <div className="flex">
                <button
                    onClick={handleResetQuestions}
                    className="bg-green-500 hover:bg-green-300 active:bg-gray-300 active:text-green-800 text-white px-4 py-2 text-sm rounded-4xl shadow-lg hover:scale-105 transition-transform ease-in-out duration-200 mr-4"
                  >
                    Reset Questions
                  </button>
                  <button
                    onClick={handleStartTimer}
                    className="bg-blue-600 text-white px-4 py-2 text-sm rounded-4xl shadow-lg mr-2 
             hover:bg-blue-400 hover:scale-105 active:bg-gray-300 active:text-blue-800 
             transition-transform ease-in-out duration-200"
                  >
                    Start Training
                  </button>
                  <button
                    onClick={handleStopTimer}
                    className="bg-red-500 hover:bg-red-300 active:bg-gray-300 active:text-red-800 text-white  px-4 py-2 text-sm rounded-4xl shadow-lg hover:scale-105 transition-transform ease-in-out duration-200"
                  >
                    Stop Timer
                  </button>
                  <button
                    onClick={handleShowResults}
                    className="bg-green-500 hover:bg-green-300 active:bg-gray-300 active:text-green-800 text-white px-4 py-2 text-sm rounded-4xl shadow-lg hover:scale-105 transition-transform ease-in-out duration-200 ml-4"
                  >
                    Show Results
                  </button>

                </div>
              </div>
              <div className="flex flex-col w-full p-6">
                {timerActive &&
                  moduleDetails.questions.map((question) => {
                    const isAnswered = answeredQuestions[question.questionId];
                    const selectedAnswer = selectedAnswers[question.questionId];
                    const isCorrect = selectedAnswer === question.correctOption;
                    const optionsWithLabels = question.options.map(
                      (option, idx) => ({
                        label: String.fromCharCode(65 + idx), // Converts 0 to A, 1 to B, etc.
                        option,
                      })
                    );

                    return (
                      <div
                        key={question.questionId}
                        className="p-4 border rounded-md mb-4 w-full"
                      >
                        <h3 className="text-lg font-semibold">
                          {question.questionText}
                        </h3>
                        <div className="my-2">
                          {optionsWithLabels.map(({ label, option }, idx) => (
                            <button
                              key={idx}
                              onClick={() =>
                                handleOptionClick(question.questionId, option)
                              }
                              className={`block p-2 mt-1 rounded ${
                                selectedAnswer === option
                                  ? isCorrect
                                    ? "bg-green-200"
                                    : "bg-red-200"
                                  : "bg-gray-100"
                              } hover:bg-gray-200`}
                              disabled={isAnswered} // Disable button if the question has already been answered
                            >
                              {label}. {option}
                            </button>
                          ))}
                        </div>
                        {isAnswered && (
                          <div className="mt-2 p-2 border rounded-md">
                            <p
                              className={`font-semibold ${
                                isCorrect ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {isCorrect ? "Correct!" : "Incorrect!"}
                            </p>
                            <p className="mt-1">
                              <strong>Explanation:</strong>{" "}
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleBackToMCQs}
                className="bg-blue-500 hover:bg-blue-300 active:bg-gray-300 active:text-blue-800 text-white  px-4 py-2 text-sm rounded-4xl shadow-lg hover:scale-105 transition-transform ease-in-out duration-200 ml-4"
              >
                Back to MCQs
              </button>

              <div className="flex justify-between">
                {/* Bar Chart */}
                <div className="w-1/2">
                  <h3 className="text-lg font-bold">Questions Overview</h3>
                  <ApexCharts
                    options={barChartOptions}
                    series={barChartSeries}
                    type="bar"
                    height={300}
                  />
                </div>

                {/* Additional Charts */}
                <div className="w-1/2">
                  <h3 className="text-lg font-bold">Performance Overview</h3>
                  <ApexCharts
                    options={pieChartOptions}
                    series={pieChartSeries}
                    type="pie"
                    height={300}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="fixed right-0 top-0 p-4">
        <div
          className={`text-xl font-bold ${
            timerActive ? "text-red-500" : "text-black"
          }`}
        >
          Timer: {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
        </div>
      </div>
    </div>
  );
};

export default SimulatorModule;
