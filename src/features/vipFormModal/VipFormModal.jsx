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
    firstName: yup.string().required("กรุณากรอกชื่อ"),
    lastName: yup.string().required("กรุณากรอกนามสกุล"),
    tel: yup
      .string()
      .required("กรุณากรอกหมายเลขโทรศัพท์")
      .matches(/^[0-9]+$/, "หมายเลขโทรศัพท์ต้องเป็นตัวเลขเท่านั้น")
      .min(10, "หมายเลขโทรศัพท์ต้องเป็นเลข 10 หลัก")
      .max(10, "หมายเลขโทรศัพท์ต้องเป็นเลข 10 หลัก"),
    vipDuration: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .required("กรุณาระบุอายุสมาชิก VIP")
      .positive("ต้องเป็นจำนวนที่มากกว่า 0")
      .integer("ต้องเป็นเลขจำนวนเต็ม"),
  })
  .required();

const apiUrl = process.env.REACT_APP_API_URL;

function VipFormModal({ isOpen, handleClose, vipId, fetchVipData }) {
  const [showRegisterCar, setShowRegisterCar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    tel: "",
    vip_days: "",
  });
  const [licensePlate, setLicensePlate] = useState("");
  const [licensePlateError, setLicensePlateError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange", // This enables real-time validation
  });

  // Watch form values
  const watchedFields = watch();

  const onSubmit = async (data) => {
    try {
      const registerResponse = await axios.post(`${apiUrl}/member/register`, {
        f_name: data.firstName,
        l_name: data.lastName,
        phone: data.tel,
      });

      if (!registerResponse.data.status) {
        setErrorMessage(registerResponse.data.message);
        return;
      }

      setFormData({
        fname: data.firstName,
        lname: data.lastName,
        tel: data.tel,
        vip_days: data.vipDuration,
      });
      setShowRegisterCar(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error during member registration:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred during registration."
      );
    }
  };

  const validateLicensePlate = () => {
    if (!licensePlate) {
      setLicensePlateError("กรุณากรอกเลขทะเบียนรถ");
      return false;
    }
    setLicensePlateError("");
    return true;
  };

  const handleRegister = async () => {
    try {
      if (!validateLicensePlate()) {
        return;
      }

      const linkResponse = await axios.post(`${apiUrl}/member/link-car`, {
        phone: formData.tel,
        licenseplate: licensePlate,
        vip_days: formData.vip_days,
      });

      if (linkResponse.data.message === "Car linked successfully") {
        setSuccessMessage("สมัครสมาชิกและลงทะเบียนรถสำเร็จ!");

        setTimeout(() => {
          if (typeof fetchVipData === "function") {
            fetchVipData(1);
          }
          handleCloseWithReset();
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

  const handleCloseWithReset = () => {
    reset();
    setFormData({
      fname: "",
      lname: "",
      tel: "",
      vip_days: "",
    });
    setLicensePlate("");
    setLicensePlateError("");
    setErrorMessage("");
    setSuccessMessage("");
    setShowRegisterCar(false);
    handleClose();
  };

  const handleBack = () => {
    setShowRegisterCar(false);
    setErrorMessage("");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[779px]">
            <div className="w-full flex justify-end w-[150px] h-[49px]">
              <button onClick={handleCloseWithReset}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>

            <div
              className={`w-full flex flex-col justify-start ${
                vipId ? "items-start" : "items-center"
              }`}
            >
              {!vipId && (
                <img src={vip} alt="vip" className="w-[180px] h-[180px]" />
              )}
              <h2 className="text-3xl font-bold">
                {vipId
                  ? "รายละเอียดสมาชิก VIP"
                  : showRegisterCar
                  ? "รายละเอียดรถ"
                  : "สมัครสมาชิก VIP"}
              </h2>
            </div>

            {/* แสดง error message */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="text-center">{errorMessage}</p>
              </div>
            )}

            {/* แสดง success message */}
            {successMessage && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                <p className="text-center">{successMessage}</p>
              </div>
            )}

            {!showRegisterCar ? (
              /* แบบฟอร์มสมัครสมาชิก */
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4 pt-6">
                  <div className="flex justify-between gap-6">
                    <div className="w-full">
                      <label className="block text-gray-700 mb-2">ชื่อ</label>
                      <input
                        {...register("firstName")}
                        type="text"
                        placeholder="ชื่อภาษาไทย"
                        className={`w-full border p-2 rounded ${
                          errors.firstName ? "border-red-500" : ""
                        }`}
                      />
                      {errors.firstName && (
                        <span className="text-xs text-error">
                          {errors.firstName.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full">
                      <label className="block text-gray-700 mb-2">
                        นามสกุล
                      </label>
                      <input
                        {...register("lastName")}
                        type="text"
                        placeholder="นามสกุลภาษาไทย"
                        className={`w-full border p-2 rounded ${
                          errors.lastName ? "border-red-500" : ""
                        }`}
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
                        className={`w-full border p-2 rounded ${
                          errors.tel ? "border-red-500" : ""
                        }`}
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
                        className={`w-full border p-2 rounded ${
                          errors.vipDuration ? "border-red-500" : ""
                        }`}
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
                    onClick={handleCloseWithReset}
                    type="button"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded-lg w-[150px] h-[49px] ${
                      isValid ? "bg-primary" : "bg-gray-200"
                    }`}
                    disabled={!isValid}
                  >
                    ต่อไป
                  </button>
                </div>
              </form>
            ) : (
              /* แบบฟอร์มลงทะเบียนรถ */
              <div>
                <div className="space-y-4 pt-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      เบอร์ติดต่อ
                    </label>
                    <input
                      type="text"
                      value={formData.tel}
                      readOnly
                      className="w-full border p-2 rounded bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      เลขทะเบียนรถ
                    </label>
                    <input
                      type="text"
                      placeholder="กรอกเลขทะเบียน"
                      className={`w-full border p-2 rounded ${
                        licensePlateError ? "border-red-500" : ""
                      }`}
                      value={licensePlate}
                      onChange={(e) => {
                        setLicensePlate(e.target.value);
                        if (e.target.value) {
                          setLicensePlateError("");
                        }
                      }}
                      onBlur={validateLicensePlate}
                    />
                    {licensePlateError && (
                      <span className="text-xs text-error">
                        {licensePlateError}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    className="bg-gray-200 px-4 py-2 text-black rounded-lg w-[150px] h-[49px]"
                    onClick={handleBack}
                    type="button"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    className={`px-4 py-2 text-white rounded-lg w-[150px] h-[49px] ${
                      licensePlate ? "bg-primary" : "bg-gray-200"
                    }`}
                    onClick={handleRegister}
                    type="button"
                    disabled={!licensePlate}
                  >
                    สมัครสมาชิก
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default VipFormModal;
