import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeFormSchema } from "./schemas/employeeSchema";
import FormLayout from "./FormLayout";
import TextField from "./fields/TextField";
import DropdownField from "./fields/DropdownField";
import DatepickerField from "./fields/DatePickerField";
import AddressFields from "./fields/AddressFields";
import FormActions from "./buttons/FormActions";
import { useEffect, useMemo, useState } from "react";
import GovernmentRemittancesSection from "./fields/dynamic-fields/GovernmentRemittancesSectionFields";
import EmergencyContactsSection from "./fields/dynamic-fields/EmergencyContactsSectionFields";
import EmployeeSearchComboBox from "./fields/dynamic-fields/EmployeeSearchComboBox";
import OfficeSearchComboBox from "./fields/dynamic-fields/OfficeSearchComboBox";
import DivisionSearchComboBox from "./fields/dynamic-fields/DivisionSearchComboBox";
import DepartmentSearchComboBox from "./fields/dynamic-fields/DepartmentSearchComboBox";
import TeamSearchComboBox from "./fields/dynamic-fields/TeamSearchComboBox";
import JobPositionSearchComboBox from "./fields/dynamic-fields/JobPositionSearchComboBox";
import EmploymentStatusSearchComboBox from "./fields/dynamic-fields/EmploymentStatusSearchComboBox";
import JobLevelSearchComboBox from "./fields/dynamic-fields/JobLevelSearchComboBox";
import EmployeeTypeSearchComboBox from "./fields/dynamic-fields/EmployeeTypeSearchComboBox";
import SalaryTypeSearchComboBox from "./fields/dynamic-fields/SalaryTypeSearchComboBox";
import ShiftTemplateSearchComboBox from "./fields/dynamic-fields/ShiftTemplateSearchComboBox";
import PasswordField from "./fields/PasswordField";
import { useFetchGovernmentRemittancesAPI } from "@/hooks/useGovernmentRemittancesAPI";
import {
  useCheckEmployeeEmailAvailabilityAPI,
  useCheckEmployeeIdAvailabilityAPI,
  useFetchLatestEmployeeIdAPI,
} from "@/hooks/useEmployeeAPI";
import EmployeeIdTextField from "./fields/EmployeeIdTextField";
import GeneratePasswordButton from "./buttons/GeneratePassword";
import WorkEmailTextField from "./fields/WorkEmailTextField";

const EmployeeForm = ({ onSubmit, onCancel }) => {
  const { allGovernmentRemittances, loading } =
    useFetchGovernmentRemittancesAPI();

  const { latestEmployeeId, loading: latestIdLoading } =
    useFetchLatestEmployeeIdAPI();

  const form = useForm({
    resolver: zodResolver(employeeFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      //user acc

      password: "",
      confirmPassword: "",
      // Personal Info
      firstName: "",
      middleName: "",
      lastName: "",
      nickname: "",
      extensionName: "",
      sex: "",
      gender: "",
      birthdate: null,
      birthplace: "",
      nationality: "",
      civilStatus: "",
      heightCm: 0,
      weightKg: 0,
      bloodType: "",

      // Contact Info
      personalEmail: "",
      phoneNumber: "",
      companyIssuedPhoneNumber: "",
      // Emergency Contacts
      emergencyContacts: [
        {
          fullname: "",
          contactNumber: "",
          relationship: "",
        },
      ],

      // Permanent Address
      countryPermanent: "",
      regionPermanent: { code: "", name: "" },
      provincePermanent: { code: "", name: "" },
      cityPermanent: { code: "", name: "" },
      barangayPermanent: { code: "", name: "" },
      postalCodePermanent: "",

      buildingNumPermanent: "",
      streetPermanent: "",

      // Present Address
      countryPresent: "",
      regionPresent: { code: "", name: "" },
      provincePresent: { code: "", name: "" },
      cityPresent: { code: "", name: "" },
      barangayPresent: { code: "", name: "" },
      postalCodePresent: "",
      buildingNumPresent: "",
      streetPresent: "",

      governmentRemittances: [],

      // Employee Info
      employeeId: "",
      workEmail: "",
      office: "",
      division: "",
      department: "",
      team: "",
      jobTitle: "",
      employmentStatus: "",
      jobLevel: "",
      employeeType: "",
      shift: "",
      supervisor: "",
      salaryBasePay: 0,
      salaryType: "",
      docuUrl: "",

      // Employment Timeline
      dateHired: undefined,
      dateRegularized: undefined,
      dateOffboarded: undefined,
      dateSeparated: undefined,
    },
  });

  const defaultGovRemittances = useMemo(() => {
    return allGovernmentRemittances
      .filter((item) => item.government_id_name.toLowerCase() !== "philcare")
      .map((item) => ({
        type: item.government_id_type_id,
        acc_number: "",
      }));
  }, [allGovernmentRemittances]);

  useEffect(() => {
    if (!loading && allGovernmentRemittances.length) {
      form.reset({
        ...form.getValues(),
        governmentRemittances: defaultGovRemittances,
      });
    }
  }, [loading, allGovernmentRemittances, defaultGovRemittances]);
  useEffect(() => {
    if (latestEmployeeId) {
      const parts = latestEmployeeId.split("-");
      const prefix = parts[0]; // OCCI
      const num = parseInt(parts[1], 10); // 452
      const nextNum = num + 1;

      const padded = String(nextNum).padStart(parts[1].length, "0");
      const newId = `${prefix}-${padded}`;

      form.reset({
        ...form.getValues(),
        employeeId: newId,
      });
    }
  }, [latestEmployeeId]);

  const [copy, setCopy] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const doPasswordsMatch = password === confirmPassword;

  const { isEmpIdAvailable, isEmpIdAvailableLoading, checkAvailability } =
    useCheckEmployeeIdAvailabilityAPI();

  const {
    formState: { isSubmitting },
  } = form;
  const {
    isEmpEmailAvailable,
    isEmpEmailAvailableLoading,
    checkEmailAvailability,
  } = useCheckEmployeeEmailAvailabilityAPI();

  const generateWorkEmail = (first = "", last = "") => {
    if (!first || !last) return "";
    const firstWord = first.trim().split(" ")[0].toLowerCase();
    const cleanLast = last.replace(/\s+/g, "").toLowerCase();
    return `${firstWord}.${cleanLast}@getfullsuite.com`;
  };

  const firstNameValue = form.watch("firstName");
  const lastNameValue = form.watch("lastName");
  const employeeIdValue = form.watch("employeeId");

  useEffect(() => {
      checkAvailability(employeeIdValue);
  }, [employeeIdValue]);

  useEffect(() => {
    if (firstNameValue && lastNameValue) {
      const email = generateWorkEmail(firstNameValue, lastNameValue);
      form.setValue("workEmail", email, { shouldValidate: true });
      checkEmailAvailability(email);
    }
  }, [firstNameValue, lastNameValue]);

  return (
    <FormLayout form={form} onSubmit={onSubmit}>
      <div>
        <h2 className="text-sm font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextField
            name="firstName"
            label="First Name"
            control={form.control}
            required
          />
          <TextField
            name="middleName"
            label="Middle Name"
            control={form.control}
          />
          <TextField
            name="lastName"
            label="Last Name"
            control={form.control}
            required
          />
          <TextField
            name="extensionName"
            label="Extension Name (e.g. 'Jr.','II', etc.)"
            control={form.control}
          />
          <TextField name="nickname" label="Nickname" control={form.control} />
          <DropdownField
            name="sex"
            label="Sex"
            control={form.control}
            options={["Male", "Female"]}
            required
          />{" "}
          <DropdownField
            name="gender"
            label="Gender"
            control={form.control}
            options={[
              "Cisgender",
              "Transgender",
              "Non-binary",
              "Genderqueer",
              "Agender",
              "Genderfluid",
              "Intersex",
              "Bigender",
              "Pangender",
              "Gender non-conforming",
            ]}
          />
          <DropdownField
            name="civilStatus"
            label="Civil Status"
            control={form.control}
            options={[
              "Single",
              "Married",
              "Widowed",
              "Divorced",
              "Separated",
              "Civil Union",
            ]}
            required
          />
          <TextField
            name="heightCm"
            label="Height(CM)"
            type="number"
            min={0}
            control={form.control}
          />{" "}
          <TextField
            name="weightKg"
            label="Weight(KG)"
            type="number"
            min={0}
            control={form.control}
          />
          <DatepickerField
            name="birthdate"
            label="Birthdate"
            control={form.control}
            required
          />
          <TextField
            name="birthplace"
            label="Birthplace"
            control={form.control}
          />
          <TextField
            name="nationality"
            label="Nationality"
            control={form.control}
          />
          <DropdownField
            name="bloodType"
            label="Blood Type"
            control={form.control}
            options={[
              "A",
              "A+",
              "A-",
              "B",
              "B+",
              "B-",
              "AB",
              "AB+",
              "AB-",
              "O",
              "O+",
              "O-",
              "Unknown",
            ]}
          />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <TextField
            name="personalEmail"
            label="Personal Email"
            control={form.control}
            type="email"
            placeholder="you@gmail.com"
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            control={form.control}
            type="tel"
            placeholder="09XXXXXXXXX"
          />
        </div>
      </div>

      <div>
        <EmergencyContactsSection />
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-4">Addresses</h2>

        <AddressFields
          control={form.control}
          watch={form.watch}
          setValue={form.setValue}
          trigger={form.trigger}
          prefix="permanent"
          sectionLabel="Permanent Address"
        />
        <div className="py-3"></div>
        <AddressFields
          control={form.control}
          watch={form.watch}
          setValue={form.setValue}
          trigger={form.trigger}
          prefix="present"
          sectionLabel="Current Address"
          enableCopyFrom
          copyFromPrefix="permanent"
          isCopyEnabled={copy}
          onCopyToggle={setCopy}
        />
      </div>
      <div>
        <GovernmentRemittancesSection />
      </div>
      <div>
        <h2 className="text-sm font-semibold mb-4">Employee Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <EmployeeIdTextField
            name="employeeId"
            control={form.control}
            label="Employee ID"
            placeholder="Enter employee ID"
            required
            onAvailabilityCheck={(value) => {
                checkAvailability(value);
            }}
            availabilityState={{
              loading: isEmpIdAvailableLoading,
              available: isEmpIdAvailable,
            }}
          />
          <WorkEmailTextField
            control={form.control}
            required
            availabilityState={{
              loading: isEmpEmailAvailableLoading,
              available: isEmpEmailAvailable,
            }}
            onAvailabilityCheck={checkEmailAvailability}
          />
          <TextField
            name="companyIssuedPhoneNumber"
            label="Company Issued Phone Number"
            control={form.control}
            type="tel"
            placeholder="09XXXXXXXXX"
          />
          <OfficeSearchComboBox name="office" control={form.control} />
          <DivisionSearchComboBox name="division" control={form.control} />
          <DepartmentSearchComboBox name="department" control={form.control} />
          <TeamSearchComboBox name="team" control={form.control} />
          <JobPositionSearchComboBox
            name="jobTitle"
            control={form.control}
            required
          />
          <EmploymentStatusSearchComboBox
            name="employmentStatus"
            control={form.control}
            required
          />
          <JobLevelSearchComboBox
            name="jobLevel"
            control={form.control}
            required
          />
          <EmployeeTypeSearchComboBox
            name="employeeType"
            control={form.control}
            required
          />
          <ShiftTemplateSearchComboBox
            name="shift"
            control={form.control}
            required
          />
          <EmployeeSearchComboBox
            name="supervisor"
            control={form.control}
            required
          />{" "}
          <TextField
            name="docuUrl"
            placeholder={"https://drive.google.com/..."}
            label="Document URL (Google Drive Folder Link)"
            type="url"
            control={form.control}
          />
          <TextField
            name="salaryBasePay"
            label="Salary Base Pay"
            type="number"
            min={0}
            control={form.control}
          />
          <SalaryTypeSearchComboBox name="salaryType" control={form.control} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-4">Employment Timeline</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <DatepickerField
            name="dateHired"
            label="Date Hired"
            control={form.control}
            required
          />
          <DatepickerField
            name="dateRegularized"
            label="Date Regularized"
            control={form.control}
            allowAllDates
          />
          <DatepickerField
            name="dateOffboarded"
            label="Date Offboarded"
            control={form.control}
            allowAllDates
          />
          <DatepickerField
            name="dateSeparated"
            label="Date Separated"
            control={form.control}
            allowAllDates
          />
        </div>
      </div>

      <div>
        <div className="flex flex-col items-start mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h2 className="text-sm font-semibold">User Account</h2>
            <span className="text-muted-foreground text-xs">
              (Employee login credentials for accessing services)
            </span>
          </div>

          <p className="text-muted-foreground text-xs">
            Generated Password Format:{" "}
            <code className="bg-gray-100 px-1 rounded">
              {"{employeeID}-{LASTNAME}-{firstname}"}
            </code>{" "}
            <br /> Example:{" "}
            <code className="bg-gray-100 px-1 rounded">
              OCCI-0000-DELACRUZ-juan
            </code>
          </p>

          <GeneratePasswordButton form={form} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <PasswordField
            name="password"
            label="Password"
            control={form.control}
            value={form.watch("password")}
            onValueChange={(val) => form.setValue("password", val)}
            required
          />

          <PasswordField
            name="confirmPassword"
            label="Confirm Password"
            control={form.control}
            value={form.watch("confirmPassword")}
            onValueChange={(val) => form.setValue("confirmPassword", val)}
            errorMessage={
              form.watch("confirmPassword") &&
              form.watch("password") !== form.watch("confirmPassword")
                ? "Passwords do not match"
                : ""
            }
            required
          />
        </div>
      </div>

      <FormActions
        isLoading={isSubmitting}
        onCancel={onCancel}
        submitLabel="Submit"
        cancelLabel="Cancel"
        loadingLabel="Saving..."
      />
    </FormLayout>
  );
};

export default EmployeeForm;
