import React, { useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

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
        setError("An error occurred while fetching discounts.");
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
        setDiscounts(discounts.filter((discount) => discount.id !== deleteData));
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
                  เวลาจอดฟรี (ชั่วโมง)
                </th>
                <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
                  ประเภทลูกค้า
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
              {discounts
                .slice((page - 1) * 10, page * 10)
                .map((discount) => (
                  <tr key={discount.id} className="border-b text-black text-sm font-thin">
                    <td className="px-4 py-3">{discount.title}</td>
                    <td className="px-4 py-3">
                      {discount.min_purchase} - {discount.max_purchase}
                    </td>
                    <td className="px-4 py-3">{discount.hours_granted}</td>
                    <td className="px-4 py-3">
                      {discount.customer_type === 1 ? "VIP" : "ทั่วไป"}
                    </td>
                    <td className="px-4 py-3">
                      {discount.is_active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
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
                onClick={() => setPage((prev) => (prev === 1 ? pageCount : prev - 1))}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((prev) => (prev === pageCount ? 1 : prev + 1))}
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
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">แก้ไขส่วนลด</h2>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium">ชื่อส่วนลด</label>
              <input
                type="text"
                id="title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="min_purchase" className="block text-sm font-medium">เงื่อนไขการซื้อ (บาท) - Min</label>
              <input
                type="number"
                id="min_purchase"
                value={editData.min_purchase}
                onChange={(e) => setEditData({ ...editData, min_purchase: e.target.value })}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="max_purchase" className="block text-sm font-medium">เงื่อนไขการซื้อ (บาท) - Max</label>
              <input
                type="number"
                id="max_purchase"
                value={editData.max_purchase}
                onChange={(e) => setEditData({ ...editData, max_purchase: e.target.value })}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="hours_granted" className="block text-sm font-medium">เวลาจอดฟรี (ชั่วโมง)</label>
              <input
                type="number"
                id="hours_granted"
                value={editData.hours_granted}
                onChange={(e) => setEditData({ ...editData, hours_granted: e.target.value })}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="customer_type" className="block text-sm font-medium">ประเภทลูกค้า</label>
              <select
                id="customer_type"
                value={editData.customer_type}
                onChange={(e) => setEditData({ ...editData, customer_type: parseInt(e.target.value) })}
                className="border border-gray-300 rounded p-2 w-full"
              >
                <option value={1}>VIP</option>
                <option value={2}>Regular</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="is_active" className="block text-sm font-medium">สถานะโปรโมชั่น</label>
              <select
                id="is_active"
                value={editData.is_active}
                onChange={(e) => setEditData({ ...editData, is_active: e.target.value === 'true' })}
                className="border border-gray-300 rounded p-2 w-full"
              >
                <option value={true}>เปิดใช้งาน</option>
                <option value={false}>ปิดใช้งาน</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEditPopup(false)} className="bg-gray-300 px-4 py-2 rounded-lg">ยกเลิก</button>
              <button onClick={handleSubmitEdit} className="bg-primary px-4 py-2 text-white rounded-lg">บันทึก</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup for adding a new discount */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">เพิ่มส่วนลดใหม่</h2>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium">ชื่อส่วนลด</label>
              <input
                type="text"
                id="title"
                value={newDiscount.title}
                onChange={(e) => setNewDiscount({ ...newDiscount, title: e.target.value })}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="min_purchase" className="block text-sm font-medium">เงื่อนไขการซื้อ (บาท) - Min</label>
              <input
                type="number"
                id="min_purchase"
                value={newDiscount.min_purchase}
                onChange={(e) => setNewDiscount({ ...newDiscount, min_purchase: e.target.value })}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="max_purchase" className="block text-sm font-medium">เงื่อนไขการซื้อ (บาท) - Max</label>
              <input
                type="number"
                id="max_purchase"
                value={newDiscount.max_purchase}
                onChange={(e) => setNewDiscount({ ...newDiscount, max_purchase: e.target.value })}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="hours_granted" className="block text-sm font-medium">เวลาจอดฟรี (ชั่วโมง)</label>
              <input
                type="number"
                id="hours_granted"
                value={newDiscount.hours_granted}
                onChange={(e) => setNewDiscount({ ...newDiscount, hours_granted: e.target.value })}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="customer_type" className="block text-sm font-medium">ประเภทลูกค้า</label>
              <select
                id="customer_type"
                value={newDiscount.customer_type}
                onChange={(e) => setNewDiscount({ ...newDiscount, customer_type: parseInt(e.target.value) })}
                className="border border-gray-300 rounded p-2 w-full"
              >
                <option value={1}>VIP</option>
                <option value={2}>ทั่วไป</option>
              </select>
            </div>
            <div className="mb-4 gap-3 flex justify-end ">
              <button onClick={handleAddDiscount} className="bg-primary px-4 py-2 text-white rounded-lg">เพิ่ม</button>
              <button onClick={() => setShowAddPopup(false)} className="bg-gray-300 px-4 py-2 rounded-lg">ยกเลิก</button>
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
              <button onClick={() => setShowDeletePopup(false)} className="bg-gray-300 px-4 py-2 rounded-lg">ยกเลิก</button>
              <button onClick={handleConfirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg">ลบ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListManageDiscountTable;
