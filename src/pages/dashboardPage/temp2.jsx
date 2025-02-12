import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  CartesianGrid,
  Legend,
} from "recharts";

import { Calendar, Activity, CarFront, CarRear } from "lucide-react";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import PageCotainer from "../PageCotainer";
import income from "../../assets/income.svg";
import carIn from "../../assets/car_in.svg";
import carOut from "../../assets/car_out.svg";

const Dashboard = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const data = {
    totalRevenue: 30000,
    revenueChange: -4.3,
    totalEntries: 540,
    entriesChange: 8.5,
    totalExits: 500,
    exitsChange: 8.5,
    revenueData: [
      { month: "ม.ค.", revenue: 10000 },
      { month: "ก.พ.", revenue: 15000 },
      { month: "มี.ค.", revenue: 30000 },
      { month: "เม.ย.", revenue: 25000 },
      { month: "พ.ค.", revenue: 20000 },
      { month: "มิ.ย.", revenue: 5000 },
      { month: "ก.ค.", revenue: 28000 },
      { month: "ส.ค.", revenue: 26000 },
      { month: "ก.ย.", revenue: 22000 },
      { month: "ต.ค.", revenue: 18000 },
      { month: "พ.ย.", revenue: 24000 },
      { month: "ธ.ค.", revenue: 15000 },
    ],
    carData: [
      { month: "ม.ค.", entries: 400, exits: 350 },
      { month: "ก.พ.", entries: 450, exits: 400 },
      { month: "มี.ค.", entries: 500, exits: 450 },
      { month: "เม.ย.", entries: 300, exits: 250 },
      { month: "พ.ค.", entries: 350, exits: 300 },
      { month: "มิ.ย.", entries: 600, exits: 550 },
      { month: "ก.ค.", entries: 700, exits: 650 },
      { month: "ส.ค.", entries: 500, exits: 450 },
      { month: "ก.ย.", entries: 400, exits: 350 },
      { month: "ต.ค.", entries: 300, exits: 250 },
      { month: "พ.ย.", entries: 500, exits: 450 },
      { month: "ธ.ค.", entries: 600, exits: 550 },
    ],
  };

  return (
    <PageCotainer>
      <div className="pt-6 min-h-screen">
        <div className="flex justify-between items-center">
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-6">แดชบอร์ด</h1>
            <div className="flex justify-between items-center">
              <p className="font-medium">ภาพรวม (ม.ค. 67 - ธ.ค. 67)</p>
              <div className="flex items-center gap-6">
                <h1 className="font-medium">ข้อมูล ณ วันที่ 30 ธ.ค. 67</h1>
                <Button
                  className="flex gap-2 border border-blue-300 text-blue-500 rounded-lg"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <Calendar size={20} /> กำหนดเอง
                </Button>
              </div>
            </div>
          </div>
          <div className="relative flex items-center gap-6">
            {showDatePicker && (
              <div className="absolute right-6 top-6 mt-6 z-10">
                <div class="w-80 sm:w-[638px] flex flex-col bg-white border shadow-lg rounded-xl overflow-hidden">
                  {/* <!-- Calendar --> */}
                  <div class="sm:flex">
                    {/* <!-- Calendar --> */}
                    <div class="p-3 space-y-0.5">
                      {/* <!-- Months --> */}
                      <div class="grid grid-cols-5 items-center gap-x-3 mx-1.5 pb-3">
                        {/* <!-- Prev Button --> */}
                        <div class="col-span-1">
                          <button
                            type="button"
                            class="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            aria-label="Previous"
                          >
                            <svg
                              class="shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                          </button>
                        </div>
                        {/* <!-- End Prev Button --> */}

                        {/* <!-- Month / Year --> */}
                        <div class="col-span-3 flex justify-center items-center gap-x-1">
                          <div class="relative">
                            <select
                              data-hs-select='{
                              "placeholder": "Select month",
                              "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                              "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-blue-600 focus:outline-none focus:text-blue-600 before:absolute before:inset-0 before:z-[1]",
                              "dropdownClasses": "mt-2 z-50 w-32 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                              "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100",
                              "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-gray-800" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"
                            }'
                              class="hidden"
                            >
                              <option value="0">January</option>
                              <option value="1">February</option>
                              <option value="2">March</option>
                              <option value="3">April</option>
                              <option value="4">May</option>
                              <option value="5">June</option>
                              <option value="6" selected>
                                July
                              </option>
                              <option value="7">August</option>
                              <option value="8">September</option>
                              <option value="9">October</option>
                              <option value="10">November</option>
                              <option value="11">December</option>
                            </select>
                          </div>

                          <span class="text-gray-800">/</span>

                          <div class="relative">
                            <select
                              data-hs-select='{
                              "placeholder": "Select year",
                              "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                              "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-blue-600 focus:outline-none focus:text-blue-600 before:absolute before:inset-0 before:z-[1]",
                              "dropdownClasses": "mt-2 z-50 w-20 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                              "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100",
                              "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-gray-800" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"
                            }'
                              class="hidden"
                            >
                              <option selected>2023</option>
                              <option>2024</option>
                              <option>2025</option>
                              <option>2026</option>
                              <option>2027</option>
                            </select>
                          </div>
                        </div>
                        {/* <!-- End Month / Year --> */}

                        {/* <!-- Next Button --> */}
                        <div class="col-span-1 flex justify-end">
                          <button
                            type="button"
                            class="opacity-0 pointer-events-none size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            aria-label="Next"
                          >
                            <svg
                              class="shrink-0 size-4"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </button>
                        </div>
                        {/* <!-- End Next Button --> */}
                      </div>
                      {/* <!-- Months --> */}

                      {/* <!-- Weeks --> */}
                      <div class="flex pb-1.5">
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          Mo
                        </span>
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          Tu
                        </span>
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          We
                        </span>
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          Th
                        </span>
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          Fr
                        </span>
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          Sa
                        </span>
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          Su
                        </span>
                      </div>
                      {/* <!-- Weeks --> */}

                      {/* <!-- Days --> */}
                      <div class="flex">
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                            disabled
                          >
                            26
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                            disabled
                          >
                            27
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                            disabled
                          >
                            28
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                            disabled
                          >
                            29
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                            disabled
                          >
                            30
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            1
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            2
                          </button>
                        </div>
                      </div>
                      {/* <!-- Days --> */}

                      {/* <!-- Days --> */}
                      <div class="flex">
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            3
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            4
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            5
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            6
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            7
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            8
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            9
                          </button>
                        </div>
                      </div>
                      {/* <!-- Days --> */}

                      {/* <!-- Days --> */}
                      <div class="flex">
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            10
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            11
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            12
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            13
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            14
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            15
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            16
                          </button>
                        </div>
                      </div>
                      {/* <!-- Days --> */}

                      {/* <!-- Days --> */}
                      <div class="flex">
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            17
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            18
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            19
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            20
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            21
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            22
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            23
                          </button>
                        </div>
                      </div>
                      {/* <!-- Days --> */}

                      {/* <!-- Days --> */}
                      <div class="flex">
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            24
                          </button>
                        </div>
                        <div class="bg-gray-100 rounded-s-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center bg-blue-600 border border-transparent text-sm font-medium text-white hover:border-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          >
                            25
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            26
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            27
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            28
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            29
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            30
                          </button>
                        </div>
                      </div>
                      {/* <!-- Days --> */}

                      {/* <!-- Days --> */}
                      <div class="flex">
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            31
                          </button>
                        </div>
                        <div class="bg-gradient-to-r from-gray-100">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            1
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            2
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            3
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            4
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            5
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            6
                          </button>
                        </div>
                      </div>
                      {/* <!-- Days --> */}
                    </div>

                    {/* <!-- Calendar --> */}
                    <div class="p-3 space-y-0.5">
                      {/* <!-- Months --> */}
                      <div class="grid grid-cols-5 items-center gap-x-3 mx-1.5 pb-3">
                        {/* <!-- Prev Button --> */}
                        <div class="col-span-1">
                          <button
                            type="button"
                            class="opacity-0 pointer-events-none size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            aria-label="Previous"
                          >
                            <svg
                              class="shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                          </button>
                        </div>
                        {/* <!-- End Prev Button --> */}

                        {/* <!-- Month / Year --> */}
                        <div class="col-span-3 flex justify-center items-center gap-x-1">
                          <div class="relative">
                            <select
                              data-hs-select='{
                              "placeholder": "Select month",
                              "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                              "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-blue-600 focus:outline-none focus:text-blue-600 before:absolute before:inset-0 before:z-[1]",
                              "dropdownClasses": "mt-2 z-50 w-32 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                              "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100",
                              "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-gray-800" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"
                            }'
                              class="hidden"
                            >
                              <option value="0">January</option>
                              <option value="1">February</option>
                              <option value="2">March</option>
                              <option value="3">April</option>
                              <option value="4">May</option>
                              <option value="5">June</option>
                              <option value="6" selected>
                                July
                              </option>
                              <option value="7">August</option>
                              <option value="8">September</option>
                              <option value="9">October</option>
                              <option value="10">November</option>
                              <option value="11">December</option>
                            </select>
                          </div>

                          <span class="text-gray-800">/</span>

                          <div class="relative">
                            <select
                              data-hs-select='{
                              "placeholder": "Select year",
                              "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                              "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-blue-600 focus:outline-none focus:text-blue-600 before:absolute before:inset-0 before:z-[1]",
                              "dropdownClasses": "mt-2 z-50 w-20 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                              "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100",
                              "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-gray-800" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"
                            }'
                              class="hidden"
                            >
                              <option selected>2023</option>
                              <option>2024</option>
                              <option>2025</option>
                              <option>2026</option>
                              <option>2027</option>
                            </select>
                          </div>
                        </div>
                        {/* <!-- End Month / Year --> */}

                        {/* <!-- Next Button --> */}
                        <div class="col-span-1 flex justify-end">
                          <button
                            type="button"
                            class="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            aria-label="Next"
                          >
                            <svg
                              class="shrink-0 size-4"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </button>
                        </div>
                        {/* <!-- End Next Button --> */}
                      </div>
                      {/* <!-- Months --> */}

                      {/* <!-- Weeks --> */}
                      <div class="flex pb-1.5">
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          Mo
                        </span>
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          Tu
                        </span>
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          We
                        </span>
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          Th
                        </span>
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          Fr
                        </span>
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          Sa
                        </span>
                        <span class="m-px w-10 block text-center text-sm text-gray-500">
                          Su
                        </span>
                      </div>
                      {/* <!-- Weeks --> */}

                      {/* <!-- Days --> */}
                      <div class="flex">
                        <div class="bg-gradient-to-l from-gray-100">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            31
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          >
                            1
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          >
                            2
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          >
                            3
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          >
                            4
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            5
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            6
                          </button>
                        </div>
                      </div>
                      {/* <!-- Days --> */}

                      {/* <!-- Days --> */}
                      <div class="flex">
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            7
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            8
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            9
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            10
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            11
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            12
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            13
                          </button>
                        </div>
                      </div>
                      {/* <!-- Days --> */}

                      {/* <!-- Days --> */}
                      <div class="flex">
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            14
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            15
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            16
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            17
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            18
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            19
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            20
                          </button>
                        </div>
                      </div>
                      {/* <!-- Days --> */}

                      {/* <!-- Days --> */}
                      <div class="flex">
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            21
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            22
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            23
                          </button>
                        </div>
                        <div class="bg-gray-100 first:rounded-s-full last:rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            24
                          </button>
                        </div>
                        <div class="bg-gray-100 rounded-e-full">
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center bg-blue-600 border border-transparent text-sm font-medium text-white hover:border-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                          >
                            25
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            26
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            27
                          </button>
                        </div>
                      </div>
                      {/* <!-- Days --> */}

                      {/* <!-- Days --> */}
                      <div class="flex">
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            28
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            29
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            30
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:border-blue-600 focus:text-blue-600"
                          >
                            31
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            1
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            2
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            3
                          </button>
                        </div>
                      </div>
                      {/* <!-- Days --> */}

                      {/* <!-- Days --> */}
                      <div class="flex">
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            4
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            5
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            6
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            7
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            8
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            9
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="m-px size-10 flex justify-center items-center border border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100"
                            disabled
                          >
                            10
                          </button>
                        </div>
                      </div>
                      {/* <!-- Days --> */}
                    </div>
                  </div>
                  {/* <!-- End Calendar --> */}

                  {/* <!-- Button Group --> */}
                  <div class="flex items-center py-3 px-4 justify-end border-t border-gray-200 gap-x-2">
                    <span class="md:me-3 text-xs text-gray-500">
                      20.07.2023 - 10.08.2023
                    </span>
                    <button
                      type="button"
                      class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      class="py-2 px-3  inline-flex justify-center items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Apply
                    </button>
                  </div>
                  {/* <!-- End Button Group --> */}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-600 font-medium mb-3">รายได้รวม</p>
                <h2 className="text-3xl font-bold mb-6">
                  {data.totalRevenue.toLocaleString()}
                </h2>
              </div>
              <img
                src={income}
                alt="income icon"
                className="text-xl self-start"
              />
            </div>
            <p className="flex items-center text-sm text-red-500">
              <HiTrendingDown className="mr-2 text-2xl" />
              {data.revenueChange}% ลดลงจากปัจจุบัน
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-600 font-medium mb-3">จำนวนรถเข้า</p>
                <h2 className="text-3xl font-bold mb-6 ">
                  {data.totalEntries}
                </h2>
              </div>
              <img
                src={carIn}
                alt="car in icon"
                className="text-xl self-start"
              />
            </div>
            <p className="flex items-center text-sm text-green-500">
              <HiTrendingUp className="mr-2 text-2xl" />
              {data.entriesChange}% เพิ่มขึ้นจากปัจจุบัน
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-600 font-medium mb-3">จำนวนรถออก</p>
                <h2 className="text-3xl font-bold mb-6">{data.totalExits}</h2>
              </div>
              <img
                src={carOut}
                alt="car out icon"
                className="text-xl self-start"
              />
            </div>
            <p className="flex items-center text-sm text-green-500">
              <HiTrendingUp className="mr-2 text-2xl" />
              {data.exitsChange}% เพิ่มขึ้นจากปัจจุบัน
            </p>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 h-[300px]">
          <Card className="p-4">
            <p className="pt-4 pb-[3rem] text-lg font-bold">ภาพรวมรายได้</p>
            <ResponsiveContainer
              width="100%"
              height={250}
              className="pl-6 pr-6"
            >
              <LineChart data={data.revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3998FF" stopOpacity={1} />
                    <stop offset="49%" stopColor="#66AFFF" stopOpacity={0.5} />
                    <stop
                      offset="100%"
                      stopColor="#E5EAFC"
                      stopOpacity={0.26}
                    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: "12px" }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fill="url(#colorRevenue)"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#007AFF"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-4">
            <p className="pt-4 text-lg font-bold mb-6">ภาพรวมรถเข้า-ออก</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.carData}>
                <CartesianGrid strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: "12px" }} />
                <YAxis tick={{ fontSize: "12px" }} />
                <Tooltip />
                <Legend
                  iconType="circle"
                  verticalAlign="top"
                  align="center"
                  layout="horizontal"
                  wrapperStyle={{
                    paddingBottom: 20,
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                  formatter={(value) => {
                    if (value === "entries") return "รถเข้า";
                    if (value === "exits") return "รถออก";
                    return value;
                  }}
                />
                <Bar dataKey="entries" fill="#007AFF" radius={[10, 10, 0, 0]} />
                <Bar dataKey="exits" fill="#D9EBFF" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </PageCotainer>
  );
};

export default Dashboard;
