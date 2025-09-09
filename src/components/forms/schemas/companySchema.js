import { z } from "zod";

export const companyFormSchema = z.object({
  company_name: z.string().trim().min(1, "required"),
  company_trade_name: z.string().trim().min(1, "required"),
  company_email: z.string().trim().min(1, "required"),
  company_phone: z.string().trim().min(1, "required"),
  company_tin: z.string().trim().min(1, "required"),
  company_brn: z.string().trim().min(1, "required"),
  business_type: z.string().trim().min(1, "required"),
  industry_type: z.string().trim().min(1, "required"),
  // status: z.string().trim().min(1, "required"),
  floor_bldg_street: z.string().trim().min(1, "required"),
  barangay: z.string().trim().min(1, "required"),
  city_municipality: z.string().trim().min(1, "required"),
  province_region: z.string().trim().min(1, "required"),
  country: z.string().trim().min(1, "required"),
  postal_code: z.string().trim().min(1, "required"),
});
