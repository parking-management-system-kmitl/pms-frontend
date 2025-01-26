import React, { useEffect, useState } from "react";
import AOS from "aos";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import "aos/dist/aos.css";
import "./DetailPage.css";
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
      <div className="detail-page">
        <div className="main-container">
          <div className="header">
            <div className="flex items-center justify-between">
              <h1
                className="font-inter font-bold text-3xl"
                data-aos="fade-right"
              >
                รายการเข้า-ออกที่จอดรถ
              </h1>
              <div className="searchbar" data-aos="fade-left">
                <svg
                  id="lens"
                  class="w-6 h-6"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>

                <form>
                  <input
                    type="text"
                    id="carname"
                    name="carname"
                    placeholder="ค้นหาป้ายทะเบียน"
                  />
                </form>
              </div>
            </div>
            <div>
              <div className="img-group">
                <div className="img-container" data-aos="zoom-out">
                  <img
                    className="big-img"
                    id="img1"
                    src="/images/car_pic_example.png"
                    alt="cat"
                  />
                  <span className="zoom-label">Zoom</span>
                </div>
                <div className="img-container" data-aos="zoom-out">
                  <img
                    className="big-img"
                    id="img2"
                    src="/images/car_pic_example.png"
                    alt="cat"
                  />
                  <span className="zoom-label">Zoom</span>
                </div>
                <div className="img-container" data-aos="zoom-out">
                  <img
                    className="big-img"
                    id="img3"
                    src="/images/car_pic_example.png"
                    alt="cat"
                  />
                  <span className="zoom-label">Zoom</span>
                </div>
                <div className="img-container" data-aos="zoom-out">
                  <img
                    className="big-img"
                    id="img4"
                    src="/images/car_pic_example.png"
                    alt="cat"
                  />
                  <span className="zoom-label">Zoom</span>
                </div>
                <div className="img-container" data-aos="zoom-out">
                  <img
                    className="big-img"
                    id="img5"
                    src="/images/car_pic_example.png"
                    alt="cat"
                  />
                  <span className="zoom-label">Zoom</span>
                </div>
                <div className="img-container" data-aos="zoom-out">
                  <img
                    className="big-img"
                    id="img6"
                    src="/images/car_pic_example.png"
                    alt="cat"
                  />
                  <span className="zoom-label">Zoom</span>
                </div>
                <div className="img-container" data-aos="zoom-out">
                  <img
                    className="big-img"
                    id="img7"
                    src="/images/car_pic_example.png"
                    alt="cat"
                  />
                  <span className="zoom-label">Zoom</span>
                </div>
                <div className="mini-img-group">
                  <img
                    id="mini-img1"
                    src="/images/car_pic_example.png"
                    alt="cat"
                    data-aos="zoom-out-down"
                  />
                  <img
                    id="mini-img2"
                    src="/images/car_pic_example.png"
                    alt="cat"
                    data-aos="zoom-out-down"
                  />
                  <img
                    id="mini-img3"
                    src="/images/car_pic_example.png"
                    alt="cat"
                    data-aos="zoom-out-down"
                  />
                  <img
                    id="mini-img4"
                    src="/images/car_pic_example.png"
                    alt="cat"
                    data-aos="zoom-out-down"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="info mt-3">
            <div className="table-container text-sm font-thin">
              <div className="table-wrapper">
                <table border="1" className="info-table">
                  <thead>
                    <tr className="border-b text-left px-4 py-3 text-gray-700 text-sm font-bold">
                      <th className="bg-blue-200">คันที่</th>
                      <th className="bg-blue-200">ทะเบียนรถ</th>
                      <th className="bg-blue-200">วันที่</th>
                      <th className="bg-blue-200">เวลาเข้า</th>
                      <th className="bg-blue-200">เวลาออก</th>
                      <th className="bg-blue-200">ระยะเวลา</th>
                      <th className="bg-blue-200">ค่าบริการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => {
                      const serialNumber = (page - 1) * rowsPerPage + index + 1; // คำนวณลำดับคันที่
                      return (
                        <tr key={index} onClick={() => handleRowClick(index)}>
                          <td>{serialNumber}</td>
                          <td>{row.licenseplate}</td>
                          <td>{row.date}</td>
                          <td>{row.entrytime}</td>
                          <td>{row.exittime}</td>
                          <td>{row.duration}</td>
                          <td>{row.fee}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center mt-4 gap-6">
            <div className="flex items-center">
              <p className="text-sm font-thin">Rows per page:</p>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="py-1 text-sm font-thin ml-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
            <p className="text-sm font-thin">{getCurrentRowRange()}</p>
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
            selectedRow={data[selectedRow]} // ส่งข้อมูลแถวที่เลือก
            selectedDiscount={selectedDiscount}
            setSelectedDiscount={setSelectedDiscount}
          />
        </div>
      </div>
    </PageCotainer>
  );
}

export default DetailPage;
