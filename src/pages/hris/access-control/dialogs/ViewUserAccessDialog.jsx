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
import { useState, useEffect, useMemo, useCallback } from "react";
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
import { useActivateSuiteliferAPI } from "@/hooks/suitelifer/useActivateSuiteliferAPI";
import { useUpdateUserTypeSuiteliferAPI } from "@/hooks/suitelifer/useUpdateUserTypeSuiteliferAPI";

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
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { activateSuitelifer } = useActivateSuiteliferAPI();
  const { updateUserTypeSuitelifer } = useUpdateUserTypeSuiteliferAPI(); 

  const { addServicePermission, loading: serviceLoading } =
    useAddServicePermissionAPI();
  const { addAccessPermission, loading: featureLoading } =
    useAddAccessPermissionAPI();
  const { deleteServicePermissions, loading: deleteServiceLoading } =
    useDeleteServicePermissionsAPI();
  const { deleteAccessPermissions, loading: deleteAccessLoading } =
    useDeleteAccessPermissionsAPI();

  const { servicesAndFeatures, loading, error } =
    useFetchFeaturesAndServicesAPI();

  const shouldFetchEmployeePermissions =
    method === "add" && selectedEmployee && open;

  const {
    services: employeeServices,
    loading: loadingEmployeeServices,
    error: errorEmployeeServices,
  } = useFetchServicesByUserIdAPI(
    shouldFetchEmployeePermissions ? selectedEmployee : null
  );

  const {
    features: employeeFeatures,
    loading: loadingEmployeeFeatures,
    error: errorEmployeeFeatures,
  } = useFetchFeaturesByUserIdAPI(
    shouldFetchEmployeePermissions ? selectedEmployee : null
  );

  const userServiceIds = useMemo(() => {
    return method === "edit"
      ? userAccessDetails?.HrisUserServicePermissions?.map(
          (s) => s.service_id
        ) || []
      : [];
  }, [userAccessDetails, method]);

  const userFeatureIds = useMemo(() => {
    return method === "edit"
      ? userAccessDetails?.HrisUserAccessPermissions?.map(
          (f) => f.service_feature_id
        ) || []
      : [];
  }, [userAccessDetails, method]);

  const [servicesSelected, setServicesSelected] = useState([]);
  const [featuresSelected, setFeaturesSelected] = useState([]);

  const employeeServiceIds = useMemo(
    () => employeeServices?.map((service) => service.service_id) || [],
    [employeeServices]
  );

  const employeeFeatureIds = useMemo(
    () => employeeFeatures?.map((feature) => feature.service_feature_id) || [],
    [employeeFeatures]
  );

  useEffect(() => {
    if (method === "add" && selectedEmployee && open) {
      if (employeeServiceIds.length > 0 || employeeFeatureIds.length > 0) {
        setServicesSelected(employeeServiceIds);
        setFeaturesSelected(employeeFeatureIds);

        const expandedState = {};
        employeeServiceIds.forEach((serviceId) => {
          expandedState[serviceId] = true;
        });
        setExpandedByService(expandedState);
      }
    }
  }, [selectedEmployee, employeeServiceIds, employeeFeatureIds, method, open]);

  useEffect(() => {
    if (open) {
      if (method === "edit") {
        setServicesSelected(userServiceIds);
        setFeaturesSelected(userFeatureIds);
      } else {
        if (!selectedEmployee) {
          setServicesSelected([]);
          setFeaturesSelected([]);
        }
        setExpandedByService({});
        setExpandedFeature({});
      }
    }
  }, [open, userServiceIds, userFeatureIds, method, selectedEmployee]);

  const toggleService = useCallback(
    (serviceId) => {
      if (method === "add" && !selectedEmployee) return;

      setServicesSelected((prev) => {
        if (prev.includes(serviceId)) {
          return prev.filter((id) => id !== serviceId);
        } else {
          return [...prev, serviceId];
        }
      });

      setExpandedByService((prev) => ({
        ...prev,
        [serviceId]: !prev[serviceId],
      }));
    },
    [method, selectedEmployee]
  );

  const toggleFeature = useCallback(
    (featureId, serviceId, isRadio = false) => {
      if (method === "add" && !selectedEmployee) return;

      setFeaturesSelected((prev) => {
        if (isRadio) {
          return [featureId];
        }
        return prev.includes(featureId)
          ? prev.filter((id) => id !== featureId)
          : [...prev, featureId];
      });
    },
    [method, selectedEmployee]
  );

  const selectAllFeatures = useCallback(
    (serviceId, serviceFeatures) => {
      if (method === "add" && !selectedEmployee) return;

      const allFeatureIds = serviceFeatures.map((f) => f.service_feature_id);
      setFeaturesSelected((prev) => {
        const newFeatures = allFeatureIds.filter((id) => !prev.includes(id));
        return [...prev, ...newFeatures];
      });
    },
    [method, selectedEmployee]
  );

  const deselectAllFeatures = useCallback(
    (serviceId, serviceFeatures) => {
      if (method === "add" && !selectedEmployee) return;

      const featureIdsToRemove = serviceFeatures.map(
        (f) => f.service_feature_id
      );
      setFeaturesSelected((prev) =>
        prev.filter((id) => !featureIdsToRemove.includes(id))
      );
    },
    [method, selectedEmployee]
  );

  const areAllFeaturesSelected = useCallback(
    (serviceFeatures) => {
      if (!serviceFeatures.length) return false;
      return serviceFeatures.every((feature) =>
        featuresSelected.includes(feature.service_feature_id)
      );
    },
    [featuresSelected]
  );

  const toggleFeatureDescription = (serviceId, featureId) => {
    const key = `${serviceId}-${featureId}`;
    setExpandedFeature((prev) => (prev === key ? null : key));
  };

  const getAccessStatusText = useCallback(
    (isServiceSelected, hasSelectedFeatures) => {
      if (!isServiceSelected) {
        return method === "add" ? "Turn on to give access" : "No Access";
      }

      if (!hasSelectedFeatures) {
        return "Choose permissions";
      }

      return "Has Access";
    },
    [method]
  );

  const groupedServices = useMemo(() => {
    return (
      servicesAndFeatures?.map((service) => {
        const serviceFeatures = service.ServiceFeatures || [];
        const grouped = serviceFeatures.reduce((acc, feature) => {
          const category = feature?.category || "Uncategorized";
          if (!acc[category]) acc[category] = [];
          acc[category].push(feature);
          return acc;
        }, {});

        return {
          ...service,
          groupedFeatures: grouped,
          serviceFeatures,
        };
      }) || []
    );
  }, [servicesAndFeatures]);

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

    groupedServices.forEach((service) => {
      const isServiceOn = servicesSelected.includes(service.service_id);
      if (!isServiceOn) return;

      const selectedFeatures = service.serviceFeatures.filter((feature) =>
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

    let currentServiceIds = [];
    let currentFeatureIds = [];

    if (method === "add") {
      currentServiceIds = employeeServiceIds;
      currentFeatureIds = employeeFeatureIds;
    } else if (method === "edit") {
      currentServiceIds = userServiceIds;
      currentFeatureIds = userFeatureIds;
    }

    const setsEqual = (arrA = [], arrB = []) => {
      if (arrA.length !== arrB.length) return false;
      const a = new Set(arrA);
      for (const v of arrB) if (!a.has(v)) return false;
      return true;
    };

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
      await deleteServicePermissions(payload.user_id);
      await deleteAccessPermissions(payload.user_id);

      if (payload.service_ids.length > 0) {
        await addServicePermission(payload.user_id, payload.service_ids);
      }
      if (payload.feature_ids.length > 0) {
        await addAccessPermission(payload.user_id, payload.feature_ids);
      }

      const suitelifer = groupedServices.find(
        (s) => s.service_name?.toLowerCase() === "suitelifer"
      );

      if (suitelifer) {
        const hasSuiteliferFeatures = payload.feature_ids.some((fid) =>
          suitelifer.serviceFeatures.some((sf) => sf.service_feature_id === fid)
        );

        if (hasSuiteliferFeatures) {
          const role = suitelifer.serviceFeatures.find((sf) =>
            payload.feature_ids.includes(sf.service_feature_id)
          )?.feature_name;

          await updateUserTypeSuitelifer(role, payload.user_id);
          await activateSuitelifer(true, payload.user_id);
        } else {
          await activateSuitelifer(false, payload.user_id);
        }
      }

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

  const confirmCancel = useCallback(() => {
    setConfirmCancelOpen(false);
    setOpen(false);
  }, []);

  const ServiceItem = useCallback(
    ({ service }) => {
      const isServiceSelected = servicesSelected.includes(service.service_id);
      const hasSelectedFeatures = service.serviceFeatures.some((feature) =>
        featuresSelected.includes(feature.service_feature_id)
      );

      const allFeaturesSelected = areAllFeaturesSelected(
        service.serviceFeatures
      );
      const accessStatusText = getAccessStatusText(
        isServiceSelected,
        hasSelectedFeatures
      );
      const isExpanded = expandedByService[service.service_id] ?? false;

      const handleToggleExpand = () => {
        if (!isServiceSelected) return;
        setExpandedByService((prev) => ({
          ...prev,
          [service.service_id]: !prev[service.service_id],
        }));
      };

      return (
        <div className="p-5 border-b last:border-b-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isServiceSelected}
                  onCheckedChange={() => toggleService(service.service_id)}
                  id={`service-${service.service_id}`}
                  disabled={method === "add" && !selectedEmployee}
                />{" "}
                <Button
                  variant={"ghost"}
                  type="button"
                  onClick={handleToggleExpand}
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
                  />{" "}
                </Button>
                <label
                  htmlFor={`service-${service.service_id}`}
                  className={`cursor-pointer select-none inline-block px-4 text-sm sm:px-8 py-1 rounded-2xl sm:text-md font-medium ${
                    !isServiceSelected
                      ? "bg-gray-300 text-white"
                      : serviceColors[service.service_name.toLowerCase()] ||
                        serviceColors.default
                  }`}
                >
                  {service.service_name}
                </label>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <label
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

          <AnimatePresence>
            {isExpanded && isServiceSelected && (
              <div>
                <div className="text-left ">
                  {isServiceSelected &&
                    service.serviceFeatures.length > 0 &&
                    (service.service_name.toLowerCase() === "suitelifer" ? (
                      featuresSelected.some((id) =>
                        service.serviceFeatures.some(
                          (f) => f.service_feature_id === id
                        )
                      ) && (
                        <Button
                          type="button"
                          size="sm"
                          variant="link"
                          onClick={() =>
                            deselectAllFeatures(
                              service.service_id,
                              service.serviceFeatures
                            )
                          }
                          className="font-light text-red-700 !p-0"
                          disabled={method === "add" && !selectedEmployee}
                        >
                          Deselect
                        </Button>
                      )
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="link"
                        onClick={() =>
                          allFeaturesSelected
                            ? deselectAllFeatures(
                                service.service_id,
                                service.serviceFeatures
                              )
                            : selectAllFeatures(
                                service.service_id,
                                service.serviceFeatures
                              )
                        }
                        className={`font-light !p-0 ${
                          allFeaturesSelected
                            ? "text-red-700"
                            : "text-green-700"
                        }`}
                        disabled={method === "add" && !selectedEmployee}
                      >
                        {allFeaturesSelected ? "Deselect All" : "Select All"}
                      </Button>
                    ))}
                </div>

                {Object.entries(service.groupedFeatures || {}).map(
                  ([category, features]) => {
                    const isSuitelifer =
                      service.service_name.toLowerCase() === "suitelifer";

                    return (
                      <div key={category} className="mb-6">
                        <p className="font-medium text-gray-600 text-sm mb-3">
                          {category}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                          {features.map((feature) => {
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
                                expanded={
                                  expandedFeature ===
                                  `${service.service_id}-${feature.service_feature_id}`
                                } 
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
              </div>
            )}
          </AnimatePresence>
        </div>
      );
    },
    [
      servicesSelected,
      featuresSelected,
      expandedByService,
      expandedFeature,
      method,
      selectedEmployee,
      toggleService,
      toggleFeature,
      selectAllFeatures,
      deselectAllFeatures,
      areAllFeaturesSelected,
      getAccessStatusText,
      toggleFeatureDescription,
    ]
  );

  return (
    <div>
      <CustomDialog
        onCancel={() => {
          setSelectedEmployee(null);
        }}
        isShownCloseButton={false}
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

          {groupedServices.map((service) => (
            <ServiceItem key={service.service_id} service={service} />
          ))}
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
