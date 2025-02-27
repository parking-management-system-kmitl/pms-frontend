import React, { useState, useEffect } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/solid";
import alertIcon from "../../assets/Alert_Icon.png"; // Make sure this path is correct

function ListManageFeeTable() {
  const [page, setPage] = useState(1);
  const [parkingRates, setParkingRates] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    hours: "",
    rate_at_hour: "",
  });
  const [isEditingCondition, setIsEditingCondition] = useState(false);

  // Add delete confirmation modal state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  // Parking options state variables
  const [parkingOptions, setParkingOptions] = useState({
    parking_option_id: "",
    note_description: "",
    minute_rounding_threshold: 0,
    exit_buffer_time: 0,
  });

  const [tempCondition, setTempCondition] = useState(
    parkingOptions.note_description
  );

  // Temporary state variables
  const [tempMinuteRounding, setTempMinuteRounding] = useState("");
  const [tempExitBuffer, setTempExitBuffer] = useState("");

  // New state for adding parking rate
  const [newParkingRate, setNewParkingRate] = useState({
    hours: "",
    rate_at_hour: "",
  });

  // Modified: Changed items per page from 10 to 5
  const itemsPerPage = 5;

  // Get authentication token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch parking options data
  useEffect(() => {
    const fetchParkingOptions = async () => {
      const apiUrl = `${process.env.REACT_APP_API_URL}/configuration/options`;
      try {
        const response = await fetch(apiUrl, {
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (data.status === 200) {
          const updatedData = {
            ...data.data,
            minute_rounding_threshold: parseInt(
              data.data.minute_rounding_threshold,
              10
            ),
            exit_buffer_time: parseInt(data.data.exit_buffer_time, 10),
          };

          setParkingOptions(updatedData);
          setTempCondition(data.data.note_description);
        }
      } catch (error) {
        console.error("Error fetching parking options:", error);
      }
    };

    fetchParkingOptions();
  }, []);

  // Fetch parking rates data
  useEffect(() => {
    const fetchParkingRates = async () => {
      const apiUrl = `${process.env.REACT_APP_API_URL}/configuration/rates`;
      try {
        const response = await fetch(apiUrl, {
          headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (data.status === 200 && Array.isArray(data.data)) {
          setParkingRates(data.data);
        }
      } catch (error) {
        console.error("Error fetching parking rates:", error);
      }
    };

    fetchParkingRates();
  }, []);

  const getPaginationText = () => {
    const totalPages = Math.ceil(parkingRates.length / itemsPerPage);
    return `หน้า ${page} จาก ${totalPages}`;
  };

  const pageCount = Math.ceil(parkingRates.length / itemsPerPage);

  const handleUpdateParkingOptions = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/configuration/options/${parkingOptions.parking_option_id}`;
    const requestBody = {
      note_description: tempCondition,
      minute_rounding_threshold: parseInt(tempMinuteRounding, 10),
      exit_buffer_time: parseInt(tempExitBuffer, 10),
    };

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.status === 200) {
        const updatedData = {
          ...data.data,
          minute_rounding_threshold: parseInt(
            data.data.minute_rounding_threshold,
            10
          ),
          exit_buffer_time: parseInt(data.data.exit_buffer_time, 10),
        };

        setParkingOptions(updatedData);
        setTempCondition(data.data.note_description);
        setIsEditingCondition(false);
      } else {
        console.error("Failed to update parking options:", data.message);
      }
    } catch (error) {
      console.error("Error updating parking options:", error);
    }
  };

  const handleEditClick = (row) => {
    setEditData({
      hours: row.hours,
      rate_at_hour: row.rate_at_hour,
    });
    setShowPopup(true);
  };

  const handleAddClick = () => {
    setAddPopup(true);
  };

  const handleSubmitAdd = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/configuration/rates`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newParkingRate),
      });
      const data = await response.json();
      if (data.status === 201) {
        setParkingRates([...parkingRates, data.data]);
        setAddPopup(false);
        setNewParkingRate({ hours: "", rate_at_hour: "" }); // Reset form
      } else {
        console.error("Failed to add parking rate:", data.message);
      }
    } catch (error) {
      console.error("Error adding parking rate:", error);
    }
  };

  const handleSubmitEdit = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/configuration/rates/${editData.hours}`;
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ rate_at_hour: editData.rate_at_hour }),
      });

      const data = await response.json();
      if (data.status === 200) {
        const updatedRates = parkingRates.map((rate) =>
          rate.hours === editData.hours
            ? { ...rate, rate_at_hour: data.data.rate_at_hour }
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

  // Modified: Separate click and confirm functions for delete
  const handleDeleteClick = (hours) => {
    setDeleteData(hours);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/configuration/rates/${deleteData}`;
    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (data.status === 200) {
        const updatedRates = parkingRates.filter(
          (rate) => rate.hours !== deleteData
        );
        setParkingRates(updatedRates);

        const newPageCount = Math.ceil(updatedRates.length / itemsPerPage);
        if (page > newPageCount && newPageCount > 0) {
          setPage(newPageCount);
        }
        
        setShowDeletePopup(false);
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
          className="bg-primary rounded-lg px-7 py-2 text-white w-[216px]"
        >
          เพิ่มค่าจอดรถ
        </button>
      </div>

      <div className="flex flex-col gap-y-4 mb-6">
        {isEditingCondition && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[779px]">
              <div className="w-full flex justify-end">
                <button onClick={() => setIsEditingCondition(false)}>
                  <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
                </button>
              </div>
              <h2 className="text-3xl font-medium mb-4">เงื่อนไขค่าจอดรถ</h2>
              <div className="flex justify-between gap-6 mb-2">
                <div className="mb-4 w-full">
                  <label className="block text-sm font-medium mb-1">
                    นาทีที่ปัดเศษ (นาที)
                  </label>
                  <input
                    type="number"
                    value={tempMinuteRounding}
                    onChange={(e) => setTempMinuteRounding(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    placeholder={parkingOptions.minute_rounding_threshold.toString()}
                  />
                </div>
                <div className="mb-4 w-full">
                  <label className="block text-sm font-medium mb-1">
                    ระยะเวลาออกหลังชำระเงิน (นาที)
                  </label>
                  <input
                    type="number"
                    value={tempExitBuffer}
                    onChange={(e) => setTempExitBuffer(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    placeholder={parkingOptions.exit_buffer_time.toString()}
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
                  onClick={handleUpdateParkingOptions}
                  className="bg-primary px-4 py-2 text-white rounded-lg w-[150px] h-[49px]"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-y-4 mb-6">
          <div className="flex gap-2">
            <h3 className="flex text-lg font-medium">เงื่อนไขค่าจอดรถ :</h3>
            <button
              onClick={() => {
                setIsEditingCondition(true);
                setTempMinuteRounding(
                  parkingOptions.minute_rounding_threshold.toString()
                );
                setTempExitBuffer(parkingOptions.exit_buffer_time.toString());
                setTempCondition(parkingOptions.note_description);
              }}
            >
              <PencilSquareIcon className="w-5 h-5 text-primary" />
            </button>
          </div>
          <div className="ml-4 space-y-2">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <span className="text-sm font-medium">นาทีที่ปัดเศษ:</span>
                <span className="text-sm ml-2">
                  {parkingOptions.minute_rounding_threshold} นาที
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">
                  ระยะเวลาออกหลังชำระเงิน:
                </span>
                <span className="text-sm ml-2">
                  {parkingOptions.exit_buffer_time} นาที
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">หมายเหตุ:</span>
                <span className="text-sm ml-2">
                  {parkingOptions.note_description}
                </span>
              </div>
            </div>
          </div>
        </div>
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
            <th className="border-b bg-blue-200 px-4 py-3 text-right text-black text-sm font-bold pr-7">
              การจัดการ
            </th>
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {parkingRates
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((row) => (
              <tr
                key={row.hours}
                className="border-b text-black text-sm font-thin"
              >
                <td className="px-4 py-3">{row.hours}</td>
                <td className="px-4 py-3">{row.rate_at_hour}</td>
                <td className="flex px-4 py-3 justify-end gap-5 pr-8">
                  <button onClick={() => handleEditClick(row)}>
                    <PencilSquareIcon className="w-5 h-5 text-primary" />
                  </button>
                  <button onClick={() => handleDeleteClick(row.hours)}>
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
            <h2 className="text-3xl font-medium mb-4">
              จัดการอัตราค่าบริการจอดรถ
            </h2>
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium mb-1">
                ชั่วโมงที่จอด (ชม.)
              </label>
              <div className="border border-gray-300 rounded p-2 w-full bg-gray-100">
                {editData.hours}
              </div>
            </div>
            <div className="mb-6 w-full">
              <label
                htmlFor="rate_at_hour"
                className="block text-sm font-medium mb-1"
              >
                อัตราค่าบริการ (บาท/ชั่วโมง)
              </label>
              <input
                type="number"
                id="rate_at_hour"
                value={editData.rate_at_hour}
                onChange={(e) =>
                  setEditData({ ...editData, rate_at_hour: e.target.value })
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
            <h2 className="text-3xl font-medium mb-4">เพิ่มค่าจอดรถ</h2>
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
                htmlFor="rate_at_hour"
                className="block text-sm font-medium mb-1"
              >
                อัตราค่าบริการ (บาท/ชั่วโมง)
              </label>
              <input
                type="number"
                id="rate_at_hour"
                value={newParkingRate.rate_at_hour}
                onChange={(e) =>
                  setNewParkingRate({
                    ...newParkingRate,
                    rate_at_hour: e.target.value,
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

      {/* Delete confirmation popup - Added this section */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <div className="flex flex-col justify-center items-center">
              <img className="w-[120px] h-[120px] mb-6 mt-6" src={alertIcon} alt="alert-icon" />
              <p className="text-2xl font-medium">
                คุณต้องการที่จะลบรายการนี้?
              </p>
            </div>
            <div className="flex justify-center gap-6 mt-6 mb-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg w-[150px] h-[49px]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-[150px] h-[49px]"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end items-center mt-4 gap-6">
        <p className="text-sm font-thin">{getPaginationText()}</p>
        <div className="flex gap-3">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            className={page === 1 ? "text-gray-400 " : "text-black"}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === pageCount}
            className={page === pageCount ? "text-gray-400 " : "text-black"}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListManageFeeTable;