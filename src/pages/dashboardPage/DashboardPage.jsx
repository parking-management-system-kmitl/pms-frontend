import { useState } from "react";
import { Card } from "../../components/ui/Card";
import DatePicker, { registerLocale } from "react-datepicker";
import { th } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "./DashboardPage.css";
import { Button } from "../../components/ui/Button";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
} from "recharts";

import { Calendar, Activity, CarFront, CarRear } from "lucide-react";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import PageCotainer from "../PageCotainer";
import income from "../../assets/income.svg";
import carIn from "../../assets/car_in.svg";
import carOut from "../../assets/car_out.svg";

registerLocale("th", th);

const Dashboard = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState(null);

  const handleRangeSelect = (range) => {
    setSelectedRange(range.label);
    setDateRange(range.days, range.type || "days");
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const predefinedRanges = [
    { label: "วันนี้", days: 0 },
    { label: "เมื่อวาน", days: 1 },
    { label: "7 วันล่าสุด", days: 7 },
    { label: "30 วันล่าสุด", days: 30 },
    { label: "เดือนนี้", days: 0, type: "month" },
    { label: "เดือนที่แล้ว", days: 1, type: "month" },
  ];

  const setDateRange = (days, type = "days") => {
    const today = new Date();
    let pastDate = new Date();

    if (type === "month") {
      if (days === 0) {
        // "เดือนนี้" (current month)
        pastDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the current month
        today.setMonth(today.getMonth() + 1, 0); // Last day of the current month
      } else if (days === 1) {
        // "เดือนที่แล้ว" (previous month)
        pastDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); // First day of the previous month
        today.setMonth(today.getMonth(), 0); // Last day of the previous month
      }
    } else if (days === 1) {
      // "เมื่อวาน" (yesterday)
      pastDate.setDate(today.getDate() - 1);
      today.setDate(today.getDate() - 1); // End date also set to yesterday
    } else {
      pastDate.setDate(today.getDate() - days); // For ranges like 7 days or 30 days
    }

    setStartDate(pastDate);
    setEndDate(today);
  };

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
              <div className="absolute right-0 top-[3rem] mt-2 bg-white p-4 rounded-lg z-10 flex flex-row gap-4 shadow-[0px_0px_54px_rgba(0,0,0,0.07)]">
                <div className="p-4 border-r">
                  {predefinedRanges.map((range) => (
                    <p
                      key={range.label}
                      className={`cursor-pointer p-2 hover:bg-gray-100 w-[100px] font-thin text-sm text-gray-500 
                          ${
                            selectedRange === range.label
                              ? "bg-gray-50 border-r-4 border-blue-500 text-blue-400"
                              : ""
                          }`}
                      onClick={() => handleRangeSelect(range)} // Update the selected range on click
                    >
                      {range.label}
                    </p>
                  ))}
                </div>
                <div className="p-2">
                  <div className="flex gap-3">
                    <DatePicker
                      selected={startDate}
                      onChange={handleDateChange}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      locale="th"
                      dateFormat="dd/MM/yyyy"
                      className="border p-2 rounded w-full flex"
                      inline
                      monthsShown={2}
                    />
                  </div>
                  <div className="flex justify-end gap-6 mt-2">
                    <Button
                      className="text-gray-500"
                      style={{ color: "#007AFF" }}
                      onClick={() => setShowDatePicker(false)}
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      className="text-white"
                      style={{ backgroundColor: "#007AFF" }}
                      onClick={() => setShowDatePicker(false)}
                    >
                      เลือก
                    </Button>
                  </div>
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
            <ResponsiveContainer width="100%" height={250} className="pl-6 pr-6">
  <AreaChart data={data.revenueData}>
    <defs>
      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3998FF" stopOpacity={1} />
        <stop offset="49%" stopColor="#66AFFF" stopOpacity={0.5} />
        <stop offset="100%" stopColor="#E5EAFC" stopOpacity={0.26} />
      </linearGradient>
    </defs>
    <XAxis dataKey="month" tick={{ fontSize: "12px" }} />
    <Tooltip
      itemStyle={{
        color: "white",
        fontSize: "14px",
      }}
      contentStyle={{
        backgroundColor: "black",
        borderRadius: "8px",
        padding: "10px",
      }}
      labelStyle={{
        color: "#E5E5EF",
        fontSize: "14px",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
    <Area
      type="monotone"
      dataKey="revenue"
      stroke="#007AFF"
      strokeWidth={2}
      fill="url(#colorRevenue)"
    />
  </AreaChart>
</ResponsiveContainer>

          </Card>
          <Card className="p-4">
            <p className="pt-4 text-lg font-bold mb-6">ภาพรวมรถเข้า-ออก</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.carData}>
                <CartesianGrid strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: "12px" }} />
                <YAxis tick={{ fontSize: "12px" }} />
                <Tooltip
                  itemStyle={{
                    color: "white", // เปลี่ยนสีข้อความใน tooltip
                    fontSize: "14px",
                  }}
                  contentStyle={{
                    backgroundColor: "black", // เปลี่ยนพื้นหลังเป็นสีดำ
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                  labelStyle={{
                    color: "#E5E5EF", // เปลี่ยนสีของ label (วันที่) เป็นสีเทา
                    fontSize: "14px",
                    textAlign: "center", // จัดตำแหน่งข้อความให้ตรงกลาง
                    display: "flex",
                    justifyContent: "center", // ทำให้เนื้อหาอยู่กลาง
                    alignItems: "center",
                  }}
                />
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
                    if (value === "entries") {
                      return <span style={{ color: "#615E83" }}>รถเข้า</span>;
                    }
                    if (value === "exits") {
                      return <span style={{ color: "#615E83" }}>รถออก</span>;
                    }
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
