import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // สร้าง ref เพื่อเก็บสถานะว่ากำลังโหลดข้อมูลอยู่หรือไม่
  const isLoadingRef = useRef(false);
  // สร้าง ref เพื่อเก็บ AbortController สำหรับยกเลิก fetch request ที่ยังไม่เสร็จ
  const abortControllerRef = useRef(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  // ย้าย token และ headers ออกจาก component state เพื่อไม่ให้ทริกเกอร์การ re-render
  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchVipData = useCallback(async () => {
    // ถ้ากำลังโหลดข้อมูลอยู่แล้ว ให้ยกเลิก request เก่าก่อน
    if (isLoadingRef.current) {
      abortControllerRef.current?.abort();
    }

    // สร้าง AbortController ใหม่
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // ตั้งค่าสถานะกำลังโหลด
    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const headers = getAuthHeaders();
      let response;
      const isSearching = searchQuery && searchQuery.trim().length > 0;

      if (isSearching) {
        response = await fetch(`${apiUrl}/vip/search`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            licensePlate: searchQuery,
            page,
            limit: ITEMS_PER_PAGE,
          }),
          signal, // ใช้ AbortController signal
        });
      } else {
        response = await fetch(
          `${apiUrl}/vip/getvip?page=${page}&limit=${ITEMS_PER_PAGE}`,
          {
            method: "GET",
            headers: headers,
            signal, // ใช้ AbortController signal
          }
        );
      }

      // ตรวจสอบว่า request ถูกยกเลิกหรือไม่
      if (signal.aborted) return;

      const result = await response.json();

      if (result.data) {
        setVipData(result.data);
        setTotal(result.total);
      }
    } catch (error) {
      // ไม่แสดง error ถ้าเป็นการยกเลิก request
      if (error.name !== "AbortError") {
        console.error("Error fetching VIP data:", error);
      }
    } finally {
      // อัปเดตสถานะการโหลดเมื่อเสร็จสิ้น
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [apiUrl, page, searchQuery]); // ลบ headers ออกจาก dependency array

  // ใช้ useEffect เพื่อจัดการการยกเลิก request เมื่อ component unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // useEffect สำหรับเรียกข้อมูล
  useEffect(() => {
    // เพิ่ม debounce เพื่อลดการเรียก API ถี่เกินไป
    const timer = setTimeout(() => {
      fetchVipData();
    }, 300); // รอ 300ms ก่อนเรียก API

    return () => clearTimeout(timer);
  }, [fetchVipData]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setPage(1);
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
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
    return `หน้า ${page} จาก ${totalPages}`;
  };

  // เช็คว่าปุ่มเลื่อนหน้าถูก disable หรือไม่
  const isPrevButtonDisabled = page === 1;
  const isNextButtonDisabled = page >= Math.ceil(total / ITEMS_PER_PAGE);

  // สร้างฟังก์ชันที่จะส่งต่อให้ Modal components เพื่อดึงข้อมูลใหม่หลังจากการอัปเดต
  const refreshData = () => {
    // หน่วงเวลาเล็กน้อยเพื่อให้ API มีเวลาอัปเดตข้อมูลในฐานข้อมูล
    setTimeout(() => {
      fetchVipData();
    }, 500);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">รายการสมาชิก VIP</h1>
          <div className="flex items-center px-4 gap-4 bg-blue-100 text-gray-600 rounded-full w-1/3 h-12">
            <svg
              id="lens"
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <input
              type="text"
              id="carname"
              name="carname"
              placeholder="ค้นหาป้ายทะเบียน"
              className="bg-transparent outline-none w-full text-gray-600 placeholder-gray-600"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
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

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <table className="table-auto w-full border-collapse mt-6">
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
            {vipData.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-3xl px-4 py-[6rem] text-center text-gray-400"
                >
                  {searchQuery
                    ? "ไม่พบป้ายทะเบียนที่ค้นหา"
                    : "ไม่มีรายการสมาชิก VIP"}
                </td>
              </tr>
            ) : (
              vipData.map((row, index) => (
                <tr
                  key={row.car_id}
                  className="border-b text-black text-sm font-thin hover:bg-blue-50"
                >
                  <td className="px-4 py-3">
                    {index + 1 + (page - 1) * ITEMS_PER_PAGE}
                  </td>
                  <td className="px-4 py-3">{row.license_plate}</td>
                  <td className="px-4 py-3">
                    {row.member
                      ? `${row.member.f_name} ${row.member.l_name}`
                      : ""}
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
              ))
            )}
          </tbody>
        </table>
      )}

      <div className="flex justify-end items-center mt-4 gap-6">
        {vipData.length > 0 && (
          <>
            <div className="flex items-center gap-1">
              <p className="text-sm">รายการต่อหน้า :</p>
              <div className="relative">
                <select
                  value={ITEMS_PER_PAGE}
                  onChange={(e) => {}}
                  className="text-sm py-1 appearance-none px-2 border border-gray-300 rounded-md w-[50px]"
                >
                  {[5, 10, 15, 20].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="absolute top-1/2 right-1 transform -translate-y-1/2 text-gray-500 pointer-events-none">
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
            <p className="text-sm">{getCurrentPageDisplay()}</p>
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
          </>
        )}
      </div>

      <VipFormModal
        isOpen={isFormOpen}
        handleClose={handleCloseForm}
        vipId={vipId}
        fetchVipData={refreshData}
        getAuthHeaders={getAuthHeaders}
      />
      <CarRegisModal
        isOpen={isCarRegisOpen}
        onClose={handleCloseCarRegis}
        onSubmit={handleCarRegister}
        formData={formData}
        setFormData={setFormData}
        fetchVipData={refreshData}
        getAuthHeaders={getAuthHeaders}
      />
      <VipEditModal
        isOpen={isVipEditOpen}
        onClose={() => setIsVipEditOpen(false)}
        vipId={vipId}
        formData={formData}
        setFormData={setFormData}
        getAuthHeaders={getAuthHeaders}
        onSuccess={refreshData}
      />
      <CarRegisEditModal
        isOpen={isCarRegisEditOpen}
        onClose={handleCloseCarRegisEdit}
        vipId={vipId}
        carData={carData}
        setCarData={setCarData}
        fetchVipData={refreshData}
        getAuthHeaders={getAuthHeaders}
      />
    </>
  );
}

export default ListVipTable;
