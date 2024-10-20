import {
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import receipt from "../../assets/Receipt.png";
// import download from "../../assets/download.png";

function ReceiptPage() {

  return (
    <div>
      <div className=" px-4 pt-10">
        <div className=" p-6 border-gray-300 border-[0.5px] rounded-[20px] shadow-md flex justify-center items-center mb-8 space-x-10">
          <img src={receipt} alt="receipt" className="w-14 h-14" />
          <div className=" flex flex-col justify-center items-center text-lg ">
            <p>ชำระเงินสำเร็จ </p>
          </div>
        </div>

        <div className=" pl-9 pr-9 w-full flex flex-col justify-center items-center space-y-4">
          <h1 className=" w-full flex justify-center">ใบเสร็จการชำระเงิน</h1>

          <div className=" border-[0.5px] border-gray-300 w-full h-a flex flex-col p-3 space-y-3">
            <h2 className=" text-sm w-full flex justify-center">
              บจก. KMITL สแควร์
            </h2>
            <p className=" text-xs w-ful space-y-1 ">
              <p>TAX ID: 0105539025678</p>
              <p>Date: 17/08/2024</p>
              <p>Rcpt: RM9999240817000658</p>
            </p>
            <div className=" w-full border-[0.5px] border-gray-300"></div>
            <p className=" text-xs w-ful space-y-1 ">
              <p>เลขทะเบียน: 2กฐ452 (C)</p>
              <p>เวลาเข้า: 17/08/2024 14:32</p>
              <p>เวลาออก: 17/08/2024 18:33</p>
              <div className=" flex justify-between">
                <p>ค่าบริการ</p>
                <p>90.00 บาท</p>
              </div>
              <div className=" flex justify-between">
                <p>ชำระเงิน</p>
                <p>90.00 บาท</p>
              </div>
              <div className=" flex justify-between">
                <p>วิธีการชำระเงิน</p>
                <p>Thai QR PromptPay</p>
              </div>
            </p>
            <div className=" w-full border-[0.5px] border-gray-300"></div>
            <div className=" flex flex-col space-y-1">
              <h2 className=" text-md w-full flex justify-center">
                กรุณานำรถออกก่อนเวลา 19:32
              </h2>
              <h3 className=" text-xs w-full flex justify-center text-gray-500">
                หากเกินเวลาจะคิดค่าบริการเพิ่ม
              </h3>
            </div>
          </div>

          <div className=" flex flex-col justify-center items-center w-full h-auto  ">
            {/* <img src={download} alt="download" className="w-8 h-8" /> */}
            <button className=" rounded-2xl border-[0.5px] p-2 border-gray-300 w-8 h-8 flex justify-center items-center">
              <ArrowDownTrayIcon className=" w-auto h-auto" />
            </button>
            <p className=" mt-2 text-sm">บันทึก QR</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptPage;
