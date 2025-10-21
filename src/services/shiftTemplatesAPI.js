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

export const addShiftTemplateAPI = async ({ shift_name, start_time, end_time, break_start_time, break_end_time, day_of_week }) => {
  try {
    const response = await api.post("/api/hris-user-accounts/employment-info/shift-templates", {
      shift_name,
      start_time,
      end_time,
      break_start_time,
      break_end_time,
      day_of_week,
    });
    console.log("Shift Template added successfully:", response.data.shift);
    return response.data.shift;
  } catch (error) {
    console.error("Failed to add Shift Template:", error);
    return null;
  }
};


export const editShiftTemplateAPI = async ({ shift_template_id, shift_name, start_time, end_time, break_start_time, break_end_time, day_of_week }) => {
  try {
    const response = await api.patch(`/api/hris-user-accounts/employment-info/shift-templates/${shift_template_id}`, {
      shift_name,
      start_time,
      end_time,
      break_start_time,
      break_end_time,
      day_of_week,
    });
    console.log("Shift Template updated successfully:", response.data.shift);
    return response.data.shift;
  } catch (error) {
    console.error("Failed to update Shift Template:", error);
    throw error;
  }
}

export const deleteShiftTemplateAPI = async (shift_template_id) => {
  try {
    const response = await api.delete(`/api/hris-user-accounts/employment-info/shift-templates/${shift_template_id}`);
    console.log("Shift Template deleted successfully:", response.data.shift);
    return response.data.shift;
  } catch (error) {
    console.error("Failed to delete Shift Template:", error);
    throw error;
  }
}


export default fetchAllShiftTemplatesAPI;

