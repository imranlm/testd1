import React, { useEffect, useState } from "react";
import PageNameAndDate from "../../utilities/PageNameAndDate";
import InstructorSidebar from "../../utilities/InstructorSidebar";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const SimulatorModuleDetail = () => {
  const { id } = useParams();
  const [simulator, setSimulator] = useState({
    module: {
      questions: [],
      time: "" // Added for managing module time
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctOption: "",
    explanation: "",
  });
  const [editQuestion, setEditQuestion] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [jsonUpload, setJsonUpload] = useState("");
  const [editTime, setEditTime] = useState(false); // Added for editing time
  const [moduleTime, setModuleTime] = useState(""); // Added for managing module time input
  const navigate = useNavigate();
  const location = useLocation();
  const moduleTitle = location.state?.title;

  // Fetch the simulator details
  const fetchSimulatorDetails = () => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/instructor/dashboard/getSimulatorDetail/${id}/${moduleTitle}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setSimulator(response.data);
        setModuleTime(response.data.module.maxTime); // Set the initial module time
      })
      .catch((error) => {
        console.error("Error fetching simulator details:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Check for authentication
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

  // Fetch simulator details on authentication change
  useEffect(() => {
    if (isAuthenticated === true) {
      fetchSimulatorDetails();
    }
  }, [isAuthenticated, id, moduleTitle]);

  // Handle input changes
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleSaveQuestion = () => {
    axios
      .post(`http://localhost:5000/instructor/dashboard/addQuestion/${id}/${moduleTitle}`, newQuestion, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Question added successfully:", response.data);
        setSimulator((prev) => ({
          ...prev,
          questions: [...prev.questions, response.data],
        }));
        setNewQuestion({
          questionText: "",
          options: ["", "", "", ""],
          correctOption: "",
          explanation: "",
        });
      })
      .catch((error) => {
        console.error("Error adding question:", error);
      });
  };

  const handleUpdateQuestion = (questionId, updatedQuestion) => {
    setLoading(true);
    axios
      .put(`http://localhost:5000/instructor/dashboard/updateQuestion/${id}/${moduleTitle}/${questionId}`, updatedQuestion, {
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);
        fetchSimulatorDetails();
        console.log("Question updated successfully:", response.data);
        setSimulator((prev) => ({
          ...prev,
          questions: prev.questions?.map((q) =>
            q._id === questionId ? response.data : q
          ),
        }));
        setEditMode(false);
        setEditQuestion(null);
      })
      .catch((error) => {
        console.error("Error updating question:", error);
      });
  };

  const handleEditClick = (question) => {
    setEditQuestion(question);
    setNewQuestion(question);
    setEditMode(true);
  };

  const handleJsonUpload = () => {
    try {
      const questions = JSON.parse(jsonUpload);
      if (Array.isArray(questions)) {
        axios
          .post(`http://localhost:5000/instructor/dashboard/addQuestions/${id}/${moduleTitle}`, { questions: questions }, {
            withCredentials: true,
          })
          .then(() => {
            fetchSimulatorDetails();
            setJsonUpload("");
          })
          .catch((error) => {
            console.error("Error adding questions:", error);
          });
      } else {
        console.error("Invalid JSON format");
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };
  const handleDeleteQuestion = (questionId) => {
    setLoading(true);
    axios
      .delete(`http://localhost:5000/instructor/dashboard/deleteQuestion/${id}/${moduleTitle}/${questionId}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Question deleted successfully:", response.data);
      fetchSimulatorDetails();
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  const handleSaveModuleTime = () => {
    setLoading(true);
    axios
      .put(`http://localhost:5000/instructor/dashboard/updateModuleTime/${id}/${moduleTitle}`, { time: moduleTime }, {
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);
        console.log("Module time updated successfully:", response.data);
        setSimulator((prev) => ({
          ...prev,
          module: {
            ...prev.module,
            time: moduleTime,
          },
        }));
        setEditTime(false);
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error updating module time:", error);
      });
  };

  return isAuthenticated === null ? (
    <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
      <CircularProgress style={{ color: "blue" }} />
    </div>
  ) : isAuthenticated ? (
    <div className="flex flex-col md:flex-row h-screen ">
      <div className="fixed flex flex-col md:flex-row h-screen">
        <InstructorSidebar />
      </div>

      <div className="md:ml-[268px] sm:ml-44 flex flex-col w-full text-sm">
        <div className="w-full p-6 mt-4">
          <PageNameAndDate pageName={"Module Detail"} />
          {loading && (
          <div className="fixed inset-0 backdrop-filter backdrop-blur-sm z-50 flex items-center justify-center">
            <CircularProgress style={{ color: "blue" }} />
          </div>
        )}
          <div className="mt-4">
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
              <h3 className="text-md font-semibold">Module Time in minutes</h3>
              {/* {editTime ? ( */}
                <div className="flex items-center">
                  <input
                    type="Number"
                    value={moduleTime}
                    onChange={(e) => setModuleTime(e.target.value)}
                    className="border rounded-lg p-2 w-1/2"
                  />
                  <button
                    onClick={handleSaveModuleTime}
                    className="ml-2 bg-green-500 text-white rounded-lg p-2"
                  >
                    Save Time
                  </button>
                  {/* <button
                    onClick={() => setEditTime(false)}
                    className="ml-2 bg-red-500 text-white rounded-lg p-2"
                  >
                    Cancel
                  </button> */}
                </div>
              {/* ) : (
                <div className="flex items-center">
                  <p>{simulator.module.time}</p>
                  <button
                    onClick={() => setEditTime(true)}
                    className="ml-2 bg-blue-500 text-white rounded-lg p-2"
                  >
                    Edit Time
                  </button>
                </div> */}
              {/* )} */}
            </div>
            {simulator && simulator.module.questions && simulator.module.questions.length > 0 ? (
  simulator.module.questions.map((question) => (
    <div key={question._id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center">
      <div className="flex-grow">
        <h3 className="text-md font-semibold">{question.questionText}</h3>
        <ul className="list-disc ml-5">
          {question.options.map((option, index) => (
            <li key={index} className={option === question.correctOption ? "text-green-600" : ""}>
              {option}
            </li>
          ))}
        </ul>
        <p className="text-sm">Explanation: {question.explanation}</p>
      </div>
      <button
        onClick={() => handleEditClick(question)}
        className="bg-blue-500 text-white rounded-lg p-2"
      >
        Edit Question
      </button>
      <button
        onClick={() => handleDeleteQuestion(question._id)}
        className="ml-2 bg-red-500 text-white rounded-lg p-2"
      >
  <DeleteIcon style={{ fontSize: 20 }} />
    </button>
    </div>
  ))
) : (
  <p>No questions available.</p>
)}


            {editMode && (
              <div className="bg-white shadow-md rounded-lg p-4 mt-4">
                <h3 className="text-md font-semibold">Edit Question</h3>
                <input
                  type="text"
                  name="questionText"
                  value={newQuestion.questionText}
                  onChange={handleQuestionChange}
                  placeholder="Question Text"
                  className="border rounded-lg p-2 w-full"
                />
                {newQuestion.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="border rounded-lg p-2 w-full mt-2"
                  />
                ))}
                <input
                  type="text"
                  name="correctOption"
                  value={newQuestion.correctOption}
                  onChange={handleQuestionChange}
                  placeholder="Correct Option"
                  className="border rounded-lg p-2 w-full mt-2"
                />
                <input
                  type="text"
                  name="explanation"
                  value={newQuestion.explanation}
                  onChange={handleQuestionChange}
                  placeholder="Explanation"
                  className="border rounded-lg p-2 w-full mt-2"
                />
                <div className="flex items-center mt-4">
                  <button
                    onClick={() => handleUpdateQuestion(editQuestion._id, newQuestion)}
                    className="bg-green-500 text-white rounded-lg p-2"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="ml-2 bg-red-500 text-white rounded-lg p-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            

            <div className="bg-white shadow-md rounded-lg p-4 mt-4">
              <h3 className="text-md font-semibold">Bulk Upload Questions</h3>
              <textarea
                value={jsonUpload}
                onChange={(e) => setJsonUpload(e.target.value)}
                placeholder='[{"questionText": "What is the capital of France?", "options": ["Paris", "London", "Berlin", "Madrid"], "correctOption": "Paris", "explanation": "Paris is the capital city of France."}, {"questionText": "Which planet is known as the Red Planet?", "options": ["Earth", "Mars", "Jupiter", "Saturn"], "correctOption": "Mars", "explanation": "Mars is often referred to as the Red Planet due to its reddish appearance."}]'
                rows="5"
                className="border rounded-lg p-2 w-full"
              />
              <button
                onClick={handleJsonUpload}
                className="bg-green-500 text-white rounded-lg p-2 mt-4"
              >
                Upload JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>Unauthorized Access</p>
  );
};

export default SimulatorModuleDetail;
