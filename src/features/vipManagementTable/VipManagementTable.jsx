import React, { useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/solid";

function VIPPromotionsTable() {
  const [page, setPage] = useState(1);
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const [editData, setEditData] = useState({
    vip_promotion_id: "",
    days: "",
    price: "",
    isActive: false,
  });

  const [newPromotion, setNewPromotion] = useState({
    days: "",
    price: "",
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/vip-promotions`;
    try {
      setIsLoading(true);
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (Array.isArray(data)) {
        setPromotions(data);
      } else {
        setError("Failed to fetch promotions.");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดขณะพยายาม fetch ข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (promotion) => {
    setEditData({
      vip_promotion_id: promotion.vip_promotion_id,
      days: promotion.days,
      price: promotion.price,
      isActive: promotion.isActive,
    });
    setShowEditPopup(true);
  };

  const handleToggleStatus = async (promotionId) => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/vip-promotions/activate/${promotionId}`;
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        await fetchPromotions(); // Refresh the list to get updated status
      } else {
        console.error("Failed to toggle promotion status");
      }
    } catch (error) {
      console.error("Error toggling promotion status:", error);
    }
  };

  const handleSubmitEdit = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/vip-promotions/${editData.vip_promotion_id}`;
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          days: Number(editData.days),
          price: Number(editData.price),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        await fetchPromotions();
        setShowEditPopup(false);
      } else {
        console.error("Failed to update promotion:", data);
      }
    } catch (error) {
      console.error("Error updating promotion:", error);
    }
  };

  const handleAddPromotion = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/vip-promotions`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          days: String(newPromotion.days),
          price: String(newPromotion.price),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        await fetchPromotions();
        setShowAddPopup(false);
        setNewPromotion({ days: "", price: "" });
      } else {
        console.error("Failed to add promotion:", data);
      }
    } catch (error) {
      console.error("Error adding promotion:", error);
    }
  };

  const handleDeleteClick = (promotionId) => {
    setDeleteData(promotionId);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/vip-promotions/${deleteData}`;
    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        await fetchPromotions();
        setShowDeletePopup(false);
      } else {
        console.error("Failed to delete promotion");
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
    }
  };

  const getCurrentRowRange = () => {
    const startRange = (page - 1) * 10 + 1;
    const endRange = Math.min(page * 10, promotions.length);
    return `${startRange}-${endRange} of ${promotions.length}`;
  };

  const pageCount = Math.ceil(promotions.length / 10);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">จัดการโปรโมชั่น VIP</h1>
        <button
          className="bg-primary rounded-lg px-7 py-2 text-white"
          onClick={() => setShowAddPopup(true)}
        >
          เพิ่มโปรโมชั่น
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
                  ระยะเวลา (วัน)
                </th>
                <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
                  ราคา (บาท)
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
              {promotions.slice((page - 1) * 10, page * 10).map((promotion) => (
                <tr
                  key={promotion.vip_promotion_id}
                  className="border-b text-black text-sm font-thin"
                >
                  <td className="px-4 py-3">{promotion.days}</td>
                  <td className="px-4 py-3">
                    {Number(promotion.price).toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={promotion.isActive}
                        onChange={() => handleToggleStatus(promotion.vip_promotion_id)}
                        className="toggle-checkbox"
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                  <td className="flex px-4 py-3 justify-end gap-5 pr-8">
                    <button onClick={() => handleEditClick(promotion)}>
                      <PencilSquareIcon className="w-5 h-5 text-primary" />
                    </button>
                    <button onClick={() => handleDeleteClick(promotion.vip_promotion_id)}>
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

      {/* Edit Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[600px]">
            <div className="w-full flex justify-end">
              <button onClick={() => setShowEditPopup(false)}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>
            <h2 className="text-3xl font-medium mb-4">แก้ไขโปรโมชั่น VIP</h2>
            <div className="mb-4">
              <label htmlFor="days" className="block text-sm font-medium mb-1">
                ระยะเวลา (วัน)
              </label>
              <input
                type="number"
                id="days"
                value={editData.days}
                onChange={(e) => setEditData({ ...editData, days: e.target.value })}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                ราคา (บาท)
              </label>
              <input
                type="number"
                id="price"
                value={editData.price}
                onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                className="border border-gray-300 rounded p-2 w-full"
              />
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

      {/* Add Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[600px]">
            <div className="w-full flex justify-end">
              <button onClick={() => setShowAddPopup(false)}>
                <XCircleIcon className="w-8 h-8 text-primary hover:text-error" />
              </button>
            </div>
            <h2 className="text-3xl font-medium mb-4">เพิ่มโปรโมชั่น VIP</h2>
            <div className="mb-4">
              <label htmlFor="days" className="block text-sm font-medium mb-1">
                ระยะเวลา (วัน)
              </label>
              <input
                type="number"
                id="days"
                value={newPromotion.days}
                onChange={(e) => setNewPromotion({ ...newPromotion, days: e.target.value })}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                ราคา (บาท)
              </label>
              <input
                type="number"
                id="price"
                value={newPromotion.price}
                onChange={(e) => setNewPromotion({ ...newPromotion, price: e.target.value })}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="flex justify-end gap-6">
              <button
                onClick={() => setShowAddPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg w-[150px] h-[49px]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddPromotion}
                className="bg-primary px-4 py-2 text-white rounded-lg w-[150px] h-[49px]"
              >
                เพิ่ม
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">ยืนยันการลบ</h2>
            <p>คุณแน่ใจหรือไม่ที่จะลบโปรโมชั่นนี้?</p>
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

export default VIPPromotionsTable;