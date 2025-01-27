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
  const [totalRows, setTotalRows] = useState(0);
  const [pageCount, setPageCount] = useState(1);

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
        setTotalRows(result.data.meta.total);
        setPageCount(result.data.meta.totalPages);
      } else {
        console.error("Failed to fetch data:", result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleRowClick = (rowIndex) => {
    setSelectedRow(rowIndex);
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

  return (
    <PageCotainer>
      <div className="flex flex-col">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1
              className="font-inter font-bold text-3xl"
              data-aos="fade-right"
            >
              รายการเข้า-ออกที่จอดรถ
            </h1>
            <div
              className="flex items-center px-4 gap-4 bg-blue-100 text-gray-600 rounded-full w-1/3 h-12 ml-auto"
              data-aos="fade-left"
            >
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
              />
            </div>
          </div>
          <div className="flex w-full">
            <div className="flex gap-5 h-50">
              {Array(6)
                .fill("/images/car_pic_example.png")
                .map((src, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 w-[15%] h-full overflow-hidden"
                    data-aos="zoom-out"
                  >
                    <img
                      className="w-full h-full rounded-xl"
                      src={src}
                      alt={`car-${index + 1}`}
                    />
                    <span className="absolute bottom-0 right-0 text-center bg-blue-500 text-white py-1 px-3 rounded-tl-lg text-sm">
                      Zoom
                    </span>
                  </div>
                ))}
            </div>
          <div className="grid grid-cols-2 gap-2 w-1/3">
            {Array(4)
              .fill("/images/car_pic_example.png")
              .map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`mini-car-${index + 1}`}
                  className="w-full h-20 rounded-lg overflow-hidden"
                  data-aos="zoom-out-down"
                />
              ))}
          </div>
          </div>
        </div>
        <div className="mt-6 overflow-auto">
          <table className="table-auto w-full border-collapse text-gray-700">
            <thead>
              <tr>
                {["คันที่", "ทะเบียนรถ", "วันที่", "เวลาเข้า", "เวลาออก", "ระยะเวลา", "ค่าบริการ"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-4 py-3 bg-blue-200 sticky top-0 text-left"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const serialNumber = (page - 1) * rowsPerPage + index + 1;
                return (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(index)}
                    className="border-b hover:bg-blue-50 cursor-pointer"
                  >
                    <td className="px-4 py-3">{serialNumber}</td>
                    <td className="px-4 py-3">{row.licenseplate}</td>
                    <td className="px-4 py-3">{row.date}</td>
                    <td className="px-4 py-3">{row.entrytime}</td>
                    <td className="px-4 py-3">{row.exittime}</td>
                    <td className="px-4 py-3">{row.duration}</td>
                    <td className="px-4 py-3">{row.fee} บาท</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end items-center mt-4 gap-6">
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">Rows per page:</p>
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
        </div>
        <CarDetailModal
          isVisible={modalVisible}
          onClose={closeModal}
          selectedRow={data[selectedRow]}
          selectedDiscount={selectedDiscount}
          setSelectedDiscount={setSelectedDiscount}
        />
      </div>
    </PageCotainer>
  );
}

export default DetailPage;
