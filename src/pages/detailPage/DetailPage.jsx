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

  const buttons = ["ทั้งหมด", "รถเข้า", "รถออก"];

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchData = async (currentPage, limit) => {
    try {
      const response = await fetch(`${apiUrl}/entry-exit/list/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: currentPage,
          limit: limit,
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        setData(result.data.items);
        setFilteredData(result.data.items);
        setTotalRows(result.data.meta.total);
        setPageCount(result.data.meta.totalPages);
      } else {
        console.error("Failed to fetch data:", result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchEntryRecords = async (currentPage, limit) => {
    try {
      const response = await fetch(
        `${apiUrl}/parking/entry-records?page=${currentPage}&limit=${limit}`
      );
      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setFilteredData(result.data);
        setTotalRows(result.total);
        setPageCount(result.totalPages);
      } else {
        console.error("Failed to fetch entry records:", result);
      }
    } catch (error) {
      console.error("Error fetching entry records:", error);
    }
  };

  useEffect(() => {
    if (selected === "รถเข้า") {
      fetchEntryRecords(page, rowsPerPage);
    } else {
      fetchData(page, rowsPerPage);
    }
  }, [page, rowsPerPage, selected]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((row) =>
        row.car.license_plate.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, data]);

  const handleRowClick = (index) => {
    setSelectedRow(filteredData[index]);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRow(null);
  };

  const getCurrentRowRange = () => {
    const startRange = (page - 1) * rowsPerPage + 1;
    const endRange = Math.min(page * rowsPerPage, totalRows);
    return `${startRange}-${endRange} of ${totalRows}`;
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-[110px] w-[130px] bg-gray-300 flex items-center justify-center"
              >
                <span>Image {i + 1}</span>
              </div>
            ))}
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[110px] w-[130px]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-400 flex items-center justify-center h-[47px] w-[61px]"
                >
                  <span>Sub {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-5">
            {buttons.map((btn) => (
              <button
                key={btn}
                onClick={() => setSelected(btn)}
                className={`px-4 py-2 border border-[#007AFF]/15 text-[#007AFF] rounded-[8px] w-[87px] h-[40px] font-sm ${
                  selected === btn ? "bg-[#007AFF]/15" : "bg-white"
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 overflow-auto">
          <table className="table-auto w-full border-collapse text-gray-700">
            <thead>
              <tr>
                {[
                  "คันที่",
                  "ทะเบียนรถ",
                  "วันที่",
                  "เวลาเข้า",
                  "เวลาออก",
                  "ระยะเวลา",
                  "ค่าบริการ",
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
                    colSpan="7"
                    className="text-3xl px-4 py-[6rem] text-center text-gray-400"
                  >
                    ไม่พบป้ายทะเบียนที่ค้นหา
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => {
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
                        {new Date(row.entry_time).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(row.entry_time).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3">-</td>
                      <td className="px-4 py-3">-</td>
                      <td className="px-4 py-3">{row.parkingFee} บาท</td>
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
                <p className="text-sm text-gray-500">รายการต่อหน้า :</p>
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="text-sm py-1 px-2 border border-gray-300 rounded-md"
                >
                  {[5, 10, 15, 20].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-500">{getCurrentRowRange()}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setPage((prev) => (prev > 1 ? prev - 1 : pageCount))
                  }
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setPage((prev) => (prev < pageCount ? prev + 1 : 1))
                  }
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
        />
      </div>
    </PageCotainer>
  );
}

export default DetailPage;
