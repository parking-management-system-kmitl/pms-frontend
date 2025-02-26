import { useNavigate } from "react-router-dom";
import kid from "../../assets/kids high five-cuate 1.svg";

export default function RegisVipReceiptPage() {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate("/regisVip");
  };
  
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white">
      <div className="w-full px-4">
        <div className="text-center mb-6 mt-[6rem]">
          <img src={kid} alt="Kid High Five Pic" className="w- mx-auto mb-2" />
          <h1 className="text-xl font-bold mt-6">ขอบคุณที่สมัครสมาชิก VIP</h1>
          <h2 className="mt-4 font-light">
            หากมีข้อสงสัยหรือต้องการความช่วยเหลือ
          </h2>
          <h2 className="font-light">ทีมงานของเราพร้อมให้บริการเสมอ</h2>
          <h2 className="mt-6 font-light">KMITL Parking</h2>
        </div>
      </div>
      <div className="w-full">
        <hr className="w-full h-px my-4 px-0 bg-gray-200 border-0 dark:bg-gray-200"/>
        <div className="px-4">
          <button 
            className="w-full bg-blue-600 hover:bg-blue-600 mb-[2rem] rounded-3xl h-[44px] text-white"
            onClick={handleBackClick}
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
}