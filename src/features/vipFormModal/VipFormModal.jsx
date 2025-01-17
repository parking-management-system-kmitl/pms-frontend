import React, { useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import vip from "../../assets/VIP.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    licensePlate: yup
      .string()
      .matches(/^[0-9ก-ฮ][ก-ฮ][ก-ฮ]? [0-9]{1,4}$/,"Lincese is incorrect pattern")
      .required("License plate is required"),
    tel: yup
      .string()
      .matches(/^[0-9]+$/, "Tel must be only digits")
      .min(10, "Tel must be at least 10 digits")
      .required("Tel is required"),
  })
  .required();




function VipFormModal({ isOpen, handleClose, vipId }) {

  const apiUrl = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    tel: "" 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegVip = async (e) => {
    e.preventDefault();
    try {
      console.log("start login");
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      // แสดงข้อมูล response ทั้งหมด
      const data = await response.json();

      if (response.ok && data.status === "success") {
        
        
      } else {
        console.log("Regist failed");
      }



    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  



  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    if (vipId) {
      console.log("update vip", vipId, data);
    } else {
      console.log("create vip", data);
    }
    reset();
    handleClose();
  };

  const onCloseModal = () => {
    handleClose();
    reset();
  };

  const onDelete = () => {
    console.log("delete", vipId);
    handleClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[779px]">
            <div className="w-full flex justify-end">
              <button onClick={() => onCloseModal()}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>

            <div
              className={`w-full flex flex-col justify-start ${
                vipId ? " items-start" : "items-center"
              }`}
            >
              {vipId ? null : (
                <img src={vip} alt="vip" className="w-[180px] h-[180px]" />
              )}

              <h2 className="text-3xl font-bold">
                {vipId ? "รายละเอียดสมาชิก VIP" : "สมัครสมาชิก VIP"}{" "}
                {/*vipId ? 'มีid(หน้าedit)' : 'ไม่มีid(หน้าสมัคร)'*/}
              </h2>
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex justify-between gap-6">
                <div className="w-full">
                  <label className="block text-gray-700 mb-2">ชื่อ</label>
                  <input
                    {...register("firstName")}
                    type="text"
                    id="fname"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    
                    placeholder="ชื่อภาษาไทย"
                    className="w-full border p-2 rounded"
                  />
                  {errors.firstName && (
                    <span className=" text-xs text-error">
                      {errors.firstName.message}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-gray-700 mb-2">นามสกุล</label>
                  <input
                    {...register("lastName")}
                    type="text"
                    id="lname"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    
                    placeholder="นามสกุลภาษาไทย"
                    className="w-full border p-2 rounded"
                  />
                  {errors.lastName && (
                    <span className=" text-xs text-error">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">เลขทะเบียนรถ</label>
                <input
                  {...register("licensePlate")}
                  type="text"
                  placeholder="กรอกเลขทะเบียน"
                  className="w-full border p-2 rounded"
                />
                {errors.licensePlate && (
                  <span className=" text-xs text-error">
                    {errors.licensePlate.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">เบอร์ติดต่อ</label>
                <input
                  {...register("tel")}
                  type="text"
                  placeholder="กรอกเบอร์ติดต่อ"
                  className="w-full border p-2 rounded"
                />
                {errors.tel && (
                  <span className=" text-xs text-error">
                    {errors.tel.message}
                  </span>
                )}
              </div>
            </div>

            <div
              className={`mt-6 flex gap-4 ${
                vipId ? "justify-between" : "justify-end"
              }`}
            >
              {vipId ? (
                <button
                  className=" flex gap-1 justify-center items-center py-2 text-black rounded-lg hover:text-red-500"
                  onClick={() => onDelete()}
                >
                  <TrashIcon className=" w-5 h-5" />
                  <p className=" text-base">ยกเลิกสมาชิก VIP</p>
                </button>
              ) : null}

              <div className="flex gap-4 items-center">
                <button
                  className="bg-gray-400 px-4 py-2 text-white rounded-lg"
                  onClick={() => onCloseModal()}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  className={`px-4 py-2 text-white rounded-lg ${
                    isDirty ? "bg-primary" : "bg-gray-400"
                  }`}
                  disabled={!isDirty}
                >
                  สมัครสมาชิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VipFormModal;
