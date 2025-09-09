import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import RegionDropdown from "./address/RegionDropdown";
import ProvinceDropdown from "./address/ProvinceDropdown";
import CityDropdown from "./address/CityDropdown";
import BarangayDropdown from "./address/BarangayDropdown";
import { useAddressReset } from "@/hooks/useAddressReset";

const addressFields = [
  { key: "country", label: "Country" },
  { key: "region", label: "Region" },
  { key: "province", label: "Province" },
  { key: "city", label: "City/Municipality" },
  { key: "barangay", label: "Barangay" },
  { key: "postalCode", label: "Postal Code" },
  { key: "street", label: "Street" },
  { key: "buildingNum", label: "Building/House No." },
];

const AddressFields = ({
  trigger,
  control,
  watch,
  setValue,
  prefix = "permanent",
  sectionLabel = "Address",
  enableCopyFrom,
  copyFromPrefix = "permanent",
  isCopyEnabled = false,
  onCopyToggle,
}) => {
  useAddressReset({ watch, setValue, prefix, disableReset: isCopyEnabled });

  useEffect(() => {
    if (!enableCopyFrom || !isCopyEnabled) return;

    addressFields.forEach(({ key }) => {
      const sourceKey =
        key + copyFromPrefix.charAt(0).toUpperCase() + copyFromPrefix.slice(1);
      const targetKey = key + prefix.charAt(0).toUpperCase() + prefix.slice(1);
      const sourceValue = watch(sourceKey);

      // Set the target value (object or string)
      setValue(targetKey, sourceValue ?? "", { shouldValidate: true });
    });

    // Special case: force reset dependent dropdowns in correct order
    const presentPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    const dependentKeys = ["region", "province", "city", "barangay"];
    const allTargetFields = dependentKeys.map((key) => key + presentPrefix);

    trigger(allTargetFields);
  }, [isCopyEnabled]);

  const getFieldValue = (key) =>
    watch(key + prefix.charAt(0).toUpperCase() + prefix.slice(1));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-primary-color mb-2">
          {sectionLabel}
        </h3>
        {enableCopyFrom && (
          <div className="flex items-center gap-2">
            <Checkbox
              id={`copy-${prefix}`}
              checked={isCopyEnabled}
              onCheckedChange={onCopyToggle}
              className="data-[state=checked]:bg-[#008080] data-[state=checked]:border-[#008080]"
            />
            <label
              htmlFor={`copy-${prefix}`}
              className="!text-xs text-muted-foreground italic font-light"
            >
              Same as {copyFromPrefix} address
            </label>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {addressFields.map(({ key, label }) => {
          const name = key + prefix.charAt(0).toUpperCase() + prefix.slice(1);
          const isDisabled = isCopyEnabled && enableCopyFrom;

          return (
            <FormField
              key={name}
              name={name}
              control={control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="!text-xs gap-0 !text-black">
                    {label}
                    {[
                      "city",
                      "postalcode",
                      "province",
                      "region",
                      "country",
                      "barangay",
                    ].includes(key.toLowerCase()) && (
                      <span className="text-primary-color ml-0.5">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    {key === "region" ? (
                      <RegionDropdown
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isDisabled}
                        error={fieldState.error}
                      />
                    ) : key === "province" ? (
                      <ProvinceDropdown
                        regionCode={getFieldValue("region")?.code}
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          setValue(
                            "city" +
                              prefix.charAt(0).toUpperCase() +
                              prefix.slice(1),
                            ""
                          );
                          setValue(
                            "barangay" +
                              prefix.charAt(0).toUpperCase() +
                              prefix.slice(1),
                            ""
                          );
                        }}
                        disabled={isDisabled}
                        error={fieldState.error}
                      />
                    ) : key === "city" ? (
                      <CityDropdown
                        provinceCode={getFieldValue("province")?.code}
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          setValue(
                            "barangay" +
                              prefix.charAt(0).toUpperCase() +
                              prefix.slice(1),
                            ""
                          );
                        }}
                        disabled={isDisabled}
                        error={fieldState.error}
                      />
                    ) : key === "barangay" ? (
                      <BarangayDropdown
                        cityCode={getFieldValue("city")?.code}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isDisabled}
                        error={fieldState.error}
                      />
                    ) : (
                      <Input
                        {...field}
                        disabled={isDisabled}
                        className={
                          fieldState.error
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }
                      />
                    )}
                  </FormControl>
                  {fieldState.error && (
                    <p className="text-red-500 text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AddressFields;
