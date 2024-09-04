import React, { useState } from "react";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import InputField from "../../styles/InputField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useCookies } from "react-cookie";


const LoginPage = () => {
  const navigate = useNavigate();

  const[cookies]=useCookies(['userType']);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setApiError(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.email) {
      formErrors.email = "Email is required";
      isValid = false;
    }

    if (!formData.password) {
      formErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    try {
      const response = await axios.post(`http://localhost:5000/auth/signIn`, formData, {
        withCredentials: true,
      }
    );
      console.log("Login successful:", response.data);
      if(response.data.userType==='instructor'){
        navigate('/instructor/dashboard');
      }else if(response.data.userType==='student'){
        navigate('/student/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setApiError(error.response.data.message || "An error occurred");
      } else {
        setApiError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row w-full ${
        loading ? "pointer-events-none opacity-70" : ""
      } overflow-hidden`}
    >
       {loading && (
              <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
                <CircularProgress style={{ color: "blue" }} />
              </div>
            )}

      {/* Container with Image */}
      <div className="flex-1 flex justify-center items-center">
        <Link to="/">
          <ArrowBackIcon className="cursor-pointer absolute top-8 left-8 text-black" />
        </Link>
        <img
          src={`${process.env.PUBLIC_URL}/images/log1.jpg`}
          alt="background"
          className="w-full h-screen object-cover"
        />
      </div>

      {/* Form Container */}
      <div className="md:w-1/2 sm:w-full flex flex-col bg-register_page_bg p-4 shadow-md text-center justify-center items-center sm:rounded-none md:rounded-tl-5xl md:rounded-bl-5xl">
        <div className="rounded-full bg-gray-300">
          <div className=" flex justify-between gap-14 sm:gap-14 px-2 py-1 sm:px-4 w-[80%] sm:w-[40%] text-xs sm:text-sm">
            <div className="bg-blue-500 text-white  px-2 sm:px-8 py-1 sm:py-1.5 rounded-3xl cursor-pointer text-center flex-1 sm:flex-none max-w-[120px] sm:max-w-none">
              Login
            </div>
           <Link to='/register'> <div className="py-1 sm:py-1.5  sm:pr-4 cursor-pointer text-blue-600">
              Register
            </div></Link>
          </div>
        </div>

        <p className="mt-4 text-white text-xs sm:text-sm">
          Enter your credentials to login
        </p>
        <form className="flex flex-col gap-2 sm:gap-3 text-left w-full sm:w-1/2 mt-6" onSubmit={handleSubmit}>
          {/* Email */}
          <InputField
            label="Email"
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            value={formData.email}
            error={errors.email}
            onChange={handleInputChange}
            focusColor="white"
            top="6"
          />

          {/* Password */}
          <InputField
            label="Password"
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            value={formData.password}
            error={errors.password}
            onChange={handleInputChange}
            focusColor="white"
            top="6"
          />

          {/* Submit Button */}
          {apiError && (
            <p className="text-red-800 font-bold text-xs  w-full">
              {apiError}
            </p>
          )}
          <button
            type="submit"
            className="flex items-center justify-center bg-gray-100 text-blue-500 px-4 py-1 rounded cursor-pointer mt-2"
          >
            <ExitToAppOutlinedIcon className="mr-1" />
            <p className="text-md font-bold">Login</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
