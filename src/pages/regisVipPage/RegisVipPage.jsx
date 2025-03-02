import { useState } from "react";
import { useNavigate } from "react-router-dom";
import vip from "../../assets/VIP.png";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { XCircleIcon } from "@heroicons/react/24/solid";
import * as yup from "yup";

const apiUrl = process.env.REACT_APP_API_URL;

// Schema validation
const phoneSchema = yup.object({
  phone: yup
    .string()
    .required("กรุณากรอกหมายเลขโทรศัพท์")
    .matches(/^[0-9]+$/, "หมายเลขโทรศัพท์ต้องเป็นตัวเลขเท่านั้น")
    .min(10, "หมายเลขโทรศัพท์ต้องเป็นเลข 10 หลัก")
    .max(10, "หมายเลขโทรศัพท์ต้องเป็นเลข 10 หลัก"),
});

const registrationSchema = yup.object({
  phone: yup
    .string()
    .required("กรุณากรอกหมายเลขโทรศัพท์")
    .matches(/^[0-9]+$/, "หมายเลขโทรศัพท์ต้องเป็นตัวเลขเท่านั้น")
    .min(10, "หมายเลขโทรศัพท์ต้องเป็นเลข 10 หลัก")
    .max(10, "หมายเลขโทรศัพท์ต้องเป็นเลข 10 หลัก"),
  firstName: yup.string().required("กรุณากรอกชื่อ"),
  lastName: yup.string().required("กรุณากรอกนามสกุล"),
  licensePlate: yup.string().required("กรุณากรอกเลขทะเบียนรถ"),
});

const licensePlateSchema = yup.object({
  licensePlate: yup.string().required("กรุณากรอกเลขทะเบียนรถ"),
});

export default function RegisVipPage() {
  const navigate = useNavigate();
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [vipCars, setVipCars] = useState([]);
  const [showAddCar, setShowAddCar] = useState(false);
  const [error, setError] = useState("");
  const [duplicateLicenseError, setDuplicateLicenseError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Phone check form
  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors },
    setValue: setPhoneValue,
  } = useForm({
    resolver: yupResolver(phoneSchema),
    mode: "onChange",
  });

  // Registration form
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: formErrors },
    setValue: setFormValue,
  } = useForm({
    resolver: yupResolver(registrationSchema),
    mode: "onChange",
  });

  // License plate form for VIP members
  const {
    register: registerLicensePlate,
    handleSubmit: handleSubmitLicensePlate,
    formState: { errors: licensePlateErrors },
  } = useForm({
    resolver: yupResolver(licensePlateSchema),
    mode: "onChange",
  });

  const checkPhone = async (data) => {
    try {
      setError("");
      setDuplicateLicenseError(false);
      const phone = data.phone;
      setPhoneNumber(phone);

      const response = await axios.post(`${apiUrl}/member/check-phone`, {
        phone: phone,
      });

      if (response.data.exists) {
        if (response.data.cars.some((car) => !car.is_expired)) {
          setIsVip(true);
          setVipCars(response.data.cars);
          setPhoneValue("phone", phone);
        } else {
          setShowMoreFields(true);
          setIsVip(false);
          setFormValue("phone", phone);
        }
      } else {
        setShowMoreFields(true);
        setIsVip(false);
        setFormValue("phone", phone);
      }
    } catch (error) {
      setError("ตรวจสอบเบอร์โทรศัพท์ไม่สำเร็จ");
    }
  };

  const registerMember = async (data) => {
    try {
      setError("");
      setDuplicateLicenseError(false);
      const prepareRegResponse = await axios.post(
        `${apiUrl}/member/preparereg`,
        {
          phone: data.phone,
          licenseplate: data.licensePlate,
        }
      );

      if (prepareRegResponse.data.status) {
        navigate("/regisvippaying", {
          state: {
            promotionData: prepareRegResponse.data.data.promotion,
            carOwner: prepareRegResponse.data.data.car_owner,
            phone: data.phone,
            licensePlate: data.licensePlate,
            firstName: data.firstName,
            lastName: data.lastName,
            isNewMember: true,
          },
        });
      } else {
        setError("เตรียมข้อมูลการลงทะเบียนไม่สำเร็จ");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setError("เลขทะเบียนรถนี้ถูกลงทะเบียนแล้ว");
        setDuplicateLicenseError(true);
      } else {
        setError("การสมัครสมาชิกไม่สำเร็จ");
      }
    }
  };

  const addCarToVip = async (data) => {
    try {
      setError("");
      setDuplicateLicenseError(false);
      const response = await axios.post(`${apiUrl}/member/preparereg`, {
        phone: phoneNumber,
        licenseplate: data.licensePlate,
      });

      if (response.data.status) {
        navigate("/regisvippaying", {
          state: {
            promotionData: response.data.data.promotion,
            carOwner: response.data.data.car_owner,
            phone: phoneNumber,
            licensePlate: data.licensePlate,
            isNewMember: false,
          },
        });
      } else {
        setError("เตรียมข้อมูลการลงทะเบียนไม่สำเร็จ");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setError("เลขทะเบียนรถนี้ถูกลงทะเบียนแล้ว");
        setDuplicateLicenseError(true);
      } else {
        setError("การเพิ่มรถไม่สำเร็จ");
      }
    }
  };

  const handleBackToDetails = () => {
    navigate(-1);
  };

  const handleBackToPhoneForm = () => {
    setShowMoreFields(false);
  };

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      {/* ส่วนของเนื้อหาหลัก - ใช้ flex-grow เพื่อให้ขยายเต็มพื้นที่ว่าง */}
      <div className="flex-grow px-4 pt-10 pb-32">
        {" "}
        {/* เพิ่ม pb-32 เพื่อสร้าง padding ด้านล่างให้เนื้อหาไม่ไปซ้อนทับกับปุ่ม */}
        <div className="text-center mb-6 mt-[6rem]">
          <img src={vip} alt="VIP Icon" className="w-20 mx-auto mb-2" />
          <h1 className="text-xl font-bold">สมัครสมาชิก VIP</h1>
          <p className="text-sm font-medium">KMITL Parking</p>
          {isVip && (
            <div>
              <p className="text-blue-500 text-sm font-medium mt-2">
                หมายเลขนี้ได้เป็นสมาชิก VIP แล้ว
              </p>
              <p
                className="text-blue-500 text-sm font-medium mt-1 underline cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                คลิกรายละเอียดเพิ่มเติม
              </p>
            </div>
          )}
        </div>
        {/* Phone Check Form */}
        {!showMoreFields && !isVip && (
          <div className="mt-[3rem]">
            <label className="block text-sm font-medium mb-2">
              หมายเลขโทรศัพท์
            </label>
            <input
              type="tel"
              placeholder="กรอกเบอร์ติดต่อ"
              {...registerPhone("phone")}
              className={`mb-1 w-full border p-2 rounded ${
                phoneErrors.phone ? "border-red-500" : ""
              }`}
            />
            {phoneErrors.phone && (
              <p className="text-red-500 text-xs mb-2">
                {phoneErrors.phone.message}
              </p>
            )}
          </div>
        )}
        {/* Registration Form */}
        {showMoreFields && !isVip && (
          <div className="mt-[3rem]">
            <label className="block text-sm font-medium mb-2">
              หมายเลขโทรศัพท์
            </label>
            <input
              type="tel"
              placeholder="กรอกเบอร์ติดต่อ"
              {...registerForm("phone")}
              className={`mb-1 w-full border p-2 rounded ${
                formErrors.phone ? "border-red-500" : ""
              }`}
              readOnly
            />
            {formErrors.phone && (
              <p className="text-red-500 text-xs mb-2">
                {formErrors.phone.message}
              </p>
            )}

            <label className="block text-sm font-medium mb-2">ชื่อ</label>
            <input
              type="text"
              placeholder="กรอกชื่อ"
              {...registerForm("firstName")}
              className={`mb-1 w-full border p-2 rounded ${
                formErrors.firstName ? "border-red-500" : ""
              }`}
            />
            {formErrors.firstName && (
              <p className="text-red-500 text-xs mb-2">
                {formErrors.firstName.message}
              </p>
            )}

            <label className="block text-sm font-medium mb-2">นามสกุล</label>
            <input
              type="text"
              placeholder="กรอกนามสกุล"
              {...registerForm("lastName")}
              className={`mb-1 w-full border p-2 rounded ${
                formErrors.lastName ? "border-red-500" : ""
              }`}
            />
            {formErrors.lastName && (
              <p className="text-red-500 text-xs mb-2">
                {formErrors.lastName.message}
              </p>
            )}

            <label className="block text-sm font-medium mb-2">
              เลขทะเบียนรถ
            </label>
            <input
              type="text"
              placeholder="กรอกเลขทะเบียน"
              {...registerForm("licensePlate")}
              className={`mb-1 w-full border p-2 rounded ${
                formErrors.licensePlate || duplicateLicenseError
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formErrors.licensePlate && (
              <p className="text-red-500 text-xs mb-2">
                {formErrors.licensePlate.message}
              </p>
            )}
            {duplicateLicenseError && !formErrors.licensePlate && (
              <p className="text-red-500 text-xs mb-2">{error}</p>
            )}
          </div>
        )}
        {/* Add Car Form */}
        {isVip && (
          <div className="mt-[3rem]">
            <label className="block text-sm font-medium mb-2">
              หมายเลขโทรศัพท์
            </label>
            <input
              type="tel"
              placeholder="กรอกเบอร์ติดต่อ"
              value={phoneNumber}
              className="mb-4 w-full border p-2 rounded"
              readOnly
            />

            {showAddCar && (
              <>
                <label className="block text-sm font-medium mb-2">
                  เลขทะเบียนรถ
                </label>
                <input
                  type="text"
                  placeholder="กรอกเลขทะเบียน"
                  {...registerLicensePlate("licensePlate")}
                  className={`mb-1 w-full border p-2 rounded ${
                    licensePlateErrors.licensePlate || duplicateLicenseError
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {licensePlateErrors.licensePlate && (
                  <p className="text-red-500 text-xs mb-2">
                    {licensePlateErrors.licensePlate.message}
                  </p>
                )}
                {duplicateLicenseError && !licensePlateErrors.licensePlate && (
                  <p className="text-red-500 text-xs mb-2">{error}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Fixed bottom buttons section - เปลี่ยนจาก absolute เป็น fixed */}
      <div className="flex flex-col justify-center items-center space-y-4 w-full fixed bottom-0 p-5 border-t-[0.5px] border-gray-300 bg-white">
        {!showMoreFields && !isVip && (
          <form onSubmit={handleSubmitPhone(checkPhone)} className="w-full">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-3xl h-[44px] text-white mb-4"
            >
              ถัดไป
            </button>
          </form>
        )}

        {showMoreFields && !isVip && (
          <form onSubmit={handleSubmitForm(registerMember)} className="w-full">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-3xl h-[44px] text-white mb-4"
            >
              สมัครสมาชิก
            </button>
          </form>
        )}

        {isVip && (
          <form
            onSubmit={handleSubmitLicensePlate(addCarToVip)}
            className="w-full"
          >
            {showAddCar ? (
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-3xl h-[44px] text-white mb-4"
              >
                ยืนยัน
              </button>
            ) : (
              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-3xl h-[44px] text-white mb-4"
                onClick={() => setShowAddCar(true)}
              >
                เพิ่มรถ
              </button>
            )}
          </form>
        )}

        {showMoreFields && !isVip ? (
          <button
            onClick={handleBackToPhoneForm}
            className="w-full text-blue-600 text-sm font-medium"
          >
            ย้อนกลับ
          </button>
        ) : (
          <button
            onClick={handleBackToDetails}
            className="w-full text-blue-600 text-sm font-medium"
          >
            กลับไปหน้ารายละเอียด
          </button>
        )}
      </div>

      {/* Modal for showing registered cars */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white p-6 rounded-t-lg w-full">
            <div className="w-full flex justify-end">
              <button onClick={() => setShowModal(false)}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>
            <h3 className="text-sm font-medium mb-3">เลขทะเบียนที่สมัครแล้ว</h3>
            <div className="mb-4">
              {vipCars.length > 0 ? (
                <div className="space-y-2">
                  {vipCars.map((car, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between mb-1">
                        <p className="text-sm">เลขทะเบียน</p>
                        <p className="text-blue-600 text-sm">
                          {car.license_plate}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-500">สถานะ:</p>
                        {!car.is_expired ? (
                          <span className="text-green-500 text-sm">
                            ใช้งานได้
                          </span>
                        ) : (
                          <span className="text-red-500 text-sm">หมดอายุ</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">ไม่พบข้อมูลรถที่ลงทะเบียน</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && !duplicateLicenseError && (
        <div className="fixed bottom-32 left-0 right-0 flex justify-center">
          {" "}
          {/* ปรับตำแหน่งให้สูงขึ้นจาก bottom-20 เป็น bottom-32 */}
          <p className="text-red-500 text-sm bg-white px-4 py-2 rounded-lg shadow">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
