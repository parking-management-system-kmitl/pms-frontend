import notfoundpic from "../../assets/404_pic.svg";

export default function VipErrorPage() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-12">
      <div className="w-full">
        <div className="text-center mb-6">
          <img src={notfoundpic} alt="Not Found Pic" className="mx-auto mb-2" />
          <h1 className="text-xl font-bold mt-6">404 Not Found!</h1>
          <h2 className="mt-4 font-light">The page you're looking for might have been moved, deleted, or the URL is incorrect.</h2>
        </div>
      </div>
      <div className="w-full">
        <button className="w-full bg-blue-600 hover:bg-blue-600 rounded-3xl h-[44px] text-white">
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
}