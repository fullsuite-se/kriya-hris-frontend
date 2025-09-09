import { ArrowLeftToLineIcon, ArrowRightToLineIcon, ChevronFirstIcon, ChevronLastIcon } from "lucide-react";

export function ArrowLeftLineIcon({
  size = 15,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
}) {
  return (
    <ArrowLeftToLineIcon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}

export function ArrowRightLineIcon({
  size = 15,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
}) {
  return (
    <ArrowRightToLineIcon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}


export function ArrowHeadRightLineIcon({
  size = 15,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
}) {
  return (
    <ChevronFirstIcon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}


export function ArrowHeadLeftLineIcon({
  size = 15,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
}) {
  return (
    <ChevronLastIcon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}

export default ArrowLeftLineIcon;
