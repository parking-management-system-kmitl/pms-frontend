import React, { useState } from "react";
import { MOCK_DATA_API, MOCK_VIP_TABLE, VIP_TABLE_HEADER } from "./constants";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { VipFormModal } from "../vipFormModal";

function ListVipTable() {
  const [page, setPage] = useState(1);
  const [vipId, setVipId] = useState()
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleOpenForm = (vipId = null) => {
    setVipId(vipId)
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
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">การจัดการสมาชิก VIP</h1>
        <button
          className="bg-primary rounded-lg px-7 py-2 text-white"
          onClick={() => handleOpenForm()}
        >
          สมัครสมาชิก VIP
        </button>
      </div>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-blue-100">
            {VIP_TABLE_HEADER.map((label) => (
              <th
                key={label}
                className="border-b bg-blue-200 px-4 py-3 text-left text-gray-700 text-sm font-bold"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="h-[430px] overflow-auto">
          {MOCK_VIP_TABLE.map((row,index) => (
            <tr
              key={row.id}
              className="border-b text-gray-700 text-sm font-thin"
            >
              <td className="px-4 py-3">{index+1}</td>
              <td className="px-4 py-3">{row.licensePlate}</td>
              <td className="px-4 py-3">{row.name}</td>
              <td className="px-4 py-3">{row.phoneNumber}</td>
              <td className="px-4 py-3">{row.expired}</td>
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
     <VipFormModal isOpen={isFormOpen} handleClose={handleCloseForm} vipId={vipId} />
    </>
  );
}

export default ListVipTable;
