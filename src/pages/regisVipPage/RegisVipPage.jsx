import { useState } from "react";
import { useNavigate } from "react-router-dom";
import vip from "../../assets/VIP.png";
import axios from "axios";
import { XCircleIcon } from "@heroicons/react/24/outline";

const apiUrl = process.env.REACT_APP_API_URL;

export default function RegisVipPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [error, setError] = useState("");
  const [isVip, setIsVip] = useState(false);
  const [vipCars, setVipCars] = useState([]);
  const [showAddCar, setShowAddCar] = useState(false);

  const checkPhone = async () => {
    try {
      const response = await axios.post(`${apiUrl}/member/check-phone`, {
        phone,
      });
      if (response.data.exists) {
        if (response.data.cars.some((car) => !car.is_expired)) {
          setIsVip(true);
          setVipCars(response.data.cars);
        } else {
          setShowMoreFields(true);
          setIsVip(false);
        }
      } else {
        setShowMoreFields(true);
        setIsVip(false);
      }
    } catch (error) {
      setError("ตรวจสอบเบอร์โทรศัพท์ไม่สำเร็จ");
    }
  };

  const registerMember = async () => {
    try {
      // Validate required fields
      if (!phone || !firstName || !lastName || !licensePlate) {
        setError("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      const prepareRegResponse = await axios.post(
        `${apiUrl}/member/preparereg`,
        {
          phone: phone,
          licenseplate: licensePlate,
        }
      );

      if (prepareRegResponse.data.status) {
        navigate("/regisvippaying", {
          state: {
            promotionData: prepareRegResponse.data.data.promotion,
            carOwner: prepareRegResponse.data.data.car_owner,
            phone: phone,
            licensePlate: licensePlate,
            firstName: firstName,
            lastName: lastName,
            isNewMember: true
          }
        });
      } else {
        setError("เตรียมข้อมูลการลงทะเบียนไม่สำเร็จ");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setError("เลขทะเบียนรถนี้ถูกลงทะเบียนแล้ว");
      } else {
        setError("การสมัครสมาชิกไม่สำเร็จ");
      }
    }
  };

  const addCarToVip = async () => {
    try {
      if (!phone || !licensePlate) {
        setError("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      const response = await axios.post(`${apiUrl}/member/preparereg`, {
        phone: phone,
        licenseplate: licensePlate,
      });

      if (response.data.status) {
        navigate("/regisvippaying", {
          state: {
            promotionData: response.data.data.promotion,
            carOwner: response.data.data.car_owner,
            phone: phone,
            licensePlate: licensePlate,
            isNewMember: false
          }
        });
      } else {
        setError("เตรียมข้อมูลการลงทะเบียนไม่สำเร็จ");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setError("เลขทะเบียนรถนี้ถูกลงทะเบียนแล้ว");
      } else {
        setError("การเพิ่มรถไม่สำเร็จ");
      }
    }
  };

  const handleBackToDetails = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white">
      <div className="w-full px-4">
        <div className="text-center mb-6 mt-[6rem]">
          <img src={vip} alt="VIP Icon" className="w-20 mx-auto mb-2" />
          <h1 className="text-xl font-bold">สมัครสมาชิก VIP</h1>
          <p className="text-blue-500 text-sm font-medium">KMITL Parking</p>
          {isVip && (
            <>
              <p className="text-red-500 text-sm font-medium mt-2">
                หมายเลขนี้ได้เป็นสมาชิก VIP แล้ว
              </p>
              {vipCars.length > 0 && (
                <div className="mt-2 text-sm">
                  <p>รถที่ลงทะเบียนแล้ว:</p>
                  {vipCars.map((car, index) => (
                    <p key={index} className="text-gray-600">
                      {car.license_plate} 
                      {!car.is_expired && " (ยังไม่หมดอายุ)"}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-[3rem]">
          <label className="block text-sm font-medium mb-2">
            หมายเลขโทรศัพท์
          </label>
          <input
            type="tel"
            placeholder="กรอกเบอร์ติดต่อ"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mb-4 w-full border p-2 rounded"
          />
        </div>

        {showMoreFields && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">ชื่อ</label>
              <input
                type="text"
                placeholder="กรอกชื่อ"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mb-4 w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">นามสกุล</label>
              <input
                type="text"
                placeholder="กรอกนามสกุล"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mb-4 w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                เลขทะเบียนรถ
              </label>
              <input
                type="text"
                placeholder="กรอกเลขทะเบียน"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                className="mb-4 w-full border p-2 rounded"
              />
            </div>
          </>
        )}

        {showAddCar && (
          <div>
            <label className="block text-sm font-medium mb-2">
              เลขทะเบียนรถ
            </label>
            <input
              type="text"
              placeholder="กรอกเลขทะเบียน"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              className="mb-4 w-full border p-2 rounded"
            />
          </div>
        )}
      </div>

      <div className="w-full px-4">
        {!showMoreFields && !isVip && (
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-3xl h-[44px] text-white"
            onClick={checkPhone}
          >
            ถัดไป
          </button>
        )}

        {isVip && (
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-3xl h-[44px] text-white"
            onClick={() => {
              if (showAddCar) {
                addCarToVip();
              } else {
                setShowAddCar(true);
              }
            }}
          >
            {showAddCar ? "ยืนยัน" : "เพิ่มรถ"}
          </button>
        )}

        {showMoreFields && !isVip && (
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-3xl h-[44px] text-white"
            onClick={registerMember}
          >
            สมัครสมาชิก
          </button>
        )}

        <button 
          onClick={handleBackToDetails}
          className="w-full text-blue-600 mt-6 mb-[2rem] text-sm font-medium"
        >
          กลับไปหน้ารายละเอียด
        </button>
      </div>

      {error && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center">
          <p className="text-red-500 text-sm bg-white px-4 py-2 rounded-lg shadow">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}