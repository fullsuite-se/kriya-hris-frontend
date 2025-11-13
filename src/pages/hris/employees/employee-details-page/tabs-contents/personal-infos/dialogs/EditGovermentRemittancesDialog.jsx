import CustomDialog from "@/components/dialog/CustomDialog";
import { useState, useContext, useEffect } from "react";
import TextField from "@/components/forms/fields/TextField";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditEmployeeGovernmentRemittancesAPI } from "@/hooks/useEmployeeAPI";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { glassToast } from "@/components/ui/glass-toast";
import { employeeGovernmentRemittancesFormSchema } from "@/components/forms/schemas/employeeSchema";

const EditGovernmentRemittancesDialog = ({ trigger, refetch }) => {
  const [open, setOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  const { governmentIds, user } = useContext(EmployeeDetailsContext);

  const { editEmployeeGovernmentRemittances, loading } =
    useEditEmployeeGovernmentRemittancesAPI();

  const form = useForm({
    resolver: zodResolver(employeeGovernmentRemittancesFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      governmentIdNumbers: {
        TIN: "",
        PHIC: "",
        SSS: "",
        HDMF: "",
        UnionBank: "",
        PhilCare: "",
      },
    },
  });

  useEffect(() => {
    console.log("governmentIDs: ", governmentIds);
    if (governmentIds?.length) {
      const govValues = {
        TIN: "",
        PHIC: "",
        SSS: "",
        HDMF: "",
        UnionBank: "",
        PhilCare: "",
      };
      governmentIds.forEach((item) => {
        const key = item?.HrisUserGovernmentIdType?.government_id_name;
        if (key && govValues.hasOwnProperty(key)) {
          govValues[key] = item.government_id_number || "";
        }
      });
      form.reset({ governmentIdNumbers: govValues });
      console.log("govValues: ", govValues);
    }
  }, [governmentIds, form]);

  const onSaveChanges = async (data) => {
    const user_id = user?.user_id;
    if (!user_id) return alert("User ID not found.");

    try {
      const changedFields = {};
      const normalize = (value) => {
        if (value === undefined || value === null) return "";
        if (typeof value === "string") return value.trim();
        return String(value);
      };

      if (!Array.isArray(governmentIds)) {
        console.warn("governmentIds is not an array:", governmentIds);
        return;
      }

      Object.entries(data.governmentIdNumbers || {}).forEach(([key, value]) => {
        const trimmed = normalize(value);
        const currentValue = normalize(
          governmentIds.find(
            (item) => item?.HrisUserGovernmentIdType?.government_id_name === key
          )?.government_id_number || ""
        );

        if (trimmed.toLowerCase() !== currentValue.toLowerCase()) {
          changedFields[key] = trimmed;
        }
      });

      if (Object.keys(changedFields).length === 0) {
        glassToast({
          message: `No changes in Government Remittances.`,
          icon: <InformationCircleIcon className="w-5 h-5 text-gray-500" />,
          duration: 3000,
        });
        setOpen(false);
        setConfirmSubmitOpen(false);
        return;
      }
      console.log("changed fieeelds: ", changedFields);
      await editEmployeeGovernmentRemittances(user_id, changedFields);

      setOpen(false);
      setConfirmSubmitOpen(false);
      if (refetch) {
        await refetch();
      }
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>Government Remittances</span>{" "}
            updated successfully!
          </>
        ),
        icon: <CheckCircleIcon className="w-5 h-5 text-[#008080]" />,
        duration: 4000,
      });
    } catch (err) {
      console.error(err);
      glassToast({
        message: `Failed to update Government Remittances. Please try again.`,
        icon: <ExclamationTriangleIcon className="w-5 h-5 text-[#CC5500]" />,
        duration: 4000,
      });
    }
  };

  const confirmCancel = () => {
    setConfirmCancelOpen(false);
    setOpen(false);
    form.reset({ governmentIdNumbers: {} });
  };

  return (
    <div>
      <CustomDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            const formValues = form.getValues().governmentIdNumbers || {};

            const normalize = (value) => {
              if (value === undefined || value === null) return "";
              if (typeof value === "string") return value.trim().toLowerCase();
              return String(value).toLowerCase();
            };
            let hasChanges = false;
            Object.entries(formValues).forEach(([key, value]) => {
              const currentValue =
                governmentIds?.find(
                  (item) =>
                    item?.HrisUserGovernmentIdType?.government_id_name === key
                )?.government_id_number || "";
              if (normalize(value) !== normalize(currentValue)) {
                hasChanges = true;
              }
            });

            if (hasChanges) {
              setConfirmCancelOpen(true);
            } else {
              setOpen(false);
              form.reset({ governmentIdNumbers: {} });
            }
          } else {
            setOpen(true);
          }
        }}
        trigger={trigger}
        title="Update Government Remittances"
        width="xl"
        height="full"
        confirmLabel="Save Changes"
        onConfirm={() => setConfirmSubmitOpen(true)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            name="governmentIdNumbers.TIN"
            label="TIN"
            control={form.control}
          />
          <TextField
            name="governmentIdNumbers.PHIC"
            label="PHIC"
            control={form.control}
          />
          <TextField
            name="governmentIdNumbers.SSS"
            label="SSS"
            control={form.control}
          />
          <TextField
            name="governmentIdNumbers.HDMF"
            label="HDMF"
            control={form.control}
          />
          <TextField
            name="governmentIdNumbers.UnionBank"
            label="UnionBank"
            control={form.control}
          />
          <TextField
            name="governmentIdNumbers.PhilCare"
            label="PhilCare"
            control={form.control}
          />
        </div>
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

export default EditGovernmentRemittancesDialog;
