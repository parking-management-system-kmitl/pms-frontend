import React from "react";

function CarDetailModal({ isVisible, onClose, selectedRow, selectedDiscount, setSelectedDiscount }) {
  if (!selectedRow) return null;
  const { licenseplate, entrytime, exittime, duration, fee } = selectedRow;

  const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyles = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '25px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    width: '850px',
    height: '600px',
    position: 'relative',
  };

  const closeStyles = {
    cursor: 'pointer',
    position: 'absolute',
    top: '3%',
    right: '5%',
    fontSize: '24px',
  };

  const modalContainerStyles = {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '1.5rem',
  };

  const modalLeftStyles = {
    width: '50%',
    marginRight: '5%',
    marginLeft: '1rem',
  };

  const modalRightStyles = {
    width: '50%',
    marginLeft: '5%',
    marginRight: '1rem',
  };

  const priceContainerStyles = {
    backgroundColor: '#f7f7f7',
    height: '120px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const dropdownContainerStyles = {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
  };

  const dropdownStyles = {
    width: '100%',
    padding: '8px',
    border: '2px solid #e2e8f0',
    borderRadius: '4px',
    backgroundColor: '#f9fafb',
    appearance: 'none',
    fontSize: '16px',
    paddingRight: '40px',
  };

  const arrowIconStyles = {
    position: 'absolute',
    top: '50%',
    right: '10px',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  };

  return (
    <>
      {isVisible && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <span style={closeStyles} onClick={onClose}>
              &times;
            </span>
            <div style={modalContainerStyles}>
              <div style={modalLeftStyles}>
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
                  VIP member
                  <span className="font-semibold text-gray-500 flex font-inter text-center border-2 rounded-md p-1 bg-gray-50 w-8/12 h-10 items-center justify-center">
                    -
                  </span>
                </p>
              </div>
              <div style={modalRightStyles}>
                <p className="font-bold mb-1 text-sm text-gray-600">
                  ค่าบริการ (บาท)
                </p>
                <div style={{ ...priceContainerStyles, ...{ marginBottom: '1rem', borderBottom: '4px solid #3b82f6', borderRadius: '8px' } }}>
                  <h1 className="font-inter text-5xl text-blue-500 font-bold">
                    90
                  </h1>
                </div>
                <p className="font-bold mb-1 text-sm text-gray-600">
                  ส่วนลดต่างๆ
                </p>
                <div style={dropdownContainerStyles}>
                  <select
                    value={selectedDiscount}
                    onChange={(e) => setSelectedDiscount(e.target.value)}
                    style={dropdownStyles}
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
                  <span style={arrowIconStyles}>
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
                  เวลาเข้า: <span>17:00:00</span>
                </p>
                <p className="font-inter text-sm mb-1 mt-3 flex justify-between text-gray-500">
                  เวลาออก: <span>20:45:45</span>
                </p>
                <p className="font-inter text-sm mb-1 mt-3 flex justify-between text-gray-500">
                  ระยะเวลาการจอด: <span>3 ชั่วโมง 45 นาที</span>
                </p>
                <p className="font-inter text-sm mb-1 mt-3 flex justify-between text-gray-500">
                  สิทธิ์จอดฟรี: <span>1 ชั่วโมง 0 นาที</span>
                </p>
                <p className="font-inter text-sm mb-3 mt-3 flex justify-between text-gray-500">
                  ชำระแล้ว: <span>0 บาท</span>
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
