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
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCarRegisOpen, setIsCarRegisOpen] = useState(false);
  const [vipId, setVipId] = useState(null);
  const [formData, setFormData] = useState({ tel: "", licensePlate: "" });
  const [isVipEditOpen, setIsVipEditOpen] = useState(false);
  const [carData, setCarData] = useState([]);
  const [isCarRegisEditOpen, setIsCarRegisEditOpen] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchVipData(page);
  }, [page]);

  const fetchVipData = async (currentPage) => {
    try {
      const response = await fetch(`${apiUrl}/vip/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: currentPage, limit: 10 }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setVipData(result.data.items);
        setMeta(result.data.meta);
      }
    } catch (error) {
      console.error("Error fetching VIP data:", error);
    }
  };

  const handleOpenForm = (vipId = null) => {
    setVipId(vipId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => setIsFormOpen(false);

  const handleOpenCarRegis = () => setIsCarRegisOpen(true);

  const handleCloseCarRegis = () => setIsCarRegisOpen(false);

  const handleCarRegister = () => {
    console.log("Registering car with data:", formData);
    handleCloseCarRegis();
  };

  const handleOpenCarRegisEdit = (vipId, cars) => {
    setVipId(vipId);
    setCarData(cars);
    setIsCarRegisEditOpen(true);
  };

  const handleCloseCarRegisEdit = () => {
    setIsCarRegisEditOpen(false);
  };

  const handleOpenVipEdit = (vipId, currentData) => {
    setVipId(vipId);
    setFormData({
      vip_member_id: currentData.vip_member_id,
      fname: currentData.fname,
      lname: currentData.lname,
      tel: currentData.tel,
      extend_days: "0",
    });
    setIsVipEditOpen(true);
  };

  const getCurrentRowRange = () => {
    const startRange = (page - 1) * 10 + 1;
    const endRange = Math.min(page * 10, meta.total);
    return `${startRange}-${endRange} of ${meta.total}`;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">รายการสมาชิก VIP</h1>
        <div className="flex gap-2">
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
              key={row.vip_member_id}
              className="border-b text-black text-sm font-thin"
            >
              <td className="px-4 py-3">{index + 1 + (page - 1) * 10}</td>
              <td className="px-4 py-3">
                {row.cars.map((car) => car.licenseplate).join(", ").length > 15
                  ? row.cars
                      .map((car) => car.licenseplate)
                      .join(", ")
                      .slice(0, 15) + "..."
                  : row.cars.map((car) => car.licenseplate).join(", ")}
              </td>
              <td className="px-4 py-3">{`${row.fname} ${row.lname}`}</td>
              <td className="px-4 py-3">{row.tel}</td>
              <td className="px-4 py-3">
                {new Date(row.expire_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() =>
                    handleOpenCarRegisEdit(row.vip_member_id, row.cars)
                  }
                >
                  <FontAwesomeIcon icon={faCar} className="text-blue-500" />
                </button>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleOpenVipEdit(row.vip_member_id, row)}
                >
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
          <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, meta.totalPages))
            }
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <VipFormModal
        isOpen={isFormOpen}
        handleClose={handleCloseForm}
        vipId={vipId}
      />
      <CarRegisModal
        isOpen={isCarRegisOpen}
        onClose={handleCloseCarRegis}
        onSubmit={handleCarRegister}
        formData={formData}
        setFormData={setFormData}
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
      />
    </>
  );
}

export default ListVipTable;
