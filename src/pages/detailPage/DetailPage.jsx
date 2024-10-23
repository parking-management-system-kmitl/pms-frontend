import React, { useEffect, useState } from "react";
import AOS from "aos";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { MOCK_DATA_API , CARDETAIL_TABLE_HEADER , MOCK_CARDETAIL_TABLE} from "../../features/carDetailModal/constants"; //ยืมก่อน เดี๋ยวค่อยแก้ เขาไม่รู้
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

  const columns = 8;

  const handleRowClick = (rowIndex) => {
    setSelectedRow(rowIndex);
    setModalVisible(true);
    console.log(modalVisible);
    console.log(rowIndex);
  };
  

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRow(null);
  };

  const getCurrentRowRange = () => {
    const startRange = (page - 1) * rowsPerPage + 1;
    const endRange = Math.min(page * rowsPerPage, MOCK_DATA_API.rows);
    return `${startRange}-${endRange} of ${MOCK_DATA_API.rows}`;
  };

  const pageCount = Math.ceil(MOCK_DATA_API.rows / MOCK_DATA_API.pageSize);

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
                <img className="big-img" id="img1" src="/images/car_pic_example.png" alt="cat" />
                <span className="zoom-label">Zoom</span>
              </div>
              <div className="img-container" data-aos="zoom-out">
                <img className="big-img" id="img2" src="/images/car_pic_example.png" alt="cat" />
                <span className="zoom-label">Zoom</span>
              </div>
              <div className="img-container" data-aos="zoom-out">
                <img className="big-img" id="img3" src="/images/car_pic_example.png" alt="cat" />
                <span className="zoom-label">Zoom</span>
              </div>
              <div className="img-container" data-aos="zoom-out">
                <img className="big-img" id="img4" src="/images/car_pic_example.png" alt="cat" />
                <span className="zoom-label">Zoom</span>
              </div>
              <div className="img-container" data-aos="zoom-out">
                <img className="big-img" id="img5" src="/images/car_pic_example.png" alt="cat" />
                <span className="zoom-label">Zoom</span>
              </div>
              <div className="img-container" data-aos="zoom-out">
                <img className="big-img" id="img6" src="/images/car_pic_example.png" alt="cat" />
                <span className="zoom-label">Zoom</span>
              </div>
              <div className="img-container" data-aos="zoom-out">
                <img className="big-img" id="img7" src="/images/car_pic_example.png" alt="cat" />
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
                    <tr>
                    {CARDETAIL_TABLE_HEADER.map((label) => (
                      <th
                        key={label}
                        className="border-b bg-blue-200 text-left px-4 py-3 text-gray-700 text-sm font-bold"
                      >
                        {label}
                      </th>
                    ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_CARDETAIL_TABLE.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, rowIndex) => (
                      <tr key={rowIndex} onClick={() => handleRowClick(rowIndex)}>
                        <td>{row.id}</td>
                        <td>{row.licensePlate}</td>
                        <td>{row.date}</td>
                        <td>{row.checkInTime}</td>
                        <td>{row.checkOutTime}</td>
                        <td>{row.duration}</td>
                        <td>{row.serviceFee}</td>
                        <td>{row.remarks}</td>
                      </tr>
                    ))}
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
          <CarDetailModal
            isVisible={modalVisible}
            onClose={closeModal}
            selectedRow={selectedRow}
            selectedDiscount={selectedDiscount}
            setSelectedDiscount={setSelectedDiscount}
          />
        </div>
      </div>
    </PageCotainer>
  );
}

export default DetailPage;
