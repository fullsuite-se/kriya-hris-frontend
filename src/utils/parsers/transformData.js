// import formatDate from "../formatters/dateFormatter";

// export const transformUsers = (users) => {
//   const sorted = [...users].sort((a, b) => {
//     const lastA = a.HrisUserInfo?.last_name?.toLowerCase() || "";
//     const lastB = b.HrisUserInfo?.last_name?.toLowerCase() || "";
//     return lastA.localeCompare(lastB);
//   });

//   return sorted.map((user, index) => {
//     const userEmail = user.user_email || "";
//     const info = user.HrisUserInfo || {};
//     const employmentInfo = user.HrisUserEmploymentInfo || {};
//     const status = employmentInfo.HrisUserEmploymentStatus || {};
//     const designation = (user.HrisUserDesignations || [])[0] || {};
//     const jobTitle = designation.CompanyJobTitle || {};
//     return {
//       employee_id: info.user_id || null,
//       user_pic: info.user_pic || null,
//       first_name: info.first_name || "---",
//       last_name: info.last_name || "---",
//       middle_name: info.middle_name || null,
//       email: userEmail.split("@")[0] || "---",
//       job_title: jobTitle.job_title || "---",
//       date_hired: formatDate(employmentInfo.date_hired, "shortMonth") || "---",
//       regularization_date:
//         formatDate(employmentInfo.date_regularization, "shortMonth") || "---",
//       status: status.employment_status || "---",
//       user,
//     };
//   });
// };

// export default transformUsers;


import formatDate from "../formatters/dateFormatter";

export const transformUsers = (users) => {
  const sorted = [...users].sort((a, b) => {
    const lastA = a.HrisUserInfo?.last_name?.toLowerCase() || "";
    const lastB = b.HrisUserInfo?.last_name?.toLowerCase() || "";
    return lastA.localeCompare(lastB);
  });

  return sorted.map((user) => {
    const info = user.HrisUserInfo || {};
    const employmentInfo = user.HrisUserEmploymentInfo || {};
    const status = employmentInfo.HrisUserEmploymentStatus || {};
    const designation = (user.HrisUserDesignations || [])[0] || {};
    const jobTitle = designation.CompanyJobTitle || {};
    const department = designation.CompanyDepartment || {};

    return {
      employee_id: user.user_id || null, 
      user_pic: info.user_pic || null,
      first_name: info.first_name || "---",
      middle_name: info.middle_name || null,
      last_name: info.last_name || "---",
      extension_name: info.extension_name || null,
      email: user.user_email || "---",
      job_title: jobTitle.job_title || "---",
      department_name: department.department_name || "---",
      upline_id: designation.upline_id || null,
      date_hired: formatDate(employmentInfo.date_hired, "shortMonth") || "---",
      regularization_date:
        formatDate(employmentInfo.date_regularization, "shortMonth") || "---",
      status: status.employment_status || "---",
      user, 
    };
  });
};

export default transformUsers;
