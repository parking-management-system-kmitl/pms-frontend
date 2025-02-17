import { useState, useEffect } from "react";
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
import { Calendar } from "lucide-react";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import PageCotainer from "../PageCotainer";
import income from "../../assets/income.svg";
import carIn from "../../assets/car_in.svg";
import carOut from "../../assets/car_out.svg";
import { format, differenceInDays } from "date-fns";

registerLocale("th", th);

const Dashboard = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleRangeSelect = (range) => {
    setSelectedRange(range.label);
    const dates = calculateDateRange(range.days, range.type || "days");
    setTempStartDate(dates.start);
    setTempEndDate(dates.end);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setTempStartDate(start);
    setTempEndDate(end);
  };

  const calculateDateRange = (days, type = "days") => {
    const today = new Date();
    let pastDate = new Date();

    if (type === "month") {
      if (days === 0) {
        pastDate = new Date(today.getFullYear(), today.getMonth(), 1);
        today.setMonth(today.getMonth() + 1, 0);
      } else if (days === 1) {
        pastDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        today.setMonth(today.getMonth(), 0);
      }
    } else if (days === 1) {
      pastDate.setDate(today.getDate() - 1);
      today.setDate(today.getDate() - 1);
    } else {
      pastDate.setDate(today.getDate() - days);
    }

    return { start: pastDate, end: today };
  };

  const handleApplyDateRange = () => {
    if (tempStartDate && tempEndDate) {
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
      setShowDatePicker(false);
    }
  };

  const handleCancelDateRange = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setShowDatePicker(false);
  };

  // Format graph data based on date range
  const getFormattedGraphData = () => {
    if (!dashboardData?.graphData) return [];

    try {
      const daysDifference = differenceInDays(endDate, startDate);

      if (daysDifference === 0 && dashboardData.graphData.revenueByHour) {
        return dashboardData.graphData.revenueByHour.map((item) => ({
          time: `${item.hour}:00`,
          revenue: item.revenue,
        }));
      } else if (daysDifference <= 7 && dashboardData.graphData.revenueByDay) {
        return dashboardData.graphData.revenueByDay.map((item) => ({
          time: format(new Date(item.day), "dd/MM/yyyy"),
          revenue: item.revenue,
        }));
      } else if (
        daysDifference <= 365 &&
        dashboardData.graphData.revenueByMonth
      ) {
        return dashboardData.graphData.revenueByMonth.map((item) => ({
          time: item.month,
          revenue: item.revenue,
        }));
      } else if (dashboardData.graphData.revenueByYear) {
        return dashboardData.graphData.revenueByYear.map((item) => ({
          time: item.year.toString(),
          revenue: item.revenue,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error formatting graph data:", error);
      return [];
    }
  };

  // Format vehicle data based on date range
  const getFormattedVehicleData = () => {
    if (!dashboardData?.graphData) return [];

    try {
      const daysDifference = differenceInDays(endDate, startDate);

      if (daysDifference === 0 && dashboardData.graphData.entriesByHour) {
        return dashboardData.graphData.entriesByHour.map((item, index) => ({
          time: `${item.hour}:00`,
          entries: item.entries,
          exits: dashboardData.graphData.exitsByHour?.[index]?.exits || 0,
        }));
      } else if (daysDifference <= 7 && dashboardData.graphData.entriesByDay) {
        return dashboardData.graphData.entriesByDay.map((item, index) => ({
          time: format(new Date(item.day), "dd/MM/yyyy"),
          entries: item.entries,
          exits: dashboardData.graphData.exitsByDay?.[index]?.exits || 0,
        }));
      } else if (
        daysDifference <= 365 &&
        dashboardData.graphData.entriesByMonth
      ) {
        return dashboardData.graphData.entriesByMonth.map((item, index) => ({
          time: item.month,
          entries: item.entries,
          exits: dashboardData.graphData.exitsByMonth?.[index]?.exits || 0,
        }));
      } else if (dashboardData.graphData.entriesByYear) {
        return dashboardData.graphData.entriesByYear.map((item, index) => ({
          time: item.year.toString(),
          entries: item.entries,
          exits: dashboardData.graphData.exitsByYear?.[index]?.exits || 0,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error formatting vehicle data:", error);
      return [];
    }
  };

  const fetchDashboardData = async (start, end) => {
    try {
      setLoading(true);
      setError(null);

      const body = {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };

      const response = await fetch(`${apiUrl}/dashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to fetch dashboard data");

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchDashboardData(startDate, endDate);
    }
  }, [startDate, endDate]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

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
                      onClick={() => handleRangeSelect(range)}
                    >
                      {range.label}
                    </p>
                  ))}
                </div>
                <div className="p-2">
                  <div className="flex gap-3">
                    <DatePicker
                      selected={tempStartDate}
                      onChange={handleDateChange}
                      startDate={tempStartDate}
                      endDate={tempEndDate}
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
                      onClick={handleCancelDateRange}
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      className="text-white"
                      style={{ backgroundColor: "#007AFF" }}
                      onClick={handleApplyDateRange}
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
                  {dashboardData?.revenue.current.toLocaleString()}
                </h2>
              </div>
              <img
                src={income}
                alt="income icon"
                className="text-xl self-start"
              />
            </div>
            <p
              className={`flex items-center text-sm ${
                dashboardData?.revenue.percentageChange >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {dashboardData?.revenue.percentageChange >= 0 ? (
                <HiTrendingUp className="mr-2 text-2xl" />
              ) : (
                <HiTrendingDown className="mr-2 text-2xl" />
              )}
              {Math.abs(dashboardData?.revenue.percentageChange)}%{" "}
              {dashboardData?.revenue.percentageChange >= 0
                ? "เพิ่มขึ้น"
                : "ลดลง"}
              จากปัจจุบัน
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-600 font-medium mb-3">จำนวนรถเข้า</p>
                <h2 className="text-3xl font-bold mb-6">
                  {dashboardData?.entries.current.toLocaleString()}
                </h2>
              </div>
              <img
                src={carIn}
                alt="car in icon"
                className="text-xl self-start"
              />
            </div>
            <p
              className={`flex items-center text-sm ${
                dashboardData?.entries.percentageChange >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {dashboardData?.entries.percentageChange >= 0 ? (
                <HiTrendingUp className="mr-2 text-2xl" />
              ) : (
                <HiTrendingDown className="mr-2 text-2xl" />
              )}
              {Math.abs(dashboardData?.entries.percentageChange)}%{" "}
              {dashboardData?.entries.percentageChange >= 0
                ? "เพิ่มขึ้น"
                : "ลดลง"}
              จากปัจจุบัน
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-600 font-medium mb-3">จำนวนรถออก</p>
                <h2 className="text-3xl font-bold mb-6">
                  {dashboardData?.exits.current.toLocaleString()}
                </h2>
              </div>
              <img
                src={carOut}
                alt="car out icon"
                className="text-xl self-start"
              />
            </div>
            <p
              className={`flex items-center text-sm ${
                dashboardData?.exits.percentageChange >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {dashboardData?.exits.percentageChange >= 0 ? (
                <HiTrendingUp className="mr-2 text-2xl" />
              ) : (
                <HiTrendingDown className="mr-2 text-2xl" />
              )}
              {Math.abs(dashboardData?.exits.percentageChange)}%{" "}
              {dashboardData?.exits.percentageChange >= 0
                ? "เพิ่มขึ้น"
                : "ลดลง"}
              จากปัจจุบัน
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
              <AreaChart data={getFormattedGraphData()}>
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
                <XAxis dataKey="time" tick={{ fontSize: "12px" }} />
                <YAxis tick={{ fontSize: "12px" }} />
                <Tooltip />
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
              <BarChart data={getFormattedVehicleData()}>
                <CartesianGrid strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: "12px" }} />
                <YAxis tick={{ fontSize: "12px" }} />
                <Tooltip />
                <Legend />
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
