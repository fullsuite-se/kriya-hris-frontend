import { useHeader } from "@/context/HeaderContext";
import useFetchCompanyDetailsAPI from "@/hooks/useCompanyAPI";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";

const EditPersonalDetailsPage = () => {
  const { setHeaderConfig } = useHeader();
  const { systemCompanyId } = useAuthStore();

  const { companyDetails } = useFetchCompanyDetailsAPI();

  useEffect(() => {
    setHeaderConfig({
      isHidden: false,
    });
  }, []);

  return (
    <div className="relative bg-white shadow-xs rounded-lg p-5">
     
      <div>
          <h2 className="text-lg font-semibold">Edit Personal Details</h2>
        </div>
    </div>
  );
};

export default EditPersonalDetailsPage;
