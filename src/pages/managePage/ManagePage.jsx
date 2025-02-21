import { ListManageDiscountTable } from "../../features/listManageDiscountTable";
import { ListManageFeeTable } from "../../features/listManageFeeTable";
import VIPPromotionsTable from "../../features/vipManagementTable/VipManagementTable";
import PageCotainer from "../PageCotainer";

function ManagePage() {
  return (
    <PageCotainer>
      <div className=" space-y-10">
      <ListManageFeeTable />
      <ListManageDiscountTable />
      <VIPPromotionsTable />
      </div>
      
      
    </PageCotainer>
  )
}

export default ManagePage