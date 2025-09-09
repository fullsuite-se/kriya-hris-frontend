import fetchEmployeeDetailsAPI, {
  addEmployeeAPI,
  checkEmployeeIdAvailabilityAPI,
  editEmployeeAddressesAPI,
  editEmployeeContactInfoAPI,
  editEmployeeDesignationAPI,
  editEmployeeEmergencyContactsAPI,
  editEmployeeGovernmentRemittancesAPI,
  editEmployeeHr201urlAPI,
  editEmployeePersonalDetailsAPI,
  editEmployeeSalaryAPI,
  editEmployeeTimelineAPI,
  fetchAllEmployeesAPI,
  fetchLatestEmployeeIdAPI,
} from "@/services/employeeAPI";
import { use, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";
import { useAuthStore } from "@/stores/useAuthStore";

//check availability emp id

export const useCheckEmployeeIdAvailabilityAPI = () => {
  const [isEmpIdAvailable, setIsEmpIdAvailable] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAvailability = async (userId) => {
    if (!userId) {
      setIsEmpIdAvailable(null);
      return;
    }
    setLoading(true);
    try {
      const available = await checkEmployeeIdAvailabilityAPI(userId);
      setIsEmpIdAvailable(available);
    } catch {
      setIsEmpIdAvailable(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    isEmpIdAvailable,
    isEmpIdAvailableLoading: loading,
    checkAvailability,
  };
};

//get latest id
export const useFetchLatestEmployeeIdAPI = () => {
  const [latestEmployeeId, setLatestEmployeeId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      setLoading(true);
      try {
        const res = await fetchLatestEmployeeIdAPI();
        setLatestEmployeeId(res);
      } catch (error) {
        console.log("unable to fetch latest emp id: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return { latestEmployeeId, loading };
};

//all

export const useFetchAllEmployeesAPI = (filters = {}) => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      setLoading(true);
      try {
        const response = await fetchAllEmployeesAPI(filters);
        setAllEmployees(response || []);
      } catch (err) {
        console.error("Failed to fetch all employees:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEmployees();
  }, [JSON.stringify(filters)]);

  return { allEmployees, error, loading };
};

//details of loggedin user
export const useFetchLoggedInUserDetailsAPI = (userId) => {
  const {
    setUser,
    setLoading,
    setPersonalInfo,
    setDesignations,
    setEmploymentInfo,
    setSalaryInfo,
    setHr201,
    setGovernmentIds,
    setAddresses,
    setEmergencyContacts,
  } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        const data = await fetchEmployeeDetailsAPI({ user_id: userId });
        // console.log("Fetched user details:", data);

        if (data?.user) {
          const user = data.user;

          setUser(user);
          setPersonalInfo(user.HrisUserInfo);
          setDesignations(user.HrisUserDesignations?.[0] || {});
          setEmploymentInfo(user.HrisUserEmploymentInfo);
          setSalaryInfo(user.HrisUserSalary);
          setHr201(user.HrisUserHr201);
          setGovernmentIds(user.HrisUserGovernmentIds);
          setAddresses(user.HrisUserAddresses);
          setEmergencyContacts(user.HrisUserEmergencyContacts);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [
    userId,
    setUser,
    setLoading,
    setPersonalInfo,
    setDesignations,
    setEmploymentInfo,
    setSalaryInfo,
    setHr201,
    setGovernmentIds,
    setAddresses,
    setEmergencyContacts,
  ]);
};

//single lang
export const useFetchEmployeeDetailsAPI = (userId) => {
  const {
    setUser,
    setLoading,
    setPersonalInfo,
    setDesignations,
    setEmploymentInfo,
    setSalaryInfo,
    setHr201,
    setGovernmentIds,
    setAddresses,
    setEmergencyContacts,
    setNotFound,
  } = useContext(EmployeeDetailsContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        const data = await fetchEmployeeDetailsAPI({ user_id: userId });
        // console.log("Fetched user details:", data);
        if (data == 404) {
          setNotFound(true);
        }

        if (data?.user) {
          const user = data.user;

          setUser(user);
          setPersonalInfo(user.HrisUserInfo);
          setDesignations(user.HrisUserDesignations?.[0] || {});
          setEmploymentInfo(user.HrisUserEmploymentInfo);
          setSalaryInfo(user.HrisUserSalary);
          setHr201(user.HrisUserHr201);
          setGovernmentIds(user.HrisUserGovernmentIds);
          setAddresses(user.HrisUserAddresses);
          setEmergencyContacts(user.HrisUserEmergencyContacts);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [
    userId,
    setUser,
    setLoading,
    setPersonalInfo,
    setDesignations,
    setEmploymentInfo,
    setSalaryInfo,
    setHr201,
    setGovernmentIds,
    setAddresses,
    setEmergencyContacts,
    setNotFound,
  ]);
};

//add

export const useAddEmployeeAPI = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addEmployee = async (employeeData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await addEmployeeAPI(employeeData, token);
      return result;
    } catch (err) {
      console.error("Failed to add employee:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addEmployee, loading, error };
};

//edit personal details

export const useEditEmployeePersonalDetailsAPI = () => {
  const { setUser, setPersonalInfo } = useContext(EmployeeDetailsContext);
  const { setUser: setUserLoggedIn, setPersonalInfo: setPersonalInfoLoggedIn } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemUserId } = useAuthStore();

  const editEmployeePersonalDetails = async (user_id, personalDetails) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUserInfo = await editEmployeePersonalDetailsAPI(
        user_id,
        personalDetails
      );

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setPersonalInfo(refreshedData.user.HrisUserInfo || null);
      }

      if (systemUserId == user_id) {
        const refreshedDataLoggedIn = await fetchEmployeeDetailsAPI({
          user_id,
        });
        if (refreshedDataLoggedIn !== 404 && refreshedDataLoggedIn.user) {
          setUserLoggedIn(refreshedDataLoggedIn.user);
          setPersonalInfoLoggedIn(
            refreshedDataLoggedIn.user.HrisUserInfo || null
          );
        }
      }

      console.log(
        "Employee Personal Details updated successfully:",
        updatedUserInfo
      );
      return updatedUserInfo;
    } catch (err) {
      console.error("Failed to update Employee Personal Details:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeePersonalDetails, loading, error };
};

//edit contac info

export const useEditEmployeeContactInfoAPI = () => {
  const { setUser, setPersonalInfo } = useContext(EmployeeDetailsContext);
  const { setUser: setUserLoggedIn, setPersonalInfo: setPersonalInfoLoggedIn } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemUserId } = useAuthStore();

  const editEmployeeContactInfo = async (user_id, contactInfo) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUserInfo = await editEmployeeContactInfoAPI(user_id, {
        user_email: contactInfo.user_email,
        personal_email: contactInfo.personal_email,
        contact_number: contactInfo.contact_number,
        company_issued_phone_number: contactInfo.company_issued_phone_number,
      });

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setPersonalInfo(refreshedData.user.HrisUserInfo || null);
      }

      if (systemUserId == user_id) {
        const refreshedDataLoggedIn = await fetchEmployeeDetailsAPI({
          user_id,
        });
        if (refreshedDataLoggedIn !== 404 && refreshedDataLoggedIn.user) {
          setUserLoggedIn(refreshedDataLoggedIn.user);
          setPersonalInfoLoggedIn(
            refreshedDataLoggedIn.user.HrisUserInfo || null
          );
        }
      }

      console.log(
        "Employee Contact Info updated successfully:",
        updatedUserInfo
      );
      return updatedUserInfo;
    } catch (err) {
      console.error("Failed to update Employee Contact Info:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeContactInfo, loading, error };
};

//edit remittances

export const useEditEmployeeGovernmentRemittancesAPI = () => {
  const { setUser, setGovernmentIds, governmentIds } = useContext(
    EmployeeDetailsContext
  );
  const { setUser: setUserLoggedIn, setPersonalInfo: setPersonalInfoLoggedIn } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemUserId } = useAuthStore();

  const editEmployeeGovernmentRemittances = async (user_id, governmentIds) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUserGovernmentRemittances =
        await editEmployeeGovernmentRemittancesAPI(user_id, governmentIds);

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setGovernmentIds(refreshedData.user.HrisUserGovernmentIds || []);
      }

      if (systemUserId == user_id) {
        const refreshedDataLoggedIn = await fetchEmployeeDetailsAPI({
          user_id,
        });
        if (refreshedDataLoggedIn !== 404 && refreshedDataLoggedIn.user) {
          setUserLoggedIn(refreshedDataLoggedIn.user);
          setPersonalInfoLoggedIn(
            refreshedDataLoggedIn.user.HrisUserInfo || null
          );
        }
      }

      console.log(
        "Employee Government Remittances updated successfully:",
        updatedUserGovernmentRemittances
      );
      return updatedUserGovernmentRemittances;
    } catch (err) {
      console.error("Failed to update Employee Government Remittances:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeGovernmentRemittances, loading, error };
};

//edit emergency contacts

export const useEditEmployeeEmergencyContactsAPI = () => {
  const { setUser, setEmergencyContacts } = useContext(EmployeeDetailsContext);
  const { setUser: setUserLoggedIn, setPersonalInfo: setPersonalInfoLoggedIn } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemUserId } = useAuthStore();

  const editEmployeeEmergencyContacts = async (user_id, emergency_contacts) => {
    setLoading(true);
    setError(null);

    try {
      const updatedContacts = await editEmployeeEmergencyContactsAPI(
        user_id,
        emergency_contacts
      );

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setEmergencyContacts(
          refreshedData.user.HrisUserEmergencyContacts || []
        );
      }

      if (systemUserId === user_id) {
        const refreshedDataLoggedIn = await fetchEmployeeDetailsAPI({
          user_id,
        });

        if (refreshedDataLoggedIn !== 404 && refreshedDataLoggedIn.user) {
          setUserLoggedIn(refreshedDataLoggedIn.user);
          setPersonalInfoLoggedIn(
            refreshedDataLoggedIn.user.HrisUserInfo || null
          );
        }
      }

      console.log(
        "Employee Emergency Contacts updated successfully:",
        updatedContacts
      );
      return updatedContacts;
    } catch (err) {
      console.error("Failed to update Employee Emergency Contacts:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeEmergencyContacts, loading, error };
};

//edit addresses

export const useEditEmployeeAddressesAPI = () => {
  const { setUser, setAddresses } = useContext(EmployeeDetailsContext);
  const { setUser: setUserLoggedIn, setPersonalInfo: setPersonalInfoLoggedIn } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { systemUserId } = useAuthStore();

  const editEmployeeAddresses = async (user_id, addresses) => {
    setLoading(true);
    setError(null);

    try {
      const updatedAddresses = await editEmployeeAddressesAPI(
        user_id,
        addresses
      );

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setAddresses(refreshedData.user.HrisUserAddresses || []);
      }

      if (systemUserId === user_id) {
        const refreshedDataLoggedIn = await fetchEmployeeDetailsAPI({
          user_id,
        });

        if (refreshedDataLoggedIn !== 404 && refreshedDataLoggedIn.user) {
          setUserLoggedIn(refreshedDataLoggedIn.user);
          setPersonalInfoLoggedIn(
            refreshedDataLoggedIn.user.HrisUserInfo || null
          );
        }
      }

      console.log("Employee Addresses updated successfully:", updatedAddresses);
      return updatedAddresses;
    } catch (err) {
      console.error("Failed to update Employee Addresses:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeAddresses, loading, error };
};

//edit docuurl

export const useEditEmployeeHr201urlAPI = () => {
  const { setUser, setHr201 } = useContext(EmployeeDetailsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editEmployeeHr201url = async (user_id, hr201url) => {
    setLoading(true);
    setError(null);

    try {
      const updatedHr201url = await editEmployeeHr201urlAPI(user_id, hr201url);

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setHr201(refreshedData.user.HrisUserHr201 || null);
      }

      console.log("Employee HR201 url updated successfully:", updatedHr201url);
      return updatedHr201url;
    } catch (err) {
      console.error("Failed to update Employee HR201 url:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeHr201url, loading, error };
};

//edit designation
export const useEditEmployeeDesignationAPI = () => {
  const { setDesignations, setEmploymentInfo } = useContext(
    EmployeeDetailsContext
  );

  const { setUser: setUserLoggedIn, setPersonalInfo: setPersonalInfoLoggedIn } =
    useContext(UserContext);

  const { systemUserId } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editEmployeeDesignation = async (user_id, designation) => {
    console.log("Starting editEmployeeDesignation", { user_id, designation });
    setLoading(true);
    setError(null);

    try {
      console.log("Calling editEmployeeDesignationAPI with", {
        user_id,
        designation,
      });
      const updated = await editEmployeeDesignationAPI(user_id, designation);
      console.log("Received response from editEmployeeDesignationAPI", updated);

      if (!updated) {
        console.log("No update response received from server");
        throw new Error("No update response from server");
      }

      if (updated.designation) {
        console.log("Updating designations state", updated.designation);
        setDesignations((prev) => {
          const newDesignations = {
            ...prev,
            ...updated.designation,
            CompanyOffice: updated.designation.office_id
              ? {
                  ...(prev?.CompanyOffice || {}),
                  office_id: updated.designation.office_id,
                  office_name:
                    updated.designation.CompanyOffice?.office_name ||
                    prev?.CompanyOffice?.office_name ||
                    null,
                }
              : null,
            CompanyDivision: updated.designation.division_id
              ? {
                  ...(prev?.CompanyDivision || {}),
                  division_id: updated.designation.division_id,
                  division_name:
                    updated.designation.CompanyDivision?.division_name ||
                    prev?.CompanyDivision?.division_name ||
                    null,
                }
              : null,
            CompanyDepartment: updated.designation.department_id
              ? {
                  ...(prev?.CompanyDepartment || {}),
                  department_id: updated.designation.department_id,
                  department_name:
                    updated.designation.CompanyDepartment?.department_name ||
                    prev?.CompanyDepartment?.department_name ||
                    null,
                }
              : null,
            CompanyTeam: updated.designation.team_id
              ? {
                  ...(prev?.CompanyTeam || {}),
                  team_id: updated.designation.team_id,
                  team_name:
                    updated.designation.CompanyTeam?.team_name ||
                    prev?.CompanyTeam?.team_name ||
                    null,
                }
              : null,
            CompanyJobTitle: updated.designation.job_title_id
              ? {
                  ...(prev?.CompanyJobTitle || {}),
                  job_title_id: updated.designation.job_title_id,
                  job_title:
                    updated.designation.CompanyJobTitle?.job_title ||
                    prev?.CompanyJobTitle?.job_title ||
                    null,
                }
              : null,
            upline: updated.designation.upline_id
              ? {
                  ...(prev?.upline || {}),
                  user_id: updated.designation.upline_id,
                  HrisUserInfo:
                    updated.designation.upline?.HrisUserInfo ||
                    prev?.upline?.HrisUserInfo ||
                    null,
                }
              : null,
            Company: updated.designation.company_id
              ? {
                  ...(prev?.Company || {}),
                  company_id: updated.designation.company_id,
                  company_email:
                    updated.designation.Company?.company_email ||
                    prev?.Company?.company_email ||
                    null,
                  CompanyAddress:
                    updated.designation.Company?.CompanyAddress ||
                    prev?.Company?.CompanyAddress ||
                    null,
                  CompanyInfo:
                    updated.designation.Company?.CompanyInfo ||
                    prev?.Company?.CompanyInfo ||
                    null,
                }
              : null,
          };
          console.log("New designations state", newDesignations);
          return newDesignations;
        });
      }
      if (updated.employment) {
        console.log("Updating employment info state", updated.employment);
        setEmploymentInfo((prev) => {
          const newEmploymentInfo = {
            ...prev,
            ...updated.employment,
            HrisUserEmploymentStatus: updated.employment.employment_status_id
              ? {
                  ...(prev?.HrisUserEmploymentStatus || {}),
                  employment_status_id: updated.employment.employment_status_id,
                  employment_status:
                    updated.employment.HrisUserEmploymentStatus
                      ?.employment_status ||
                    prev?.HrisUserEmploymentStatus?.employment_status ||
                    null,
                }
              : null,
            HrisUserEmploymentType: updated.employment.employment_type_id
              ? {
                  ...(prev?.HrisUserEmploymentType || {}),
                  employment_type_id: updated.employment.employment_type_id,
                  employment_type:
                    updated.employment.HrisUserEmploymentType
                      ?.employment_type ||
                    prev?.HrisUserEmploymentType?.employment_type ||
                    null,
                }
              : null,
            HrisUserJobLevel: updated.employment.job_level_id
              ? {
                  ...(prev?.HrisUserJobLevel || {}),
                  job_level_id: updated.employment.job_level_id,
                  job_level_name:
                    updated.employment.HrisUserJobLevel?.job_level_name ||
                    prev?.HrisUserJobLevel?.job_level_name ||
                    null,
                }
              : null,
            HrisUserShiftsTemplate: updated.employment.shift_template_id
              ? {
                  ...(prev?.HrisUserShiftsTemplate || {}),
                  shift_template_id: updated.employment.shift_template_id,
                  shift_name:
                    updated.employment.HrisUserShiftsTemplate?.shift_name ||
                    prev?.HrisUserShiftsTemplate?.shift_name ||
                    null,
                }
              : null,
          };
          console.log("New employment info state", newEmploymentInfo);
          return newEmploymentInfo;
        });
      }

      if (systemUserId === user_id) {
        console.log("Updating logged-in user state", { systemUserId, user_id });
        setUserLoggedIn((prev) => {
          const newUserState = {
            ...prev,
            HrisUserDesignations: updated.designation,
            HrisUserEmploymentInfo: updated.employment,
          };
          console.log("New logged-in user state", newUserState);
          return newUserState;
        });

        if (updated.HrisUserInfo) {
          console.log(
            "Setting personal info for logged-in user",
            updated.HrisUserInfo
          );
          setPersonalInfoLoggedIn(updated.HrisUserInfo);
        }
      }

      console.log("Employee Designation updated successfully:", updated);
      console.log("Returning updated data", updated);
      return updated; // must return to dialog
    } catch (err) {
      console.error("Failed to update Employee Designation:", err);
      console.log("Error details", { error: err.message, stack: err.stack });
      setError(err);
      throw err;
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  };

  return { editEmployeeDesignation, loading, error };
};

//edit salary

export const useEditEmployeeSalaryAPI = () => {
  const { setUser, setSalaryInfo } = useContext(EmployeeDetailsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editEmployeeSalary = async (user_id, user_salary_id, salary) => {
    setLoading(true);
    setError(null);

    try {
      console.log("user_id: ", user_id);
      console.log("user_salary_id: ", user_salary_id);
      console.log("salary: ", salary);
      const updatedSalary = await editEmployeeSalaryAPI(
        user_id,
        user_salary_id,
        salary
      );

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setSalaryInfo(refreshedData.user.HrisUserSalary || null);
      }

      console.log("Employee salary updated successfully:", updatedSalary);
      return updatedSalary;
    } catch (err) {
      console.error("Failed to update Employee salary:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeSalary, loading, error };
};

//edit employment timeline

export const useEditEmployeeTimelineAPI = () => {
  const { setUser, setEmploymentInfo } = useContext(EmployeeDetailsContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editEmployeeTimeline = async (user_id, timeline) => {
    setLoading(true);
    setError(null);

    try {
      const updatedTimeline = await editEmployeeTimelineAPI(user_id, timeline);

      const refreshedData = await fetchEmployeeDetailsAPI({ user_id });

      if (refreshedData !== 404 && refreshedData.user) {
        setUser(refreshedData.user);
        setEmploymentInfo(refreshedData.user.HrisUserEmploymentInfo || null);
      }

      console.log("Employee timeline updated successfully:", updatedTimeline);
      return updatedTimeline;
    } catch (err) {
      console.error("Failed to update Employee timeline:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editEmployeeTimeline, loading, error };
};

export default useFetchLoggedInUserDetailsAPI;
