import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
import { FaCar } from "react-icons/fa";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import PageCotainer from "../PageCotainer";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function DashboardPage() {
  const data = {
    labels: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
    datasets: [
      {
        label: "รายได้",
        data: [2000, 2500, 3200, 2800, 2900, 3100, 4000, 5000, 3600, 3700, 3800, 3900],
        backgroundColor: "#3b82f6",
        borderRadius: 5,
      },
    ],
  };

  return (
    <PageCotainer>
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6 mt-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">รายได้รวมทั้งหมด</p>
            <h2 className="text-3xl font-bold">30,000.00</h2>
            <p className="text-red-500 flex items-center mt-2"><HiTrendingDown className="mr-1" /> 4.3% ลดลงจากเดือนก่อน</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">จำนวนรถเข้าทั้งหมด</p>
            <h2 className="text-3xl font-bold">540</h2>
            <p className="text-green-500 flex items-center mt-2"><HiTrendingUp className="mr-1" /> 8.5% เพิ่มขึ้นจากเดือนก่อน</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">จำนวนรถออกทั้งหมด</p>
            <h2 className="text-3xl font-bold">500</h2>
            <p className="text-green-500 flex items-center mt-2"><HiTrendingUp className="mr-1" /> 8.5% เพิ่มขึ้นจากเดือนก่อน</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-white rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">ภาพรวมรายได้แต่ละเดือน</h2>
          <Button variant="outline" className="bg-blue-500 text-white">2024</Button>
        </div>
        <Bar 
            data={data} 
            options={{ 
                responsive: true, 
                maintainAspectRatio: true,
                aspectRatio: 2.5 // ค่ามากกว่านี้จะทำให้กราฟเตี้ยลง
            }} 
            />
      </div>
    </div>
    </PageCotainer>
  );
}
