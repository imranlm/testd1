import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCookies } from "react-cookie";
import Cart from "./Cart"; // Import the Cart component
import axios from "axios";

const Navbar = ({ textColor = "text-white" }) => {
  const [cookies, setCookie] = useCookies(["jwt", "PMI-cart"]);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null to indicate loading state
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // State to manage cart visibility

  const cartItemsCount = (cookies["PMI-cart"] || []).length; // Calculate number of items in the cart

  useEffect(() => {
    axios
      .get(`http://localhost:5000/auth/verifyAuth`, { withCredentials: true })
      .then((response) => {
        setIsAuthenticated(true);
        console.log(response);
      })
      .catch((error) => {
        setIsAuthenticated(false);
        console.log(error);
      });
  }, []);

  let userType;
  if (cookies.userType){
    if(cookies.userType=='student'){
      userType="student"
    }
    else{
      userType='instructor'
    }
  }
 

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const loginBgColor =
    textColor === "text-blue-800" ? "bg-blue-800" : "bg-white";
  const loginTextColor =
    textColor === "text-blue-800" ? "text-white" : "text-blue-800";
  const loginHoverColor =
    textColor === "text-blue-800" ? "hover:bg-blue-400" : "hover:bg-gray-300";

  return (
    <div className={textColor}>
      <nav className="flex items-center justify-between p-4">
        <div className={`text-xl font-bold ${textColor}`}>PMIAcademy</div>

        {/* Centered navigation items on larger screens */}
        <div
          className={`hidden md:flex justify-center flex-grow space-x-8 ml-4 ${textColor}`}
        >
          <Link to="/" className="hover:text-blue-200">
            Home
          </Link>
          <Link to="/courses" className="hover:text-blue-200">
            Courses
          </Link>
          <Link to="/courses" className="hover:text-blue-200">
            Simulator
          </Link>
          <Link to="/" className="hover:text-blue-200">
            PMI
          </Link>
          <Link to="/" className="hover:text-blue-200">
            About Us
          </Link>
        </div>

        {/* Conditional buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated === null ? null : isAuthenticated ? (
            <Link to={`/${userType}/dashboard`}>
              <div
                className={`w-24 ${textColor} rounded-full px-2 py-1.5 hover:underline hover:scale-105 cursor-pointer text-center`}
              >
                Dashboard
              </div>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <div
                  className={`w-24 ${loginBgColor} ${loginTextColor} rounded-full px-2 py-1.5 ${loginHoverColor} cursor-pointer text-center`}
                >
                  Login
                </div>
              </Link>
              <Link to="/register">
                <div className="w-24 bg-blue-800 text-white rounded-full px-2 py-1.5 hover:bg-blue-500 cursor-pointer text-center">
                  Sign Up
                </div>
              </Link>
            </>
          )}
          <div className="relative">
            <button onClick={toggleCart} className="focus:outline-none">
              <ShoppingCartIcon className={textColor} />
              {cartItemsCount > 0 && (
                <span className="absolute left-4 bottom-5 h-5 w-5 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Hamburger menu and Cart icon for small screens */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? (
              <CloseIcon className={textColor} />
            ) : (
              <MenuIcon className={textColor} />
            )}
          </button>
          <div className="relative">
            <button onClick={toggleCart} className="focus:outline-none">
              <ShoppingCartIcon className={textColor} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Separate div for mobile menu */}
      {isOpen && (
        <div
          className={`md:hidden bg-gradient-to-b from-[#152354] via-[#1B2D6B] to-[#2F4DBA] p-4 ${textColor}`}
        >
          <Link to="/" className="block py-2 hover:text-blue-200">
            Home
          </Link>
          <Link to="/courses" className="block py-2 hover:text-blue-200">
            Courses
          </Link>
          <Link to="/simulator" className="block py-2 hover:text-blue-200">
            Simulator
          </Link>
          <Link to="/" className="block py-2 hover:text-blue-200">
            PMI
          </Link>
          <Link to="/" className="block py-2 hover:text-blue-200">
            About Us
          </Link>
          <div className="flex space-x-4 mt-4">
            {isAuthenticated === null ? null : isAuthenticated ? (
              <Link to={`/${userType}/dashboard`}>
                <div
                  className={`w-24 ${textColor} rounded-full px-2 py-1.5 hover:underline hover:scale-105 cursor-pointer text-center`}
                >
                  Dashboard
                </div>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <div
                    className={`w-24 ${loginBgColor} ${loginTextColor} rounded-full px-2 py-1.5 ${loginHoverColor} cursor-pointer text-center`}
                  >
                    Login
                  </div>
                </Link>
                <Link to="/register">
                  <div className="w-24 bg-blue-800 text-white rounded-full px-2 py-1.5 hover:bg-blue-500 cursor-pointer text-center">
                    Sign Up
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Cart component */}
      {isCartOpen && (
        <div>
          <Cart cookies={cookies} setCookie={setCookie} closeCart={closeCart} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
