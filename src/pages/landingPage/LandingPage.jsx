import React, { useState, useEffect } from "react";
import parking from "../../assets/parking.png";
import { useNavigate, useSearchParams } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [parkingData, setParkingData] = useState(null);
  const [latestPayment, setLatestPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needNewPayment, setNeedNewPayment] = useState(false);
  const [newPaymentDetails, setNewPaymentDetails] = useState(null);
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);

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
    console.log("License Plate ID:", id);
    const fetchData = async () => {
      try {
        // Fetch latest payment history
        const paymentResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/parking/lastestpaymenthistory/${id}`
        );
        const paymentResult = await paymentResponse.json();

        if (paymentResult.latestPayment) {
          setLatestPayment(paymentResult.latestPayment);

          // Handle new API response format with needNewPayment
          if (paymentResult.needNewPayment) {
            setNeedNewPayment(true);
            setNewPaymentDetails(paymentResult.newPaymentDetails);
            setParkingData({
              entryTime: paymentResult.entryTime,
              currentTime: paymentResult.currentTime,
              needNewPayment: true,
              newPaymentDetails: paymentResult.newPaymentDetails,
            });

            // Check if payment is enabled based on amount
            const amountAfterDiscount = parseFloat(
              paymentResult.newPaymentDetails?.amountAfterDiscount || 0
            );
            setIsPaymentEnabled(amountAfterDiscount >= 20);

            setLoading(false);
            return;
          }

          // If there's a latest payment without exitTime, we don't need to check current parking
          if (!paymentResult.latestPayment.exitTime) {
            setParkingData(null);
            setLoading(false);
            return;
          }
        }

        // If no active payment or payment is completed (has exitTime), check current parking
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
        const parkingResult = await parkingResponse.json();
        if (parkingResult.success) {
          setParkingData(parkingResult.data);

          // Check if payment is enabled based on amount
          const amountAfterDiscount = parseFloat(
            parkingResult.data?.newPaymentDetails?.amountAfterDiscount || 0
          );
          setIsPaymentEnabled(amountAfterDiscount >= 20);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Update isPaymentEnabled whenever parkingData or newPaymentDetails changes
  useEffect(() => {
    const paymentAmount = parseFloat(
      newPaymentDetails?.amountAfterDiscount ||
        parkingData?.newPaymentDetails?.amountAfterDiscount ||
        0
    );
    setIsPaymentEnabled(paymentAmount >= 20);
  }, [parkingData, newPaymentDetails]);

  const handlePayment = () => {
    if (isPaymentEnabled) {
      navigate(`/payment/${id}`);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!parkingData && !latestPayment) return <p>ไม่พบข้อมูลการจอด</p>;

  // Use parking data if available, otherwise use latest payment
  const displayData = parkingData || { lastPayment: latestPayment };
  const paymentDetails = parkingData?.newPaymentDetails;

  // Calculate duration in hours and minutes
  const getDuration = (startTime, currentTime) => {
    const start = new Date(startTime);
    const current = new Date(currentTime);
    const diffInMinutes = Math.floor((current - start) / (1000 * 60));
    return {
      hours: Math.floor(diffInMinutes / 60),
      minutes: diffInMinutes % 60,
    };
  };

  const duration = parkingData
    ? getDuration(parkingData.entryTime, parkingData.currentTime)
    : { hours: 0, minutes: 0 };

  const paymentAmount = parseFloat(
    newPaymentDetails?.amountAfterDiscount ||
      paymentDetails?.amountAfterDiscount ||
      0
  );

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
          {!needNewPayment && displayData.lastPayment ? (
            <>
              <p className="text-lg">ประวัติการชำระเงินล่าสุด</p>
              <div className="flex justify-between">
                <p>วันเวลาเข้า</p>
                <p>{formatDateTime(displayData.lastPayment.entryTime)}</p>
              </div>
              {displayData.lastPayment.exitTime && (
                <div className="flex justify-between">
                  <p>วันเวลาออก</p>
                  <p>{formatDateTime(displayData.lastPayment.exitTime)}</p>
                </div>
              )}
              <div className="flex justify-between">
                <p>จำนวนเงินที่ชำระ</p>
                <p>{displayData.lastPayment.amount} บาท</p>
              </div>
              <div className="flex justify-between">
                <p>เวลาที่ชำระ</p>
                <p>{formatDateTime(displayData.lastPayment.paidAt)}</p>
              </div>
              {displayData.lastPayment.validUntil && (
                <div className="flex justify-between">
                  <p>มีผลถึง</p>
                  <p>{formatDateTime(displayData.lastPayment.validUntil)}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-lg">รายละเอียดการจอดรถ</p>
              <div className="flex justify-between">
                <p>วันเวลาเข้า</p>
                <p>{formatDateTime(parkingData.entryTime)}</p>
              </div>
              <div className="flex justify-between">
                <p>วันเวลาปัจจุบัน</p>
                <p>{formatDateTime(parkingData.currentTime)}</p>
              </div>
              <div className="flex justify-between">
                <p>ระยะเวลาการจอด</p>
                <p>
                  {duration.hours} ชม. {duration.minutes} นาที
                </p>
              </div>
              {needNewPayment && newPaymentDetails && (
                <>
                  {/* <div className="flex justify-between">
                    <p>เริ่มคิดค่าบริการต่อจาก</p>
                    <p>{formatDateTime(newPaymentDetails.startTime)}</p>
                  </div> */}
                  <div className="flex justify-between">
                    <p>ค่าบริการจอดรถ</p>
                    <p>{newPaymentDetails.originalAmount} บาท</p>
                  </div>
                  {parseFloat(newPaymentDetails.discount) > 0 && (
                    <div className="flex justify-between">
                      <p>ส่วนลด</p>
                      <p>{newPaymentDetails.discount} บาท</p>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <p>ยอดชำระ</p>
                    <p>{newPaymentDetails.amountAfterDiscount} บาท</p>
                  </div>
                </>
              )}
              {!needNewPayment && paymentDetails && (
                <>
                  <div className="flex justify-between">
                    <p>ค่าบริการจอดรถ</p>
                    <p>{paymentDetails.originalAmount} บาท</p>
                  </div>
                  {parseFloat(paymentDetails.discount) > 0 && (
                    <div className="flex justify-between">
                      <p>ส่วนลด</p>
                      <p>{paymentDetails.discount} บาท</p>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <p>ยอดชำระ</p>
                    <p>{paymentDetails.amountAfterDiscount} บาท</p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      {(needNewPayment || (parkingData && parkingData.needNewPayment)) && (
        <div className="flex flex-col justify-center items-center space-y-4 w-full absolute bottom-0 p-5 border-t-[0.5px] border-gray-300">
          <button
            onClick={handlePayment}
            disabled={!isPaymentEnabled}
            className={`w-full flex justify-center items-center ${
              isPaymentEnabled
                ? "bg-[#007AFF] text-white"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            } p-3 rounded-[20px] shadow-md font-medium text-md`}
          >
            ชำระเงิน
          </button>
          <a href="/regisVip" className="text-blue-500 text-sm underline">สมัครสมาชิก VIP</a>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
