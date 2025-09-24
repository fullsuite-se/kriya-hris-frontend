import CustomDialog from "@/components/dialog/CustomDialog";
import {
  useAddAccessPermissionAPI,
  useAddServicePermissionAPI,
  useFetchFeaturesAndServicesAPI,
  useFetchServicesByUserIdAPI,
  useFetchFeaturesByUserIdAPI,
  useDeleteServicePermissionsAPI,
  useDeleteAccessPermissionsAPI,
} from "@/hooks/useAdminAPI";
import { useState, useEffect, useMemo } from "react";
import PermissionCheckbox from "../components/PermissionCheckbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EmployeeSelector from "../components/EmployeeSelector";
import { glassToast } from "@/components/ui/glass-toast";
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

const serviceColors = {
  suitelifer: "bg-[#CCE5E5] text-[#004D4D]",
  hris: "bg-[#99CCCC] text-[#003D3D]",
  payroll: "bg-[#66B2B2] text-[#002E2E]",
  ats: "bg-[#339999] text-white",
  default: "bg-[#E6F2F2] text-[#004D4D]",
};

const ViewUserAccessDialog = ({
  trigger,
  userAccessDetails,
  method = "edit",
  refetchUsers,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [expandedByService, setExpandedByService] = useState({});
  const [expandedFeatures, setExpandedFeatures] = useState({});

  const { addServicePermission, loading: serviceLoading } =
    useAddServicePermissionAPI();
  const { addAccessPermission, loading: featureLoading } =
    useAddAccessPermissionAPI();
  const { deleteServicePermissions, loading: deleteServiceLoading } =
    useDeleteServicePermissionsAPI();
  const { deleteAccessPermissions, loading: deleteAccessLoading } =
    useDeleteAccessPermissionsAPI();

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // Get all services + features
  const { servicesAndFeatures, loading, error } =
    useFetchFeaturesAndServicesAPI();

  // Get permissions for selected employee (add mode)
  const {
    services: employeeServices,
    loading: loadingEmployeeServices,
    error: errorEmployeeServices,
  } = useFetchServicesByUserIdAPI(selectedEmployee);

  const {
    features: employeeFeatures,
    loading: loadingEmployeeFeatures,
    error: errorEmployeeFeatures,
  } = useFetchFeaturesByUserIdAPI(selectedEmployee);

  // User's granted service IDs (only for edit mode)
  const userServiceIds = useMemo(() => {
    return method === "edit"
      ? userAccessDetails?.HrisUserServicePermissions?.map(
          (s) => s.service_id
        ) || []
      : [];
  }, [userAccessDetails, method]);

  // User's granted feature IDs (only for edit mode)
  const userFeatureIds = useMemo(() => {
    return method === "edit"
      ? userAccessDetails?.HrisUserAccessPermissions?.map(
          (f) => f.service_feature_id
        ) || []
      : [];
  }, [userAccessDetails, method]);

  // State for selected services/features
  const [servicesSelected, setServicesSelected] = useState([]);
  const [featuresSelected, setFeaturesSelected] = useState([]);

  // When employee changes in add mode, update permissions
  // When employee changes in add mode, update permissions
  useEffect(() => {
    console.log("empservices:", employeeServices);
    console.log("empfeatures:", employeeFeatures);
    if (method === "add") {
      if (selectedEmployee) {
        const employeeServiceIds = employeeServices.map(
          (service) => service.service_id
        );
        const employeeFeatureIds = employeeFeatures.map(
          (feature) => feature.service_feature_id
        );

        setServicesSelected(employeeServiceIds);
        setFeaturesSelected(employeeFeatureIds);

        // Auto-expand services that the employee has access to
        const expandedState = {};
        employeeServiceIds.forEach((serviceId) => {
          expandedState[serviceId] = true;
        });
        setExpandedByService(expandedState);
      } else {
        // Reset selections when no employee is selected
        setServicesSelected([]);
        setFeaturesSelected([]);
        setExpandedByService({});
      }
    }
  }, [selectedEmployee, employeeServices, employeeFeatures, method]);

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      if (method === "edit") {
        setServicesSelected(userServiceIds);
        setFeaturesSelected(userFeatureIds);
      } else {
        // For add mode, start with empty selections
        setServicesSelected([]);
        setFeaturesSelected([]);
        setSelectedEmployee(null);
      }
      setExpandedByService({});
      setExpandedFeatures({});
    }
  }, [open, userServiceIds, userFeatureIds, method]);
  const toggleService = (serviceId) => {
    // Disable toggling if in add mode and no employee is selected
    if (method === "add" && !selectedEmployee) return;

    if (servicesSelected.includes(serviceId)) {
      setServicesSelected((prev) => prev.filter((id) => id !== serviceId));
      setExpandedByService((prev) => ({
        ...prev,
        [serviceId]: false,
      }));
    } else {
      setServicesSelected((prev) => [...prev, serviceId]);
      setExpandedByService((prev) => ({
        ...prev,
        [serviceId]: true,
      }));
    }
  };

  // Toggle a feature on/off
  const toggleFeature = (featureId, serviceId, isRadio = false) => {
    // Disable toggling if in add mode and no employee is selected
    if (method === "add" && !selectedEmployee) return;

    setFeaturesSelected((prev) => {
      if (isRadio) {
        return [featureId];
      }
      return prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId];
    });
  };

  // Select all features
  const selectAllFeatures = (serviceId, serviceFeatures) => {
    // Disable if in add mode and no employee is selected
    if (method === "add" && !selectedEmployee) return;

    const allFeatureIds = serviceFeatures.map((f) => f.service_feature_id);
    setFeaturesSelected((prev) => {
      const newFeatures = allFeatureIds.filter((id) => !prev.includes(id));
      return [...prev, ...newFeatures];
    });
  };

  // Deselect all features
  const deselectAllFeatures = (serviceId, serviceFeatures) => {
    // Disable if in add mode and no employee is selected
    if (method === "add" && !selectedEmployee) return;

    const featureIdsToRemove = serviceFeatures.map((f) => f.service_feature_id);
    setFeaturesSelected((prev) =>
      prev.filter((id) => !featureIdsToRemove.includes(id))
    );
  };

  // Check if all features for a service are selected
  const areAllFeaturesSelected = (serviceFeatures) => {
    if (!serviceFeatures.length) return false;
    return serviceFeatures.every((feature) =>
      featuresSelected.includes(feature.service_feature_id)
    );
  };

  // Toggle description
  const toggleFeatureDescription = (serviceId, featureId) => {
    setExpandedFeatures((prev) => {
      const key = `${serviceId}-${featureId}`;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  // Get access status text
  const getAccessStatusText = (isServiceSelected, hasSelectedFeatures) => {
    if (!isServiceSelected) {
      return method === "add" ? "Turn on to give access." : "No Access.";
    }

    if (!hasSelectedFeatures) {
      return "Choose permissions";
    }

    return "Has Access";
  };

  const onSaveChanges = async () => {
    if (method === "add" && !selectedEmployee) {
      glassToast({
        message: `Please select an employee first.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      setConfirmSubmitOpen(false);
      return;
    }

    const validServices = [];
    const validFeatures = [];

    servicesAndFeatures.forEach((service) => {
      const isServiceOn = servicesSelected.includes(service.service_id);
      if (!isServiceOn) return;

      const selectedFeatures = service.ServiceFeatures.filter((feature) =>
        featuresSelected.includes(feature.service_feature_id)
      );

      if (selectedFeatures.length > 0) {
        validServices.push(service.service_id);
        validFeatures.push(
          ...selectedFeatures.map((f) => f.service_feature_id)
        );
      }
    });

    const payload = {
      user_id: method === "add" ? selectedEmployee : userAccessDetails?.user_id,
      service_ids: validServices,
      feature_ids: validFeatures,
    };

    // choose basis for comparison depending on method
    let currentServiceIds = [];
    let currentFeatureIds = [];

    if (method === "add") {
      currentServiceIds = (employeeServices || []).map((s) => s.service_id);
      currentFeatureIds = (employeeFeatures || []).map(
        (f) => f.service_feature_id
      );
    } else if (method === "edit") {
      currentServiceIds = userServiceIds;
      currentFeatureIds = userFeatureIds;
    }

    const setsEqual = (arrA = [], arrB = []) => {
      const a = new Set(arrA);
      const b = new Set(arrB);
      if (a.size !== b.size) return false;
      for (const v of a) if (!b.has(v)) return false;
      return true;
    };

    // exit if nothing changed
    if (
      setsEqual(currentServiceIds, payload.service_ids) &&
      setsEqual(currentFeatureIds, payload.feature_ids)
    ) {
      glassToast({
        message: "No changes made.",
        icon: (
          <InformationCircleIcon className="text-[#636363] w-5 h-5 mt-0.5" />
        ),
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 3000,
      });
      setConfirmSubmitOpen(false);
      setOpen(false);
      return;
    }

    try {
      // apply changes (delete then add)
      await deleteServicePermissions(payload.user_id);
      await deleteAccessPermissions(payload.user_id);

      if (payload.service_ids.length > 0) {
        await addServicePermission(payload.user_id, payload.service_ids);
      }
      if (payload.feature_ids.length > 0) {
        await addAccessPermission(payload.user_id, payload.feature_ids);
      }

      // detect if only added or if removals happened
      const removedServices = currentServiceIds.filter(
        (id) => !payload.service_ids.includes(id)
      );
      const removedFeatures = currentFeatureIds.filter(
        (id) => !payload.feature_ids.includes(id)
      );

      const message =
        method === "add" ? (
          removedServices.length > 0 || removedFeatures.length > 0 ? (
            <>
              Changes saved for{" "}
              <span className="text-[#008080]">{selectedEmployee}</span>
            </>
          ) : (
            <>
              Access granted to{" "}
              <span className="text-[#008080]">{selectedEmployee}</span>
            </>
          )
        ) : (
          <>
            Changes saved for{" "}
            <span className="text-[#008080]">{userAccessDetails?.user_id}</span>
          </>
        );
      refetchUsers();
      glassToast({
        message,
        icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });

      setOpen(false);
    } catch (err) {
      console.error("Failed to save changes:", err);
      glassToast({
        message:
          method === "add"
            ? "Failed to grant access."
            : "Failed to save changes.",
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    } finally {
      setConfirmSubmitOpen(false);
    }
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
          method === "add" ? (
            <div>Grant Access</div>
          ) : (
            <>
              <span className="text-[#008080]">
                {`${userAccessDetails?.HrisUserInfo?.first_name} ${userAccessDetails?.HrisUserInfo?.last_name}`}
              </span>
              's Access
            </>
          )
        }
        width="xl"
        height="full"
        confirmLabel={method === "add" ? "Grant Access" : "Save Changes"}
        onConfirm={() => setConfirmSubmitOpen(true)}
      >
        <div className="space-y-6">
          {loading && <p>Loading services and features...</p>}
          {error && (
            <p className="text-red-500">
              Failed to load services and features.
            </p>
          )}

          {method === "add" && (
            <div className="px-5">
              <div className="py-2 text-xs">
                {selectedEmployee ? "Selected Employee" : "Choose Employee"}
              </div>
              <EmployeeSelector
                value={selectedEmployee}
                onChange={setSelectedEmployee}
                singleSelect={true}
              />
            </div>
          )}

          {servicesAndFeatures?.map((service) => {
            const isServiceSelected = servicesSelected.includes(
              service.service_id
            );
            const serviceFeatures = service.ServiceFeatures || [];

            const hasSelectedFeatures = serviceFeatures.some((feature) =>
              featuresSelected.includes(feature.service_feature_id)
            );

            const allFeaturesSelected = areAllFeaturesSelected(serviceFeatures);
            const accessStatusText = getAccessStatusText(
              isServiceSelected,
              hasSelectedFeatures
            );

            // Render grouped features
            const grouped = serviceFeatures.reduce((acc, feature) => {
              const category = feature?.category || "Uncategorized";
              if (!acc[category]) acc[category] = [];
              acc[category].push(feature);
              return acc;
            }, {});

            const isExpanded = expandedByService[service.service_id] ?? false;

            const handleToggleExpand = (serviceId) => {
              if (!isServiceSelected) return;
              setExpandedByService((prev) => ({
                ...prev,
                [serviceId]: !prev[serviceId],
              }));
            };

            return (
              <div
                key={service.service_id}
                className="p-5 border-b last:border-b-0"
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={isServiceSelected}
                        onCheckedChange={() =>
                          toggleService(service.service_id)
                        }
                        id={`service-${service.service_id}`}
                        disabled={method === "add" && !selectedEmployee}
                      />
                      <label
                        htmlFor={`service-${service.service_id}`}
                        className={`hidden sm:block text-xs italic ${
                          isServiceSelected && hasSelectedFeatures
                            ? "text-green-700"
                            : "text-muted-foreground"
                        }`}
                      >
                        {accessStatusText}
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 items-center">
                    <div
                      className={`inline-block px-4 text-sm  sm:px-8 py-1 rounded-2xl sm:text-md font-medium ${
                        !isServiceSelected
                          ? "bg-gray-300 text-white"
                          : serviceColors[service.service_name.toLowerCase()] ||
                            serviceColors.default
                      }`}
                    >
                      {service.service_name}
                    </div>
                    <Button
                      variant={"ghost"}
                      type="button"
                      onClick={() => handleToggleExpand(service.service_id)}
                      disabled={
                        !isServiceSelected ||
                        (method === "add" && !selectedEmployee)
                      }
                      className={`focus:outline-none transition-transform ${
                        !isServiceSelected ||
                        (method === "add" && !selectedEmployee)
                          ? "opacity-5 !cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <ChevronDown
                        className={`w-5 h-5 transform transition-transform duration-300 ${
                          isExpanded ? "-rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                {/* Animated collapse */}
                <AnimatePresence>
                  {isExpanded && isServiceSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-right">
                        {isServiceSelected &&
                          serviceFeatures.length > 0 &&
                          (service.service_name === "Suitelifer" ? (
                            featuresSelected.some((id) =>
                              serviceFeatures.some(
                                (f) => f.service_feature_id === id
                              )
                            ) && (
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  deselectAllFeatures(
                                    service.service_id,
                                    serviceFeatures
                                  )
                                }
                                className="font-light"
                                disabled={method === "add" && !selectedEmployee}
                              >
                                Deselect
                              </Button>
                            )
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                allFeaturesSelected
                                  ? deselectAllFeatures(
                                      service.service_id,
                                      serviceFeatures
                                    )
                                  : selectAllFeatures(
                                      service.service_id,
                                      serviceFeatures
                                    )
                              }
                              className="font-light"
                              disabled={method === "add" && !selectedEmployee}
                            >
                              {allFeaturesSelected
                                ? "Deselect All"
                                : "Select All"}
                            </Button>
                          ))}
                      </div>

                      {Object.entries(grouped || {}).map(
                        ([category, features]) => {
                          const isSuitelifer =
                            service.service_name === "Suitelifer";

                          return (
                            <div key={category} className="mb-6">
                              <p className="font-medium text-gray-600 text-sm mb-3">
                                {category}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                                {features.map((feature) => {
                                  const featureKey = `${service.service_id}-${feature.service_feature_id}`;
                                  const isFeatureExpanded =
                                    expandedFeatures[featureKey] || false;

                                  return (
                                    <PermissionCheckbox
                                      key={feature.service_feature_id}
                                      feature={feature}
                                      checked={featuresSelected.includes(
                                        feature.service_feature_id
                                      )}
                                      onChange={() => {
                                        if (isSuitelifer) {
                                          deselectAllFeatures(
                                            service.service_id,
                                            features
                                          );
                                        }
                                        toggleFeature(
                                          feature.service_feature_id,
                                          service.service_id
                                        );
                                      }}
                                      expanded={isFeatureExpanded}
                                      serviceName={service.service_name}
                                      onToggleExpand={() =>
                                        toggleFeatureDescription(
                                          service.service_id,
                                          feature.service_feature_id
                                        )
                                      }
                                      selectionType={
                                        isSuitelifer ? "single" : "multiple"
                                      }
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </CustomDialog>

      {/* Cancel confirmation */}
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

      {/* Submit confirmation */}
      <CustomDialog
        open={confirmSubmitOpen}
        onOpenChange={setConfirmSubmitOpen}
        title={method === "add" ? "Grant Access" : "Save Changes"}
        description={
          method === "add"
            ? "Do you want to grant this employee access?"
            : "Do you want to save your changes?"
        }
        confirmLabel={
          method === "add" ? "Yes, Grant Access" : "Yes, Save Changes"
        }
        cancelLabel="Cancel"
        loading={
          serviceLoading ||
          featureLoading ||
          deleteAccessLoading ||
          deleteServiceLoading
        }
        onConfirm={onSaveChanges}
        isShownCloseButton={false}
      />
    </div>
  );
};

export default ViewUserAccessDialog;
