import React, { useEffect, useState } from "react";
import axios from "axios";

const AuthVerify = ({ onAuthVerify }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.ServerURL}/auth/verifyAuth`, { withCredentials: true })
      .then((response) => {
        console.log(response);
        if (response.data.user) {
          setIsAuthenticated(true);
          setUserType(response.data.user.userType);
          onAuthVerify(true, response.data.user.userType);
        } else {
          setIsAuthenticated(false);
          onAuthVerify(false, null);
        }
      })
      .catch((error) => {
        setIsAuthenticated(false);
        setUserType(null);
        onAuthVerify(false, null);
        console.log(error);
      });
  }, [onAuthVerify]);

  return null; // This component doesn't render anything visible
};

export default AuthVerify;
