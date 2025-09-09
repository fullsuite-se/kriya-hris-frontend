import CustomDialog from "@/components/dialog/CustomDialog";
import { EmployeeDetailsContext } from "@/context/EmployeeDetailsContext";
import { useState, useContext, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeEmergencyContactsFormSchema } from "@/components/forms/schemas/employeeSchema";
import EmergencyContactsSection from "@/components/forms/fields/dynamic-fields/EmergencyContactsSectionFields";
import { useEditEmployeeEmergencyContactsAPI } from "@/hooks/useEmployeeAPI";
import { glassToast } from "@/components/ui/glass-toast";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

const normalize = (value) => (value ?? "").toString().trim().toLowerCase();

const hasContactsChanged = (currentList, initialList) => {
  const curr = currentList || [];
  const init = initialList || [];

  if (curr.length !== init.length) return true;

  for (let i = 0; i < curr.length; i++) {
    const a = curr[i] || {};
    const b = init[i] || {};
    if (
      normalize(a.name) !== normalize(b.name) ||
      normalize(a.contactNumber) !== normalize(b.contactNumber) ||
      normalize(a.relationship) !== normalize(b.relationship)
    ) {
      return true;
    }
  }
  return false;
};

const EditEmergencyContactsDialog = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  const { emergencyContacts, user } = useContext(EmployeeDetailsContext);

  const { editEmployeeEmergencyContacts, loading } =
    useEditEmployeeEmergencyContactsAPI();

  const form = useForm({
    resolver: zodResolver(employeeEmergencyContactsFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      emergencyContacts: [{ name: "", contactNumber: "", relationship: "" }],
    },
  });

  const [initialValues, setInitialValues] = useState([]);

  useEffect(() => {
    if (emergencyContacts?.length) {
      const mappedContacts = emergencyContacts.map((c) => ({
        name: c.full_name || "",
        contactNumber: c.contact_number || "",
        relationship: c.relationship || "",
      }));
      setInitialValues(mappedContacts);
      form.setValue("emergencyContacts", mappedContacts);
    }
  }, [emergencyContacts, form]);

  const onSaveChanges = async (data) => {
    const user_id = user?.user_id;
    if (!user_id) return alert("User ID not found.");

    try {
      const hasEmptyNameOrNumber = data.emergencyContacts.some(
        (c) =>
          (!normalize(c.name) || !normalize(c.contactNumber)) &&
          normalize(c.relationship)
      );

      const changedContacts = data.emergencyContacts.filter(
        (newContact, idx) => {
          const oldContact = initialValues[idx] || {};
          return (
            normalize(newContact.name) !== normalize(oldContact.name) ||
            normalize(newContact.contactNumber) !==
              normalize(oldContact.contactNumber) ||
            normalize(newContact.relationship) !==
              normalize(oldContact.relationship)
          );
        }
      );

      if (hasEmptyNameOrNumber) {
        glassToast({
          message: `No changes in Emergency Contacts.`,
          icon: <InformationCircleIcon className="w-5 h-5 text-gray-500" />,
          duration: 3000,
        });
        setOpen(false);
        setConfirmSubmitOpen(false);
        return;
      }

      console.log("Changed contacts:", changedContacts);

      const cleanPayload = {
        emergencyContacts: data.emergencyContacts,
      };

      const response = await editEmployeeEmergencyContacts(
        user_id,
        cleanPayload
      );
      setInitialValues([]);
      console.log("responseeee: ", response);
      setOpen(false);
      setConfirmSubmitOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>Emergency Contacts</span> updated
            successfully!
          </>
        ),
        icon: <CheckCircleIcon className="w-5 h-5 text-[#008080]" />,
        duration: 4000,
      });
    } catch (err) {
      console.error(err);
      glassToast({
        message: `Failed to update Emergency Contacts. Please try again.`,
        icon: <ExclamationTriangleIcon className="w-5 h-5 text-[#CC5500]" />,
        duration: 4000,
      });
    }
  };

  const confirmCancel = () => {
    setConfirmCancelOpen(false);
    setOpen(false);
    form.reset();
  };

  return (
    <div>
      <CustomDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            const values = form.getValues();
            const changed = hasContactsChanged(
              values.emergencyContacts,
              initialValues
            );

            if (changed) {
              setConfirmCancelOpen(true);
            } else {
              setOpen(false);
              form.reset();
            }
          } else {
            setOpen(true);
          }
        }}
        trigger={trigger}
        title="Update Contact Info"
        width="xl"
        height="full"
        confirmLabel="Save Changes"
        onConfirm={() => setConfirmSubmitOpen(true)}
      >
        <FormProvider {...form}>
          <EmergencyContactsSection initialValues={initialValues} />
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

export default EditEmergencyContactsDialog;
