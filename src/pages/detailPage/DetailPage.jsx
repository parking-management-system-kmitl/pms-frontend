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
  const [pageCount, setPageCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState("ทั้งหมด");
  const [sortBy, setSortBy] = useState("entryTime");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [isLoading, setIsLoading] = useState(false);

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


  
  const getStatus = (row) => {
    if (selected === "รถเข้า") {
      return "กำลังจอด";
    } else if (selected === "รถออก") {
      return "ออกแล้ว";
    } else {
      return row.type === "active" ? "กำลังจอด" : "ออกแล้ว";
    }
  };

  const extractPaginationInfo = (result) => {
    // For /parking/records endpoint
    if (result.pagination) {
      return {
        total: result.pagination.total_entries,
        totalPages: parseInt(result.pagination.total_pages) || 
                   Math.ceil(result.pagination.total_entries / rowsPerPage)
      };
    }
    // For other endpoints
    else if (result.total !== undefined) {
      return {
        total: result.total,
        totalPages: parseInt(result.totalPages) || 
                  Math.ceil(result.total / rowsPerPage)
      };
    }
    // Fallback
    return {
      total: data.length,
      totalPages: Math.ceil(data.length / rowsPerPage)
    };
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let url;
      let requestBody = null;
      let response;
      
      // Determine if we should use search endpoints based on searchQuery
      const isSearching = searchQuery && searchQuery.trim().length > 0;
      
      // Build the URL or request based on the selected tab and whether we're searching
      if (selected === "รถเข้า") {
        if (isSearching) {
          url = `${apiUrl}/parking/entry-records/search`;
          requestBody = {
            licensePlate: searchQuery,
            page,
            limit: rowsPerPage
          };
        } else {
          url = `${apiUrl}/parking/entry-records?page=${page}&limit=${rowsPerPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }
      } else if (selected === "รถออก") {
        if (isSearching) {
          url = `${apiUrl}/parking/entry-exit-records/search`;
          requestBody = {
            licensePlate: searchQuery,
            page,
            limit: rowsPerPage
          };
        } else {
          url = `${apiUrl}/parking/entry-exit-records?page=${page}&limit=${rowsPerPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }
      } else {
        // For "ทั้งหมด" tab
        if (isSearching) {
          url = `${apiUrl}/parking/all-records/search`;
          requestBody = {
            licensePlate: searchQuery,
            page,
            limit: rowsPerPage,
            sortBy,
            sortOrder
          };
        } else {
          url = `${apiUrl}/parking/records?page=${page}&limit=${rowsPerPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }
      }
  
      // Make the appropriate request based on whether we're searching or not
      if (isSearching) {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
      } else {
        response = await fetch(url);
      }
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch data');
      }
  
      let formattedData = [];
  
      if (selected === "รถเข้า" && result.data) {
        formattedData = result.data.map((record) => ({
          entry_records_id: record.parking_record_id || record.entry_records_id,
          car: record.car,
          entry_time: record.entry_time,
          exit_time: null,
          parkedHours: record.parkedHours,
          parkingFee: record.parkingFee,
          payments: record.payments || [],
          type: "active",
          isVip: record.isVip || record.car.isVip,
          entry_car_image_path: record.entry_car_image_path,
        }));
      } else if (selected === "รถออก" && result.data) {
        formattedData = result.data.map((record) => ({
          entry_exit_records_id: record.parking_record_id || record.entry_exit_records_id,
          car: record.car,
          entry_time: record.entry_time,
          exit_time: record.exit_time,
          parkedHours: record.parkedHours,
          parkingFee: record.parkingFee,
          payments: record.payments || [],
          type: "completed",
          isVip: record.isVip || record.car.isVip,
          entry_car_image_path: record.entry_car_image_path,
        }));
      } else if (result.data) {
        formattedData = result.data.map((record) => ({
          entry_records_id:
            (record.type === "active" || !record.exit_time) ? 
            (record.parking_record_id || record.entry_records_id) : 
            null,
          entry_exit_records_id:
            (record.type === "completed" || record.exit_time) ? 
            (record.parking_record_id || record.entry_exit_records_id) : 
            null,
          car: record.car,
          entry_time: record.entry_time,
          exit_time: record.exit_time,
          parkedHours: record.parkedHours || record.parked_hours,
          parkingFee: record.parkingFee || record.parking_fee,
          payments: record.payments || [],
          type: record.exit_time ? "completed" : "active",
          isVip: record.isVip || record.car.isVip,
          entry_car_image_path: record.entry_car_image_path,
        }));
      }
  
      setData(formattedData);
  
      // Update pagination information
      const { totalPages } = extractPaginationInfo(result);
      setPageCount(totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect for fetching data when key parameters change
  useEffect(() => {
    fetchData();
  }, [selected, page, rowsPerPage, sortBy, sortOrder, searchQuery]);

  const handleNextPage = () => {
    if (page < pageCount) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };
  
  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleSelectChange = (btn) => {
    setSelected(btn);
    setPage(1);
    if (btn === "รถเข้า") {
      setSortBy("entryTime");
      setSortOrder("DESC");
    }
  };

  const handleRowClick = (index) => {
    setSelectedRow(data[index]);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRow(null);
  };

  const getCurrentRowRange = () => {
    return `หน้า ${page} จาก ${pageCount}`;
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
          <div className="flex gap-4 overflow-x-auto">
            {data.map((record, index) => (
              <div
                key={index}
                className="h-[110px] w-[130px] bg-gray-100 rounded-[8px] overflow-hidden relative flex-shrink-0"
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
                  onChange={handleSortChange}
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
                  onChange={handleSortOrderChange}
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
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
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
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-3xl px-4 py-[6rem] text-center text-gray-400"
                    >
                      {searchQuery ? "ไม่พบป้ายทะเบียนที่ค้นหา" : "ไม่มีข้อมูล"}
                    </td>
                  </tr>
                ) : (
                  data.map((row, index) => {
                    const serialNumber = (page - 1) * rowsPerPage + index + 1;
                    return (
                      <tr
                        key={index}
                        onClick={() => handleRowClick(index)}
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
          )}
        </div>
        <div className="flex justify-end items-center mt-4 gap-6">
          {data.length > 0 && (
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
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className={page === 1 ? "text-gray-300" : ""}
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextPage}
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