import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PayingPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verifying, setVerifying] = useState(false);

    const initialTime = 15 * 60;
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        const initializePayment = async () => {
            try {
                const parkingResponse = await fetch(
                    `${process.env.REACT_APP_API_URL}/parking/payment/check`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ licensePlate: id }),
                    }
                );
                const parkingData = await parkingResponse.json();
                
                if (!parkingData.success) {
                    throw new Error("Failed to fetch parking details");
                }

                const amount = parkingData.data.newPaymentDetails.amountAfterDiscount;

                const paymentResponse = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/payments/initiate`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ amount: amount.toString() }),
                    }
                );
                const paymentResult = await paymentResponse.json();
                setPaymentData(paymentResult);
            } catch (err) {
                setError(err.message);
                console.error("Error initializing payment:", err);
            } finally {
                setLoading(false);
            }
        };

        initializePayment();
    }, [id]);

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

    const handleReceipt = async () => {
        try {
            setVerifying(true);
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/parking/payment/mock`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ licensePlate: id }),
                }
            );
            
            const result = await response.json();
            if (result.success) {
                // Navigate to receipt page with the license plate id parameter
                navigate(`/receipt/${id}`);
            } else {
                // Handle unsuccessful payment verification
                alert("การชำระเงินยังไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
            }
        } catch (err) {
            console.error("Error verifying payment:", err);
            alert("เกิดข้อผิดพลาดในการตรวจสอบ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setVerifying(false);
        }
    };

    const handleDownloadQR = () => {
        if (paymentData?.qrCodeUrl) {
            const link = document.createElement('a');
            link.href = `http://jjsornwakii.3bbddns.com:34724/public${paymentData.qrCodeUrl}`;
            link.download = 'qr-code.svg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

    return (
        <div>
            <div className="px-4 pt-10">
                <div className="p-6 border-gray-300 border-[0.5px] rounded-[20px] shadow-md flex flex-col justify-center w-full h-[96px] items-center space-y-1 mb-8">
                    <p className="text-md">เวลาที่เหลือสำหรับการชำระเงิน</p>
                    <p className="text-[#007AFF] text-2xl">{formatTime()}</p>
                </div>

                <div className="pl-6 pr-6">
                    <div className="border-gray-300 border-[0.5px] rounded-[20px] shadow-md flex flex-col justify-center w-full h-auto items-center">

                        <div className="flex flex-col justify-center items-center h-auto w-full rounded-[20px] p-6 space-y-3 bg-white">
                            {paymentData?.qrCodeUrl && (
                                <img 
                                    src={`http://jjsornwakii.3bbddns.com:34724/public${paymentData.qrCodeUrl}`}
                                    alt="QR Code"
                                    className="w-[186px]"
                                />
                            )}
                            <div className="flex justify-center items-end space-x-2">
                                <p className="text-md">ชำระเงินทั้งหมด: </p>
                                <p className="text-xl font-semibold">
                                    {paymentData?.amount.toFixed(2)}
                                </p>
                                <p className="text-md">บาท</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center items-center mt-6">
                        <div className="flex flex-col justify-center items-center w-auto h-auto p-2">
                            <button 
                                onClick={handleDownloadQR}
                                className="rounded-2xl border-[0.5px] p-2 border-gray-300 w-8 h-8 flex justify-center items-center"
                            >
                                <ArrowDownTrayIcon className="w-auto h-auto" />
                            </button>
                            <p className="mt-2 text-sm">บันทึก QR</p>
                        </div>
                    </div>
                    <div className="flex justify-center items-center mt-6 h-24 w-full"></div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-end inset-x-0 space-y-4 w-full fixed bottom-0 p-4 border-t-[0.5px] border-gray-300 bg-white h-24">
                <button 
                    onClick={handleReceipt}
                    disabled={verifying}
                    className={`w-full flex justify-center items-center bg-[#007AFF] text-white p-3 rounded-[20px] shadow-md font-medium text-md ${
                        verifying ? 'opacity-50' : ''
                    }`}
                >
                    {verifying ? 'กำลังตรวจสอบ...' : 'ตรวจสอบ'}
                </button>
            </div>
        </div>
    );
}

export default PayingPage;