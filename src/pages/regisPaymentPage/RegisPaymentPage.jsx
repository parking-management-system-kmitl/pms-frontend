import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import ThaiQR from "../../assets/ThaiQR.png";
import PromptPay from "../../assets/PromptPay.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const publicUrl = "http://jjsornwakii.3bbddns.com:34724/public";

export default function RegisPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { promotionData, carOwner, phone, licensePlate } = location.state || {};

  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const initialTime = 15 * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/payments/initiate`, {
          amount: promotionData?.price || "0",
        });

        if (response.data.qrCodeUrl) {
          setQrCodeUrl(`${publicUrl}${response.data.qrCodeUrl}`);
        }
      } catch (err) {
        setError("ไม่สามารถสร้าง QR Code ได้ กรุณาลองใหม่อีกครั้ง");
      }
    };

    initiatePayment();
  }, [promotionData]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      navigate("/regisvip"); // Redirect if time expires
    }
  }, [timeLeft, navigate]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      // Register member if not existing
      if (!carOwner) {
        await axios.post(`${apiUrl}/member/register`, {
          f_name: location.state?.firstName,
          l_name: location.state?.lastName,
          phone: phone,
        });
      }

      // Link car to member
      await axios.post(`${apiUrl}/member/link-car`, {
        phone: phone,
        licenseplate: licensePlate,
        vip_days: promotionData?.days,
      });

      navigate("/regisvipreceipt", {
        state: {
          paymentAmount: promotionData?.price,
          vipDays: promotionData?.days,
        },
      });
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = "payment-qr.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white">
      <div className="w-full px-4 pt-10">
        <div className="border-gray-300 border-[0.5px] rounded-[20px] shadow-md flex flex-col justify-center w-full h-[96px] items-center space-y-1 mb-8">
          <p className="text-md">เวลาที่เหลือสำหรับการชำระเงิน</p>
          <p className="text-[#007AFF] text-2xl">{formatTime()}</p>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-md border-gray-300 border-[0.5px] rounded-[20px] shadow-md flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center w-full rounded-[20px] p-6 bg-white">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-full max-w-[186px]"
                />
              ) : (
                <img
                  src={PromptPay}
                  alt="PromptPay"
                  className="w-full max-w-[186px]"
                />
              )}
              <div className="flex justify-center items-end space-x-2 mt-4">
                <p className="text-md">ชำระเงินทั้งหมด: </p>
                <p className="text-xl font-semibold">
                  {promotionData?.price || "0.00"}
                </p>
                <p className="text-md">บาท</p>
              </div>
              {promotionData && (
                <p className="text-sm text-gray-600 mt-2">
                  ระยะเวลา VIP: {promotionData.days} วัน
                </p>
              )}
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </div>
          </div>
        </div>

        {/* QR Download Button - Optional */}
        {/* <div className="w-full flex justify-center items-center mt-6">
          <div className="flex flex-col justify-center items-center w-auto h-auto p-2">
            <button 
              onClick={handleDownloadQR}
              disabled={!qrCodeUrl}
              className="rounded-2xl border-[0.5px] p-2 border-gray-300 w-8 h-8 flex justify-center items-center"
            >
              <ArrowDownTrayIcon className="w-auto h-auto" />
            </button>
            <p className="mt-2 text-sm">บันทึก QR</p>
          </div>
        </div> */}
      </div>

      <div className="w-full absolute bottom-0 border-t-[0.5px] border-gray-300">
        <div className="px-4 py-5">
          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className={`w-full rounded-3xl h-[44px] text-white ${
              isProcessing ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isProcessing ? "กำลังดำเนินการ..." : "ยืนยัน"}
          </button>
        </div>
      </div>
    </div>
  );
}
