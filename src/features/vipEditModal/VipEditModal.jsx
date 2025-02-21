import React, { useState } from "react";
import axios from "axios";
import { XCircleIcon } from "@heroicons/react/24/outline";
import vip from "../../assets/VIP.png";

const VipEditModal = ({ isOpen, onClose, vipId, formData, setFormData }) => {
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState("");

  if (!isOpen) return null;

  const apiUrl = `${process.env.REACT_APP_API_URL}/vip/${formData.car_id}`;

  const handleSubmit = async () => {
    if (!formData.fname || !formData.lname || !formData.tel) {
      setStatusMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      setStatusType("error");
      return;
    }

    const submitData = {
      vip_days: parseInt(formData.extend_days) || 0,
      f_name: formData.fname,
      l_name: formData.lname,
      phone: formData.tel,
    };

    try {
      const response = await axios.put(apiUrl, submitData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setStatusMessage("แก้ไขข้อมูลสำเร็จ!");
        setStatusType("success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "ไม่สามารถแก้ไขข้อมูลได้";
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
              <h2 className="text-3xl font-bold">แก้ไขข้อมูลสมาชิก VIP</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between gap-6">
                <div className="w-full">
                  <label className="block text-gray-700 mb-2">ชื่อ</label>
                  <input
                    type="text"
                    value={formData.fname}
                    placeholder="กรอกชื่อ"
                    onChange={(e) =>
                      setFormData({ ...formData, fname: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-gray-700 mb-2">นามสกุล</label>
                  <input
                    type="text"
                    value={formData.lname}
                    placeholder="กรอกนามสกุล"
                    onChange={(e) =>
                      setFormData({ ...formData, lname: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
              <div className="flex justify-between gap-6">
                <div className="w-full">
                  <label className="block text-gray-700 mb-2">
                    เบอร์ติดต่อ
                  </label>
                  <input
                    type="text"
                    value={formData.tel}
                    placeholder="กรอกเบอร์โทร"
                    onChange={(e) =>
                      setFormData({ ...formData, tel: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-gray-700 mb-2">
                    จำนวนวันต่ออายุ VIP
                  </label>
                  <input
                    type="number"
                    value={formData.extend_days}
                    placeholder="0"
                    onChange={(e) =>
                      setFormData({ ...formData, extend_days: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="bg-primary px-4 py-2 text-white rounded-lg"
                onClick={handleSubmit}
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VipEditModal;
