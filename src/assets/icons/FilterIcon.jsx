import { ListFilter } from "lucide-react";

export default function FilterIcon({
  size = 15,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
}) {
  return (
    <ListFilter
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}
