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

  const liveOutsidePH = watch(
    `liveOutsidePH${prefix.charAt(0).toUpperCase() + prefix.slice(1)}`
  );

  const permanentLiveOutsidePH = watch(
    `liveOutsidePH${
      copyFromPrefix.charAt(0).toUpperCase() + copyFromPrefix.slice(1)
    }`
  );

  useEffect(() => {
    const countryField = `country${
      prefix.charAt(0).toUpperCase() + prefix.slice(1)
    }`;

    const currentValue = getFieldValue("country");
    if (!currentValue) {
      setValue(countryField, "Philippines", { shouldValidate: true });
    }
  }, []); 

  useEffect(() => {
    if (!enableCopyFrom || !isCopyEnabled) return;

    addressFields.forEach(({ key }) => {
      const sourceKey =
        key + copyFromPrefix.charAt(0).toUpperCase() + copyFromPrefix.slice(1);
      const targetKey = key + prefix.charAt(0).toUpperCase() + prefix.slice(1);
      const sourceValue = watch(sourceKey);

      if (["region", "province", "city", "barangay"].includes(key)) {
        setValue(targetKey, sourceValue ?? null, { shouldValidate: true });
      } else {
        setValue(targetKey, sourceValue ?? "", { shouldValidate: true });
      }
    });

    setValue(
      `liveOutsidePH${prefix.charAt(0).toUpperCase() + prefix.slice(1)}`,
      permanentLiveOutsidePH,
      { shouldValidate: true }
    );

    const presentPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    const dependentKeys = ["region", "province", "city", "barangay"];
    const allTargetFields = dependentKeys.map((key) => key + presentPrefix);
    trigger(allTargetFields);
  }, [isCopyEnabled, permanentLiveOutsidePH]);

  const getFieldValue = (key) =>
    watch(key + prefix.charAt(0).toUpperCase() + prefix.slice(1));

  useEffect(() => {
    const countryField = `country${
      prefix.charAt(0).toUpperCase() + prefix.slice(1)
    }`;
    const countryValue = (watch(countryField) || "").toLowerCase();

    if (countryValue && countryValue !== "philippines") {
      setValue(
        `liveOutsidePH${prefix.charAt(0).toUpperCase() + prefix.slice(1)}`,
        true,
        { shouldValidate: true }
      );
    } else {
      setValue(
        `liveOutsidePH${prefix.charAt(0).toUpperCase() + prefix.slice(1)}`,
        false,
        { shouldValidate: true }
      );

      if (!countryValue) {
        setValue(countryField, "Philippines", { shouldValidate: true });
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <h3 className="text-xs font-medium text-primary-color mb-2 md:mb-0">
          {sectionLabel}
        </h3>

        <div className="flex items-center gap-4">
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
                Same as {copyFromPrefix}
              </label>
            </div>
          )}

          {/* Live outside PH checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id={`outsidePH-${prefix}`}
              checked={liveOutsidePH}
              onCheckedChange={(val) => {
                // Sync liveOutsidePH
                setValue(
                  `liveOutsidePH${
                    prefix.charAt(0).toUpperCase() + prefix.slice(1)
                  }`,
                  val,
                  { shouldValidate: true }
                );

                const fieldsToReset = [
                  "region",
                  "province",
                  "city",
                  "barangay",
                  "regionCode",
                  "provinceCode",
                  "cityCode",
                  "barangayCode",
                  "postalCode",
                  "street",
                  "buildingNum",
                ];

                if (val) {
                  setValue(
                    `country${
                      prefix.charAt(0).toUpperCase() + prefix.slice(1)
                    }`,
                    "",
                    { shouldValidate: true }
                  );

                  fieldsToReset.forEach((key) => {
                    const fullKey =
                      key + prefix.charAt(0).toUpperCase() + prefix.slice(1);
                    if (
                      ["region", "province", "city", "barangay"].includes(key)
                    ) {
                      setValue(fullKey, null);
                    } else {
                      setValue(fullKey, "");
                    }
                  });
                } else {
                  // Back to PH default
                  setValue(
                    `country${
                      prefix.charAt(0).toUpperCase() + prefix.slice(1)
                    }`,
                    "Philippines",
                    { shouldValidate: true }
                  );

                  // Reset dependent fields
                  fieldsToReset.forEach((key) => {
                    const fullKey =
                      key + prefix.charAt(0).toUpperCase() + prefix.slice(1);
                    if (
                      ["region", "province", "city", "barangay"].includes(key)
                    ) {
                      setValue(fullKey, null);
                    } else {
                      setValue(fullKey, "");
                    }
                  });
                }
              }}
              disabled={isCopyEnabled && enableCopyFrom} // disable if copying from permanent
            />

            <label
              htmlFor={`outsidePH-${prefix}`}
              className="!text-xs text-muted-foreground italic font-light"
            >
              Outside PH
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {addressFields.map(({ key, label }) => {
          const name = key + prefix.charAt(0).toUpperCase() + prefix.slice(1);
          const isDisabled = isCopyEnabled && enableCopyFrom;

          if (key === "country") {
            return (
              <FormField
                key={name}
                name={name}
                control={control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="!text-xs !text-black">
                      {label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={
                          key === "country" && liveOutsidePH
                            ? field.value
                            : field.value || "Philippines"
                        }
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={
                          !liveOutsidePH || (isCopyEnabled && enableCopyFrom)
                        }
                      />
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
          }

          return (
            <FormField
              key={name}
              name={name}
              control={control}
              render={({ field, fieldState }) => {
                const countryValue = getFieldValue("country");
                const isPhilippines =
                  countryValue?.toLowerCase() === "philippines" &&
                  !liveOutsidePH;

                let displayLabel = label;
                if (!isPhilippines) {
                  if (key === "region") displayLabel = "Region/State";
                  if (key === "barangay") displayLabel = "Barangay/District";
                }

                if (!isPhilippines) {
                  return (
                    <FormItem>
                      <FormLabel className="!text-xs gap-0 !text-black">
                        {displayLabel}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={
                            typeof field.value === "object"
                              ? field.value?.name || ""
                              : field.value || ""
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                          disabled={isDisabled}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="text-red-500 text-xs">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  );
                }

                const region = getFieldValue("region");
                const regionCode = region?.code;
                const isNCR = regionCode === "130000000";
                if (isNCR && key === "province") return null;

                return (
                  <FormItem>
                    <FormLabel className="!text-xs gap-0 !text-black">
                      {label}
                    </FormLabel>
                    <FormControl>
                      {key === "region" ? (
                        <RegionDropdown
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            ["province", "city", "barangay"].forEach((subKey) =>
                              setValue(
                                subKey +
                                  prefix.charAt(0).toUpperCase() +
                                  prefix.slice(1),
                                ""
                              )
                            );
                          }}
                          disabled={isDisabled}
                          error={fieldState.error}
                        />
                      ) : key === "province" ? (
                        <ProvinceDropdown
                          regionCode={regionCode}
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            ["city", "barangay"].forEach((subKey) =>
                              setValue(
                                subKey +
                                  prefix.charAt(0).toUpperCase() +
                                  prefix.slice(1),
                                ""
                              )
                            );
                          }}
                          disabled={isDisabled}
                          error={fieldState.error}
                        />
                      ) : key === "city" ? (
                        <CityDropdown
                          provinceCode={
                            isNCR ? null : getFieldValue("province")?.code
                          }
                          regionCode={
                            isNCR ? getFieldValue("region")?.code : null
                          }
                          isNCR={isNCR}
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
                );
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AddressFields;
