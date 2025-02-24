import React, { useEffect, useState } from "react";
import AOS from "aos";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import "aos/dist/aos.css";
import { CarDetailModal } from "../../features/carDetailModal";
import PageCotainer from "../PageCotainer";

function DetailPage() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState("ทั้งหมด");
  const [sortBy, setSortBy] = useState("entryTime");
  const [sortOrder, setSortOrder] = useState("DESC");

  const buttons = ["ทั้งหมด", "รถเข้า", "รถออก"];
  const apiUrl = process.env.REACT_APP_API_URL;

  // Format time to 24-hour format with seconds
  const formatTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH");
  };

  // Client-side sorting function
  const sortData = (data) => {
    return [...data].sort((a, b) => {
      let compareA, compareB;

      if (sortBy === "entryTime") {
        compareA = new Date(a.entry_time).getTime();
        compareB = new Date(b.entry_time).getTime();
      } else if (sortBy === "exitTime") {
        compareA = a.exit_time ? new Date(a.exit_time).getTime() : 0;
        compareB = b.exit_time ? new Date(b.exit_time).getTime() : 0;
      }

      if (sortOrder === "ASC") {
        return compareA - compareB;
      } else {
        return compareB - compareA;
      }
    });
  };

  const getStatus = (row) => {
    if (selected === "รถเข้า") {
      return "กำลังจอด";
    } else if (selected === "รถออก") {
      return "ออกแล้ว";
    } else {
      return row.type === "active" ? "กำลังจอด" : "ออกแล้ว";
    }
  };

  const fetchAllRecords = async () => {
    try {
      const response = await fetch(`${apiUrl}/parking/records`);
      const result = await response.json();
      if (result.data) {
        const formattedData = result.data.map((record) => ({
          entry_records_id:
            record.type === "active" ? record.entry_records_id : null,
          entry_exit_records_id:
            record.type === "completed" ? record.entry_exit_records_id : null,
          car: record.car,
          entry_time: record.entry_time,
          exit_time: record.exit_time,
          parkedHours: record.parked_hours,
          parkingFee: record.parking_fee,
          payments: record.payments || [],
          type: record.type,
          isVip: record.car.isVip,
          entry_car_image_path: record.entry_car_image_path,
        }));

        const sortedData = sortData(formattedData);
        setData(sortedData);
        setFilteredData(sortedData);
        setTotalRows(sortedData.length);
        setPageCount(Math.ceil(sortedData.length / rowsPerPage));
      }
    } catch (error) {
      console.error("Error fetching all records:", error);
    }
  };

  const fetchEntryRecords = async () => {
    try {
      const response = await fetch(`${apiUrl}/parking/entry-records`);
      const result = await response.json();
      if (result.success) {
        const sortedData = sortData(result.data);
        setData(sortedData);
        setFilteredData(sortedData);
        setTotalRows(sortedData.length);
        setPageCount(Math.ceil(sortedData.length / rowsPerPage));
      }
    } catch (error) {
      console.error("Error fetching entry records:", error);
    }
  };

  const fetchExitRecords = async () => {
    try {
      const response = await fetch(`${apiUrl}/parking/entry-exit-records`);
      const result = await response.json();
      if (result.success) {
        const sortedData = sortData(result.data);
        setData(sortedData);
        setFilteredData(sortedData);
        setTotalRows(sortedData.length);
        setPageCount(Math.ceil(sortedData.length / rowsPerPage));
      }
    } catch (error) {
      console.error("Error fetching exit records:", error);
    }
  };

  // Effect for sorting
  useEffect(() => {
    const sortedData = sortData(filteredData);
    setFilteredData(sortedData);
  }, [sortBy, sortOrder]);

  // Effect for fetching data based on selected tab
  useEffect(() => {
    switch (selected) {
      case "รถเข้า":
        fetchEntryRecords();
        break;
      case "รถออก":
        fetchExitRecords();
        break;
      default:
        fetchAllRecords();
    }
  }, [selected]);

  // Effect for search filtering
  useEffect(() => {
    let filtered = data;
    if (searchQuery !== "") {
      filtered = data.filter((row) =>
        row.car.license_plate.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    const sortedAndFiltered = sortData(filtered);
    setFilteredData(sortedAndFiltered);
    setPageCount(Math.ceil(sortedAndFiltered.length / rowsPerPage));

    // Reset to page 1 if current page would be empty
    const maxPage = Math.ceil(sortedAndFiltered.length / rowsPerPage);
    if (page > maxPage) {
      setPage(1);
    }
  }, [searchQuery, data, rowsPerPage]);

  // Effect for updating pageCount when rowsPerPage changes
  useEffect(() => {
    setPageCount(Math.ceil(filteredData.length / rowsPerPage));
    // Reset to page 1 if current page would be empty
    const maxPage = Math.ceil(filteredData.length / rowsPerPage);
    if (page > maxPage) {
      setPage(1);
    }
  }, [rowsPerPage, filteredData.length]);

  const handleSelectChange = (btn) => {
    setSelected(btn);
    setPage(1);
    if (btn === "รถเข้า") {
      setSortBy("entryTime");
      setSortOrder("DESC");
    }
  };

  const handleRowClick = (index) => {
    setSelectedRow(filteredData[index]);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRow(null);
  };

  const getCurrentRowRange = () => {
    return `หน้า ${page} จาก ${pageCount}`;
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  // Get current rows for display
  const getCurrentPageData = () => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  };

  return (
    <PageCotainer>
      <div className="flex flex-col">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="font-inter font-bold text-3xl">
              รายการเข้า-ออกที่จอดรถ
            </h1>
            <div className="flex items-center px-4 gap-4 bg-blue-100 text-gray-600 rounded-full w-1/3 h-12 ml-auto">
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
          <div className="flex gap-4">
            {filteredData
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((record, index) => (
                <div
                  key={index}
                  className="h-[110px] w-[130px] bg-gray-100 rounded-[8px] overflow-hidden relative"
                >
                  {record.entry_car_image_path ? (
                    <img
                      src={`${apiUrl}${record.entry_car_image_path}`}
                      alt={`Car ${record.car.license_plate}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-car.jpg";
                        e.target.className =
                          "w-full h-full object-contain bg-gray-200";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div
                    className="absolute w-[85px] text-center bottom-0 left-0 text-white text-xs p-1 rounded-tr-xl"
                    style={{ backgroundColor: "#007AFF" }}
                  >
                    {record.car.license_plate}
                  </div>
                </div>
              ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  disabled={selected === "รถเข้า"}
                  className={`px-4 pr-8 appearance-none py-2 border rounded-[8px] h-[40px] ${
                    selected === "รถเข้า"
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <option value="entryTime">เรียงตามเวลาเข้า</option>
                  <option value="exitTime">เรียงตามเวลาออก</option>
                </select>
                <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className={`w-4 h-4 ${
                      selected === "รถเข้า" ? "text-gray-300" : ""
                    }`}
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
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-4 pr-8 appearance-none py-2 border rounded-[8px] h-[40px]"
                >
                  <option value="DESC">มากไปน้อย</option>
                  <option value="ASC">น้อยไปมาก</option>
                </select>
                <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none">
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
            <div className="flex gap-4">
              {buttons.map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleSelectChange(btn)}
                  className={`px-4 py-2 border border-[#007AFF]/15 text-[#007AFF] rounded-[8px] w-[87px] h-[40px] font-sm ${
                    selected === btn ? "bg-[#007AFF]/15" : "bg-white"
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 overflow-auto">
          <table className="table-auto w-full border-collapse text-gray-700">
            <thead>
              <tr>
                {[
                  "คันที่",
                  "ทะเบียนรถ",
                  "วันที่เข้า",
                  "เวลาเข้า",
                  "เวลาออก",
                  "ระยะเวลา (ชม.)",
                  "ค่าบริการ (บาท)",
                  "สถานะ",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 bg-blue-200 sticky top-0 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-3xl px-4 py-[6rem] text-center text-gray-400"
                  >
                    ไม่พบป้ายทะเบียนที่ค้นหา
                  </td>
                </tr>
              ) : (
                getCurrentPageData().map((row, index) => {
                  const serialNumber = (page - 1) * rowsPerPage + index + 1;
                  return (
                    <tr
                      key={index}
                      onClick={() =>
                        handleRowClick((page - 1) * rowsPerPage + index)
                      }
                      className="border-b hover:bg-blue-50 cursor-pointer"
                    >
                      <td className="px-4 py-3">{serialNumber}</td>
                      <td className="px-4 py-3">{row.car.license_plate}</td>
                      <td className="px-4 py-3">
                        {formatDate(row.entry_time)}
                      </td>
                      <td className="px-4 py-3">
                        {formatTime(row.entry_time)}
                      </td>
                      <td className="px-4 py-3">{formatTime(row.exit_time)}</td>
                      <td className="px-4 py-3">
                        {row.parkedHours ? `${row.parkedHours}` : "-"}
                      </td>
                      <td className="px-4 py-3">{row.parkingFee}</td>
                      <td className="px-4 py-3">{getStatus(row)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end items-center mt-4 gap-6">
          {filteredData.length > 0 && (
            <>
              <div className="flex items-center gap-1">
                <p className="text-sm ">รายการต่อหน้า :</p>
                <div className="relative">
                  <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
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
              <p className="text-sm ">{getCurrentRowRange()}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setPage((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                  disabled={page === 1}
                  className={page === 1 ? "text-gray-300" : ""}
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setPage((prev) => (prev < pageCount ? prev + 1 : prev))
                  }
                  disabled={page === pageCount}
                  className={page === pageCount ? "text-gray-300" : ""}
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
        <CarDetailModal
          isVisible={modalVisible}
          onClose={closeModal}
          selectedRow={selectedRow}
          selectedDiscount={selectedDiscount}
          setSelectedDiscount={setSelectedDiscount}
          carId={selectedRow?.car?.car_id}
        />
      </div>
    </PageCotainer>
  );
}

export default DetailPage;
