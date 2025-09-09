import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@radix-ui/react-label";

export default function ControlledDynamicComboBox({
  options = [],
  getSearchable = (item) => (typeof item === "object" ? item.email : item),
  getOptionLabel = (item) => {
    if (typeof item !== "object" || !item) return String(item ?? "");

    if (item.fname || item.lname) {
      return `${item.fname || ""} ${item.mname || ""} ${item.lname || ""}`
        .replace(/\s+/g, " ")
        .trim();
    }

    if (item.office_name) return item.office_name;
    if (item.name) return item.name;

    if (item.email) return item.email;
    if (item.title) return item.title;
    if (item.label) return item.label;

    return String(item?.id ?? "");
  },

  getOptionSubLabel = (item) => (typeof item === "object" ? item.email : ""),
  name,
  valueKey = "id",
  value = null,
  onChange,
  placeholder = "Select...",
  width = "w-full",
  label,
  required = false,
  error,
  disabled = false,
  noResultsLabel = "No results found.",
}) {
  const [open, setOpen] = useState(false);

  const selectedItem = options.find((item) => {
    if (typeof item === "object" && typeof value === "object") {
      return item?.[valueKey] === value?.[valueKey];
    }
    return item === value;
  });

  const handleSelect = (searchableValue) => {
    const matched = options.find((item) => {
      const itemSearchable =
        typeof item === "object" ? getSearchable(item) : item;
      return itemSearchable.toLowerCase() === searchableValue.toLowerCase();
    });

    if (onChange && matched) {
      onChange(matched);
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 ">
      {label && (
        <Label htmlFor={name} className="text-xs font-medium gap-0">
          {label}
          {required && <span className="text-primary-color">*</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            id={valueKey}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "bg-transparent justify-between text-xs font-normal",
              width,
              error && "border-red-500 ring-1 ring-red-500"
            )}
          >
            {selectedItem ? getOptionLabel(selectedItem) : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("p-0", width)}>
          <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <CommandList>
              <CommandEmpty>{noResultsLabel}</CommandEmpty>
              <CommandGroup>
                {options.map((item) => {
                  const isObject = typeof item === "object";
                  const key = isObject ? item[valueKey] : item;
                  const label = getOptionLabel(item);
                  const subLabel = getOptionSubLabel?.(item);
                  const isSelected = isObject
                    ? value?.[valueKey] === item?.[valueKey]
                    : value === item;

                  return (
                    <CommandItem
                      key={key}
                      value={getSearchable(item)}
                      onSelect={handleSelect}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{label}</span>
                        {subLabel && (
                          <span className="text-xs text-muted-foreground">
                            {subLabel}
                          </span>
                        )}
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
