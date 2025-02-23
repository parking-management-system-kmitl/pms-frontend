import React, { useState } from "react";
import axios from "axios";
import { XCircleIcon } from "@heroicons/react/24/outline";

const CarRegisEditModal = ({ isOpen, onClose, vipId, carData, setCarData }) => {
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [newLicensePlate, setNewLicensePlate] = useState("");
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  if (!isOpen) return null;

  const apiUrl = `${process.env.REACT_APP_API_URL}`;

  const handleDeleteCar = async (carId) => {
    try {
      const response = await axios.post(`${apiUrl}/member/unlink-car`, {
        car_id: carId,
      });

      if (response.data.success) {
        // Update local state to remove the unlinked car
        setCarData((prevData) =>
          prevData.filter((car) => car.car_id !== carId)
        );
        setStatusMessage("ยกเลิกการเชื่อมต่อรถสำเร็จ!");
        setStatusType("success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      setStatusMessage("ไม่สามารถยกเลิกการเชื่อมต่อรถได้");
      setStatusType("error");
    }
  };

  const handleEditCar = async () => {
    if (!newLicensePlate) {
      setStatusMessage("กรุณากรอกป้ายทะเบียนใหม่");
      setStatusType("error");
      return;
    }

    try {
      const response = await axios.put(
        `${apiUrl}/vip/updatelp/${selectedCar.car_id}`,
        {
          license_plate: newLicensePlate,
        }
      );

      if (response.status === 200) {
        // Update the local state with the new license plate
        setCarData((prevData) =>
          prevData.map((car) =>
            car.car_id === selectedCar.car_id
              ? { ...car, licenseplate: newLicensePlate }
              : car
          )
        );
        setStatusMessage("แก้ไขทะเบียนรถสำเร็จ!");
        setStatusType("success");
        setEditModalOpen(false);
        setSelectedCar(null);
        setNewLicensePlate("");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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
            <h2 className="text-3xl font-bold mb-6">จัดการทะเบียนรถ</h2>

            <div className="space-y-4">
              {carData.length > 0 ? (
                carData.map((car) => (
                  <div
                    key={car.car_id}
                    className="flex justify-between items-center border-b py-3"
                  >
                    <span>{car.licenseplate}</span>
                    <div className="flex gap-6">
                      <button
                        className="text-blue-500"
                        onClick={() => {
                          setSelectedCar(car);
                          setEditModalOpen(true);
                        }}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => {
                          setSelectedCar(car);
                          setConfirmDeleteModalOpen(true);
                        }}
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>ไม่มีทะเบียนรถ</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Edit License Plate Modal */}
      {editModalOpen && selectedCar && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[400px]">
            <h3 className="text-xl font-bold mb-4">แก้ไขทะเบียนรถ</h3>
            <div className="space-y-4">
              <p>ทะเบียนเดิม: {selectedCar.licenseplate}</p>
              <input
                type="text"
                value={newLicensePlate}
                onChange={(e) => setNewLicensePlate(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="กรอกป้ายทะเบียนใหม่"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onClick={() => setEditModalOpen(false)}
              >
                ยกเลิก
              </button>
              <button
                className="bg-primary px-4 py-2 text-white rounded-lg"
                onClick={handleEditCar}
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteModalOpen && selectedCar && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[400px]">
            <h3 className="text-xl font-bold mb-4">
              ยืนยันการยกเลิกการเชื่อมต่อรถ
            </h3>
            <p>
              คุณต้องการยกเลิกการเชื่อมต่อรถทะเบียน {selectedCar.licenseplate}{" "}
              หรือไม่?
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onClick={() => setConfirmDeleteModalOpen(false)}
              >
                ยกเลิก
              </button>
              <button
                className="bg-red-500 px-4 py-2 text-white rounded-lg"
                onClick={() => {
                  handleDeleteCar(selectedCar.car_id);
                  setConfirmDeleteModalOpen(false);
                }}
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarRegisEditModal;
