import React, { useState } from "react";
import axios from "axios";
import { XCircleIcon } from "@heroicons/react/24/outline";
import vip from "../../assets/VIP.png";

const CarRegisModal = ({ isOpen, onClose, formData, setFormData }) => {
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState(""); // 'success' or 'error'

  if (!isOpen) return null;

  const apiUrl = `${process.env.REACT_APP_API_URL}/cars/link-vip`;

  const handleSubmit = async () => {
    // ตรวจสอบข้อมูลใน formData ก่อนส่งคำขอ
    console.log(formData.tel);
    console.log(formData.licenseplate);
    if (!formData.tel || !formData.licenseplate) {
      setStatusMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      setStatusType("error");
      return;
    }

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setStatusMessage("ลงทะเบียนสำเร็จ!");
        setStatusType("success");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "ไม่สามารถลงทะเบียนได้";
      setStatusMessage(errorMessage);
      setStatusType("error");
    }
  };

  const closePopup = () => {
    setStatusMessage(null);
    setStatusType("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-[779px]">
        <div className="w-full flex justify-end">
          <button onClick={closePopup}>
            <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
          </button>
        </div>

        {statusMessage ? (
          <div
            className={`p-4 rounded-lg ${
              statusType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {statusMessage}
          </div>
        ) : (
          <>
            <div className="w-full flex flex-col justify-center items-center mb-6">
              <img src={vip} alt="vip" className="w-[180px] h-[180px]" />
              <h2 className="text-3xl font-bold">รายละเอียดรถ</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">เบอร์ติดต่อ</label>
                <input
                  type="text"
                  placeholder="กรอกเบอร์โทร"
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
                  onChange={(e) =>
                    setFormData({ ...formData, licenseplate: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="bg-primary px-4 py-2 text-white rounded-lg"
                onClick={handleSubmit}
              >
                ลงทะเบียนรถ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CarRegisModal;
