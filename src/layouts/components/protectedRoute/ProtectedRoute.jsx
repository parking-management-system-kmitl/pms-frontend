import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // ตรวจสอบว่ามี token ใน localStorage หรือไม่
  const isAuthenticated = localStorage.getItem("access_token");

  // ถ้ายังไม่ล็อกอิน ให้ redirect ไปหน้า login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ถ้าล็อกอินแล้ว ให้แสดง children (หน้าปลายทาง)
  return <Outlet />;
};

export default ProtectedRoute;