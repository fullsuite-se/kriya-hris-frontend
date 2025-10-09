import api from "@/config/api";

export const checkEmployeeIdAvailabilityAPI = async (user_id) => {
  try {
    const response = await api.get(
      `/api/hris-user-accounts/check-id/${user_id}`
    );
    console.log(
      "Successfully check employee id availability:",
      response.data.available
    );
    return response.data.available;
  } catch (error) {
    console.error("Failed to check employee id if taken:", error);
    return 404;
  }
};

export const fetchLatestEmployeeIdAPI = async () => {
  try {
    const response = await api.get(`/api/hris-user-accounts/latest-id/get`);
    console.log("Successfully fetch last employee id:", response.data.latestId);
    return response.data.latestId;
  } catch (error) {
    console.error("Failed to fetch latest emp id: ", error);
    return 404;
  }
};

export const fetchEmployeeDetailsAPI = async ({ user_id }) => {
  try {
    // console.log("Fetching user details for user_id:", user_id);
    const response = await api.get(`/api/hris-user-accounts/${user_id}`);
    console.log("User details fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return 404;
  }
};


//all
/*
using these, create me 

*/
//prod
// export const fetchAllEmployeesAPI = async (filters = {}) => {
//   try {
//     const params = new URLSearchParams(filters).toString();

//     const response = await api.get(
//       `/api/hris-user-accounts${params ? `?${params}` : ""}`
//     );
//     console.log(
//       "URL REQUEEEST:",
//       `/api/hris-user-accounts${params ? `?${params}` : ""}`
//     );

//     console.log("Employees fetched successfully:", response.data);
//     return response.data.users;
//   } catch (error) {
//     console.error("Failed to fetch employees:", error);
//     return null;
//   }
// };
//pagiantion

// export const fetchAllEmployeesAPI = async (filters = {}) => {
//   try {
//     const params = new URLSearchParams(filters).toString();

//     const response = await api.get(
//       `/api/hris-user-accounts${params ? `?${params}` : ""}`
//     );
//     console.log("URL REQUEST:", `/api/hris-user-accounts${params ? `?${params}` : ""}`);
//     console.log("Employees fetched successfully:", response.data);

//     // Return the full pagination object, not just users
//     return {
//       users: response.data.users || [],
//       total: response.data.total || 0,
//       page: response.data.page || 1,
//       totalPages: response.data.totalPages || 1,
//     };
//   } catch (error) {
//     console.error("Failed to fetch employees:", error);
//     return {
//       users: [],
//       total: 0,
//       page: 1,
//       totalPages: 1,
//       error,
//     };
//   }
// };

//page w search

export const fetchAllEmployeesAPI = async (filters = {}) => {
  try {
    // Convert filters object to URLSearchParams, handling nested objects
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value);
        }
      }
    });

    const queryString = params.toString();
    const response = await api.get(
      `/api/hris-user-accounts${queryString ? `?${queryString}` : ""}`
    );

    console.log("Employees fetched successfully:", response.data);

    return {
      users: response.data.users || [],
      total: response.data.total || 0,
      page: response.data.page || 1,
      totalPages: response.data.totalPages || 1,
    };
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return {
      users: [],
      total: 0,
      page: 1,
      totalPages: 1,
      error,
    };
  }
};



//get emp counts

export const fetchEmployeeCountsAPI = async () => {
  try {
    const response = await api.get(`/api/hris-user-accounts/employee-counts`);
    console.log("employee counts fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to get employee counts:", error);
    return null;
  }
};

export const addEmployeeAPI = async (employeeData, token, recaptchaToken) => {
  try {
    const response = await api.post(`/api/hris-user-accounts`, { ...employeeData, recaptchaToken }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error.response?.data || error;
  }
};

export const editEmployeePersonalDetailsAPI = async (
  user_id,
  personalDetails
) => {
  try {
    const response = await api.patch(
      `/api/hris-user-accounts/${user_id}/personal-details`,
      personalDetails
    );

    console.log(
      "Employee Personal Details updated successfully:",
      response.data.updatedUserInfo
    );

    return response.data.updatedUserInfo;
  } catch (error) {
    console.error("Failed to update Employee Personal Details:", error);
    throw error;
  }
};

export const editEmployeeContactInfoAPI = async (user_id, contactInfo) => {
  try {
    const response = await api.patch(
      `/api/hris-user-accounts/${user_id}/contact-info`,
      contactInfo
    );

    console.log(
      "Employee contact info updated successfully:",
      response.data.updatedUserInfo
    );

    return response.data.updatedUserInfo;
  } catch (error) {
    console.error("Failed to update Employee contact info:", error);
    throw error;
  }
};

export const editEmployeeGovernmentRemittancesAPI = async (
  user_id,
  governmentIds
) => {
  try {
    const response = await api.patch(
      `/api/hris-user-accounts/${user_id}/government-remittances`,
      governmentIds
    );

    console.log(
      "Employee Government Remittances updated successfully:",
      response.data.updatedRemittances
    );

    return response.data.updatedRemittances;
  } catch (error) {
    console.error("Failed to update Employee Government Remittances:", error);
    throw error;
  }
};

export const editEmployeeEmergencyContactsAPI = async (
  user_id,
  emergency_contacts
) => {
  try {
    const response = await api.patch(
      `/api/hris-user-accounts/${user_id}/emergency-contacts`,
      emergency_contacts
    );

    console.log(
      "Employee emergency contacts updated successfully:",
      response.data.updatedEmergencyContacts
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update Employee emergency contacts:", error);
    throw error;
  }
};

export const editEmployeeAddressesAPI = async (user_id, addresses) => {
  try {
    const response = await api.patch(
      `/api/hris-user-accounts/${user_id}/addresses`,
      addresses
    );

    console.log(
      "Employee addresses updated successfully:",
      response.data.updatedAddresses
    );

    return response.data.updatedAddresses;
  } catch (error) {
    console.error("Failed to update Employee addresses:", error);
    throw error;
  }
};

export const editEmployeeHr201urlAPI = async (user_id, hr201url) => {
  try {
    const response = await api.patch(
      `/api/hris-user-accounts/${user_id}/hr201url`,
      hr201url
    );

    console.log(
      "Employee hr201url updated successfully:",
      response.data.updatedHr201
    );

    return response.data.updatedHr201;
  } catch (error) {
    console.error("Failed to update Employee hr201url:", error);
    throw error;
  }
};

export const editEmployeeDesignationAPI = async (user_id, designation) => {
  try {
    const requestBody = {
      ...designation.designationFields,
      ...designation.employmentFields,
    };
    console.log("Sending request to update employee designation", {
      user_id,
      requestBody,
    });

    const response = await api.patch(
      `/api/hris-user-accounts/${user_id}/designation`,
      requestBody
    );

    console.log("Employee Designation updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update Employee Designation:", error);
    throw error;
  }
};

export const editEmployeeSalaryAPI = async (
  user_id,
  user_salary_id,
  salary
) => {
  try {
    const response = await api.patch(
      `/api/hris-user-accounts/${user_id}/salaries/${user_salary_id}`,
      salary
    );

    console.log("Employee salary updated successfully:", response.data.salary);

    return response.data.salary;
  } catch (error) {
    console.error("Failed to update Employee salary:", error);
    throw error;
  }
};

export const editEmployeeTimelineAPI = async (user_id, timeline) => {
  try {
    const response = await api.patch(
      `/api/hris-user-accounts/${user_id}/employment-timeline`,
      timeline
    );

    console.log(
      "Employee timeline updated successfully:",
      response.data.timeline
    );

    return response.data.timeline;
  } catch (error) {
    console.error("Failed to update Employee timeline:", error);
    throw error;
  }
};

export default fetchEmployeeDetailsAPI;
