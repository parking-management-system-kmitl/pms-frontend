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
      const registerResponse = await axios.post(`${apiUrl}/member/register`, {
        f_name: firstName,
        l_name: lastName,
        phone: phone,
      });

      if (registerResponse.data.status) {
        const linkCarResponse = await axios.post(`${apiUrl}/member/link-car`, {
          phone: phone,
          licenseplate: licensePlate,
          vip_days: "5",
        });

        if (linkCarResponse.data.message === "Car linked successfully") {
          navigate("/regisvippaying");
        } else {
          setError("ผูกทะเบียนรถไม่สำเร็จ");
        }
      } else {
        setError(registerResponse.data.message);
      }
    } catch (error) {
      setError("การสมัครสมาชิกไม่สำเร็จ");
    }
  };

  const addCarToVip = async () => {
    try {
      const response = await axios.post(`${apiUrl}/member/link-car`, {
        phone: phone,
        licenseplate: licensePlate,
        vip_days: "5",
      });

      if (response.data.message === "Car linked successfully") {
        navigate("/regisvippaying");
      } else {
        setError("ผูกทะเบียนรถไม่สำเร็จ");
      }
    } catch (error) {
    }
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

        <button className="w-full text-blue-600 mt-6 mb-[2rem] text-sm font-medium">
          กลับไปหน้ารายละเอียด
        </button>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
  );
}
