import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Sidebar = ({ setContentMargin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
    dispatch(removeUser());
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    navigate("/auth");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setContentMargin(isOpen ? "ml-16" : "ml-64");
  };

  return (
    <nav
      className={`h-screen ${isOpen ? "w-64" : "w-16"} bg-[#18283b] text-white flex flex-col shadow-xl fixed top-0 left-0 z-50 overflow-hidden transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className={`text-2xl font-bold text-[#9945FF] focus:outline-none transition-all duration-300 ${!isOpen ? "opacity-0 w-0" : "w-full"}`}
        >
          <i className="fas fa-code"></i> StakeSol
        </button>
        <button
          className="cursor-pointer p-2 focus:outline-none"
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars text-white text-xl"></i>
        </button>
      </div>
      
      {/* Sidebar Menu */}
      <div className="flex-1 py-6 space-y-2 overflow-y-auto">
        {[
          { name: "Dashboard", href: "/dashboard", icon: "fas fa-home" },
          { name: "Calculator", href: "/calculator", icon: "fas fa-calculator" },
          { name: "Wallet", href: "/wallet", icon: "fas fa-wallet" },
          { name: "Deposit", href: "/deposit", icon: "fas fa-arrow-down" },
          { name: "Withdraw", href: "/withdraw", icon: "fas fa-arrow-up" },
          { name: "Profile", href: "/profile", icon: "fas fa-user" },
          { name: "Support", href: "/support", icon: "fas fa-life-ring" },
          { name: "Referrals", href: "/referral", icon: "fas fa-users" },
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.href)}
            className="flex items-center px-6 py-3 text-gray-300 hover:bg-[#2c3e50] hover:text-[#14F195] transition-all rounded-md w-full"
          >
            <i className={`${item.icon} w-6`}></i>
            <span className={`ml-3 transition-all duration-300 ${!isOpen ? "hidden" : "block"}`}>{item.name}</span>
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-[#14F195] text-black py-2 rounded-md font-bold hover:bg-[#12d484] transition"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          <span className={`transition-all duration-300 ${!isOpen ? "hidden" : "block"}`}>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
