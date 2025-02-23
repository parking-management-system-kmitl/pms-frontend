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
        // Group data by member_id to combine multiple car entries
        const groupedData = result.data.reduce((acc, item) => {
          const memberId = item.member?.member_id;
          if (!acc[memberId]) {
            acc[memberId] = {
              member_id: memberId,
              vip_expiry_date: item.vip_expiry_date,
              cars: [],
              member: item.member
                ? {
                    fname: item.member.f_name,
                    lname: item.member.l_name,
                    tel: item.member.phone,
                  }
                : null,
            };
          }
          acc[memberId].cars.push({
            car_id: item.car_id,
            licenseplate: item.license_plate,
          });
          return acc;
        }, {});

        setVipData(Object.values(groupedData));
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

  const handleOpenCarRegisEdit = (memberId, cars) => {
    setVipId(memberId);
    setCarData(cars);
    setIsCarRegisEditOpen(true);
  };

  const handleCloseCarRegisEdit = () => {
    setIsCarRegisEditOpen(false);
  };

  const handleOpenVipEdit = (carId, currentData) => {
    setVipId(carId);
    setFormData({
      car_id: carId,
      fname: currentData.member?.fname || "",
      lname: currentData.member?.lname || "",
      tel: currentData.member?.tel || "",
      extend_days: "0",
    });
    setIsVipEditOpen(true);
  };

  const getCurrentRowRange = () => {
    const startRange = (page - 1) * ITEMS_PER_PAGE + 1;
    const endRange = Math.min(page * ITEMS_PER_PAGE, total);
    return `${startRange}-${endRange} of ${total}`;
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
              key={row.member_id || index}
              className="border-b text-black text-sm font-thin"
            >
              <td className="px-4 py-3">
                {index + 1 + (page - 1) * ITEMS_PER_PAGE}
              </td>
              <td className="px-4 py-3">
                {row.cars.map((car) => car.licenseplate).join(", ").length > 15
                  ? row.cars
                      .map((car) => car.licenseplate)
                      .join(", ")
                      .slice(0, 15) + "..."
                  : row.cars.map((car) => car.licenseplate).join(", ")}
              </td>
              <td className="px-4 py-3">
                {row.member ? `${row.member.fname} ${row.member.lname}` : ""}
              </td>
              <td className="px-4 py-3">{row.member?.tel || ""}</td>
              <td className="px-4 py-3">
                {new Date(row.vip_expiry_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() =>
                    handleOpenCarRegisEdit(row.member_id, row.cars)
                  }
                >
                  <FontAwesomeIcon icon={faCar} className="text-blue-500" />
                </button>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleOpenVipEdit(row.cars[0].car_id, row)}
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
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, Math.ceil(total / ITEMS_PER_PAGE))
              )
            }
            disabled={page >= Math.ceil(total / ITEMS_PER_PAGE)}
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
