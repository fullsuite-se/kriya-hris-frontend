import CustomDialog from "@/components/dialog/CustomDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";

import { useState, useContext, useEffect } from "react";
import TextField from "@/components/forms/fields/TextField";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeAddressesFormSchema } from "@/components/forms/schemas/employeeSchema";
import DropdownField from "@/components/forms/fields/DropdownField";
import DatepickerField from "@/components/forms/fields/DatePickerField";
import AddressFields from "@/components/forms/fields/AddressFields";
import FormLayout from "@/components/forms/FormLayout";
import { useEditEmployeeAddressesAPI } from "@/hooks/useEmployeeAPI";
import { formatAddressesPayload } from "@/utils/formatters/formatAddressesPayload";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { glassToast } from "@/components/ui/glass-toast";

const EditAddressesDialog = ({ trigger, refetch }) => {
  const [open, setOpen] = useState(false);
  const { user, addresses } = useContext(EmployeeDetailsContext);
  const [copy, setCopy] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  const { editEmployeeAddresses, loading } = useEditEmployeeAddressesAPI();

  const form = useForm({
    resolver: zodResolver(employeeAddressesFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      // Permanent Address
      regionPermanent: { code: "", name: "" },
      provincePermanent: { code: "", name: "" },
      cityPermanent: { code: "", name: "" },
      barangayPermanent: { code: "", name: "" },

      countryPermanent: "",
      postalCodePermanent: "",
      buildingNumPermanent: "",
      streetPermanent: "",
      addressIdPermanent: "",

      // Present Address
      regionPresent: { code: "", name: "" },
      provincePresent: { code: "", name: "" },
      cityPresent: { code: "", name: "" },
      barangayPresent: { code: "", name: "" },

      countryPresent: "",
      postalCodePresent: "",
      buildingNumPresent: "",
      streetPresent: "",
      addressIdPresent: "",
    },
  });

  useEffect(() => {
    if (open && addresses) {
      const defaultVals = {
        regionPermanent: { code: "", name: "" },
        provincePermanent: { code: "", name: "" },
        cityPermanent: { code: "", name: "" },
        barangayPermanent: { code: "", name: "" },
        countryPermanent: "",
        postalCodePermanent: "",
        buildingNumPermanent: "",
        streetPermanent: "",
        addressIdPermanent: "",

        regionPresent: { code: "", name: "" },
        provincePresent: { code: "", name: "" },
        cityPresent: { code: "", name: "" },
        barangayPresent: { code: "", name: "" },
        countryPresent: "",
        postalCodePresent: "",
        buildingNumPresent: "",
        streetPresent: "",
        addressIdPresent: "",
      };

      addresses.forEach((address) => {
        const type = address.address_type?.trim().toUpperCase();
        if (type === "CURRENT") {
          defaultVals.countryPresent = address.country || "";
          defaultVals.postalCodePresent = address.postal_code || "";
          defaultVals.buildingNumPresent = address.building_num || "";
          defaultVals.streetPresent = address.street || "";
          defaultVals.addressIdPresent = address.user_address_id || "";
          defaultVals.regionPresent = {
            code: address.regionCode || "",
            name: address.region || "",
          };
          defaultVals.provincePresent = {
            code: address.provinceCode || "",
            name: address.province || "",
          };
          defaultVals.cityPresent = {
            code: address.cityCode || "",
            name: address.city || "",
          };
          defaultVals.barangayPresent = {
            code: address.barangayCode || "",
            name: address.barangay || "",
          };
        } else if (type === "PERMANENT") {
          defaultVals.countryPermanent = address.country || "";
          defaultVals.postalCodePermanent = address.postal_code || "";
          defaultVals.buildingNumPermanent = address.building_num || "";
          defaultVals.streetPermanent = address.street || "";
          defaultVals.addressIdPermanent = address.user_address_id || "";
          defaultVals.regionPermanent = {
            code: address.regionCode || "",
            name: address.region || "",
          };
          defaultVals.provincePermanent = {
            code: address.provinceCode || "",
            name: address.province || "",
          };
          defaultVals.cityPermanent = {
            code: address.cityCode || "",
            name: address.city || "",
          };
          defaultVals.barangayPermanent = {
            code: address.barangayCode || "",
            name: address.barangay || "",
          };
        }
      });

      form.reset(defaultVals, { keepDefaultValues: true });
    }
  }, [open, addresses, form]);

  const onSaveChanges = async (data) => {
    const user_id = user?.user_id;
    if (!user_id) return alert("User ID not found.");

    try {
      console.log("Raw form data:", data);

      const normalize = (value) =>
        (value ?? "").toString().trim().toLowerCase();

      const payload = formatAddressesPayload(data);

      const oldPayload = { addresses: addresses || [] };

      const changedAddresses = payload.addresses.filter((newAddr, idx) => {
        const oldAddr = oldPayload.addresses?.[idx] || {};
        return (
          normalize(newAddr.building_num) !== normalize(oldAddr.building_num) ||
          normalize(newAddr.street) !== normalize(oldAddr.street) ||
          normalize(newAddr.barangay) !== normalize(oldAddr.barangay) ||
          normalize(newAddr.barangayCode) !== normalize(oldAddr.barangayCode) ||
          normalize(newAddr.city) !== normalize(oldAddr.city) ||
          normalize(newAddr.cityCode) !== normalize(oldAddr.cityCode) ||
          normalize(newAddr.postal_code) !== normalize(oldAddr.postal_code) ||
          normalize(newAddr.province) !== normalize(oldAddr.province) ||
          normalize(newAddr.provinceCode) !== normalize(oldAddr.provinceCode) ||
          normalize(newAddr.region) !== normalize(oldAddr.region) ||
          normalize(newAddr.regionCode) !== normalize(oldAddr.regionCode) ||
          normalize(newAddr.country) !== normalize(oldAddr.country)
        );
      });

      if (changedAddresses.length === 0) {
        glassToast({
          message: `No changes in Addresses.`,
          icon: <InformationCircleIcon className="w-5 h-5 text-gray-500" />,
          duration: 3000,
        });
        setOpen(false);
        setConfirmSubmitOpen(false);
        return;
      }

      console.log("Changed addresses:", changedAddresses);

      const response = await editEmployeeAddresses(user_id, payload);
      console.log("responseeee: ", response);

      setOpen(false);
      setConfirmSubmitOpen(false);

      if (refetch) {
        await refetch();
      }

      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>Addresses</span> updated
            successfully!
          </>
        ),
        icon: <CheckCircleIcon className="w-5 h-5 text-[#008080]" />,
        duration: 4000,
      });
    } catch (err) {
      console.error(err);
      glassToast({
        message: `Failed to update Addresses. Please try again.`,
        icon: <ExclamationTriangleIcon className="w-5 h-5 text-[#CC5500]" />,
        duration: 4000,
      });
    }
  };

  const confirmCancel = () => {
    setConfirmCancelOpen(false);
    setOpen(false);
    form.reset({ addresses });
  };

  return (
    <div>
      <CustomDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) setConfirmCancelOpen(true);
          else setOpen(true);
        }}
        trigger={trigger}
        title="Update Government Remittances"
        width="xl"
        height="full"
        confirmLabel="Save Changes"
        onConfirm={() => setConfirmSubmitOpen(true)}
      >
        <FormProvider {...form}>
          <div>
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
        </FormProvider>
      </CustomDialog>
      <CustomDialog
        open={confirmCancelOpen}
        onOpenChange={setConfirmCancelOpen}
        title="Discard Changes?"
        description="Are you sure you want to cancel? Any unsaved changes will be lost."
        confirmLabel="Yes, Discard"
        cancelLabel="Go Back"
        onConfirm={confirmCancel}
        isShownCloseButton={false}
        allowOutsideInteraction
      />

      <CustomDialog
        open={confirmSubmitOpen}
        onOpenChange={setConfirmSubmitOpen}
        title="Save Changes?"
        description="Are you sure you want to save the changes you made?"
        confirmLabel="Yes, Save changes"
        cancelLabel="Go Back"
        loading={loading}
        onConfirm={form.handleSubmit(onSaveChanges)}
        onCancel={() => setConfirmSubmitOpen(false)}
        isShownCloseButton={false}
        allowOutsideInteraction
      />
    </div>
  );
};

export default EditAddressesDialog;
