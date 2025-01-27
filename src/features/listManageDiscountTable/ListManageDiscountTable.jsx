import React, { useState } from "react";
import { MOCK_DATA_API, MOCK_DISCOUNT_TABLE, DISCOUNT_TABLE_HEADER } from "./constant";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { VipFormModal } from "../vipFormModal";

function ListManageDiscountTable() {
  const [page, setPage] = useState(1);
  const [manageDiscountId, setManageDiscountId] = useState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [discountCondition, setDiscountCondition] = useState("ไม่มีเงื่อนไขส่วนลด"); // Add default discount condition
  const [isEditingCondition, setIsEditingCondition] = useState(false);
  const [newDiscountCondition, setNewDiscountCondition] = useState(discountCondition);

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleOpenForm = (manageDiscountId = null) => {
    setManageDiscountId(manageDiscountId);
    setIsFormOpen(true);
  };

  const handleFeeConditionSubmit = () => {
    setDiscountCondition(newDiscountCondition);
    setIsEditingCondition(false); // Close the edit mode
  };

  const getCurrentRowRange = () => {
    const startRange = (page - 1) * MOCK_DATA_API.pageSize + 1;
    const endRange = Math.min(page * MOCK_DATA_API.pageSize, MOCK_DATA_API.rows);
    return `${startRange}-${endRange} of ${MOCK_DATA_API.rows}`;
  };

  const pageCount = Math.ceil(MOCK_DATA_API.rows / MOCK_DATA_API.pageSize);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">จัดการส่วนลด</h1>
        <button className="bg-primary rounded-lg px-7 py-2 text-white" onClick={() => handleOpenForm()}>
          เพิ่มส่วนลด
        </button>
      </div>
      <div className="flex flex-col gap-y-4 mb-6">
        <div className="flex gap-2">
          <h3 className="flex text-lg">เงื่อนไขส่วนลด :</h3>
          <button onClick={() => setIsEditingCondition(true)}>
            <PencilSquareIcon className="w-5 h-5 text-primary" />
          </button>
        </div>
        {isEditingCondition ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newDiscountCondition}
              onChange={(e) => setNewDiscountCondition(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
            <button onClick={handleFeeConditionSubmit} className="bg-primary px-4 py-2 text-white rounded-lg">
              บันทึก
            </button>
          </div>
        ) : (
          <p className="text-sm ml-4">{discountCondition}</p>
        )}
      </div>

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-blue-100">
            {DISCOUNT_TABLE_HEADER.map((label) => (
              <th key={label} className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-auto">
          {MOCK_DISCOUNT_TABLE.map((row, index) => (
            <tr key={row.id} className="border-b text-black text-sm font-thin">
              <td className="px-4 py-3">{row.nameOfDiscount}</td>
              <td className="px-4 py-3">{row.parkingDiscount}</td>
              <td className="px-4 py-3">{row.userType}</td>
              <td className="px-4 py-3">{row.status}</td>
              <td className="px-4 py-3">
                <button onClick={() => handleOpenForm(row.id)}>
                  <PencilSquareIcon className="w-5 h-5 text-primary" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end items-center mt-4 gap-6">
        <p className="text-sm font-thin">{getCurrentRowRange()}</p>
        <div className="flex gap-3">
          <button onClick={() => setPage((prev) => (prev === 1 ? pageCount : prev - 1))}>
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button onClick={() => setPage((prev) => (prev === pageCount ? 1 : prev + 1))}>
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <VipFormModal isOpen={isFormOpen} handleClose={handleCloseForm} manageDiscountId={manageDiscountId} />
    </div>
  );
}

export default ListManageDiscountTable;
