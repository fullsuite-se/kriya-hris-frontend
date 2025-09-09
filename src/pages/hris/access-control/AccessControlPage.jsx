import { accessControlColumns } from "@/components/table/columns/AccessControlColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { useHeader } from "@/context/HeaderContext";
import { useFetchAllEmployeesAPI } from "@/hooks/useEmployeeAPI";
import transformUsers from "@/utils/parsers/transformData";
import CanAccess from "@/utils/permissions/CanAccess";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AccessControlPage() {
  const { setHeaderConfig } = useHeader();

  const { allEmployees, error, loading } = useFetchAllEmployeesAPI({
    include: "permissions",
  });

  const transformedUsers = transformUsers(allEmployees);
  const navigate = useNavigate();
  useEffect(() => {
    setHeaderConfig({
      title: "Access Control",
      description: "Access control here for hris",
      button: (
        // <CanAccess feature={"Add Employsee"}>
        <Button
          className="cursor-pointer !text-xs !text-white hover:!bg-[#008080ed] border-none"
          onClick={() => navigate("/hris/employees/add")}
        >
          + Grant Access
        </Button>
        // </CanAccess>
      ),
    });
  }, []);

  useEffect(() => {
    document.title = "Access Control";
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary-color"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen italic text-muted-foreground">
        Failed to load this page. Try again later.
      </div>
    );
  }
  return (
    // <div className="w-full lg:w-[80%] bg-white shadow-xs rounded-lg p-5">
    <div className=" bg-white shadow-xs rounded-lg p-5">
      <DataTable
        columns={accessControlColumns}
        cursorType="cursor-default"
        data={transformedUsers}
        searchKeys={[
          "employee_id",
          "email",
          "job_title",
          (item) =>
            `${item.first_name} ${item.middle_name || ""} ${
              item.last_name
            }`.trim(),
          (item) =>
            `${item.first_name} ${item.last_name} ${
              item.middle_name || ""
            }`.trim(),
          (item) =>
            `${item.last_name} ${item.first_name} ${
              item.middle_name || ""
            }`.trim(),
          "status",
        ]}
      />
    </div>
  );
}
