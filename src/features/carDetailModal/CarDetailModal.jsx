import React, { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";

function CarDetailModal({
  isVisible,
  onClose,
  selectedRow,
  selectedDiscount,
  setSelectedDiscount,
  carId,
}) {
  const [discounts, setDiscounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchDiscounts = async () => {
      if (!carId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}/discount/list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            car_id: carId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch discounts");
        }

        const data = await response.json();
        setDiscounts(data.applicable_discounts || []);
      } catch (err) {
        setError("Failed to load discounts");
        console.error("Error fetching discounts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible) {
      fetchDiscounts();
    }
  }, [isVisible, carId, apiUrl]);

  const handleApplyDiscount = async () => {
    if (!selectedDiscount || !carId || isApplyingDiscount) return;

    const selectedDiscountObj = discounts.find(
      (discount) =>
        discount.discount_id.toString() === selectedDiscount.toString()
    );

    if (!selectedDiscountObj) {
      setError("Invalid discount selection");
      return;
    }

    setIsApplyingDiscount(true);
    setError(null);

    try {
      console.log(carId);
      console.log(selectedDiscountObj.discount_id);
      const response = await fetch(`${apiUrl}/discount/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          car_id: carId,
          discount_id: selectedDiscountObj.discount_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to apply discount");
      }

      const data = await response.json();

      if (data.status === "success") {
        onClose();
      } else {
        throw new Error("Discount application failed");
      }
    } catch (err) {
      setError("Failed to apply discount");
      console.error("Error applying discount:", err);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  if (!isVisible || !selectedRow) return null;

  const getRowType = (row) => {
    if (row.type === "active") return "entry";
    if (row.type === "completed") return "exit";
    if (row.entry_records_id) return "entry";
    if (row.entry_exit_records_id) return "exit";
    return "unknown";
  };

  const rowType = getRowType(selectedRow);

  const getData = () => {
    switch (rowType) {
      case "entry":
        return {
          licensePlate: selectedRow.car.license_plate,
          entryTime: new Date(selectedRow.entry_time).toLocaleTimeString(),
          exitTime: "-",
          parkedHours: selectedRow.parkedHours || 0,
          fee: selectedRow.parkingFee,
          isVIP: selectedRow.isVip,
          image: selectedRow.entry_car_image_path,
          payment: selectedRow.payments?.[0] ||
            selectedRow.payment || {
              amount: "0.00",
              discount: "0.00",
              paid_at: null,
            },
          date: selectedRow.entry_time,
          status: "กำลังจอด",
        };
      case "exit":
        return {
          licensePlate: selectedRow.car.license_plate,
          entryTime: new Date(selectedRow.entry_time).toLocaleTimeString(),
          exitTime: new Date(selectedRow.exit_time).toLocaleTimeString(),
          parkedHours: selectedRow.parkedHours || 0,
          fee: selectedRow.parkingFee,
          isVIP: selectedRow.isVip,
          image: selectedRow.entry_car_image_path,
          payment: selectedRow.payments?.[0] || {
            amount: "0.00",
            discount: "0.00",
            paid_at: null,
          },
          date: selectedRow.entry_time,
          status: "ออกแล้ว",
        };
      default:
        return {};
    }
  };

  const data = getData();

  const formatCurrency = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  const calculatePaidAmount = (payment) => {
    if (!payment.paid_at) return "0.00";
    const amount = parseFloat(payment.amount) || 0;
    const discount = parseFloat(payment.discount) || 0;
    return formatCurrency(amount - discount);
  };

  const renderDiscountOptions = () => {
    if (isLoading) {
      return <option disabled>กำลังโหลดรายการส่วนลด...</option>;
    }

    if (error) {
      return <option disabled>ไม่สามารถโหลดรายการส่วนลด</option>;
    }

    return (
      <>
        <option value="" disabled>
          กรุณาเลือกส่วนลดอื่นๆ
        </option>
        {discounts.map((discount) => (
          <option key={discount.discount_id} value={discount.discount_id}>
            {discount.title} - {discount.free_hours} ชั่วโมง
            {discount.customer_type === "VIP" ? " (VIP)" : ""}
          </option>
        ))}
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[850px] h-[600px] relative">
        <div className="w-full flex justify-end">
          <button onClick={onClose}>
            <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
          </button>
        </div>
        <div className="flex flex-row">
          {/* Left Section */}
          <div className="w-1/2 mr-5 ml-4">
            <h1 className="font-inter text-blue-500 text-lg font-semibold">
              {new Date(data.date).toLocaleDateString("th-TH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h1>
            <div className="mt-3 h-[250px] w-full bg-gray-100 rounded-lg overflow-hidden">
              {data.image ? (
                <img
                  src={`${apiUrl}${data.image}`}
                  alt={`Car ${data.licensePlate}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/images/car_pic_example.png";
                    e.target.className =
                      "w-full h-full object-contain bg-gray-200";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">ไม่มีรูปภาพ</span>
                </div>
              )}
            </div>
            <p className="font-semibold flex justify-between items-center mt-6">
              เลขทะเบียน
              <span className="font-semibold text-gray-500 flex font-inter text-center border-2 rounded-md p-1 bg-gray-50 w-8/12 h-10 items-center justify-center">
                {data.licensePlate}
              </span>
            </p>
            <p className="font-semibold flex justify-between items-center mt-4">
              สถานะ
              <span className="font-semibold text-gray-500 flex font-inter text-center border-2 rounded-md p-1 bg-gray-50 w-8/12 h-10 items-center justify-center">
                {data.status}
              </span>
            </p>
            <p className="font-semibold flex justify-between items-center mt-4">
              VIP member
              <span className="font-semibold text-gray-500 flex font-inter text-center border-2 rounded-md p-1 bg-gray-50 w-8/12 h-10 items-center justify-center">
                {data.isVIP ? "VIP" : "-"}
              </span>
            </p>
          </div>

          {/* Right Section */}
          <div className="w-1/2 ml-5 mr-4">
            <p className="font-bold mb-1 text-sm text-gray-600">
              ค่าบริการ (บาท)
            </p>
            <div className="bg-gray-100 h-[120px] flex justify-center items-center mb-4 border-b-4 border-blue-500 rounded-lg">
              <h1 className="font-inter text-5xl text-blue-500 font-bold">
                {formatCurrency(data.fee)}
              </h1>
            </div>
            <p className="font-bold mb-1 text-sm text-gray-600">ส่วนลดต่างๆ</p>
            <div className="relative inline-block w-full">
              <select
                value={selectedDiscount}
                onChange={(e) => setSelectedDiscount(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md bg-gray-100 text-sm appearance-none focus:outline-none disabled:bg-gray-200 disabled:text-gray-500"
                disabled={data.status === "ออกแล้ว"}
              >
                {renderDiscountOptions()}
              </select>
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 9l6 6 6-6"
                  />
                </svg>
              </span>
            </div>
            <h1 className="font-bold text-sm mb-1 mt-4 text-gray-600">
              รายละเอียด
            </h1>
            <p className="font-inter text-sm mb-1 mt-3 flex justify-between text-gray-500">
              เวลาเข้า: <span>{data.entryTime}</span>
            </p>
            <p className="font-inter text-sm mb-1 mt-3 flex justify-between text-gray-500">
              เวลาออก: <span>{data.exitTime}</span>
            </p>
            <p className="font-inter text-sm mb-1 mt-3 flex justify-between text-gray-500">
              ระยะเวลาการจอด: <span>{data.parkedHours} ชั่วโมง</span>
            </p>
            <p className="font-inter text-sm mb-1 mt-3 flex justify-between text-gray-500">
              ส่วนลด:{" "}
              <span>{formatCurrency(data.payment.discount || 0)} บาท</span>
            </p>
            <p className="font-inter text-sm mb-3 mt-3 flex justify-between text-gray-500">
              ชำระแล้ว: <span>{calculatePaidAmount(data.payment)} บาท</span>
            </p>
            <button
              className={`w-full h-10 rounded-lg ${
                data.status === "ออกแล้ว" ||
                !selectedDiscount ||
                isApplyingDiscount
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={
                data.status === "ออกแล้ว" ||
                !selectedDiscount ||
                isApplyingDiscount
              }
              onClick={handleApplyDiscount}
            >
              {isApplyingDiscount
                ? "กำลังดำเนินการ..."
                : data.status === "ออกแล้ว"
                ? "ชำระเงินแล้ว"
                : "ยืนยันการใช้ส่วนลด"}
            </button>

            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetailModal;
