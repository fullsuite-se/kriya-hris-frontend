import CustomDialog from "@/components/dialog/CustomDialog";
import EmployeeForm from "@/components/forms/EmployeeForm";
import { glassToast } from "@/components/ui/glass-toast";
import { useHeader } from "@/context/HeaderContext";
import { useAddEmployeeAPI } from "@/hooks/useEmployeeAPI";
import { useFetchGovernmentRemittancesAPI } from "@/hooks/useGovernmentRemittancesAPI";
import { extractDataForSaving } from "@/utils/parsers/extractData";
import { sanitizeData } from "@/utils/parsers/sanitizeData";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRegisterSuiteliferAPI } from "@/hooks/suitelifer/useRegisterSuiteliferAPI";

const AddEmployeePage = () => {
  const { setHeaderConfig } = useHeader();
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { addEmployee, loading, error } = useAddEmployeeAPI();
  const { registerSuitelifer } = useRegisterSuiteliferAPI();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (formData) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("FORM DATA: ", formData);

    const cleanData = sanitizeData(formData);
    console.log("CLEANED DATA: ", cleanData);

    const toNullIfEmpty = (value) =>
      value === "" || value === undefined ? null : value;

    // Emergency contacts
    const emergency_contacts = (cleanData.emergencyContacts || [])
      .map((c) => ({
        full_name: toNullIfEmpty(c.name),
        relationship: toNullIfEmpty(c.relationship),
        contact_number: toNullIfEmpty(c.contactNumber),
      }))
      .filter((c) => c.contact_number);

    // Government IDs
    const government_ids = (cleanData.governmentRemittances || [])
      .filter((g) => g.acc_number)
      .map((g) => ({
        government_id_type_id: g.type,
        government_id_number: g.acc_number,
      }));

    // Build payload matching backend structure
    const payload = {
      user_id: toNullIfEmpty(cleanData.employeeId),
      user_email: toNullIfEmpty(cleanData.workEmail),
      user_password: toNullIfEmpty(cleanData.password),

      first_name: toNullIfEmpty(cleanData.firstName),
      middle_name: toNullIfEmpty(cleanData.middleName),
      last_name: toNullIfEmpty(cleanData.lastName),
      extension_name: toNullIfEmpty(cleanData.extensionName),
      sex: toNullIfEmpty(cleanData.sex),
      gender: toNullIfEmpty(cleanData.gender),
      user_pic: null,
      personal_email: toNullIfEmpty(cleanData.personalEmail),
      contact_number: toNullIfEmpty(cleanData.phoneNumber),
      company_issued_phone_number: toNullIfEmpty(
        cleanData.companyIssuedPhoneNumber
      ),
      birthdate: toNullIfEmpty(formData.birthdate),
      nickname: toNullIfEmpty(cleanData.nickname),
      blood_type: toNullIfEmpty(cleanData.bloodType),
      civil_status: toNullIfEmpty(cleanData.civilStatus),
      height_cm: toNullIfEmpty(cleanData.heightCm),
      weight_kg: toNullIfEmpty(cleanData.weightKg),
      birth_place: toNullIfEmpty(cleanData.birthplace),
      nationality: toNullIfEmpty(cleanData.nationality),

      job_title_id: toNullIfEmpty(cleanData.jobTitle),
      department_id: toNullIfEmpty(cleanData.department),
      division_id: toNullIfEmpty(cleanData.division),
      upline_id: toNullIfEmpty(cleanData.supervisor),
      office_id: toNullIfEmpty(cleanData.office),
      team_id: toNullIfEmpty(cleanData.team),

      base_pay: toNullIfEmpty(cleanData.salaryBasePay),
      salary_adjustment_type_id: toNullIfEmpty(cleanData.salaryType),
      date_salary_created: new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila",
      }),

      hr201_url: toNullIfEmpty(cleanData.docuUrl),

      shift_template_id: toNullIfEmpty(cleanData.shift),
      date_hired: toNullIfEmpty(formData.dateHired),
      date_regularization: toNullIfEmpty(formData.dateRegularized),
      date_offboarding: toNullIfEmpty(formData.dateOffboarded),
      date_separated: toNullIfEmpty(formData.dateSeparated),
      employment_status_id: toNullIfEmpty(cleanData.employmentStatus),
      job_level_id: toNullIfEmpty(cleanData.jobLevel),
      employment_type_id: toNullIfEmpty(cleanData.employeeType),

      // Current address (code and name)
      currentBarangay: toNullIfEmpty(cleanData.barangayPresent.name),
      currentCity: toNullIfEmpty(cleanData.cityPresent.name),
      currentProvince: toNullIfEmpty(cleanData.provincePresent.name),
      currentRegion: toNullIfEmpty(cleanData.regionPresent.name),
      currentBarangayCode: toNullIfEmpty(cleanData.barangayPresent.code),
      currentCityCode: toNullIfEmpty(cleanData.cityPresent.code),
      currentProvinceCode: toNullIfEmpty(cleanData.provincePresent.code),
      currentRegionCode: toNullIfEmpty(cleanData.regionPresent.code),

      currentCountry: toNullIfEmpty(cleanData.countryPresent),
      currentPostalCode: toNullIfEmpty(cleanData.postalCodePresent),
      currentBuildingNum: toNullIfEmpty(cleanData.buildingNumPresent),
      currentStreet: toNullIfEmpty(cleanData.streetPresent),

      // Permanent address (code and name)
      permanentBarangay: toNullIfEmpty(cleanData.barangayPermanent.name),
      permanentCity: toNullIfEmpty(cleanData.cityPermanent.name),
      permanentProvince: toNullIfEmpty(cleanData.provincePermanent.name),
      permanentRegion: toNullIfEmpty(cleanData.regionPermanent.name),
      permanentBarangayCode: toNullIfEmpty(cleanData.barangayPermanent.code),
      permanentCityCode: toNullIfEmpty(cleanData.cityPermanent.code),
      permanentProvinceCode: toNullIfEmpty(cleanData.provincePermanent.code),
      permanentRegionCode: toNullIfEmpty(cleanData.regionPermanent.code),

      permanentCountry: toNullIfEmpty(cleanData.countryPermanent),
      permanentPostalCode: toNullIfEmpty(cleanData.postalCodePermanent),

      permanentBuildingNum: toNullIfEmpty(cleanData.buildingNumPermanent),
      permanentStreet: toNullIfEmpty(cleanData.streetPermanent),
      government_ids,
      emergency_contacts,
    };

    console.log("EMPLOYEE PAYLOAD:", payload);

    try {
      if (!executeRecaptcha) {
        glassToast({
          message: "reCaptcha is not ready.",
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });
        return;
      }

      const recaptchaToken = await executeRecaptcha("register");

      console.log("cleanData.employeeId: ", cleanData.employeeId);

      const result = await addEmployee(payload, recaptchaToken);
      await registerSuitelifer({
        userId: cleanData.employeeId,
        workEmail: cleanData.workEmail,
        password: cleanData.password,
        firstName: cleanData.firstName,
        middleName: cleanData.middleName,
        lastName: cleanData.lastName,
        isVerified: 1,
        isActive: 1,
      });
      console.log("registered in suitelifer!!");

      console.log("Employee saved successfully:", result);

      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>
              {payload.first_name} {payload.last_name}
            </span>{" "}
            added successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      navigate("/hris/employees");
    } catch (err) {
      console.error("Error saving employee:", err);
      glassToast({
        message:
          "Unable to add user. Double-check the information and try again.",
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    navigate(-1);
  };

  useEffect(() => {
    setHeaderConfig({
      title: "Add New Employee",
      description:
        "Fill out the form below to register a new employee and assign their details.",
      isHidden: false,
    });
  }, []);

  return (
    <>
      <div className="flex rounded-md bg-white p-5 w-full">
        <EmployeeForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>

      {showCancelDialog && (
        <CustomDialog
          open={showCancelDialog}
          onOpenChange={setShowCancelDialog}
          title="Cancel Employee Registration"
          description="Are you sure you want to cancel? All unsaved data will be lost."
          confirmLabel="Yes, Cancel"
          cancelLabel="Go Back"
          onConfirm={confirmCancel}
          isShownCloseButton={false}
          allowOutsideInteraction={true}
        />
      )}
    </>
  );
};

export default AddEmployeePage;
