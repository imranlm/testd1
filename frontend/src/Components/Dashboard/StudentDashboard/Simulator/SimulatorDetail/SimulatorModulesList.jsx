import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../../utilities/Sidebar";
import PageNameAndDate from "../../../utilities/PageNameAndDate";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const SimulatorModuleList = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const { simulatorTitle } = useParams(); // Extract simulatorTitle from URL

  useEffect(() => {
    if (simulatorTitle) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/student/dashboard/simulators/${simulatorTitle}`, { withCredentials: true })
        .then((response) => {
          setLoading(false)
          console.log(response);
          setModules(Array.isArray(response.data.modules) ? response.data.modules : []);
        })
        .catch((error) => {
          setLoading(false)
          console.error("Error fetching simulators:", error);
        });
    }
  }, [simulatorTitle]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="fixed flex flex-col md:flex-row h-screen">
        <Sidebar />
      </div>

      <div className="md:ml-[268px] sm:ml-44 flex flex-col w-full p-6 mt-4">
        <PageNameAndDate pageName={"Simulators"} />
        {loading && (
              <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
                <CircularProgress style={{ color: "blue" }} />
              </div>
            )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {modules.length > 0 ? (
            modules.map((module) => {
              const moduleTitle = encodeURIComponent(module.moduleName || "Unknown");
              return (
                <Link
                  key={module.moduleId}
                  to={`/student/dashboard/Simulators/modules/${simulatorTitle}/${moduleTitle}`}
                  className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl"
                >
                  <div className="absolute top-2 right-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full shadow-sm">
                    {module.questionsSolved}/{module.totalQuestions} Completed
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{module.moduleName || "Unknown"}</h3>
                  <p className="text-gray-600 mt-2">Total Questions: {module.totalQuestions}</p>
                </Link>
              );
            })
          ) : (
            <p className="text-gray-500 text-center col-span-full mt-6">No modules available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulatorModuleList;
