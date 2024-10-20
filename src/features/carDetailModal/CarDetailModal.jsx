import React from "react";
import "./CarDetailModal.css"; // Create a separate CSS file for modal styles if needed

function CarDetailModal({ isVisible, onClose, selectedRow, selectedDiscount, setSelectedDiscount }) {
  if (!isVisible) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close mr-6 mt-3" onClick={onClose}>
          &times;
        </span>
        <div className="modal-container">
          <div className="modal-left">
            <h1 className="font-inter text-blue-500 text-lg font-semibold">
              วันศุกร์ ที่ 6 สิงหาคม 2024 เวลา 14:32:04
            </h1>
            <img
              className="mt-3"
              src="/images/car_pic_example.png"
              alt="car-pic"
            />
            <p className="font-semibold flex justify-between items-center mt-3">
              เลขทะเบียน
              <span className="font-semibold text-gray-500 flex font-inter text-center border-2 rounded-md p-1 bg-gray-50 w-8/12 h-10 items-center justify-center">
                วล 3670
              </span>
            </p>
            <p className="font-semibold flex justify-between items-center mt-3">
              วันที่-เวลาที่บันทึก
              <span className="font-semibold text-gray-500 flex font-inter text-center border-2 rounded-md p-1 bg-gray-50 w-8/12 h-10 items-center justify-center">
                วันที่ 02/08/2024 17:00:00
              </span>
            </p>
            <p className="font-semibold flex justify-between items-center mt-3">
              VIP member
              <span className="font-semibold text-gray-500 flex font-inter text-center border-2 rounded-md p-1 bg-gray-50 w-8/12 h-10 items-center justify-center">
                -
              </span>
            </p>
          </div>
          <div className="modal-right">
            <p className="font-inter mb-1 text-sm text-gray-600">
              ค่าบริการ (บาท)
            </p>
            <div className="price-container mb-2 rounded-lg border-b-4 border-blue-500">
              <h1 className="font-inter text-5xl text-blue-500 font-bold">
                90
              </h1>
            </div>
            <p className="font-inter mb-1 text-sm text-gray-600">
              ส่วนลดต่างๆ
            </p>
            <div className="dropdown-container mb-3">
              <select
                value={selectedDiscount}
                onChange={(e) => setSelectedDiscount(e.target.value)}
                className="dropdown"
              >
                <option value="" disabled>
                  กรุณาเลือกส่วนลดอื่นๆ
                </option>
                <option className="font-inter" value="discount1">
                  ส่วนลด 10%
                </option>
                <option className="font-inter" value="discount2">
                  ส่วนลด 20%
                </option>
                <option className="font-inter" value="discount3">
                  ส่วนลด 30%
                </option>
              </select>
              <span className="arrow-icon">
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
            <h1 className="font-inter text-sm mb-1 text-gray-600">
              รายละเอียด
            </h1>
            <p className="font-inter text-sm mb-1 flex justify-between text-gray-500">
              เวลาเข้า: <span>17:00:00</span>
            </p>
            <p className="font-inter text-sm mb-1 flex justify-between text-gray-500">
              เวลาออก: <span>20:45:45</span>
            </p>
            <p className="font-inter text-sm mb-1 flex justify-between text-gray-500">
              ระยะเวลาการจอด: <span>3 ชั่วโมง 45 นาที</span>
            </p>
            <p className="font-inter text-sm mb-1 flex justify-between text-gray-500">
              สิทธิ์จอดฟรี: <span>1 ชั่วโมง 0 นาที</span>
            </p>
            <p className="font-inter text-sm mb-1 flex justify-between text-gray-500">
              ค่าบริการจอดรถ: <span>90 บาท</span>
            </p>
            <p className="font-inter text-sm mb-3 flex justify-between text-gray-500">
              ชำระแล้ว: <span>0 บาท</span>
            </p>
            <button className="bg-gray-100 w-full h-10 rounded-lg text-gray-400">
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetailModal;
