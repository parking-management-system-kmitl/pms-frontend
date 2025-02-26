import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import React, { useRef, useEffect, useState } from "react";
import receipt from "../../assets/Receipt.png";
import { useParams, Link } from "react-router-dom";
import html2canvas from "html2canvas";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function ReceiptPage() {
  const receiptRef = useRef(null);
  const { id: licensePlate } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/parking/lastestpaymenthistory/${licensePlate}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch payment data: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setPaymentData(data);
      } catch (err) {
        console.error("Error fetching payment data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (licensePlate) {
      fetchPaymentData();
    }
  }, [licensePlate]);

  const handleDownload = async () => {
    if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current);
        canvas.toBlob((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `receipt-${licensePlate}-${new Date().getTime()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        });
      } catch (error) {
        console.error("Error downloading receipt:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>กำลังโหลด...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>
      </div>
    );
  }

  const exitTimeLimit =
    paymentData?.latestPayment?.paidAt &&
    paymentData?.latestPayment?.exitBufferTime
      ? new Date(
          new Date(paymentData.latestPayment.paidAt).getTime() +
            parseFloat(paymentData.latestPayment.exitBufferTime) * 60 * 1000
        )
      : null;

  return (
    <div>
      <div className="px-4 pt-10">
        <div ref={receiptRef}>
          <div className="p-6 border-gray-300 border-[0.5px] rounded-[20px] shadow-md flex justify-center items-center mb-8 space-x-10">
            <img src={receipt} alt="receipt" className="w-14 h-14" />
            <div className="flex flex-col justify-center items-center text-lg">
              <p>ชำระเงินสำเร็จ</p>
            </div>
          </div>

          <div className="pl-9 pr-9 w-full flex flex-col justify-center items-center space-y-4">
            <h1 className="w-full flex justify-center">ใบเสร็จการชำระเงิน</h1>

            <div className="border-[0.5px] border-gray-300 w-full h-a flex flex-col p-3 space-y-3">
              <h2 className="text-sm w-full flex justify-center">
                บจก. KMITL สแควร์
              </h2>
              <p className="text-xs w-ful space-y-1">
                <p>TAX ID: 0105539025678</p>
                <p>Date: {formatDate(paymentData?.latestPayment?.paidAt)}</p>
                <p>Rcpt: RM{paymentData?.latestPayment?.paymentId}</p>
              </p>
              <div className="w-full border-[0.5px] border-gray-300"></div>
              <p className="text-xs w-ful space-y-1">
                <p>เลขทะเบียน: {paymentData?.licensePlate}</p>
                <p>
                  เวลาเข้า: {formatDate(paymentData?.latestPayment?.entryTime)}{" "}
                  {formatTime(paymentData?.latestPayment?.entryTime)}
                </p>
                {paymentData?.latestPayment?.exitTime && (
                  <p>
                    เวลาออก: {formatDate(paymentData?.latestPayment?.exitTime)}{" "}
                    {formatTime(paymentData?.latestPayment?.exitTime)}
                  </p>
                )}
                <div className="flex justify-between">
                  <p>ค่าบริการ</p>
                  <p>
                    {parseFloat(paymentData?.latestPayment?.amount).toFixed(2)}{" "}
                    บาท
                  </p>
                </div>
                {paymentData?.latestPayment?.discount !== "0.00" && (
                  <div className="flex justify-between">
                    <p>ส่วนลด</p>
                    <p>
                      {parseFloat(paymentData?.latestPayment?.discount).toFixed(
                        2
                      )}{" "}
                      บาท
                    </p>
                  </div>
                )}
                <div className="flex justify-between">
                  <p>ชำระเงิน</p>
                  <p>
                    {(
                      parseFloat(paymentData?.latestPayment?.amount) -
                      parseFloat(paymentData?.latestPayment?.discount)
                    ).toFixed(2)}{" "}
                    บาท
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>วิธีการชำระเงิน</p>
                  <p>Thai QR PromptPay</p>
                </div>
              </p>
              <div className="w-full border-[0.5px] border-gray-300"></div>
              <div className="flex flex-col space-y-1">
                <h2 className="text-md w-full flex justify-center">
                  กรุณานำรถออกก่อนเวลา{" "}
                  {exitTimeLimit ? formatTime(exitTimeLimit) : "-"}
                </h2>
                <h3 className="text-xs w-full flex justify-center text-gray-500">
                  หากเกินเวลาจะคิดค่าบริการเพิ่ม
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center items-center mt-6">
          <div className="flex flex-col justify-center items-center w-auto h-auto p-2">
            <button
              className="rounded-2xl border-[0.5px] p-2 border-gray-300 w-8 h-8 flex justify-center items-center"
              onClick={handleDownload}
            >
              <ArrowDownTrayIcon className="w-auto h-auto" />
            </button>
            <p className="mt-2 text-sm">บันทึกใบเสร็จ</p>
          </div>
        </div>

        {/* VIP Registration Link */}
        <div className="w-full flex justify-center items-center mt-4 mb-6">
          <Link to="/regisVip" className="text-blue-500 text-sm underline">
            สมัครสมาชิก VIP
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReceiptPage;
