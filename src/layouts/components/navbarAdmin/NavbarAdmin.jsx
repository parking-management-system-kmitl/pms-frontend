import React from "react";
import {
  iconCar,
  iconVIP,
  iconManage,
  iconDashboard,
} from "../../../assets";
import logo from "../../../assets/kmitl_logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

function NavbarAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const menuItems = [
    { label: "รถยนต์", icon: iconCar, path: "/detail" },
    { label: "VIP", icon: iconVIP, path: "/listvip" },
    { label: "การจัดการ", icon: iconManage, path: "/manage" },
    { label: "แดชบอร์ด", icon: iconDashboard, path: "/dashboard" },
  ];

  return (
    <nav className="fixed">
      <div className="bg-primary w-[80px] h-screen flex flex-col justify-between items-center">
        {/* ส่วนบนของ Navbar */}
        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-col space-y-4 justify-start items-center w-full mt-11">
            <div className="w-12 h-12">
              <img
                src={logo}
                alt="Avatar"
                className="w-full h-full rounded-full"
              />
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center space-y-4">
            {menuItems.map(({ label, icon: Icon, path }) => (
              <NavLink
                to={path}
                className="flex flex-col space-y-2 items-center justify-center"
                key={label}
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-14 h-8 flex items-center justify-center transition duration-500 rounded-full hover:bg-black hover:bg-opacity-10 ${
                        isActive ? "bg-black" : "bg-none"
                      }`}
                    >
                      {typeof Icon === "string" ? (
                        <img
                          src={Icon}
                          className="text-white w-6 h-6"
                          alt={label}
                        />
                      ) : (
                        <Icon className="text-white w-6 h-6" />
                      )}
                    </div>
                    <p
                      className={`text-xs transition duration-500 ${
                        isActive ? "text-black" : "text-white"
                      }`}
                    >
                      {label}
                    </p>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* ส่วนล่างของ Navbar (ปุ่ม logout) */}
        <div className="w-full flex flex-col items-center justify-center space-y-4 mb-8">
          <button
            onClick={handleLogout}
            className="flex flex-col space-y-2 items-center justify-center"
          >
            <div className="w-14 h-8 flex items-center justify-center transition duration-500 rounded-full hover:bg-black hover:bg-opacity-10">
              <ArrowLeftOnRectangleIcon className="text-white w-6 h-6" />
            </div>
            <p className="text-xs text-white">ออกจากระบบ</p>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavbarAdmin;
