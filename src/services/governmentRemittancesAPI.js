import api from "@/config/api";


export const fetchAllGovernmentRemittancesAPI = async () => {
  try {
    const response = await api.get(`/api/hris-user-accounts/gov-ids/types`);
    console.log("All government remittances fetched successfully:", response.data.idTypes);
    return response.data.idTypes;
  } catch (error) {
    console.error("Failed to fetch all government remittances:", error);
    return null;
  }
};


export const addGovernmentRemittanceAPI = async (government_id_name) => {
  try {
    const response = await api.post(`/api/hris-user-accounts/gov-ids/types`, { government_id_name });
    console.log("Government Remittance added successfully:", response.data.idType);
    return response.data.idType;
  } catch (error) {
    console.error("Failed to add Government Remittance:", error);
    throw error;
  }
};