import React, { useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/solid";
import "./ListManageDiscountTable.css";

function ListManageDiscountTable() {
  const [page, setPage] = useState(1);
  const [discounts, setDiscounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false); // New state for delete confirmation
  const [deleteData, setDeleteData] = useState(null); // Store discount id to delete
  const [editData, setEditData] = useState({
    id: "",
    title: "",
    min_purchase: "",
    max_purchase: "",
    hours_granted: "",
    customer_type: 1,
    is_active: true,
  });
  const [newDiscount, setNewDiscount] = useState({
    title: "",
    min_purchase: "",
    max_purchase: "",
    hours_granted: "",
    customer_type: 2,
  });

  useEffect(() => {
    const fetchDiscounts = async () => {
      const apiUrl = `${process.env.REACT_APP_API_URL}/parking-discounts/list`;
      try {
        setIsLoading(true);
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        if (data.status === "success") {
          setDiscounts(data.data);
        } else {
          setError(data.message || "Failed to fetch discounts.");
        }
      } catch (err) {
        setError("เกิดข้อผิดพลาดขณะพยายาม fetch ข้อมูล.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  const getCurrentRowRange = () => {
    const startRange = (page - 1) * 10 + 1;
    const endRange = Math.min(page * 10, discounts.length);
    return `${startRange}-${endRange} of ${discounts.length}`;
  };

  const pageCount = Math.ceil(discounts.length / 10);

  const handleToggleStatus = async (discountId) => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/parking-discounts/toggle-status`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: discountId }),
      });
      const data = await response.json();
      if (data.status === "success") {
        const updatedDiscounts = discounts.map((discount) =>
          discount.id === discountId
            ? { ...discount, is_active: data.data.is_active }
            : discount
        );
        setDiscounts(updatedDiscounts);
      } else {
        console.error(data.message || "Failed to toggle discount status");
      }
    } catch (error) {
      console.error("Error toggling discount status:", error);
    }
  };

  const handleEditClick = (discount) => {
    setEditData({
      id: discount.id,
      title: discount.title,
      min_purchase: discount.min_purchase,
      max_purchase: discount.max_purchase,
      hours_granted: discount.hours_granted,
      customer_type: discount.customer_type,
      is_active: discount.is_active,
    });
    setShowEditPopup(true);
  };

  const handleSubmitEdit = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/parking-discounts/update`;
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
        const updatedDiscounts = discounts.map((discount) =>
          discount.id === editData.id ? { ...discount, ...editData } : discount
        );
        setDiscounts(updatedDiscounts);
        setShowEditPopup(false);
      } else {
        console.error("Failed to update discount:", data.message);
      }
    } catch (error) {
      console.error("Error updating discount:", error);
    }
  };

  const handleAddDiscount = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/parking-discounts/create`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDiscount),
      });
      const data = await response.json();
      if (data.status === "success") {
        setDiscounts([...discounts, data.data]);
        setShowAddPopup(false);
      } else {
        console.error("Failed to add discount:", data.message);
      }
    } catch (error) {
      console.error("Error adding discount:", error);
    }
  };

  const handleDeleteClick = (discountId) => {
    setDeleteData(discountId);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/parking-discounts/delete`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteData }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setDiscounts(
          discounts.filter((discount) => discount.id !== deleteData)
        );
        setShowDeletePopup(false);
      } else {
        console.error("Failed to delete discount:", data.message);
      }
    } catch (error) {
      console.error("Error deleting discount:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">จัดการส่วนลด</h1>
        <button
          className="bg-primary rounded-lg px-7 py-2 text-white"
          onClick={() => setShowAddPopup(true)}
        >
          เพิ่มส่วนลด
        </button>
      </div>

      {isLoading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
                  ชื่อส่วนลด
                </th>
                <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
                  เงื่อนไขการซื้อ (บาท)
                </th>
                <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
                  ส่วนลดค่าจอด (ชม.)
                </th>
                <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
                  ประเภทผู้ใช้
                </th>
                <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
                  สถานะ
                </th>
                <th className="border-b bg-blue-200 px-4 py-3 text-right text-black text-sm font-bold pr-7">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="overflow-auto">
              {discounts.slice((page - 1) * 10, page * 10).map((discount) => (
                <tr
                  key={discount.id}
                  className="border-b text-black text-sm font-thin"
                >
                  <td className="px-4 py-3">{discount.title}</td>
                  <td className="px-4 py-3">
                    {discount.min_purchase} - {discount.max_purchase}
                  </td>
                  <td className="px-4 py-3">{discount.hours_granted}</td>
                  <td className="px-4 py-3">
                    {discount.customer_type === 1 ? "VIP" : "ทั่วไป"}
                  </td>
                  <td className="px-3 py-3">
                    <label className="inline-flex items-center cursor-pointer">
                      <span className="mr-2 text-sm font-medium">
                        {discount.is_active ? "" : ""}
                      </span>
                      <input
                        type="checkbox"
                        checked={discount.is_active}
                        onChange={() =>
                          handleToggleStatus(discount.id, discount.is_active)
                        }
                        className="toggle-checkbox"
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                  <td className="flex px-4 py-3 justify-end gap-5 pr-8">
                    <button onClick={() => handleEditClick(discount)}>
                      <PencilSquareIcon className="w-5 h-5 text-primary" />
                    </button>
                    <button onClick={() => handleDeleteClick(discount.id)}>
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
        </>
      )}

      {/* Popup for editing the discount */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[779px]">
            <div className="w-full flex justify-end">
              <button onClick={() => setShowEditPopup(false)}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>
            <h2 className="text-3xl font-bold mb-4">รายละเอียดส่วนลด</h2>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                รายการ
              </label>
              <input
                type="text"
                id="title"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="flex justify-between gap-6">
              <div className="mb-4 w-full">
                <label
                  htmlFor="customer_type"
                  className="block text-sm font-medium mb-1"
                >
                  ประเภทลูกค้า
                </label>
                <div className="relative">
                  <select
                    id="customer_type"
                    value={editData.customer_type}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        customer_type: parseInt(e.target.value),
                      })
                    }
                    className="border border-gray-300 rounded p-2 w-full h-[48px] appearance-none pr-8"
                  >
                    <option value={1}>VIP</option>
                    <option value={2}>Regular</option>
                  </select>
                  <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="mb-4 w-full">
                <label
                  htmlFor="hours_granted"
                  className="block text-sm font-medium mb-1"
                >
                  ส่วนลดค่าจอด (ชม.)
                </label>
                <input
                  type="number"
                  id="hours_granted"
                  value={editData.hours_granted}
                  onChange={(e) =>
                    setEditData({ ...editData, hours_granted: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full h-[48px]"
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="min_purchase"
                className="block text-sm font-medium mb-1"
              >
                ยอดค่าใช้จ่าย (บาท)
              </label>
              <div className="flex justify-between gap-6 items-center">
                <input
                  type="number"
                  id="min_purchase"
                  value={editData.min_purchase}
                  onChange={(e) =>
                    setEditData({ ...editData, min_purchase: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
                <h2 className="text-sm font-medium"> ถึง </h2>
                <input
                  type="number"
                  id="max_purchase"
                  value={editData.max_purchase}
                  onChange={(e) =>
                    setEditData({ ...editData, max_purchase: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
            </div>
            <div className="mb-5">
              <label htmlFor="is_active" className="block text-sm font-medium">
                สถานะโปรโมชั่น
              </label>
              <div className="relative">
                <select
                  id="is_active"
                  value={editData.is_active}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      is_active: e.target.value === "true",
                    })
                  }
                  className="border border-gray-300 rounded p-2 w-full h-[48px] appearance-none pr-8"
                >
                  <option value={true}>เปิดใช้งาน</option>
                  <option value={false}>ปิดใช้งาน</option>
                </select>
                <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditPopup(false)}
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

      {/* Popup for adding a new discount */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[779px]">
            <div className="w-full flex justify-end">
              <button onClick={() => setShowAddPopup(false)}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>
            <h2 className="text-3xl font-bold mb-4">รายละเอียดส่วนลด</h2>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                รายการ
              </label>
              <input
                type="text"
                id="title"
                value={newDiscount.title}
                onChange={(e) =>
                  setNewDiscount({ ...newDiscount, title: e.target.value })
                }
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="flex justify-between gap-6">
              <div className="mb-4 w-full">
                <label
                  htmlFor="customer_type"
                  className="block text-sm font-medium mb-1"
                >
                  ประเภทลูกค้า
                </label>
                <div className="relative">
                  <select
                    id="customer_type"
                    value={newDiscount.customer_type}
                    onChange={(e) =>
                      setNewDiscount({
                        ...newDiscount,
                        customer_type: parseInt(e.target.value),
                      })
                    }
                    className="border border-gray-300 rounded p-2 w-full h-[48px] appearance-none pr-8"
                  >
                    <option value={1}>VIP</option>
                    <option value={2}>ทั่วไป</option>
                  </select>
                  <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="mb-4 w-full">
                <label
                  htmlFor="hours_granted"
                  className="block text-sm font-medium mb-1"
                >
                  เวลาจอดฟรี (ชั่วโมง)
                </label>
                <input
                  type="number"
                  id="hours_granted"
                  value={newDiscount.hours_granted}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      hours_granted: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded p-2 w-full h-[48px]"
                />
              </div>
            </div>
            <div className="mb-5">
              <label
                htmlFor="min_purchase"
                className="block text-sm font-medium mb-1"
              >
                ยอดค่าใช้จ่าย (บาท)
              </label>
              <div className="flex justify-between gap-6 items-center">
                <input
                  type="number"
                  id="min_purchase"
                  value={newDiscount.min_purchase}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      min_purchase: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
                <h2 className="text-sm font-medium"> ถึง </h2>
                <input
                  type="number"
                  id="max_purchase"
                  value={newDiscount.max_purchase}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      max_purchase: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
            </div>
            <div className="mb-4 gap-3 flex justify-end ">
              <button
                onClick={() => setShowAddPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg w-[150px] h-[49px]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddDiscount}
                className="bg-primary px-4 py-2 text-white rounded-lg w-[150px] h-[49px]"
              >
                เพิ่ม
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">ยืนยันการลบ</h2>
            <p>คุณแน่ใจหรือไม่ที่จะลบส่วนลดนี้?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg w-[80px]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-[80px]"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListManageDiscountTable;
