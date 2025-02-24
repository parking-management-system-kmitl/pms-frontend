import React, { useState, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { VipFormModal } from "../vipFormModal";
import { CarRegisModal } from "../carRegisModal";
import { VipEditModal } from "../vipEditModal";
import { CarRegisEditModal } from "../carRegisEditModal";

function ListVipTable() {
  const [page, setPage] = useState(1);
  const [vipData, setVipData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCarRegisOpen, setIsCarRegisOpen] = useState(false);
  const [vipId, setVipId] = useState(null);
  const [formData, setFormData] = useState({ tel: "", licensePlate: "" });
  const [isVipEditOpen, setIsVipEditOpen] = useState(false);
  const [carData, setCarData] = useState([]);
  const [isCarRegisEditOpen, setIsCarRegisEditOpen] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchVipData(page);
  }, [page]);

  const fetchVipData = async (currentPage) => {
    try {
      const response = await fetch(
        `${apiUrl}/vip/getvip?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      if (result.data) {
        // No grouping needed, just use the data as-is
        setVipData(result.data);
        setTotal(result.total);
      }
    } catch (error) {
      console.error("Error fetching VIP data:", error);
    }
  };

  const handleOpenForm = (memberId = null) => {
    setVipId(memberId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => setIsFormOpen(false);

  const handleOpenCarRegis = () => setIsCarRegisOpen(true);

  const handleCloseCarRegis = () => setIsCarRegisOpen(false);

  const handleCarRegister = () => {
    console.log("Registering car with data:", formData);
    handleCloseCarRegis();
  };

  const handleOpenCarRegisEdit = (carId, licensePlate) => {
    setVipId(carId);
    setCarData([{ car_id: carId, licenseplate: licensePlate }]);
    setIsCarRegisEditOpen(true);
  };

  const handleCloseCarRegisEdit = () => {
    setIsCarRegisEditOpen(false);
  };

  const handleOpenVipEdit = (carId, data) => {
    setVipId(carId);
    setFormData({
      car_id: carId,
      fname: data.member?.f_name || "",
      lname: data.member?.l_name || "",
      tel: data.member?.phone || "",
      extend_days: "0",
    });
    setIsVipEditOpen(true);
  };

  // ฟังก์ชันสำหรับแสดงหน้าปัจจุบันและหน้าทั้งหมด
  const getCurrentPageDisplay = () => {
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    return `หน้า ${page} จาก ${totalPages}`;
  };

  // เช็คว่าปุ่มเลื่อนหน้าถูก disable หรือไม่
  const isPrevButtonDisabled = page === 1;
  const isNextButtonDisabled = page >= Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">รายการสมาชิก VIP</h1>
        <div className="flex gap-4">
          <button
            className="bg-primary rounded-lg px-7 py-2 text-white"
            onClick={() => handleOpenForm()}
          >
            สมัครสมาชิก VIP
          </button>
          <button
            className="bg-primary rounded-lg px-7 py-2 text-white"
            onClick={handleOpenCarRegis}
          >
            ลงทะเบียนรถ VIP
          </button>
        </div>
      </div>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-blue-100">
            <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
              ลำดับที่
            </th>
            <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
              ทะเบียนรถ
            </th>
            <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
              ชื่อ-นามสกุล
            </th>
            <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
              เบอร์โทร
            </th>
            <th className="border-b bg-blue-200 px-4 py-3 text-left text-black text-sm font-bold">
              วันหมดอายุ
            </th>
            <th className="border-b bg-blue-200 px-4 py-3 text-center text-black text-sm font-bold">
              จัดการป้ายทะเบียน
            </th>
            <th className="border-b bg-blue-200 px-4 py-3 text-center text-black text-sm font-bold">
              จัดการสมาชิก
            </th>
          </tr>
        </thead>
        <tbody>
          {vipData.map((row, index) => (
            <tr
              key={row.car_id}
              className="border-b text-black text-sm font-thin"
            >
              <td className="px-4 py-3">
                {index + 1 + (page - 1) * ITEMS_PER_PAGE}
              </td>
              <td className="px-4 py-3">{row.license_plate}</td>
              <td className="px-4 py-3">
                {row.member ? `${row.member.f_name} ${row.member.l_name}` : ""}
              </td>
              <td className="px-4 py-3">{row.member?.phone || ""}</td>
              <td className="px-4 py-3">
                {new Date(row.vip_expiry_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() =>
                    handleOpenCarRegisEdit(row.car_id, row.license_plate)
                  }
                >
                  <FontAwesomeIcon icon={faCar} className="text-blue-500" />
                </button>
              </td>
              <td className="px-4 py-3 text-center">
                <button onClick={() => handleOpenVipEdit(row.car_id, row)}>
                  <PencilSquareIcon className="w-5 h-5 text-primary" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end items-center mt-4 gap-6">
        <p className="text-sm font-thin">{getCurrentPageDisplay()}</p>
        <div className="flex gap-3">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={isPrevButtonDisabled}
            className={isPrevButtonDisabled ? "text-gray-400" : ""}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, Math.ceil(total / ITEMS_PER_PAGE))
              )
            }
            disabled={isNextButtonDisabled}
            className={isNextButtonDisabled ? "text-gray-400" : ""}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <VipFormModal
        isOpen={isFormOpen}
        handleClose={handleCloseForm}
        vipId={vipId}
        fetchVipData={fetchVipData}
      />
      <CarRegisModal
        isOpen={isCarRegisOpen}
        onClose={handleCloseCarRegis}
        onSubmit={handleCarRegister}
        formData={formData}
        setFormData={setFormData}
        fetchVipData={fetchVipData}
      />
      <VipEditModal
        isOpen={isVipEditOpen}
        onClose={() => setIsVipEditOpen(false)}
        vipId={vipId}
        formData={formData}
        setFormData={setFormData}
      />
      <CarRegisEditModal
        isOpen={isCarRegisEditOpen}
        onClose={handleCloseCarRegisEdit}
        vipId={vipId}
        carData={carData}
        setCarData={setCarData}
        fetchVipData={fetchVipData}
      />
    </>
  );
}

export default ListVipTable;
