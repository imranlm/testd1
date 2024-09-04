import React, { useState } from "react";
import axios from "axios";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import InputField from "../../styles/InputField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", // Add the name field
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      if (!/^\d*$/.test(value)) {
        setErrors({ ...errors, phoneNumber: "Only numbers are allowed" });
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setApiError(null);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "Name is required"; // Validate name
    if (!formData.email) formErrors.email = "Email is required";
    if (!formData.password) formErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      formErrors.confirmPassword = "Passwords do not match";
    if (!formData.phoneNumber)
      formErrors.phoneNumber = "Phone number is required";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/auth/signUp`, formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
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
          src={`${process.env.PUBLIC_URL}/images/reg11.jpg`}
          alt="background"
          className="w-full h-screen object-cover"
        />
      </div>

      {/* Form Container */}
      <div className="md:w-1/2 sm:w-full flex flex-col bg-register_page_bg p-4 shadow-md text-center items-center pt-16 sm:rounded-none md:rounded-tl-5xl md:rounded-bl-5xl">
        <div className="rounded-full bg-gray-300">
          <div className="flex justify-between gap-14 sm:gap-14 px-2 py-1 sm:px-4 w-[80%] sm:w-[40%] text-xs sm:text-sm">
            <Link to="/login">
              <div className="py-1 sm:py-1.5 pl-2 sm:pl-4 cursor-pointer text-blue-600">
                Login
              </div>
            </Link>
            <div className="bg-blue-500 text-white px-2 sm:px-8 py-1 sm:py-1.5 rounded-3xl cursor-pointer text-center flex-1 sm:flex-none max-w-[120px] sm:max-w-none">
              Register
            </div>
          </div>
        </div>

        <p className="mt-4 text-white text-xs sm:text-sm">
          Enter your credentials to Register
        </p>
        <form
          className="flex flex-col gap-2 sm:gap-3 text-left w-full sm:w-1/2 mt-6"
          onSubmit={handleSubmit}
        >

          {/* Name */}
          <InputField
            label="Name"
            type="text"
            id="name"
            name="name"
            autoComplete="off"
            value={formData.name}
            error={errors.name}
            onChange={handleInputChange}
            focusColor="white"
            top="6"
          />

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

          {/* Phone Number */}
          <InputField
            label="Phone Number"
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            autoComplete="off"
            value={formData.phoneNumber}
            error={errors.phoneNumber}
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

          {/* Confirm Password */}
          <InputField
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="off"
            value={formData.confirmPassword}
            error={errors.confirmPassword}
            onChange={handleInputChange}
            focusColor="white"
            top="6"
          />

          {/* Submit Button */}
          {apiError && (
            <p className="text-red-800 font-bold text-xs mt-3 w-full">
              {apiError}
            </p>
          )}
          <button
            type="submit"
            className="flex items-center justify-center bg-gray-100 text-blue-500 px-4 py-1 rounded cursor-pointer mt-2"
          >
            <ExitToAppOutlinedIcon className="mr-1" />
            <p className="text-md font-bold">Register</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
