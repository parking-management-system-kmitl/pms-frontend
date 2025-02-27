import React, { useState, useEffect } from "react";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";

const CarRegisEditModal = ({
  isOpen,
  onClose,
  vipId,
  carData,
  setCarData,
  fetchVipData,
}) => {
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState("");
  const [licensePlates, setLicensePlates] = useState({});

  // Initialize licensePlates when modal opens with new car data
  useEffect(() => {
    if (isOpen && carData.length > 0) {
      const initialLicensePlates = {};
      carData.forEach((car) => {
        initialLicensePlates[car.car_id] = car.licenseplate;
      });
      setLicensePlates(initialLicensePlates);
    }
  }, [isOpen, carData]);

  if (!isOpen) return null;

  const apiUrl = `${process.env.REACT_APP_API_URL}`;

  // Get authentication token from localStorage
  const token = localStorage.getItem("access_token");
  // Set up headers with token
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleDeleteCar = async (carId) => {
    try {
      const response = await axios.post(
        `${apiUrl}/member/unlink-car`,
        {
          car_id: carId,
        },
        { headers } // Add headers with token
      );

      if (response.data.success) {
        setCarData((prevData) =>
          prevData.filter((car) => car.car_id !== carId)
        );

        if (fetchVipData) {
          fetchVipData(1);
        }
        handleClose();
        setStatusMessage("ยกเลิกการเชื่อมต่อรถสำเร็จ!");
        setStatusType("success");

        // Close the modal after successful deletion
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      setStatusMessage("ไม่สามารถยกเลิกการเชื่อมต่อรถได้");
      setStatusType("error");
    }
  };

  const handleChangeLicensePlate = (carId, value) => {
    setLicensePlates({
      ...licensePlates,
      [carId]: value,
    });
  };

  const handleUpdateLicensePlate = async (car) => {
    const newLicensePlate = licensePlates[car.car_id];

    if (!newLicensePlate) {
      setStatusMessage("กรุณากรอกป้ายทะเบียนใหม่");
      setStatusType("error");
      return;
    }

    try {
      const response = await axios.put(
        `${apiUrl}/vip/updatelp/${car.car_id}`,
        {
          license_plate: newLicensePlate,
        },
        { headers } // Add headers with token
      );

      if (response.status === 200) {
        // Update the local state with the new license plate
        setCarData((prevData) =>
          prevData.map((c) =>
            c.car_id === car.car_id
              ? { ...c, licenseplate: newLicensePlate }
              : c
          )
        );

        // Fetch updated data using the fetchVipData function from ListVipTable
        if (fetchVipData) {
          fetchVipData(1); // Refresh data from the first page or current page
        }

        // Close the modal after successful update
        onClose();
      }
    } catch (error) {
      setStatusMessage("ไม่สามารถแก้ไขทะเบียนรถได้");
      setStatusType("error");
    }
  };

  const handleClose = () => {
    setStatusMessage(null);
    setStatusType("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-[779px]">
        <div className="w-full flex justify-end">
          <button onClick={handleClose}>
            <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
          </button>
        </div>

        {statusMessage && statusType === "error" ? (
          <div className="p-4 rounded-lg bg-red-100 text-red-700">
            {statusMessage}
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6">จัดการป้ายทะเบียน</h2>

            <div className="space-y-4">
              {carData.map((car) => (
                <div key={car.car_id}>
                  <div className="w-full mb-4">
                    <label className="block text-gray-700 mb-2">
                      เลขทะเบียน
                    </label>
                    <input
                      type="text"
                      value={licensePlates[car.car_id] || ""}
                      onChange={(e) =>
                        handleChangeLicensePlate(car.car_id, e.target.value)
                      }
                      placeholder="กรอกป้ายทะเบียน"
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div className="flex mt-3 justify-between gap-4">
                    <div
                      className="flex justify-center items-center gap-2 cursor-pointer"
                      onClick={() => handleDeleteCar(car.car_id)}
                    >
                      <TrashIcon className="w-5 h-5" />
                      <h2 className="text-black text-center">
                        ยกเลิกสมาชิก VIP
                      </h2>
                    </div>
                    <div className="flex gap-4">
                      <button
                        className="bg-gray-200 px-4 py-2 rounded-lg w-[150px] h-[49px]"
                        onClick={handleClose}
                      >
                        ยกเลิก
                      </button>
                      <button
                        className="bg-primary px-4 py-2 text-white rounded-lg w-[150px] h-[49px]"
                        onClick={() => handleUpdateLicensePlate(car)}
                      >
                        บันทึก
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CarRegisEditModal;
