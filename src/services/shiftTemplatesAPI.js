import api from "@/config/api";



export const fetchAllShiftTemplatesAPI = async () => {
  try {
    const response = await api.get("/api/hris-user-accounts/employment-info/shift-templates");
    console.log("All shift templates fetched successfully:", response.data);
    return response.data.shifts;
  } catch (error) {
    console.error("Failed to fetch all shift templates:", error);
    return null;
  }
};


export default fetchAllShiftTemplatesAPI;
