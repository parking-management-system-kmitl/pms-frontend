import React from "react";
import NavbarAdmin from "../components/navbarAdmin/NavbarAdmin";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <NavbarAdmin />
      <Outlet />
    </>
  );
}

export default Layout;
