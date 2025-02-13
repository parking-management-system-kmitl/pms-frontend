import React, { useState, useEffect } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/solid";

function LlistManageFeeTable() {
  const [page, setPage] = useState(1);
  const [parkingRates, setParkingRates] = useState([]);
  const [manageFeeId, setManageFeeId] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [addPopup, setAddPopup] = useState(false); // New state for the add modal
  const [editData, setEditData] = useState({
    id: "",
    hours: "",
    rate_per_hour: "",
  });
  const [newFeeCondition, setNewFeeCondition] = useState(
    "จอดฟรี 2 ชม. แรก ชั่วโมงต่อไป ชั่วโมงละ 30 บาท ชั่วโมงที่ 7 ขึ้นไป คิดชั่วโมงละ 60 บาท"
  );
  const [isEditingCondition, setIsEditingCondition] = useState(false);
  const [tempCondition, setTempCondition] = useState(newFeeCondition);

  // New state for adding parking rate
  const [newParkingRate, setNewParkingRate] = useState({
    hours: "",
    rate_per_hour: "",
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchParkingRates = async () => {
      const apiUrl = `${process.env.REACT_APP_API_URL}/parking-rates/list`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.status === "success") {
          setParkingRates(data.data);
        }
      } catch (error) {
        console.error("Error fetching parking rates:", error);
      }
    };

    fetchParkingRates();
  }, []);

  const getCurrentRowRange = () => {
    const startRange = (page - 1) * 10 + 1;
    const endRange = Math.min(page * 10, parkingRates.length);
    return `${startRange}-${endRange} of ${parkingRates.length}`;
  };

  const pageCount = Math.ceil(parkingRates.length / 10);

  const handleEditClick = (row) => {
    setEditData({
      id: row.id,
      hours: row.hours,
      rate_per_hour: row.rate_per_hour,
    });
    setShowPopup(true);
  };

  const handleAddClick = () => {
    setAddPopup(true); // Open the add modal
  };

  const handleSubmitEdit = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/parking-rates/update`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });
      const data = await response.json();
      if (data.status === "success") {
        const updatedRates = parkingRates.map((rate) =>
          rate.id === editData.id
            ? {
                ...rate,
                hours: editData.hours,
                rate_per_hour: editData.rate_per_hour,
              }
            : rate
        );
        setParkingRates(updatedRates);
        setShowPopup(false);
      } else {
        console.error("Failed to update parking rate:", data.message);
      }
    } catch (error) {
      console.error("Error updating parking rate:", error);
    }
  };

  const handleSubmitAdd = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/parking-rates/create`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newParkingRate),
      });
      const data = await response.json();
      if (data.status === "success") {
        setParkingRates([...parkingRates, data.data]); // Add the new rate to the list
        setAddPopup(false); // Close the add modal
      } else {
        console.error("Failed to add parking rate:", data.message);
      }
    } catch (error) {
      console.error("Error adding parking rate:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/parking-rates/delete`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.status === "success") {
        // Filter out the deleted rate from the parkingRates array
        const updatedRates = parkingRates.filter((rate) => rate.id !== id);
        setParkingRates(updatedRates);
      } else {
        console.error("Failed to delete parking rate:", data.message);
      }
    } catch (error) {
      console.error("Error deleting parking rate:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">จัดการอัตราค่าบริการจอดรถ</h1>
        <button
          onClick={handleAddClick}
          className="bg-primary rounded-lg px-7 py-2 text-white"
        >
          เพิ่มค่าจอดรถ
        </button>
      </div>

      <div className="flex flex-col gap-y-4 mb-6">
        <div className="flex gap-2">
          <h3 className="flex text-lg">เงื่อนไขค่าจอดรถ :</h3>
          <button onClick={() => setIsEditingCondition(true)}>
            <PencilSquareIcon className="w-5 h-5 text-primary" />
          </button>
        </div>
        {isEditingCondition ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[779px]">
              <div className="w-full flex justify-end">
                <button onClick={() => setIsEditingCondition(false)}>
                  <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
                </button>
              </div>
              <h2 className="text-3xl font-medium mb-4">เงื่อนไขต่างๆ</h2>
              <div className="flex justify-between gap-6 mb-2">
                <div className="mb-4 w-full">
                  <label className="block text-sm font-medium mb-1">
                    นาทีที่ปัดเศษ (นาที)
                  </label>
                  <input
                    type="number"
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
                <div className="mb-4 w-full">
                  <label className="block text-sm font-medium mb-1">
                    ระยะเวลาออกหลังชำระเงิน (นาที)
                  </label>
                  <input
                    type="number"
                    className="border border-gray-300 rounded p-2 w-full"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="feeCondition"
                  className="block text-sm font-medium mb-1"
                >
                  หมายเหตุ
                </label>
                <textarea
                  id="feeCondition"
                  value={tempCondition}
                  onChange={(e) => setTempCondition(e.target.value)}
                  className="border border-gray-300 rounded p-3 w-full h-[48px] pl-4 flex items-center"
                />
              </div>
              <div className="flex justify-end gap-6">
                <button
                  onClick={() => setIsEditingCondition(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg w-[150px] h-[49px]"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    setNewFeeCondition(tempCondition);
                    setIsEditingCondition(false);
                  }}
                  className="bg-primary px-4 py-2 text-white rounded-lg w-[150px] h-[49px]"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm ml-4">{newFeeCondition}</p>
        )}
      </div>

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-blue-100">
            <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
              ชั่วโมง
            </th>
            <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
              อัตราค่าบริการ (บาท/ชั่วโมง)
            </th>
            <th className="border-b bg-blue-200 px-4 py-3 text-right text-black text-sm font-bold">
              แก้ไข/ลบข้อมูล
            </th>
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {parkingRates.slice((page - 1) * 10, page * 10).map((row) => (
            <tr key={row.id} className="border-b text-black text-sm font-thin">
              <td className="px-4 py-3">{row.hours}</td>
              <td className="px-4 py-3">{row.rate_per_hour}</td>
              <td className="flex px-4 py-3 justify-end gap-5 pr-8">
                <button onClick={() => handleEditClick(row)}>
                  <PencilSquareIcon className="w-5 h-5 text-primary" />
                </button>
                <button onClick={() => handleDeleteClick(row.id)}>
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup for editing parking rate */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[779px]">
            <div className="w-full flex justify-end">
              <button onClick={() => setShowPopup(false)}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>
            <h2 className="text-3xl font-medium mb-4">รายละเอียดค่าจอดรถ</h2>
            <div className="mb-4 w-full">
              <label htmlFor="hours" className="block text-sm font-medium mb-1">
                ชั่วโมงที่จอด (ชม.)
              </label>
              <input
                type="number"
                id="hours"
                value={editData.hours}
                onChange={(e) =>
                  setEditData({ ...editData, hours: e.target.value })
                }
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-6 w-full">
              <label
                htmlFor="rate_per_hour"
                className="block text-sm font-medium mb-1"
              >
                อัตราค่าบริการ (บาท/ชั่วโมง)
              </label>
              <input
                type="number"
                id="rate_per_hour"
                value={editData.rate_per_hour}
                onChange={(e) =>
                  setEditData({ ...editData, rate_per_hour: e.target.value })
                }
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="flex justify-end gap-6">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg w-[150px] h-[49px]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmitEdit}
                className="bg-primary px-4 py-2 text-white rounded-lg w-[150px] h-[49px]"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for adding parking rate */}
      {addPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[779px]">
            <div className="w-full flex justify-end">
              <button onClick={() => setAddPopup(false)}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>
            <h2 className="text-3xl font-medium mb-4">รายละเอียดค่าจอดรถ</h2>
            <div className="mb-4">
              <label htmlFor="hours" className="block text-sm font-medium mb-1">
                ชั่วโมงที่จอด (ชม.)
              </label>
              <input
                type="number"
                id="hours"
                value={newParkingRate.hours}
                onChange={(e) =>
                  setNewParkingRate({
                    ...newParkingRate,
                    hours: e.target.value,
                  })
                }
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="rate_per_hour"
                className="block text-sm font-medium mb-1"
              >
                อัตราค่าจอดต่อชั่วโมง (บาท)
              </label>
              <input
                type="number"
                id="rate_per_hour"
                value={newParkingRate.rate_per_hour}
                onChange={(e) =>
                  setNewParkingRate({
                    ...newParkingRate,
                    rate_per_hour: e.target.value,
                  })
                }
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="flex justify-end gap-6">
              <button
                onClick={() => setAddPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg w-[150px] h-[49px]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmitAdd}
                className="bg-primary px-4 py-2 text-white rounded-lg w-[150px] h-[49px]"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end items-center mt-4 gap-6">
        <p className="text-sm font-thin">{getCurrentRowRange()}</p>
        <div className="flex gap-3">
          <button
            onClick={() =>
              setPage((prev) => (prev === 1 ? pageCount : prev - 1))
            }
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              setPage((prev) => (prev === pageCount ? 1 : prev + 1))
            }
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LlistManageFeeTable;
