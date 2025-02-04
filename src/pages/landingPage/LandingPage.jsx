import React, { useState, useEffect } from "react";
import parking from "../../assets/parking.png";
import { useNavigate, useSearchParams } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [parkingData, setParkingData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    useEffect(() => {
        const fetchParkingData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/payments/latest`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ licenseplate: id })
                });
                const result = await response.json();
                if (result.status === "success") {
                    setParkingData(result.data);
                }
            } catch (error) {
                console.error("Error fetching parking data:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchParkingData();
    }, [id]);

    const handlePayment = () => {
        navigate(`/payment/${id}`);
    };

    if (loading) return <p>Loading...</p>;

    if (!parkingData) return <p>ไม่พบข้อมูลการจอด</p>;

    const { currentParking, latestPayment } = parkingData;
    const isPaid = currentParking.isPaid === 1;
    const displayData = isPaid ? latestPayment : currentParking;

    return (
        <div>
            <div className="px-4 pt-10">
                <div className="p-6 border-gray-300 border-[0.5px] rounded-[20px] shadow-md flex justify-center items-center mb-8 space-x-4">
                    <img src={parking} alt="car" className="w-14 h-14" />
                    <div className="flex flex-col justify-center items-center text-lg">
                        <p>เลขทะเบียน</p>
                        <p className="font-bold">{id || "ไม่ระบุ"}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {isPaid ? (
                        <>
                            <p className="text-lg">ประวัติการชำระเงินล่าสุด</p>
                            <div className="flex justify-between"><p>วันเวลาเข้า</p><p>{formatDateTime(latestPayment.entryTime)}</p></div>
                            <div className="flex justify-between"><p>วันเวลาออก</p><p>{formatDateTime(latestPayment.exitTime)}</p></div>
                            <div className="flex justify-between"><p>จำนวนเงินที่ชำระ</p><p>{latestPayment.payment.amount} บาท</p></div>
                            <div className="flex justify-between"><p>เวลาที่ชำระ</p><p>{formatDateTime(latestPayment.payment.paid_at)}</p></div>
                        </>
                    ) : (
                        <>
                            <p className="text-lg">รายละเอียดการจอดรถ</p>
                            <div className="flex justify-between"><p>วันเวลาเข้า</p><p>{formatDateTime(currentParking.entryTime)}</p></div>
                            <div className="flex justify-between"><p>วันเวลาปัจจุบัน</p><p>{formatDateTime(currentParking.currentTime)}</p></div>
                            <div className="flex justify-between"><p>ระยะเวลาการจอด</p><p>{currentParking.duration.hours} ชม. {currentParking.duration.minutes} นาที</p></div>
                            <div className="flex justify-between"><p>สิทธิ์จอดฟรี</p><p>{currentParking.freeHours} ชม.</p></div>
                            <div className="flex justify-between"><p>ค่าบริการจอดรถ</p><p>{currentParking.parkingFee} บาท</p></div>
                        </>
                    )}
                </div>
            </div>
            {!isPaid && (
                <div className="flex flex-col justify-center items-end space-y-4 w-full absolute bottom-0 p-5 border-t-[0.5px] border-gray-300">
                    <button onClick={handlePayment} className="w-full flex justify-center items-center bg-[#007AFF] text-white p-3 rounded-[20px] shadow-md font-medium text-md">
                        ชำระเงิน
                    </button>
                </div>
            )}
        </div>
    );
}

export default LandingPage;