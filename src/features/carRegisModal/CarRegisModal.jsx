import React, { useState, useEffect } from "react";
import axios from "axios";
import { XCircleIcon } from "@heroicons/react/24/solid";
import vip from "../../assets/VIP.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Schema validation
const schema = yup
  .object({
    tel: yup
      .string()
      .required("กรุณากรอกหมายเลขโทรศัพท์")
      .matches(/^[0-9]+$/, "หมายเลขโทรศัพท์ต้องเป็นตัวเลขเท่านั้น")
      .min(10, "หมายเลขโทรศัพท์ต้องเป็นเลข 10 หลัก"),
    licenseplate: yup.string().required("กรุณากรอกเลขทะเบียนรถ"),
    vip_days: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .required("กรุณาระบุอายุสมาชิก VIP")
      .positive("ต้องเป็นจำนวนที่มากกว่า 0")
      .integer("ต้องเป็นเลขจำนวนเต็ม"),
  })
  .required();

const CarRegisModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  fetchVipData,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tel: formData?.tel || "",
      licenseplate: formData?.licenseplate || "",
      vip_days: formData?.vip_days || "",
    },
    mode: "onChange",
  });

  const watchedFields = watch();

  const isAnyFieldFilled =
    !!watchedFields.tel ||
    !!watchedFields.licenseplate ||
    !!watchedFields.vip_days;

  useEffect(() => {
    if (formData?.tel !== watchedFields.tel || 
        formData?.licenseplate !== watchedFields.licenseplate || 
        formData?.vip_days !== watchedFields.vip_days) {
      setFormData({
        tel: watchedFields.tel || "",
        licenseplate: watchedFields.licenseplate || "",
        vip_days: watchedFields.vip_days || "",
      });
    }
  }, [watchedFields, formData, setFormData]);

  useEffect(() => {
    if (formData?.tel) setValue("tel", formData.tel);
    if (formData?.licenseplate) setValue("licenseplate", formData.licenseplate);
    if (formData?.vip_days) setValue("vip_days", formData.vip_days);
  }, [formData, setValue]);

  if (!isOpen) return null;

  const apiUrl = `${process.env.REACT_APP_API_URL}/member/link-car`;

  const onSubmitForm = async (data) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("access_token");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        apiUrl,
        {
          phone: data.tel,
          licenseplate: data.licenseplate,
          vip_days: data.vip_days,
        },
        { headers }
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

        // Update parent component state
        setFormData({
          tel: data.tel,
          licenseplate: data.licenseplate,
          vip_days: data.vip_days,
        });

        setTimeout(() => {
          fetchVipData(1);
          setSuccessMessage("");
          reset();
          setFormData({
            tel: "",
            licenseplate: "",
            vip_days: "",
          });
          onClose();
        }, 2000);
      }
    } catch (error) {
      let errorMessage = "ไม่สามารถลงทะเบียนได้";
      if (error.response?.status === 409) {
        errorMessage = "รถคันนี้มีการลงทะเบียนแล้ว";
      } else if (error.response?.status === 401) {
        errorMessage = "ไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบใหม่";
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
    reset();
    setFormData({
      tel: "",
      licenseplate: "",
      vip_days: "",
    });
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[779px]">
            <div className="w-full flex justify-end w-[150px] h-[49px]">
              <button onClick={closePopup}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>

            <div className="w-full flex flex-col justify-center items-center mb-6">
              <img src={vip} alt="vip" className="w-[180px] h-[180px]" />
              <h2 className="text-3xl font-bold">ลงทะเบียนรถ VIP</h2>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                <p className="text-center">{errorMessage}</p>
              </div>
            )}

            {successMessage ? (
              <div className="text-center p-4">
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  <p>{successMessage}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      เบอร์ติดต่อ
                    </label>
                    <input
                      {...register("tel")}
                      type="text"
                      placeholder="กรอกเบอร์โทร"
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

                  <div>
                    <label className="block text-gray-700 mb-2">
                      เลขทะเบียนรถ
                    </label>
                    <input
                      {...register("licenseplate")}
                      type="text"
                      placeholder="กรอกเลขทะเบียน"
                      className={`w-full border p-2 rounded ${
                        errors.licenseplate ? "border-red-500" : ""
                      }`}
                    />
                    {errors.licenseplate && (
                      <span className="text-xs text-error">
                        {errors.licenseplate.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      อายุ VIP (วัน)
                    </label>
                    <input
                      {...register("vip_days")}
                      type="number"
                      placeholder="กรอกจำนวนวัน"
                      min="1"
                      className={`w-full border p-2 rounded ${
                        errors.vip_days ? "border-red-500" : ""
                      }`}
                    />
                    {errors.vip_days && (
                      <span className="text-xs text-error">
                        {errors.vip_days.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    type="button"
                    className="bg-gray-200 px-4 py-2 text-black rounded-lg w-[150px] h-[49px]"
                    onClick={closePopup}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded-lg w-[150px] h-[49px] ${
                      isAnyFieldFilled && isValid ? "bg-primary" : "bg-gray-200"
                    }`}
                    disabled={!isAnyFieldFilled || !isValid || isLoading}
                  >
                    {isLoading ? "กำลังดำเนินการ..." : "ลงทะเบียนรถ"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CarRegisModal;
