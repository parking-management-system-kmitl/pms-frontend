import { useState } from "react";
import { useNavigate } from "react-router-dom";
import vip from "../../assets/VIP.png";

export default function RegisVipPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white">
      <div className="w-full px-4">
        {/* โลโก้ + หัวข้อ */}
        <div className="text-center mb-6 mt-[6rem]">
          <img src={vip} alt="VIP Icon" className="w-20 mx-auto mb-2" />
          <h1 className="text-xl font-bold">สมัครสมาชิก VIP</h1>
          <p className="text-blue-500 text-sm font-medium">KMITL Parking</p>
        </div>

        {/* ช่องกรอกเบอร์โทร */}
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
      </div>

      <div className="w-full">
        <hr className="w-full h-px my-4 px-0 bg-gray-200 border-0 dark:bg-gray-200" />
        <div className="px-4">
          {!showMoreFields ? (
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-3xl h-[44px] text-white"
              onClick={() => setShowMoreFields(true)}
            >
              ถัดไป
            </button>
          ) : (
            <button
              onClick={() => navigate("/regisvippaying")}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-3xl h-[44px] text-white"
            >
              สมัครสมาชิก
            </button>
          )}

          <button className="w-full text-blue-600 mt-6 mb-[2rem] text-sm font-medium">
            กลับไปหน้ารายละเอียด
          </button>
        </div>
      </div>
    </div>
  );
}
