import CustomDialog from "@/components/dialog/CustomDialog";
import getOfficesColumns from "@/components/table/columns/OfficesColumns";
import DataTable from "@/components/table/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { glassToast } from "@/components/ui/glass-toast";
import { Input } from "@/components/ui/input";
import {
  useAddOfficeAPI,
  useDeleteOfficeAPI,
  useEditOfficeAPI,
  useFetchOfficesAPI,
} from "@/hooks/useCompanyAPI";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { use, useEffect, useState } from "react";

export const OfficesTab = () => {
  const {
    allOffices,
    refetch: refetchAllOffices,
    setAllOffices,
  } = useFetchOfficesAPI();
  const [officesDialogOpen, setOfficesDialogOpen] = useState(false);
  const { addOffice, loading: officesLoading } = useAddOfficeAPI();
  const { deleteOffice, loading: deleteOfficeLoading } = useDeleteOfficeAPI();
  const { editOffice, loading: editOfficeLoading } = useEditOfficeAPI();

  const removeLocalOffice = (office_id) => {
    const officeToRemove = allOffices.find((j) => j.office_id === office_id);
    setAllOffices((prev) => prev.filter((j) => j.office_id !== office_id));
    return officeToRemove; // store this for undo
  };

  const restoreLocalOffice = (office) => {
    setAllOffices((prev) =>
      [...prev, office].sort((a, b) =>
        a.office_name.localeCompare(b.office_name)
      )
    );
  };

  const updateLocalOffice = (office_id, office_name, office_address) => {
    setAllOffices((prevOffices) =>
      prevOffices.map((office) =>
        office.office_id === office_id
          ? { ...office, office_name, office_address }
          : office
      )
    );
  };

  const handleSaveOffice = async (formData) => {
    const { office_name, office_address } = Object.fromEntries(
      formData.entries()
    );
    try {
      await addOffice({ office_name, office_address });
      setOfficesDialogOpen(false);
      glassToast({
        message: (
          <>
            <span style={{ color: "#008080" }}>{office_name}</span> added
            successfully!
          </>
        ),
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      refetchAllOffices();
    } catch (error) {
      glassToast({
        message: `Failed to add office. Please try again.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  const handleEditOffice = async (
    formData,
    office_id,
    office_name,
    office_address
  ) => {
    const updatedOfficeName = formData.get("office_name")?.trim();
    const previousOfficeName = office_name?.trim();
    const updatedOfficeAddress = formData.get("office_address")?.trim();
    const previousOfficeAddress = office_address?.trim();

    const isNameChanged =
      updatedOfficeName &&
      updatedOfficeName.toLowerCase() !== previousOfficeName?.toLowerCase();
    const isAddressChanged =
      updatedOfficeAddress &&
      updatedOfficeAddress.toLowerCase() !==
        previousOfficeAddress?.toLowerCase();

    if (!isNameChanged && !isAddressChanged) {
      glassToast({
        message: (
          <>
            No changes made to{" "}
            <span style={{ color: "#008080" }}>{previousOfficeName}</span>.
          </>
        ),
        icon: (
          <InformationCircleIcon className="text-[#636363] w-5 h-5 mt-0.5" />
        ),
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 3000,
      });
      return;
    }

    updateLocalOffice(office_id, updatedOfficeName, updatedOfficeAddress);

    let undoCalled = false;
    let saveTimeout;

    let toastMessage;

    if (isNameChanged && isAddressChanged) {
      toastMessage = (
        <>
          Office <span style={{ color: "#008080" }}>{previousOfficeName}</span>{" "}
          and its address updated to{" "}
          <span style={{ color: "#008080" }}>{updatedOfficeName}</span>
        </>
      );
    } else if (isNameChanged) {
      toastMessage = (
        <>
          Office <span style={{ color: "#008080" }}>{previousOfficeName}</span>{" "}
          updated to{" "}
          <span style={{ color: "#008080" }}>{updatedOfficeName}</span>
        </>
      );
    } else if (isAddressChanged) {
      toastMessage = (
        <>
          Address of{" "}
          <span style={{ color: "#008080" }}>{previousOfficeName}</span> updated
        </>
      );
    } else {
      toastMessage = "Please try again.";
    }

    if (toastMessage) {
      glassToast({
        message: toastMessage,
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5 mt-0.5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 5000,
        progressDuration: 5000,
        onUndo: () => {
          undoCalled = true;
          updateLocalOffice(
            office_id,
            previousOfficeName,
            previousOfficeAddress
          );
        },
      });
    }

    saveTimeout = setTimeout(async () => {
      if (undoCalled) return;

      try {
        await editOffice(office_id, updatedOfficeName, updatedOfficeAddress);
        refetchAllOffices();
      } catch (err) {
        console.error("Failed to update office:", err);
        glassToast({
          message: `Failed to update office.`,
          icon: (
            <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5 mt-0.5" />
          ),
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        updateLocalOffice(office_id, previousOfficeName, previousOfficeAddress);
      }
    }, 5000);
  };

  const handleDeleteOffice = async (office_id, office_name) => {
    const deletedOffice = removeLocalOffice(office_id);

    let undoCalled = false;

    glassToast({
      message: (
        <>
          <span style={{ color: "#008080" }}>{office_name}</span> deleted
          successfully!
        </>
      ),
      icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
      textColor: "black",
      bgColor: "rgba(255, 255, 255, 0.2)",
      blur: 12,
      duration: 5000,
      progressDuration: 5000,
      onUndo: () => {
        undoCalled = true;
        restoreLocalOffice(deletedOffice);
      },
    });

    setTimeout(async () => {
      if (undoCalled) return;

      try {
        await deleteOffice(office_id);
        refetchAllOffices();
      } catch (err) {
        console.error("Failed to delete office:", err);
        glassToast({
          message: `Failed to delete office "${office_name}".`,
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "black",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });

        restoreLocalOffice(deletedOffice);
      }
    }, 5000);
  };

  const officesColumns = getOfficesColumns({
    onEdit: handleEditOffice,
    onDelete: handleDeleteOffice,
  });

  return (
    <div className=" p-5">
      <div className="justify-between items-center flex mb-8">
        <div>
          <h2 className="text-lg font-semibold">Offices</h2>
        </div>
        <CustomDialog
          trigger={
            <Button className="cursor-pointer !text-sm !text-white hover:!bg-[#008080ed] border-none">
              +<span className=" hidden sm:inline text-xs">&nbsp;Add New</span>
            </Button>
          }
          title="Add New Office"
          confirmLabel="Save Office"
          description="Enter the details for the new office"
          onConfirm={handleSaveOffice}
          open={officesDialogOpen}
          onOpenChange={setOfficesDialogOpen}
        >
          {" "}
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label
                className="text-xs font-medium block"
                htmlFor="office_name"
              >
                Office<span className="text-primary-color">*</span>
              </label>
              <Input name="office_name" type="text" required />
            </div>
            <div className="space-y-2">
              <label
                className="text-xs font-medium block"
                htmlFor="office_name"
              >
                Address
                <span className="text-primary-color">*</span>
              </label>
              <Input name="office_address" type="text" required />
            </div>{" "}
          </div>
        </CustomDialog>
      </div>
      <DataTable
        columns={officesColumns}
        data={allOffices}
        searchKeys={["office_name", "office_address"]}
        cursorType="cursor-default"
      />
    </div>
  );
};

export default OfficesTab;
