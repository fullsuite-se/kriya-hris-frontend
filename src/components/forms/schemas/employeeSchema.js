import { z } from "zod";

export const employeeFormSchema = z.object({
  //user acc
  password: z.string().superRefine((val, ctx) => {
    const errors = [];

    if (val.length < 8) errors.push("min 8 chars");
    if (!/[A-Z]/.test(val)) errors.push("1 upper");
    if (!/[a-z]/.test(val)) errors.push("1 lower");
    if (!/[0-9]/.test(val)) errors.push("1 number");
    if (!/[^A-Za-z0-9]/.test(val)) errors.push("1 symbol");

    if (errors.length > 0) {
      ctx.addIssue({
        code: z.custom,
        message: errors.join(", "),
      });
    }
  }),

  confirmPassword: z.string().trim().min(1, "required"),

  // Personal Info
  firstName: z.string().trim().min(1, "required"),
  middleName: z.string().trim().optional().nullable(),
  lastName: z.string().trim().min(1, "required"),
  nickname: z.string().trim().optional().nullable(),
  extensionName: z
    .string()
    .max(3, "cannot exceed 3 characters")
    .optional()
    .nullable(),
  sex: z.string().trim().min(1, "required"),
  gender: z.string().optional().nullable(),
  birthdate: z.date("required"),
  birthplace: z.string().trim().optional().nullable(),
  nationality: z.string().trim().min(1, "required"),
  civilStatus: z.string().trim().min(1, "required"),
  heightCm: z.number().optional().nullable(),
  weightKg: z.number().optional().nullable(),
  bloodType: z.string().trim().optional().nullable(),

  // Contact Info
  personalEmail: z.string().trim().min(1, "required"),
  phoneNumber: z.string().trim().min(1, "required"),
  companyIssuedPhoneNumber: z.string().trim().optional().nullable(),

  // Emergency Contacts
  emergencyContacts: z
    .array(
      z.object({
        name: z.string().trim().optional().nullable(),
        contactNumber: z.string().trim().optional().nullable(),
        relationship: z.string().trim().optional().nullable(),
      })
    )
    .optional()
    .nullable(),

  // Permanent Address
  buildingNumPermanent: z.string().trim().optional().nullable(),
  streetPermanent: z.string().trim().optional().nullable(),
  postalCodePermanent: z.string().trim().min(1, "required"),
  countryPermanent: z.string().trim().min(1, "required"),
  regionPermanent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),

  provincePermanent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),

  cityPermanent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),

  barangayPermanent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),

  // Present Address
  buildingNumPresent: z.string().trim().optional().nullable(),
  streetPresent: z.string().trim().optional().nullable(),
  postalCodePresent: z.string().trim().min(1, "required"),
  countryPresent: z.string().trim().min(1, "required"),

  regionPresent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),
  provincePresent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),
  cityPresent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),
  barangayPresent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),

  // Government Remittances
  governmentRemittances: z
    .array(
      z.object({
        gov_type_id: z.string().optional().nullable(),
        type: z.string().trim().min(1, "required"),
        acc_number: z.string().trim().optional().nullable(),
      })
    )
    .optional()
    .nullable(),

  // Employee Info
  employeeId: z
    .string()
    .trim()
    .min(1, "required")
    .regex(/^[A-Za-z]+-\d+$/, {
      message: "Must be in format: PREFIX-NUMBERS (e.g., OCCI-0321, TEE-0123)",
    }),

  workEmail: z
    .email("invalid work email")
    .refine(
      (val) =>
        ["@getfullsuite.com", "@viascari.com"].some((domain) =>
          val.endsWith(domain)
        ),
      {
        message: "email must be a @getfullsuite.com or @viascari.com",
      }
    ),

  office: z.string().trim().optional().nullable(),
  division: z.string().trim().optional().nullable(),
  department: z.string().trim().optional().nullable(),
  team: z.string().trim().optional().nullable(),
  jobTitle: z.string().trim().min(1, "required"),
  employmentStatus: z.string().trim().min(1, "required"),
  jobLevel: z.string().trim().min(1, "required"),
  employeeType: z.string().trim().min(1, "required"),
  shift: z.string().trim().min(1, "required"),
  supervisor: z.string().trim().min(1, "required"),

  salaryBasePay: z.number({ error: "required" }),
  salaryType: z.string().trim().min(1, "required"),
  docuEmploymentLink: z.string().trim().optional().nullable(),

  // Employment Timeline
  dateHired: z.date("required"),
  dateRegularized: z.date().optional().nullable(),
  dateOffboarded: z.date().optional().nullable(),
  dateSeparated: z.date().optional().nullable(),
});

export const employeePersonalDetailsFormSchema = z.object({
  // Personal Details
  firstName: z.string().trim().min(1, "required"),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, "required"),
  nickname: z.string().trim().optional(),
  extensionName: z.string().max(3, "cannot exceed 3 characters").optional(),
  sex: z.string().trim().min(1, "required"),
  gender: z.string().optional(),
  birthdate: z.date("required"),
  birthplace: z.string().trim().optional(),
  nationality: z.string().trim().min(1, "required"),
  civilStatus: z.string().trim().min(1, "required"),
  heightCm: z.number().optional(),
  weightKg: z.number().optional(),
  bloodType: z.string().trim().optional(),
});

export const employeeContactInfoFormSchema = z.object({
  // Contact Info
  personalEmail: z.string().trim().min(1, "required"),
  phoneNumber: z.string().trim().min(1, "required"),
  companyIssuedPhoneNumber: z.string().trim().optional(),

  workEmail: z
    .email("invalid work email")
    .refine((val) => val.endsWith("@getfullsuite.com"), {
      message: "email must be a @getfullsuite.com",
    }),
});

export const employeeGovernmentRemittancesFormSchema = z.object({
  governmentIdNumbers: z
    .object({
      TIN: z.string().optional(),
      PHIC: z.string().optional(),
      SSS: z.string().optional(),
      HDMF: z.string().optional(),
      UnionBank: z.string().optional(),
      PhilCare: z.string().optional(),
    })
    .optional(),
});

export const employeeEmergencyContactsFormSchema = z.object({
  emergencyContacts: z
    .array(
      z.object({
        name: z.string().trim().optional(),
        contactNumber: z.string().trim().optional(),
        relationship: z.string().trim().optional(),
      })
    )
    .optional(),
});

export const employeeAddressesFormSchema = z.object({
  // Permanent Address
  buildingNumPermanent: z.string().trim().optional(),
  streetPermanent: z.string().trim().optional(),
  postalCodePermanent: z.string().trim().min(1, "required"),
  countryPermanent: z.string().trim().min(1, "required"),
  regionPermanent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),

  provincePermanent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),

  cityPermanent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),

  barangayPermanent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),

  // Present Address
  buildingNumPresent: z.string().trim().optional(),
  streetPresent: z.string().trim().optional(),
  postalCodePresent: z.string().trim().min(1, "required"),
  countryPresent: z.string().trim().min(1, "required"),

  regionPresent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),
  provincePresent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),
  cityPresent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),
  barangayPresent: z
    .object({
      code: z.string().trim(),
      name: z.string().trim(),
    })
    .catch({ code: "", name: "" })
    .refine((val) => !!val?.code, { message: "required" }),
});

export const employeeDocuURLFormSchema = z.object({
  hr201_url: z.string().trim().optional(),
});

//EMPLOYMENTTT UPDATES

//designation

export const employeeDesignationFormSchema = z.object({
  office: z.string().trim().optional().nullable(),
  division: z.string().trim().optional().nullable(),
  department: z.string().trim().optional().nullable(),
  team: z.string().trim().optional().nullable(),
  jobTitle: z
    .string({ required_error: "required" })
    .trim()
    .min(1, "required")
    .nullable()
    .refine((val) => val !== null && val.trim().length > 0, {
      message: "required",
    }),

  employmentStatus: z.string().trim().min(1, "required"),
  jobLevel: z.string().trim().min(1, "required"),
  employeeType: z.string().trim().min(1, "required"),
  shift: z.string().trim().min(1, "required"),
  supervisor: z.string().trim().min(1, "required"),
});

//salary
export const employeeSalaryFormSchema = z.object({
  base_pay: z.number().optional(),
  salary_adjustment_type_id: z.string().trim().min(1, "required"),
  date: z.date().optional(),
});

// Employment Timeline
export const employeeTimelineFormSchema = z.object({
  date_hired: z.date("required"),
  date_regularization: z.date().nullable().optional(),
  date_offboarding: z.date().nullable().optional(),
  date_separated: z.date().nullable().optional(),
});

// ALL FIELDS NOT REQUIRED FOR FAST TESTINGG ito

// import { z } from "zod";

// export const employeeFormSchema = z.object({
//   // User account
//   password: z.string().optional(),
//   confirmPassword: z.string().optional(),

//   // Personal Info
//   firstName: z.string().optional(),
//   middleName: z.string().optional(),
//   lastName: z.string().optional(),
//   nickname: z.string().optional(),
//   extensionName: z.string().optional(),
//   sex: z.string().optional(),
//   gender: z.string().optional(),
//   birthdate: z.date().optional(),
//   birthplace: z.string().optional(),
//   nationality: z.string().optional(),
//   civilStatus: z.string().optional(),
//   heightCm: z.number().optional(),
//   weightKg: z.number().optional(),
//   bloodType: z.string().optional(),

//   // Contact Info
//   personalEmail: z.string().optional(),
//   phoneNumber: z.string().optional(),

//   // Emergency Contacts
//   emergencyContacts: z
//     .array(
//       z.object({
//         name: z.string().optional(),
//         contactNumber: z.string().optional(),
//         relationship: z.string().optional(),
//       })
//     )
//     .optional(),

//   // Permanent Address
//   buildingNumPermanent: z.string().optional(),
//   streetPermanent: z.string().optional(),
//   postalCodePermanent: z.string().optional(),
//   countryPermanent: z.string().optional(),
//   regionPermanent: z
//     .object({
//       code: z.string().optional(),
//       name: z.string().optional(),
//     })
//     .optional(),
//   provincePermanent: z
//     .object({
//       code: z.string().optional(),
//       name: z.string().optional(),
//     })
//     .optional(),
//   cityPermanent: z
//     .object({
//       code: z.string().optional(),
//       name: z.string().optional(),
//     })
//     .optional(),
//   barangayPermanent: z
//     .object({
//       code: z.string().optional(),
//       name: z.string().optional(),
//     })
//     .optional(),

//   // Present Address
//   buildingNumPresent: z.string().optional(),
//   streetPresent: z.string().optional(),
//   postalCodePresent: z.string().optional(),
//   countryPresent: z.string().optional(),
//   regionPresent: z
//     .object({
//       code: z.string().optional(),
//       name: z.string().optional(),
//     })
//     .optional(),
//   provincePresent: z
//     .object({
//       code: z.string().optional(),
//       name: z.string().optional(),
//     })
//     .optional(),
//   cityPresent: z
//     .object({
//       code: z.string().optional(),
//       name: z.string().optional(),
//     })
//     .optional(),
//   barangayPresent: z
//     .object({
//       code: z.string().optional(),
//       name: z.string().optional(),
//     })
//     .optional(),

//   // Government Remittances
//   governmentRemittances: z
//     .array(
//       z.object({
//         gov_type_id: z.string().optional(),
//         type: z.string().optional(),
//         acc_number: z.string().optional(),
//       })
//     )
//     .optional(),

//   // Employee Info
//   employeeId: z.string().optional(),
//   workEmail: z.string().optional(),
//   companyIssuedPhoneNumber: z.string().optional(),
//   office: z.string().optional(),
//   division: z.string().optional(),
//   department: z.string().optional(),
//   team: z.string().optional(),
//   jobTitle: z.string().optional(),
//   employmentStatus: z.string().optional(),
//   jobLevel: z.string().optional(),
//   employeeType: z.string().optional(),
//   shift: z.string().optional(),
//   supervisor: z.string().optional(),

//   salaryBasePay: z.number().optional(),
//   salaryType: z.string().optional(),
//   docuEmploymentLink: z.string().optional(),

//   // Employment Timeline
//   dateHired: z.date().optional(),
//   dateRegularized: z.date().optional(),
//   dateOffboarded: z.date().optional(),
//   dateSeparated: z.date().optional(),
// });
