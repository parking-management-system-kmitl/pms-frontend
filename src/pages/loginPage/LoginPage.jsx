import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSignIn = () => {
    navigate("/detail");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full h-full">
        <div
          className="flex flex-col justify-center items-center w-2/5 h-[95vh] mx-[2.5vh] px-20 bg-gradient-to-b from-[#004896] to-[#0a81ff] text-white rounded-2xl gap-24"
          data-aos="fade-right"
        >
          <h1 className="text-4xl font-bold">Vehicle parking system</h1>
          <img
            src="/images/login-logo.png"
            width={400}
            height={220}
            alt="logo"
          />
        </div>

        <div
          className="flex flex-col justify-center w-3/5 px-60 gap-5"
          data-aos="fade-left"
        >
          <h1 className="text-4xl font-bold mb-5">Sign In</h1>

          <div className="flex flex-col w-full">
            <label htmlFor="email" className="mb-1 text-lg">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@example.com"
              className="h-10 px-5 bg-gray-200 rounded-md border-none focus:outline-none"
            />
          </div>

          <div className="flex flex-col w-full mt-5">
            <label htmlFor="password" className="mb-1 text-lg">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="At least 8 characters"
              className="h-10 px-5 bg-gray-200 rounded-md border-none focus:outline-none"
            />
          </div>

          <button
            className="h-10 mt-5 bg-blue-500 text-white rounded-md"
            onClick={handleSignIn}
          >
            Sign In
          </button>

          <a
            href=""
            className="self-end text-blue-500 mt-3 text-sm no-underline"
          >
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
