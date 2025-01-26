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

function VipFormModal({ isOpen, handleClose, vipId }) {
  const [showNextModal, setShowNextModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    tel: "",
    vip_days: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    setFormData({
      fname: data.firstName,
      lname: data.lastName,
      tel: data.tel,
      vip_days: data.vipDuration,
    });
    setShowNextModal(true);
    handleClose();
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${apiUrl}/vip/reg`, {
        fname: formData.fname,
        lname: formData.lname,
        tel: formData.tel,
        vip_days: formData.vip_days,
      });
      console.log("Registration successful:", response.data);

      // Show success message if registration is successful
      if (response.status === 201) {
        setSuccessMessage("สมัครสมาชิกสำเร็จ!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      const licenseplate = document.querySelector(
        'input[placeholder="กรอกเลขทะเบียน"]'
      ).value;
      if (licenseplate) {
        const linkResponse = await axios.post(`${apiUrl}/cars/link-vip`, {
          tel: formData.tel,
          licenseplate: licenseplate,
        });
        console.log("Car linked to VIP successfully:", linkResponse.data);
      } else {
        console.error("License plate is required");
      }

      setShowNextModal(false);
    } catch (error) {
      console.error("Error during registration or linking car:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const closeNextModal = () => setShowNextModal(false);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[779px]">
            <div className="w-full flex justify-end">
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
                  className="bg-gray-400 px-4 py-2 text-white rounded-lg"
                  onClick={handleClose}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-lg ${
                    isDirty ? "bg-primary" : "bg-gray-400"
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
                  value={formData.tel} // Make it editable
                  onChange={(e) =>
                    setFormData({ ...formData, tel: e.target.value })
                  } // Update tel on change
                  className="w-full border p-2 rounded"
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

            <div className="mt-6 flex justify-end">
              <button
                className="bg-primary px-4 py-2 text-white rounded-lg"
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
