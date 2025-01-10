import React, { useState } from "react";
import { MOCK_DATA_API, MOCK_FEE_TABLE, FEE_TABLE_HEADER } from "./constant";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { VipFormModal } from "../vipFormModal";

function LlistManageFeeTable() {
  const [page, setPage] = useState(1);
  const [manageFeeId, setManageFeeId] = useState()
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleOpenForm = (manageFeeId = null) => {
    setManageFeeId(manageFeeId)
    setIsFormOpen(true)
  }

  const getCurrentRowRange = () => {
    const startRange = (page - 1) * MOCK_DATA_API.pageSize + 1;
    const endRange = Math.min(
      page * MOCK_DATA_API.pageSize,
      MOCK_DATA_API.rows
    );
    return `${startRange}-${endRange} of ${MOCK_DATA_API.rows}`;
  };

  const pageCount = Math.ceil(MOCK_DATA_API.rows / MOCK_DATA_API.pageSize);
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">จัดการอัตราค่าบริการจอดรถ</h1>
        <button
          className="bg-primary rounded-lg px-7 py-2 text-white"
          onClick={() => handleOpenForm()}
        >
          เพิ่มค่าจอดรถ
        </button>
      </div>
      <div className=" flex flex-col gap-y-4 mb-6">
        <div className=" flex gap-2">
          <h3 className=" flex text-lg ">
          เงื่อนไขค่าจอดรถ :
          </h3>
          <button>
            <PencilSquareIcon className="w-5 h-5 text-primary" />
          </button>
        </div>
        <p className=" text-sm ml-4">จอดฟรี 2 ชม. แรก ชั่วโมงต่อไป ชั่วโมงละ 30 บาท ชั่วโมงที่ 7 ขึ้นไป คิดชั่วโมงละ 60 บาท</p>
      </div>
      
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-blue-100">
            {FEE_TABLE_HEADER.map((label) => (
              <th
                key={label}
                className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className=" overflow-auto">
          {MOCK_FEE_TABLE.map((row,index) => (
            <tr
              key={row.id}
              className="border-b text-black text-sm font-thin"
            >
              <td className="px-4 py-3">{row.parkingHour}</td>
              <td className="px-4 py-3">{row.parkingRate}</td>
              <td className="px-4 py-3">{row.parkingFee}</td>
              <td className="px-4 py-3">{row.note}</td>
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
      <VipFormModal isOpen={isFormOpen} handleClose={handleCloseForm} manageFeeId={manageFeeId} />
    </div>
  )
}

export default LlistManageFeeTable