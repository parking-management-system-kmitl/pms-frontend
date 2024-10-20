import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./DetailPage.css";

function DetailPage() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState("");

  const rows = 10;
  const columns = 8;

  const handleRowClick = (rowIndex) => {
    setSelectedRow(rowIndex);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRow(null);
  };

  return (
    <div className="detail-page">
      <div className="main-container">
        <button
          data-drawer-target="logo-sidebar"
          data-drawer-toggle="logo-sidebar"
          aria-controls="logo-sidebar"
          type="button"
          class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span class="sr-only">Open sidebar</span>
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>
        <aside
          id="logo-sidebar"
          className="fixed top-0 left-0 z-40 w-20 h-screen transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              <li class="mt-5">
                <a
                  href="#"
                  className="flex flex-col items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-col items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <img
                    style={{ color: "white" }}
                    src="/images/user_icon.png"
                    alt="profilePic"
                  />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-col items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <img
                    style={{
                      width: "500px",
                      height: "32px",
                      objectFit: "cover",
                    }}
                    src="/images/car_icon.png"
                    alt="car_icon"
                  />
                  <span className="text-sm">Car</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-col items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <img
                    style={{
                      width: "500px",
                      height: "32px",
                      objectFit: "cover",
                    }}
                    src="/images/vip_icon.png"
                    alt="vip_icon"
                  />
                  <span className="text-sm">VIP</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-col items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <img
                    style={{
                      width: "500px",
                      height: "32px",
                      objectFit: "cover",
                    }}
                    src="/images/dashboard_icon.png"
                    alt="dashboard_icon"
                  />
                  <span className="text-sm">Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-col items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <img
                    style={{
                      width: "500px",
                      height: "32px",
                      objectFit: "cover",
                    }}
                    src="/images/pay_icon.png"
                    alt="pay_icon"
                  />
                  <span className="text-sm">Pay</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>
        <div className="right-container">
          <div className="header">
            <div className="flex items-center justify-between mr-40">
              <h1 className="font-inter font-bold text-3xl" data-aos="fade-right">
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
                <img id="img1" src="/images/cat.jpg" alt="cat" data-aos="zoom-out"/>
                <img id="img2" src="/images/cat.jpg" alt="cat" data-aos="zoom-out"/>
                <img id="img3" src="/images/cat.jpg" alt="cat" data-aos="zoom-out"/>
                <div className="mini-img-group">
                  <img id="mini-img1" src="/images/cat.jpg" alt="cat" data-aos="zoom-out-down"/>
                  <img id="mini-img2" src="/images/cat.jpg" alt="cat" data-aos="zoom-out-down"/>
                  <img id="mini-img3" src="/images/cat.jpg" alt="cat" data-aos="zoom-out-down"/>
                  <img id="mini-img4" src="/images/cat.jpg" alt="cat" data-aos="zoom-out-down"/>
                </div>
              </div>
            </div>
          </div>

          <div className="info">
            <div className="table-container">
              <div className="table-wrapper">
                <table border="1" className="info-table">
                  <thead>
                    <tr>
                      <th>คันที่</th>
                      <th>เลขทะเบียนรถ</th>
                      <th>วันที่</th>
                      <th>เวลาเข้า</th>
                      <th>เวลาออก</th>
                      <th>ระยะเวลาการจอด</th>
                      <th>ค่าบริการ (บาท)</th>
                      <th>หมายเหตุ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                      <tr
                        key={rowIndex}
                        onClick={() => handleRowClick(rowIndex)}
                      >
                        {Array.from({ length: columns }).map((_, colIndex) => (
                          <td key={colIndex}>
                            R {rowIndex + 1}, C {colIndex + 1}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {modalVisible && (
            <div className="modal">
              <div className="modal-content">
                <span className="close mr-6 mt-3" onClick={closeModal}>
                  &times;
                </span>
                <div className="modal-container">
                  <div className="modal-left">
                    <h1 className="font-inter text-blue-500 text-lg font-semibold">
                      วันศุกร์ ที่ 6 สิงหาคม 2024 เวลา 14:32:04
                    </h1>
                    <img
                      className="mt-3"
                      src="/images/car_pic_example.png"
                      alt="car-pic"
                    />
                    <p className="font-semibold flex justify-between items-center mt-3">
                      เลขทะเบียน
                      <span className="font-semibold text-gray-500 flex font-inter text-center border-2 rounded-md p-1 bg-gray-50 w-8/12 h-10 items-center justify-center">
                        วล 3670
                      </span>
                    </p>
                    <p className="font-semibold flex justify-between items-center mt-3">
                      วันที่-เวลาที่บันทึก
                      <span className="font-semibold text-gray-500 flex font-inter text-center border-2 rounded-md p-1 bg-gray-50 w-8/12 h-10 items-center justify-center">
                        วันที่ 02/08/2024 17:00:00
                      </span>
                    </p>
                    <p className="font-semibold flex justify-between items-center mt-3">
                      VIP member
                      <span className="font-semibold text-gray-500 flex font-inter text-center border-2 rounded-md p-1 bg-gray-50 w-8/12 h-10 items-center justify-center">
                        -
                      </span>
                    </p>
                  </div>
                  <div className="modal-right">
                    <p className="font-inter mb-1 text-sm text-gray-600">
                      ค่าบริการ (บาท)
                    </p>
                    <div className="price-container mb-2 rounded-lg border-b-4 border-blue-500">
                      <h1 className="font-inter text-5xl text-blue-500 font-bold">
                        90
                      </h1>
                    </div>
                    <p className="font-inter mb-1 text-sm text-gray-600">
                      ส่วนลดต่างๆ
                    </p>
                    <div className="dropdown-container mb-3">
                      <select
                        value={selectedDiscount}
                        onChange={(e) => setSelectedDiscount(e.target.value)}
                        className="dropdown"
                      >
                        <option value="" disabled>
                          <p className="font-inter text-sm text-gray-200">
                            กรุณาเลือกส่วนลดอื่นๆ
                          </p>
                        </option>

                        <option className="font-inter" value="discount1">
                          ส่วนลด 10%
                        </option>
                        <option className="font-inter" value="discount2">
                          ส่วนลด 20%
                        </option>
                        <option className="font-inter" value="discount3">
                          ส่วนลด 30%
                        </option>
                      </select>
                      <span className="arrow-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 9l6 6 6-6"
                          />
                        </svg>
                      </span>
                    </div>
                    <h1 className="font-inter text-sm mb-1 text-gray-600">
                      รายละเอียด
                    </h1>
                    <p className="font-inter text-sm mb-1 flex justify-between text-gray-500">
                      เวลาเข้า: <span>17:00:00</span>
                    </p>
                    <p className="font-inter text-sm mb-1 flex justify-between text-gray-500">
                      เวลาออก: <span>20:45:45</span>
                    </p>
                    <p className="font-inter text-sm mb-1 flex justify-between text-gray-500">
                      ระยะเวลาการจอด: <span>3 ชั่วโมง 45 นาที</span>
                    </p>
                    <p className="font-inter text-sm mb-1 flex justify-between text-gray-500">
                      สิทธิ์จอดฟรี: <span>1 ชั่วโมง 0 นาที</span>
                    </p>
                    <p className="font-inter text-sm mb-1 flex justify-between text-gray-500">
                      ค่าบริการจอดรถ: <span>90 บาท</span>
                    </p>
                    <p className="font-inter text-sm mb-3 flex justify-between text-gray-500">
                      ชำระแล้ว: <span>0 บาท</span>
                    </p>
                    <button className="bg-gray-100 w-full h-10 rounded-lg text-gray-400">
                      ยืนยัน
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
