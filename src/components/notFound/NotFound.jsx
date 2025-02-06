import React from "react";
import notfoundpic from "../../assets/404_pic.svg";

function NotFound() {
  return (
    <div className="w-full h-full flex justify-center items-center px-[3rem]">
      <div>
        <h1 className="text-xl font-bold">เกิดข้อผิดพลาด</h1>
        <h2 className="mt-4 font-light">เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ</h2>
        <button className="w-full bg-blue-600 hover:bg-blue-600 rounded-3xl h-[49px] text-white">
          ลองใหม่อีกครั้ง
        </button>
      </div>
      <img src={notfoundpic} alt="Not Found Pic" className="mx-auto mb-2" />
    </div>
  );
}

export default NotFound;
