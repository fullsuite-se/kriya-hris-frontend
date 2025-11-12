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
  nationality: z.string().trim().optional(),
  civilStatus: z.string().trim().min(1, "required"),
  heightCm: z.number().optional().nullable(),
  weightKg: z.number().optional().nullable(),
  bloodType: z.string().trim().optional().nullable(),

  // Contact Info
  personalEmail: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
  companyIssuedPhoneNumber: z.string().trim().optional().nullable(),

  // Emergency Contacts
  emergencyContacts: z
    .array(
      z.object({
        fullname: z.string().trim().optional().nullable(),
        contactNumber: z.string().trim().optional().nullable(),
        relationship: z.string().trim().optional().nullable(),
      })
    )
    .optional()
    .nullable(),

  // Permanent Address
  buildingNumPermanent: z.string().trim().optional().nullable(),
  streetPermanent: z.string().trim().optional().nullable(),
  postalCodePermanent: z.string().trim().optional().nullable(),
  countryPermanent: z.string().trim().optional().nullable(),
  regionPermanent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => {
      if (!val) return null;
      return typeof val === "string" ? { code: null, name: val } : val;
    }),
  provincePermanent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => (typeof val === "string" ? { code: null, name: val } : val)),

  cityPermanent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => (typeof val === "string" ? { code: null, name: val } : val)),

  barangayPermanent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => (typeof val === "string" ? { code: null, name: val } : val)),


  // Present Address
  buildingNumPresent: z.string().trim().optional().nullable(),
  streetPresent: z.string().trim().optional().nullable(),
  postalCodePresent: z.string().trim().optional().nullable(),
  countryPresent: z.string().trim().optional().nullable(),

  regionPresent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => {
      if (!val) return null;
      return typeof val === "string" ? { code: null, name: val } : val;
    }),
  provincePresent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => {
      if (!val) return null;
      return typeof val === "string" ? { code: null, name: val } : val;
    }),
  cityPresent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => {
      if (!val) return null;
      return typeof val === "string" ? { code: null, name: val } : val;
    }),
  barangayPresent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => {
      if (!val) return null;
      return typeof val === "string" ? { code: null, name: val } : val;
    }),

  //when address to be required - this
  /*
  e.g.
    barangayPresent: z
      .object({
        code: z.string().trim(),
        name: z.string().trim(),
      })
      .catch({ code: "", name: "" })
      .refine((val) => !!val?.code, { message: "required" }),
  
  */

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
  nationality: z.string().trim().optional(),
  civilStatus: z.string().trim().min(1, "required"),
  heightCm: z.number().optional(),
  weightKg: z.number().optional(),
  bloodType: z.string().trim().optional(),
});

export const employeeContactInfoFormSchema = z.object({
  // Contact Info
  personalEmail: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
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
  buildingNumPermanent: z.string().trim().optional().nullable(),
  streetPermanent: z.string().trim().optional().nullable(),
  postalCodePermanent: z.string().trim().optional().nullable(),
  countryPermanent: z.string().trim().optional().nullable(),
  regionPermanent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => {
      if (!val) return null;
      return typeof val === "string" ? { code: null, name: val } : val;
    }),
  provincePermanent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => (typeof val === "string" ? { code: null, name: val } : val)),

  cityPermanent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => (typeof val === "string" ? { code: null, name: val } : val)),

  barangayPermanent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => (typeof val === "string" ? { code: null, name: val } : val)),


  // Present Address
  buildingNumPresent: z.string().trim().optional().nullable(),
  streetPresent: z.string().trim().optional().nullable(),
  postalCodePresent: z.string().trim().optional().nullable(),
  countryPresent: z.string().trim().optional().nullable(),

  regionPresent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => {
      if (!val) return null;
      return typeof val === "string" ? { code: null, name: val } : val;
    }),
  provincePresent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => {
      if (!val) return null;
      return typeof val === "string" ? { code: null, name: val } : val;
    }),
  cityPresent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => {
      if (!val) return null;
      return typeof val === "string" ? { code: null, name: val } : val;
    }),
  barangayPresent: z
    .union([
      z.object({ code: z.string().trim(), name: z.string().trim() }).nullable(),
      z.string().trim().nullable(),
    ])
    .transform((val) => {
      if (!val) return null;
      return typeof val === "string" ? { code: null, name: val } : val;
    }),



});

export const employeeDocuURLFormSchema = z.object({
  hr201_url: z.string().trim().optional(),
});

//EMPLOYMENTTT UPDATES

//designation

export const employeeDesignationFormSchema = z.object({
  company_employer: z.string().trim().optional().nullable(),
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
