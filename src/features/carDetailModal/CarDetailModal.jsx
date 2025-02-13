import React from "react";

function CarDetailModal({ isVisible, onClose, selectedRow, selectedDiscount, setSelectedDiscount }) {
  if (!selectedRow) return null;
  const {
    licenseplate,
    entrytime,
    exittime,
    duration,
    fee,
    isVIP,
  } = selectedRow;

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[850px] h-[600px] relative">
            <span
              className="absolute top-3 right-5 text-2xl cursor-pointer"
              onClick={onClose}
            >
              &times;
            </span>
            <div className="flex flex-row mt-6">
              {/* Left Section */}
              <div className="w-1/2 mr-5 ml-4">
                <h1 className="font-inter text-blue-500 text-lg font-semibold">
                  วันศุกร์ ที่ 6 สิงหาคม 2024 เวลา 14:32:04
                </h1>
                <img
                  className="mt-3"
                  src="/images/car_pic_example.png"
                  alt="car-pic"
                />
                <p className="font-semibold flex justify-between items-center mt-6">
                  เลขทะเบียน
                  <span className="font-semibold text-gray-500 flex font-inter text-center border-2 rounded-md p-1 bg-gray-50 w-8/12 h-10 items-center justify-center">
                    {licenseplate}
                  </span>
                </p>
                <p className="font-semibold flex justify-between items-center mt-4">
                  VIP member
                  <span className="font-semibold text-gray-500 flex font-inter text-center border-2 rounded-md p-1 bg-gray-50 w-8/12 h-10 items-center justify-center">
                    {isVIP ? "VIP" : "-"}
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
                    {fee}
                  </h1>
                </div>
                <p className="font-bold mb-1 text-sm text-gray-600">
                  ส่วนลดต่างๆ
                </p>
                <div className="relative inline-block w-full">
                  <select
                    value={selectedDiscount}
                    onChange={(e) => setSelectedDiscount(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md bg-gray-100 text-sm appearance-none focus:outline-none"
                  >
                    <option value="" disabled>
                      กรุณาเลือกส่วนลดอื่นๆ
                    </option>
                    <option value="discount1">ส่วนลด 10%</option>
                    <option value="discount2">ส่วนลด 20%</option>
                    <option value="discount3">ส่วนลด 30%</option>
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
                  เวลาเข้า: <span>{entrytime || "-"}</span>
                </p>
                <p className="font-inter text-sm mb-1 mt-3 flex justify-between text-gray-500">
                  เวลาออก: <span>{exittime || "-"}</span>
                </p>
                <p className="font-inter text-sm mb-1 mt-3 flex justify-between text-gray-500">
                  ระยะเวลาการจอด: <span>{duration}</span>
                </p>
                <p className="font-inter text-sm mb-1 mt-3 flex justify-between text-gray-500">
                  สิทธิ์จอดฟรี: <span>1 ชั่วโมง 0 นาที(Mock)</span>
                </p>
                <p className="font-inter text-sm mb-3 mt-3 flex justify-between text-gray-500">
                  ชำระแล้ว: <span>0 บาท(Mock)</span>
                </p>
                <button className="bg-gray-100 w-full h-10 rounded-lg text-gray-400">
                  ยืนยัน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CarDetailModal;
