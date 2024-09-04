import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PermContactCalendarRoundedIcon from "@mui/icons-material/PermContactCalendarRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import axios from "axios";

function InstructorSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const location = useLocation();

  const isActive = (pathname) => {
    return location.pathname === pathname;
  };

  const handleLogout = async () => {
    console.log("logout");
    const response = await axios.get(`http://localhost:5000/auth/logout`, {
      withCredentials: true,
    });
    if (response) {
      console.log("ok");
      navigate("/login");
    }
  };

  return (
    <div>
      <div className="md:hidden">
        <button
          onClick={toggleSidebar}
          className="bg-gray-100 text-black mt-5 ml-5 p-2 rounded-full"
        >
          {isSidebarOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
        </button>
      </div>
      <aside
        className={`w-60 m-3 ${
          isSidebarOpen ? "block" : "hidden"
        } h-[96%] md:block bg-gradient-to-b from-bg_color to-sec_color p-2 flex flex-col justify-center items-center rounded-3xl shadow-xl shadow-gray-300`}
      >
        <h1 className="text-white text-lg font-semibold mb-2 mt-4 text-center">
          John
        </h1>

        <div className="flex flex-col items-center mb-5 mt-5">
          <img
            src={`${process.env.PUBLIC_URL}/images/sidebar-icon.png`}
            alt="Profile"
            className="w-12 h-12 rounded-full mb-1"
          />
          <div className="text-center">
            <p className="text-gray-300 text-sm">Instructor</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <SidebarItem
            to="/instructor/dashboard"
            label="Dashboard"
            isActive={isActive("/instructor/dashboard")}
            onClose={onClose}
            icon={
              <DashboardRoundedIcon style={{ color: "white", fontSize: 20 }} />
            }
          />
          <SidebarItem
            to="/instructor/dashboard/students"
            label="Students"
            isActive={isActive("/instructor/dashboard/students")}
            onClose={onClose}
            icon={
              <GroupsRoundedIcon style={{ color: "white", fontSize: 20 }} />
            }
          />
          <SidebarItem
            to="/instructor/dashboard/courses"
            label="Courses"
            isActive={isActive("/instructor/dashboard/courses")}
            onClose={onClose}
            icon={
              <PermContactCalendarRoundedIcon
                style={{ color: "white", fontSize: 20 }}
              />
            }
          />
          <SidebarItem
            to="/instructor/dashboard/sessions"
            label="Sessions"
            isActive={isActive("/instructor/dashboard/sessions")}
            onClose={onClose}
            icon={
              <AccountBalanceRoundedIcon
                style={{ color: "white", fontSize: 20 }}
              />
            }
          />
          <SidebarItem
            to="/instructor/dashboard/profile"
            label="Profile"
            isActive={isActive("/instructor/dashboard/profile")}
            onClose={onClose}
            icon={
              <Person2RoundedIcon style={{ color: "white", fontSize: 20 }} />
            }
          />
          <div className="">
            <SidebarItem
              to="#"
              onClick={handleLogout}
              label="Logout"
              isActive={isActive("#")}
              onClose={onClose}
              icon={<LogoutIcon style={{ color: "white", fontSize: 20 }} />}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

function SidebarItem({ to, icon, label, isActive, onClose, onClick }) {
  const content = (
    <div
      className={`flex items-center justify-between text-white py-2 md:py-1.5 mb-1 hover:bg-blue-600 hover:rounded-2xl ${
        isActive ? "bg-bg-color pr-3 rounded-2xl" : ""
      }`}
    >
      <div className="flex items-center ml-5">
        <span className="mr-2">{icon}</span>
        <span className="text-md ml-1">{label}</span>
      </div>
    </div>
  );

  return (
    <p className="w-full" onClick={onClick ? onClick : onClose}>
      {to ? (
        <Link to={to} onClick={onClose}>
          {content}
        </Link>
      ) : (
        content
      )}
    </p>
  );
}

export default InstructorSidebar;
