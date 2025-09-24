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


export const fetchServicesByUserIdAPI = async (user_id) => {
  try {
    const response = await api.get(`/api/admin/service/hris-user-accounts/${user_id}`);
    console.log("All service permissions fetched successfully:", response.data.servicePermissions);
    return response.data.servicePermissions;
  } catch (error) {
    console.error("Failed to fetch all service permissions:", error);
    return null;
  }
};
export const fetchFeaturesByUserIdAPI = async (user_id) => {
  try {
    const response = await api.get(`/api/admin/features/hris-user-accounts/${user_id}`);
    console.log("All access permissions fetched successfully:", response.data.accessPermissions);
    return response.data.accessPermissions;
  } catch (error) {
    console.error("Failed to fetch all access permissions:", error);
    return null;
  }
};

//add permission - SERVICE

export const addServicePermissionAPI = async (user_id, service_ids) => {
  try {
    const response = await api.post(`/api/admin/service/hris-user-accounts/${user_id}`, { service_ids });
    console.log("Service Permissions added successfully:", response.data.servicePermissions);
    return response.data.servicePermissions;
  } catch (error) {
    console.error("Failed to add service permissions:", error);
    throw error;
  }
};


//remove permissions - SERVICE
export const deleteServicePermissionsAPI = async (user_id) => {
  try {
    await api.delete(`/api/admin/service/hris-user-accounts/${user_id}`);
    console.log("service permissions deleted successfully");
    return;
  } catch (error) {
    console.error("Failed to delete service permissions:", error);
    throw error;
  }
};



//add permission - FEATURES

export const addFeatureAccessPermissionAPI = async (user_id, service_feature_ids) => {
  try {
    const response = await api.post(`/api/admin/features/hris-user-accounts/${user_id}`, { service_feature_ids });
    console.log("Feature Access Permissions added successfully:", response.data.accessPermissions);
    return response.data.accessPermissions;
  } catch (error) {
    console.error("Failed to add Feature Access permissions:", error);
    throw error;
  }
};

//remove permissions - FEATRUES
export const deleteAccessPermissionsAPI = async (user_id) => {
  try {
    await api.delete(`/api/admin/features/hris-user-accounts/${user_id}`);
    console.log("access permissions deleted successfully");
    return;
  } catch (error) {
    console.error("Failed to delete access permissions:", error);
    throw error;
  }
};
//get those with permissions

// Fetch users from API
export const fetchAllUsersWithPermissionsAPI = async (
  serviceIds = [],
  serviceFeatureIds = [],
  page = 1,
  limit = 10,
  searchFilter = ""
) => {
  try {
    const params = new URLSearchParams();

    if (serviceIds.length > 0) params.append('service_ids', JSON.stringify(serviceIds));
    if (serviceFeatureIds.length > 0) params.append('service_feature_ids', JSON.stringify(serviceFeatureIds));
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (searchFilter) params.append('searchFilter', searchFilter);

    const response = await api.get(`/api/admin/users-with-permissions?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all system users:", error);
    throw error; // Throw error instead of returning null for better error handling
  }
};