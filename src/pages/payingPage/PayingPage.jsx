import { ArrowDownIcon, ArrowDownTrayIcon, ChevronDownIcon, ShareIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import ThaiQR from "../../assets/ThaiQR.png"
import PromptPay from "../../assets/PromptPay.png"
import { useNavigate } from "react-router-dom";


function PayingPage() {
    const navigate = useNavigate();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [language, setLanguage] = useState('TH');

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setIsLangOpen(false);
    };

    const handleReceipt = () => {
        navigate("/receipt");
    }

    const initialTime = 14 * 60 + 32;
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
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <>
            <div className="px-4 pt-[70px]">
                <div className="p-6 border-gray-300 border-[0.5px] rounded-[20px] shadow-md flex flex-col justify-center w-full h-[96px] items-center space-y-1 mb-8">
                    <p className="text-md">เวลาที่เหลือสำหรับการชำระเงิน</p>
                    <p className="text-[#007AFF] text-2xl">{formatTime()}</p>
                </div>

                <div className=" pl-6 pr-6">
                    <div className=" border-gray-300 border-[0.5px] rounded-[20px] shadow-md flex flex-col justify-center w-full h-auto items-center ">
                        <div className=" flex justify-center items-center h-[57px] w-full rounded-tr-[20px] rounded-tl-[20px] bg-[#113E68]">
                            <img src={ThaiQR} alt="thai_qr" className="w-[100px] " />
                        </div>
                        <div className=" flex flex-col justify-center items-center h-auto w-full rounded-[20px] p-6 space-y-3 bg-white ">
                            <img src={PromptPay} alt="PromptPay" className="w-[186px] " />
                            <div className=" flex justify-center items-end space-x-2">
                                <p className=" text-md">ชำระเงินทั้งหมด: </p>
                                <p className=" text-xl font-semibold">90.00  </p>
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
            <div className=" flex flex-col justify-center items-end space-y-4 w-full pt-6 pb-11 absolute bottom-0 p-4 border-t-[0.5px] border-gray-300 " style={{ boxShadow: '0 -2px 6px rgba(209, 213, 219, 1)' }}>
                <button onClick={handleReceipt} className=" w-full flex justify-center items-center bg-[#007AFF] text-white p-3 rounded-[20px] shadow-md font-medium text-md">
                    ตรวจสอบ
                </button>
            </div>
        </>
    );
}

export default PayingPage;
