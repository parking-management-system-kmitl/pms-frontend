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
  const [isToggling, setIsToggling] = useState(false);

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

  const itemsPerPage = 5;

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

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
    const promotionToToggle = promotions.find(
      (p) => p.vip_promotion_id === promotionId
    );

    if (!promotionToToggle) return;

    if (promotionToToggle.isActive) {
      return;
    }

    setIsToggling(true);

    const updatedPromotions = promotions.map((promotion) => {
      if (promotion.vip_promotion_id === promotionId) {
        return { ...promotion, isActive: true };
      } else if (promotion.isActive) {
        return { ...promotion, isActive: false };
      }
      return promotion;
    });

    setPromotions(updatedPromotions);

    const apiUrl = `${process.env.REACT_APP_API_URL}/vip-promotions/activate/${promotionId}`;
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        console.error("Failed to toggle promotion status");
        // หากไม่สำเร็จ ให้คืนค่าสถานะเดิม
        setPromotions(promotions);
      }
    } catch (error) {
      console.error("Error toggling promotion status:", error);
      // หากเกิดข้อผิดพลาด ให้คืนค่าสถานะเดิม
      setPromotions(promotions);
    } finally {
      setIsToggling(false);
    }
  };

  const handleSubmitEdit = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/vip-promotions/${editData.vip_promotion_id}`;
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          days: Number(editData.days),
          price: Number(editData.price),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // อัปเดต state โดยตรงแทนที่จะโหลดข้อมูลใหม่ทั้งหมด
        const updatedPromotions = promotions.map((promotion) =>
          promotion.vip_promotion_id === editData.vip_promotion_id
            ? {
                ...promotion,
                days: Number(editData.days),
                price: Number(editData.price),
              }
            : promotion
        );

        setPromotions(updatedPromotions);
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
        headers: getAuthHeaders(),
        body: JSON.stringify({
          days: String(newPromotion.days),
          price: String(newPromotion.price),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // สำหรับการเพิ่มรายการใหม่ เราจำเป็นต้องโหลดข้อมูลใหม่เพื่อให้ได้ ID ที่ถูกต้อง
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
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        // อัปเดต state โดยตรงแทนที่จะโหลดข้อมูลใหม่ทั้งหมด
        const updatedPromotions = promotions.filter(
          (promotion) => promotion.vip_promotion_id !== deleteData
        );

        setPromotions(updatedPromotions);
        setShowDeletePopup(false);
      } else {
        console.error("Failed to delete promotion");
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
    }
  };

  const getPageInfo = () => {
    const pageCount = Math.ceil(promotions.length / itemsPerPage);
    return `หน้า ${page} จาก ${pageCount}`;
  };

  const pageCount = Math.ceil(promotions.length / itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">จัดการโปรโมชัน VIP</h1>
        <button
          className="bg-primary rounded-lg px-7 py-2 text-white w-[216px]"
          onClick={() => setShowAddPopup(true)}
        >
          เพิ่มโปรโมชัน
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
              {promotions
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((promotion) => (
                  <tr
                    key={promotion.vip_promotion_id}
                    className="border-b text-black text-sm font-thin"
                  >
                    <td className="px-4 py-3">{promotion.days}</td>
                    <td className="px-4 py-3">
                      {Number(promotion.price).toLocaleString()}
                    </td>
                    <td className="px-3 py-3">
                      <label
                        className={`inline-flex items-center ${
                          promotion.isActive
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={promotion.isActive}
                          onChange={() =>
                            handleToggleStatus(promotion.vip_promotion_id)
                          }
                          disabled={isToggling || promotion.isActive}
                          className="toggle-checkbox"
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </td>
                    <td className="flex px-4 py-3 justify-end gap-5 pr-8">
                      <button onClick={() => handleEditClick(promotion)}>
                        <PencilSquareIcon className="w-5 h-5 text-primary" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick(promotion.vip_promotion_id)
                        }
                      >
                        <TrashIcon className="w-5 h-5 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="flex justify-end items-center mt-4 gap-6">
            <p className="text-sm font-thin">{getPageInfo()}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`transition-colors duration-200 ${
                  page === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-black hover:text-primary"
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                disabled={page === pageCount}
                className={`transition-colors duration-200 ${
                  page === pageCount
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-black hover:text-primary"
                }`}
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
            <h2 className="text-3xl font-medium mb-4">จัดการโปรโมชัน VIP</h2>
            <div className="mb-4">
              <label htmlFor="days" className="block text-sm font-medium mb-1">
                ระยะเวลา (วัน)
              </label>
              <input
                type="number"
                id="days"
                value={editData.days}
                onChange={(e) =>
                  setEditData({ ...editData, days: e.target.value })
                }
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
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
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
            <h2 className="text-3xl font-medium mb-4">เพิ่มโปรโมชัน VIP</h2>
            <div className="mb-4">
              <label htmlFor="days" className="block text-sm font-medium mb-1">
                ระยะเวลา (วัน)
              </label>
              <input
                type="number"
                id="days"
                value={newPromotion.days}
                onChange={(e) =>
                  setNewPromotion({ ...newPromotion, days: e.target.value })
                }
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
                onChange={(e) =>
                  setNewPromotion({ ...newPromotion, price: e.target.value })
                }
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
                บันทึก
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
