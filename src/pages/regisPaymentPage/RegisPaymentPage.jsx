import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import ThaiQR from "../../assets/ThaiQR.png";
import PromptPay from "../../assets/PromptPay.png";
import { useNavigate } from "react-router-dom";

function RegisPaymentPage() {
  const navigate = useNavigate();

  const handleReceipt = () => {
    navigate("/regisvipreceipt");
  };

  const initialTime = 15 * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white">
      <div className="px-4 pt-10">
        <div className="border-gray-300 border-[0.5px] rounded-[20px] shadow-md flex flex-col justify-center w-full h-[96px] items-center space-y-1 mb-8">
          <p className="text-md">เวลาที่เหลือสำหรับการชำระเงิน</p>
          <p className="text-[#007AFF] text-2xl">{formatTime()}</p>
        </div>

        <div className=" pl-6 pr-6">
          <div className=" border-gray-300 border-[0.5px] rounded-[20px] shadow-md flex flex-col justify-center w-full h-auto items-center ">
            <div className=" flex justify-center items-center h-[57px] w-full rounded-tr-[20px] rounded-tl-[20px] bg-[#113E68]">
              <img src={ThaiQR} alt="thai_qr" className="w-[100px] " />
            </div>
            <div className=" flex flex-col justify-center items-center h-auto w-full rounded-[20px] p-6 bg-white ">
              <img src={PromptPay} alt="PromptPay" className="w-[186px] " />
              <div className=" flex justify-center items-end space-x-2">
                <p className=" text-md">ชำระเงินทั้งหมด: </p>
                <p className=" text-xl font-semibold">90.00 </p>
                <p className=" text-md">บาท</p>
              </div>
            </div>
          </div>

          <div className=" w-full flex justify-center items-center mt-6">
            <div className=" flex flex-col justify-center items-center w-auto h-auto p-2">
              <button className=" rounded-2xl border-[0.5px] p-2 border-gray-300 w-8 h-8 flex justify-center items-center">
                <ArrowDownTrayIcon className=" w-auto h-auto" />
              </button>
              <p className=" mt-2 text-sm">บันทึก QR</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <hr className="w-full h-px my-4 px-0 bg-gray-200 border-0 dark:bg-gray-200" />
        <div className="px-4">
          <button
            onClick={handleReceipt}
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-3xl h-[44px] text-white mb-[2rem]"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisPaymentPage;
