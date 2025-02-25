import React, { useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import vip from "../../assets/VIP.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

// Schema validation
const schema = yup
  .object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    tel: yup
      .string()
      .matches(/^[0-9]+$/, "Tel must be only digits")
      .min(10, "Tel must be at least 10 digits")
      .required("Tel is required"),
    vipDuration: yup
      .number()
      .positive("ต้องเป็นจำนวนที่มากกว่า 0")
      .integer("ต้องเป็นเลขจำนวนเต็ม")
      .required("กรุณาระบุอายุสมาชิก VIP"),
  })
  .required();

const apiUrl = process.env.REACT_APP_API_URL;

function VipFormModal({ isOpen, handleClose, vipId, fetchVipData }) {
  const [showNextModal, setShowNextModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [memberId, setMemberId] = useState(null);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    tel: "",
    vip_days: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      // First, register the member
      const registerResponse = await axios.post(`${apiUrl}/member/register`, {
        f_name: data.firstName,
        l_name: data.lastName,
        phone: data.tel,
      });

      if (!registerResponse.data.status) {
        setErrorMessage(registerResponse.data.message);
        return;
      }

      setMemberId(registerResponse.data.member_id);
      setFormData({
        fname: data.firstName,
        lname: data.lastName,
        tel: data.tel,
        vip_days: data.vipDuration,
      });
      setShowNextModal(true);
      handleClose();
    } catch (error) {
      console.error("Error during member registration:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred during registration."
      );
    }
  };

  const handleRegister = async () => {
    try {
      const licenseplate = document.querySelector(
        'input[placeholder="กรอกเลขทะเบียน"]'
      ).value;

      if (!licenseplate) {
        setErrorMessage("กรุณากรอกเลขทะเบียนรถ");
        return;
      }

      const linkResponse = await axios.post(`${apiUrl}/member/link-car`, {
        phone: formData.tel,
        licenseplate: licenseplate,
        vip_days: formData.vip_days,
      });

      if (linkResponse.data.message === "Car linked successfully") {
        setSuccessMessage("สมัครสมาชิกและลงทะเบียนรถสำเร็จ!");
        
        // รีเฟรชข้อมูลในตาราง
        setTimeout(() => {
          if (typeof fetchVipData === 'function') {
            fetchVipData(1); // กลับไปหน้าแรกหลังลงทะเบียนสำเร็จ
          }
          setShowNextModal(false);
          setSuccessMessage("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during car linking:", error);
      if (error.response?.status === 409) {
        setErrorMessage("รถคันนี้ถูกลงทะเบียนไปแล้ว");
      } else {
        setErrorMessage(
          error.response?.data?.message || "เกิดข้อผิดพลาดในการลงทะเบียนรถ"
        );
      }
    }
  };

  const closeNextModal = () => setShowNextModal(false);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[779px]">
            <div className="w-full flex justify-end w-[150px] h-[49px]">
              <button onClick={handleClose}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>

            <div
              className={`w-full flex flex-col justify-start ${
                vipId ? " items-start" : "items-center"
              }`}
            >
              {!vipId && (
                <img src={vip} alt="vip" className="w-[180px] h-[180px]" />
              )}
              <h2 className="text-3xl font-bold">
                {vipId ? "รายละเอียดสมาชิก VIP" : "สมัครสมาชิก VIP"}
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4 pt-6">
                <div className="flex justify-between gap-6">
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2">ชื่อ</label>
                    <input
                      {...register("firstName")}
                      type="text"
                      placeholder="ชื่อภาษาไทย"
                      className="w-full border p-2 rounded"
                    />
                    {errors.firstName && (
                      <span className="text-xs text-error">
                        {errors.firstName.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2">นามสกุล</label>
                    <input
                      {...register("lastName")}
                      type="text"
                      placeholder="นามสกุลภาษาไทย"
                      className="w-full border p-2 rounded"
                    />
                    {errors.lastName && (
                      <span className="text-xs text-error">
                        {errors.lastName.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between gap-6">
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2">
                      เบอร์ติดต่อ
                    </label>
                    <input
                      {...register("tel")}
                      type="text"
                      placeholder="กรอกเบอร์ติดต่อ"
                      className="w-full border p-2 rounded"
                    />
                    {errors.tel && (
                      <span className="text-xs text-error">
                        {errors.tel.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="block text-gray-700 mb-2">
                      อายุสมาชิก VIP (วัน)
                    </label>
                    <input
                      {...register("vipDuration")}
                      type="number"
                      placeholder="กรอกจำนวนวัน"
                      className="w-full border p-2 rounded"
                    />
                    {errors.vipDuration && (
                      <span className="text-xs text-error">
                        {errors.vipDuration.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4 justify-end">
                <button
                  className="bg-gray-200 px-4 py-2 text-black rounded-lg w-[150px] h-[49px]"
                  onClick={handleClose}
                  type="button"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-lg w-[150px] h-[49px] ${
                    isDirty ? "bg-primary" : "bg-gray-200"
                  }`}
                  disabled={!isDirty}
                >
                  ต่อไป
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNextModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[779px]">
            <div className="w-full flex justify-end">
              <button onClick={closeNextModal}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>

            <div className="w-full flex flex-col justify-center items-center mb-6">
              <img src={vip} alt="vip" className="w-[180px] h-[180px]" />
              <h2 className="text-3xl font-bold">รายละเอียดรถ</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">เบอร์ติดต่อ</label>
                <input
                  type="text"
                  value={formData.tel}
                  readOnly
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">เลขทะเบียนรถ</label>
                <input
                  type="text"
                  placeholder="กรอกเลขทะเบียน"
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-4 justify-end">
              <button
                className="bg-gray-200 px-4 py-2 text-black rounded-lg w-[150px] h-[49px]"
                onClick={closeNextModal}
              >
                ยกเลิก
              </button>
              <button
                className="bg-primary px-4 py-2 text-white rounded-lg w-[150px] h-[49px]"
                onClick={handleRegister}
              >
                สมัครสมาชิก
              </button>
            </div>
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

      {successMessage && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[400px]">
            <div className="w-full flex justify-end">
              <button onClick={() => setSuccessMessage("")}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-primary">
                สมัครสมาชิกสำเร็จ
              </h2>
              <p className="mt-4 text-sm text-gray-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VipFormModal;