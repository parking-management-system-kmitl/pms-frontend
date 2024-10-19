import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import parking from "../../assets/parking.png"
import receipt from "../../assets/Receipt.png"
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    const [isLangOpen, setIsLangOpen] = useState(false)
    const [language, setLanguage] = useState('TH');

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setIsLangOpen(false);
    };

    const handlePayment = () => {
        navigate("/payment");
    }

    return (
        <div>
            <div className=" px-4 pt-[70px]">
                <div className=" p-6 border-gray-300 border-[0.5px] rounded-[20px] shadow-md flex justify-center items-center mb-8 space-x-4">
                    <img src={parking} alt="car" className="w-14 h-14" />
                    <div className=" flex flex-col justify-center items-center text-lg">
                        <p>เลขทะเบียน </p>
                        <p>2กฐ452 </p>
                    </div>
                </div>
                <div className=" space-y-4 ">
                    <p className=" text-lg">รายละเอียดการจอดรถ</p>
                    <div className=" flex justify-between ">
                        <p>วันเวลาเข้า</p>
                        <p>17 ส.ค. 2567 14:32:04</p>
                    </div>
                    <div className=" flex justify-between">
                        <p>วันเวลาปัจจุบัน</p>
                        <p>17 ส.ค. 2567 18:42:10</p>
                    </div>
                    <div className=" flex justify-between ">
                        <p>ระยะเวลาการจอด</p>
                        <p>4 ชม. 10 นาที</p>
                    </div>
                    <div className=" flex justify-between ">
                        <p>สิทธิ์จอดฟรี</p>
                        <p>2 ชม. 0 นาที</p>
                    </div>
                    <div className=" flex justify-between ">
                        <p>เวลาคิดค่าบริการ</p>
                        <p>2 ชม. 10 นาที</p>
                    </div>
                    <div className=" flex justify-between">
                        <p>ค่าบริการจอดรถ</p>
                        <p>90 บาท</p>
                    </div>
                    <div className=" flex justify-between ">
                        <p>ชำระแล้ว</p>
                        <p>0 บาท</p>
                    </div>
                    <div className=" flex justify-between">
                        <p>ค่าบริการที่ต้องชำระ</p>
                        <p className=" text-xl text-[#007AFF] font-bold">90 บาท</p>
                    </div>
                </div>
            </div>

            <div className=" flex flex-col justify-center items-end space-y-4 w-full pt-6 pb-11 absolute bottom-0 p-4 border-t-[0.5px] border-gray-300 " style={{ boxShadow: '0 -2px 6px rgba(209, 213, 219, 1)' }}>
                <button onClick={handlePayment} className=" w-full flex justify-center items-center bg-[#007AFF] text-white p-3 rounded-[20px] shadow-md font-medium text-md">
                    ชำระเงิน
                </button>
               
            </div>

        </div>
    );
}

export default LandingPage;

//rfce
