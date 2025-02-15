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
    free_hours: "",
    customer_type: "REGULAR",
    is_active: true,
  });

  const displayValue =
    editData.free_hours === 0 ? "" : editData.free_hours.toString();

  const handleEditClick = (discount) => {
    setEditData({
      id: discount.discount_id,
      title: discount.title,
      min_purchase: discount.min_purchase,
      max_purchase: discount.max_purchase,
      free_hours: discount.free_hours,
      customer_type: discount.customer_type,
      is_active: discount.is_active,
    });
    setShowEditPopup(true);
  };

  const [newDiscount, setNewDiscount] = useState({
    title: "",
    customer_type: "GENERAL", // Changed from number to string
    min_purchase: "",
    max_purchase: "",
    free_hours: "", // Changed from hours_granted
    is_active: true,
  });

  useEffect(() => {
    const fetchDiscounts = async () => {
      const apiUrl = `${process.env.REACT_APP_API_URL}/configuration/discounts`;
      try {
        setIsLoading(true);
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.status === 200 && Array.isArray(data.data)) {
          setDiscounts(data.data);
        } else {
          setError("Failed to fetch discounts.");
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
    const discount = discounts.find((d) => d.discount_id === discountId);
    if (!discount) return;

    const apiUrl = `${process.env.REACT_APP_API_URL}/configuration/discounts/${discountId}`;
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...discount,
          is_active: !discount.is_active,
        }),
      });
      const data = await response.json();
      if (data.status === 200) {
        const updatedDiscounts = discounts.map((d) =>
          d.discount_id === discountId ? data.data : d
        );
        setDiscounts(updatedDiscounts);
      } else {
        console.error("Failed to toggle discount status");
      }
    } catch (error) {
      console.error("Error toggling discount status:", error);
    }
  };

  const handleSubmitEdit = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/configuration/discounts/${editData.id}`;
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editData.title,
          customer_type: editData.customer_type,
          min_purchase: editData.min_purchase,
          max_purchase: editData.max_purchase,
          free_hours: Number(editData.free_hours),
          is_active: editData.is_active,
        }),
      });
      const data = await response.json();
      if (data.status === 200) {
        const updatedDiscounts = discounts.map((discount) =>
          discount.discount_id === editData.id ? data.data : discount
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
    const apiUrl = `${process.env.REACT_APP_API_URL}/configuration/discounts`;

    // ข้อมูลที่จะส่งไป
    const requestBody = {
      title: newDiscount.title,
      customer_type: newDiscount.customer_type,
      min_purchase: Number(newDiscount.min_purchase),
      max_purchase: Number(newDiscount.max_purchase),
      free_hours: Number(newDiscount.free_hours),
      is_active: true,
    };

    // แสดงข้อมูลที่จะส่งไปใน console
    console.log("Data to be sent:", requestBody);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // ส่งข้อมูลไปยัง API
      });

      const data = await response.json();
      console.log("Response from server:", data); // แสดงข้อมูลที่ได้รับกลับมาจากเซิร์ฟเวอร์

      if (data.status === 201) {
        setDiscounts([...discounts, data.data]);
        setShowAddPopup(false);
        setNewDiscount({
          title: "",
          customer_type: "REGULAR",
          min_purchase: "",
          max_purchase: "",
          free_hours: "",
          is_active: true,
        });
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
    const apiUrl = `${process.env.REACT_APP_API_URL}/configuration/discounts/${deleteData}`;
    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setDiscounts(
          discounts.filter((discount) => discount.discount_id !== deleteData)
        );
        setShowDeletePopup(false);
      } else {
        console.error("Failed to delete discount");
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
                  key={discount.discount_id}
                  className="border-b text-black text-sm font-thin"
                >
                  <td className="px-4 py-3">{discount.title}</td>
                  <td className="px-4 py-3">
                    {discount.min_purchase.toLocaleString()} -{" "}
                    {discount.max_purchase.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{discount.free_hours}</td>
                  <td className="px-4 py-3">
                    {discount.customer_type === "VIP"
                      ? "VIP"
                      : discount.customer_type === "GENERAL"
                      ? "ทั่วไป"
                      : "ทั้งหมด"}
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
                          handleToggleStatus(discount.discount_id)
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
                    <button
                      onClick={() => handleDeleteClick(discount.discount_id)}
                    >
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
            <h2 className="text-3xl font-medium mb-4">รายละเอียดส่วนลด</h2>
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
                        customer_type: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded p-2 w-full h-[48px] appearance-none pr-8"
                  >
                    <option value="VIP">VIP</option>
                    <option value="GENERAL">ทั่วไป</option>
                    <option value="ALL">ทั้งหมด</option>
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
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="mb-4 w-full">
                <label
                  htmlFor="free_hours"
                  className="block text-sm font-medium mb-1"
                >
                  ส่วนลดค่าจอด (ชม.)
                </label>
                <input
                  type="number"
                  id="free_hours"
                  value={displayValue}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : Number(e.target.value);
                    setEditData({ ...editData, free_hours: value });
                  }}
                  className="border border-gray-300 rounded p-2 w-full h-[48px]"
                />
              </div>
            </div>
            {/* Rest of the form remains the same */}
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
                    setEditData({
                      ...editData,
                      min_purchase: Number(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
                <h2 className="text-sm font-medium"> ถึง </h2>
                <input
                  type="number"
                  id="max_purchase"
                  value={editData.max_purchase}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      max_purchase: Number(e.target.value),
                    })
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
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-6">
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
            <h2 className="text-3xl font-medium mb-4">รายละเอียดส่วนลด</h2>
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
                        customer_type: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded p-2 w-full h-[48px] appearance-none pr-8"
                  >
                    <option value="VIP">VIP</option>
                    <option value="GENERAL">ทั่วไป</option>
                    <option value="ALL">ทั้งหมด</option>
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
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="mb-4 w-full">
                <label
                  htmlFor="free_hours"
                  className="block text-sm font-medium mb-1"
                >
                  ส่วนลดค่าจอด (ชม.)
                </label>
                <input
                  type="number"
                  id="free_hours"
                  value={newDiscount.free_hours}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      free_hours: Number(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded p-2 w-full h-[48px]"
                />
              </div>
            </div>
            <div className="mb-6">
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
                      min_purchase: Number(e.target.value),
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
                      max_purchase: Number(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
            </div>
            <div className="mb-4 gap-6 flex justify-end">
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
