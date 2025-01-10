import { Bars3Icon } from "@heroicons/react/24/outline";
import React from "react";
import { iconCar, iconVIP, avatar, iconManage } from "../../../assets";
import { NavLink } from "react-router-dom";

function NavbarAdmin() {
  const menuItems = [
    { label: "Car", icon: iconCar, path: "/detail" },
    { label: "VIP", icon: iconVIP, path: "/listvip" },
    { label: "Manage", icon: iconManage, path: "/manage" },
  ];
  return (
    <nav className="fixed">
      <div className=" bg-primary w-[80px]  h-screen flex flex-col justify-start items-center space-y-8">
        <div className=" flex flex-col space-y-4 justify-start items-center w-full mt-11">
          <div className="w-12 h-12">
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full rounded-full"
            />
          </div>
        </div>
        <div className=" w-full flex flex-col items-center justify-center space-y-4">
          {menuItems.map(({ label, icon, path }) => (
            <NavLink
              to={path}
              className="flex flex-col space-y-2 items-center justify-center"
              key={label}
            >
              {({ isActive }) => (
                <>
                  <div className={`w-14 h-8 flex items-center justify-center transition duration-500 rounded-full hover:bg-gray-600 ${isActive ? 'bg-black':'bg-none'} `}>
                    <img src={icon} className=" text-white w-6 h-6" />
                  </div>
                  <p className={` text-xs transition duration-500 ${isActive ? 'text-black':'text-white'}`} >{label} </p>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default NavbarAdmin;
