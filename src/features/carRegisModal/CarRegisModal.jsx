import React, { useState } from "react";
import axios from "axios";
import { XCircleIcon } from "@heroicons/react/24/solid";
import vip from "../../assets/VIP.png";

const CarRegisModal = ({ isOpen, onClose, formData, setFormData, fetchVipData }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const apiUrl = `${process.env.REACT_APP_API_URL}/member/link-car`;

  const handleSubmit = async () => {
    if (!formData.tel || !formData.licenseplate || !formData.vip_days) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const days = parseInt(formData.vip_days);
    if (isNaN(days) || days <= 0) {
      setErrorMessage("กรุณากรอกจำนวนวันให้ถูกต้อง");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        apiUrl,
        {
          phone: formData.tel,
          licenseplate: formData.licenseplate,
          vip_days: formData.vip_days,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // แสดงข้อความสำเร็จ
        let message = "ลงทะเบียนรถสำเร็จ!";
        if (response.data.cars && response.data.cars.length > 0) {
          const car = response.data.cars[0];
          message = `ลงทะเบียนรถสำเร็จ! วันหมดอายุ: ${new Date(
            car.vip_expiry_date
          ).toLocaleDateString("th-TH")} (เหลือ ${car.days_remaining} วัน)`;
        }
        setSuccessMessage(message);
        
        // รีเฟรชข้อมูลในตารางหลังจากเวลาผ่านไป
        setTimeout(() => {
          fetchVipData(1); // กลับไปหน้าแรกหลังลงทะเบียนสำเร็จ
          setSuccessMessage("");
          onClose();
        }, 2000);
      }
    } catch (error) {
      let errorMessage = "ไม่สามารถลงทะเบียนได้";
      if (error.response?.status === 409) {
        errorMessage = "รถคันนี้มีการลงทะเบียนแล้ว";
      } else {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setErrorMessage("");
    setSuccessMessage("");
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[779px]">
            {successMessage ? (
              <div className="text-center p-4">
                <h2 className="text-xl font-bold text-primary">
                  ลงทะเบียนรถสำเร็จ
                </h2>
                <p className="mt-4 text-sm text-gray-700">{successMessage}</p>
              </div>
            ) : (
              <>
                <div className="w-full flex justify-end w-[150px] h-[49px]">
                  <button onClick={closePopup}>
                    <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
                  </button>
                </div>
                
                <div className="w-full flex flex-col justify-center items-center mb-6">
                  <img src={vip} alt="vip" className="w-[180px] h-[180px]" />
                  <h2 className="text-3xl font-bold">ลงทะเบียนรถ VIP</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">เบอร์ติดต่อ</label>
                    <input
                      type="text"
                      placeholder="กรอกเบอร์โทร"
                      value={formData.tel || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, tel: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">เลขทะเบียนรถ</label>
                    <input
                      type="text"
                      placeholder="กรอกเลขทะเบียน"
                      value={formData.licenseplate || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, licenseplate: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">อายุ VIP (วัน)</label>
                    <input
                      type="number"
                      placeholder="กรอกจำนวนวัน"
                      value={formData.vip_days || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, vip_days: e.target.value })
                      }
                      min="1"
                      className="w-full border p-2 rounded"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    className="bg-gray-200 px-4 py-2 text-black rounded-lg w-[150px] h-[49px]"
                    onClick={closePopup}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className="bg-primary px-4 py-2 text-white rounded-lg w-[150px] h-[49px]"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "กำลังดำเนินการ..." : "ลงทะเบียนรถ"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[400px]">
            <div className="w-full flex justify-end">
              <button onClick={() => setErrorMessage("")}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-error">เกิดข้อผิดพลาด</h2>
              <p className="mt-4 text-sm text-gray-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarRegisModal;