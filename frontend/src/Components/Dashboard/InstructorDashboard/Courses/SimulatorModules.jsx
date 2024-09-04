import React, { useEffect, useState } from "react";
import PageNameAndDate from "../../utilities/PageNameAndDate";
import InstructorSidebar from "../../utilities/InstructorSidebar";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const InstructorSimulatorDetail = () => {
  const { id } = useParams();
  const [simulator, setSimulator] = useState(null);
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog state for adding new module
  const [newModuleTitle, setNewModuleTitle] = useState(""); // New module title
  const [newModuleMaxTime, setNewModuleMaxTime] = useState(""); // New module max time
  const navigate = useNavigate();

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
    if (isAuthenticated === true) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/instructor/dashboard/getSimulatorModules/${id}`, {
          withCredentials: true,
        })
        .then((response) => {
          setSimulator(response.data);
          setPrice(response.data.price || "");
          setDuration(response.data.duration || "");
        })
        .catch((error) => {
          console.error("Error fetching simulator details:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isAuthenticated, id]);

  const handleModuleClick = (moduleId, moduleTitle) => {
    navigate(`/instructor/dashboard/simulator/detail/module/${id}`, { state: { title: moduleTitle } });
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleSaveChanges = () => {
    setSaving(true);
    axios
      .put(`http://localhost:5000/instructor/dashboard/updateSimulator/${id}`, {
        price,
        duration,
        modules: simulator.modules,
      }, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Simulator updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating simulator:", error);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleAddModuleClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewModuleTitle("");
    setNewModuleMaxTime("");
  };

  const handleCreateModule = () => {
    const newModule = {
      title: newModuleTitle,
      maxTime: Number(newModuleMaxTime),
      numberOfQuestions: 0,
    };

    axios
      .post(`http://localhost:5000/instructor/dashboard/addModule/${id}`, newModule, {
        withCredentials: true,
      })
      .then((response) => {
        setSimulator((prevState) => ({
          ...prevState,
          modules: [...prevState.modules, response.data.module],
        }));
        handleDialogClose();
      })
      .catch((error) => {
        console.error("Error adding new module:", error);
      });
  };

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
        <div className="relative w-full p-6 mt-4">
          <PageNameAndDate pageName={"Simulator Detail"} />
        
          <div className="mt-4">     

            <div className="bg-white shadow-md rounded-lg p-4 mb-4 text-sm">
             <div className="flex justify-between"> <h2 className="text-md font-semibold mb-2">Simulator Details</h2>
             <div className="flex justify-end">  <button
           onClick={handleAddModuleClick}
           className=" bg-green-500 text-white rounded-lg p-2"
         >
           Add Module
         </button></div>
             </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price:</label>
                <input
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                  className="border rounded-lg p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Duration:</label>
                <input
                  type="text"
                  value={duration}
                  onChange={handleDurationChange}
                  className="border rounded-lg p-2 w-full"
                />
              </div>
              <button
                onClick={handleSaveChanges}
                className="bg-blue-500 text-white rounded-lg p-2"
              >
                {saving ? (
                  <CircularProgress size={24} style={{ color: "white" }} />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>

            <div className="mt-4">
              {simulator && simulator.modules && simulator.modules.length > 0 ? (
                simulator.modules.map((module, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer"
                    onClick={() => handleModuleClick(module._id, module.title)}
                  >
                    <h2 className="text-lg font-semibold mb-2">{module.title}</h2>
                    <p className="text-sm">Number of Questions: {module.numberOfQuestions}</p>
                  </div>
                ))
              ) : (
                <p>No modules available for this simulator.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Module</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Module Title"
            fullWidth
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Max Time (in minutes)"
            type="number"
            fullWidth
            value={newModuleMaxTime}
            onChange={(e) => setNewModuleMaxTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateModule} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold">You are not logged in</h1>
    </div>
  );
};

export default InstructorSimulatorDetail;
