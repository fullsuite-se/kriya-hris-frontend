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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  getUserPic = (item) => (typeof item === "object" ? item.user_pic : null),
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

  const shouldRenderAvatar = (item) => {
    const userPic = getUserPic(item);
    return userPic !== null && userPic !== undefined && userPic !== '';
  };

  const getAvatarSrc = (item) => {
    const userPic = getUserPic(item);
    if (userPic && !userPic.startsWith('initials:')) {
      return userPic; 
    }
    return undefined;
  };

  const getAvatarFallback = (item) => {
    const userPic = getUserPic(item);
    if (userPic && userPic.startsWith('initials:')) {
      return userPic.replace('initials:', '');
    }
    
    if (typeof item === 'object') {
      const firstName = item.fname || item.first_name || '';
      const lastName = item.lname || item.last_name || '';
      return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || '??';
    }
    
    return '??';
  };

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
    <div className="flex flex-col gap-1">
      {label && (
        <Label htmlFor={name} className="text-xs font-medium gap-0">
          {label}
          {required && <span className="text-primary-color">*</span>}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen} modal={true}>
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
              error && "border-red-500 ring-1 ring-red-500",
              "min-h-9"
            )}
          >
            <div className="flex items-center gap-2 truncate flex-1 text-left overflow-hidden">
              {selectedItem && shouldRenderAvatar(selectedItem) && (
                <Avatar className="h-5 w-5 flex-shrink-0">
                  <AvatarImage 
                    src={getAvatarSrc(selectedItem)} 
                    alt={getOptionLabel(selectedItem)}
                  />
                  <AvatarFallback className="bg-[#008080] text-white text-[8px]">
                    {getAvatarFallback(selectedItem)}
                  </AvatarFallback>
                </Avatar>
              )}
              <span title={selectedItem ? getOptionLabel(selectedItem) : placeholder}>
                {selectedItem ? getOptionLabel(selectedItem) : placeholder}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("p-0", width)}
          sideOffset={5}
          align="start"
          style={{ zIndex: 9999 }}
        >
          <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <CommandList className="max-h-[300px] overflow-y-scroll">
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
                  const shouldShowAvatar = shouldRenderAvatar(item);

                  return (
                    <CommandItem
                      key={key}
                      value={getSearchable(item)}
                      onSelect={handleSelect}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {shouldShowAvatar && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage 
                              src={getAvatarSrc(item)} 
                              alt={label}
                            />
                            <AvatarFallback className="bg-[#008080] text-white text-xs">
                              {getAvatarFallback(item)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col min-w-0 flex-1" style={{
                          marginLeft: shouldShowAvatar ? '0' : '0'
                        }}>
                          <span
                            className="text-sm font-medium truncate"
                            title={label}
                          >
                            {label}
                          </span>
                          {subLabel && (
                            <span
                              className="text-xs text-muted-foreground truncate"
                              title={subLabel}
                            >
                              {subLabel}
                            </span>
                          )}
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "ml-2 h-4 w-4 shrink-0",
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