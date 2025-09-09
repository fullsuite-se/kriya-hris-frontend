import api from "@/config/api";

export const fetchFeaturesAndServicesAPI = async (serviceId) => {
  try {
    const endpoint = serviceId
      ? `/api/admin/services-and-features?service=${serviceId}`
      : `/api/admin/services-and-features`;

    const response = await api.get(endpoint);

    console.log(
      "services and features fetched successfully:",
      response.data.servicesAndFeatures
    );

    return response.data.servicesAndFeatures;
  } catch (error) {
    console.error("Failed to fetch services and features:", error);
    return null;
  }
};
