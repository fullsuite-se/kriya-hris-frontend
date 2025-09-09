import CustomDialog from "@/components/dialog/CustomDialog";
import { Input } from "@/components/ui/input";
import { useFetchFeaturesAndServicesAPI } from "@/hooks/useAdminAPI";
import { useState, useEffect, useMemo } from "react";
import PermissionCheckbox from "../components/PermissionCheckbox";
import ServiceChips from "../components/ServicesChips";

const serviceColors = {
  hris: "bg-blue-200 text-blue-900",
  payroll: "bg-orange-200 text-orange-900",
  ats: "bg-purple-200 text-purple-900",
  default: "bg-gray-200 text-gray-900",
};
const ViewUserAccessDialog = ({ trigger, userAccessDetails }) => {
  const [open, setOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [expandedByService, setExpandedByService] = useState({});

  // Get all services + features in one request
  const { servicesAndFeatures, loading, error } =
    useFetchFeaturesAndServicesAPI();

  // User’s granted feature IDs
  const userFeatureIds = useMemo(() => {
    return (
      userAccessDetails?.Services?.flatMap((s) =>
        s.ServiceFeatures?.map((f) => f.service_feature_id)
      ) || []
    );
  }, [userAccessDetails]);

  // State for checkboxes
  const [selected, setSelected] = useState([]);

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setSelected(userFeatureIds);
    }
  }, [open, userFeatureIds]);

  const toggleFeature = (featureId) => {
    setSelected(
      (prev) =>
        prev.includes(featureId)
          ? prev.filter((id) => id !== featureId) // uncheck
          : [...prev, featureId] // check
    );
  };

  const onSaveChanges = async () => {
    // const payload = {
    //   user_id: userAccessDetails?.user_id,
    //   features: selected,
    // };

    // try {
    //   const res = await fetch(
    //     `/api/admin/user-access/${userAccessDetails?.user_id}`,
    //     {
    //       method: "PUT",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(payload),
    //     }
    //   );

    //   if (!res.ok) throw new Error("Failed to save changes");

    //   console.log("Changes saved successfully");
    //   setConfirmSubmitOpen(false);
    //   setOpen(false);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const confirmCancel = () => {
    setConfirmCancelOpen(false);
    setOpen(false);
  };

  return (
    <div>
      <CustomDialog
        open={open}
        onOpenChange={setOpen}
        trigger={trigger}
        title={
          <>
            <span className="text-[#008080]">
              {`${userAccessDetails?.HrisUserInfo?.first_name} ${userAccessDetails?.HrisUserInfo?.last_name}`}
            </span>
            's Access Permissions
          </>
        }
        width="xl"
        height="full"
        confirmLabel="Save Changes"
        onConfirm={() => setConfirmSubmitOpen(true)}
      >
        <div className="space-y-6 ">
          {loading && <p>Loading services and features...</p>}
          {error && (
            <p className="text-red-500">
              Failed to load services and features.
            </p>
          )}

          {servicesAndFeatures?.map((service) => {
            // Group features
            const grouped = service.ServiceFeatures.reduce((acc, feature) => {
              const category = feature?.category || "Uncategorized";
              if (!acc[category]) acc[category] = [];
              acc[category].push(feature);
              return acc;
            }, {});

            // Handle toggle
            const handleToggleExpand = (serviceId, featureId) => {
              setExpandedByService((prev) => ({
                ...prev,
                [serviceId]: prev[serviceId] === featureId ? null : featureId,
              }));
            };

            return (
              <div key={service.service_id} className="p-5 border-b last:border-b-0">
                <div
                  className={`inline-block px-8 py-1 mb-3 rounded-2xl text-md font-medium ${
                    serviceColors[service.service_name.toLowerCase()] ||
                    serviceColors.default
                  }`}
                >
                  {service.service_name}
                </div>

                {Object.entries(grouped || {}).map(([category, features]) => (
                  <div key={category} className="mb-6">
                    <p className="font-medium text-gray-600 text-sm mb-3">{category}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                      {features.map((feature) => (
                        <PermissionCheckbox
                          key={feature.service_feature_id}
                          feature={feature}
                          checked={selected.includes(
                            feature.service_feature_id
                          )}
                          onChange={() =>
                            toggleFeature(feature.service_feature_id)
                          }
                          serviceName={service.service_name}
                          expanded={
                            expandedByService[service.service_id] ===
                            feature.service_feature_id
                          }
                          onToggleExpand={() =>
                            handleToggleExpand(
                              service.service_id,
                              feature.service_feature_id
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
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
      />

      <CustomDialog
        open={confirmSubmitOpen}
        onOpenChange={setConfirmSubmitOpen}
        title="Save Changes?"
        description="Are you sure you want to save the changes you made?"
        confirmLabel="Yes, Save changes"
        cancelLabel="Go Back"
        onConfirm={onSaveChanges}
        isShownCloseButton={false}
      />
    </div>
  );
};

export default ViewUserAccessDialog;
