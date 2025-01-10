import { ListManageDiscountTable } from "../../features/listManageDiscountTable";
import { ListManageFeeTable } from "../../features/listManageFeeTable";
import PageCotainer from "../PageCotainer";

function ManagePage() {
  return (
    <PageCotainer>
      <div className=" space-y-10">
      <ListManageFeeTable />
      <ListManageDiscountTable />
      </div>
      
      
    </PageCotainer>
  )
}

export default ManagePage