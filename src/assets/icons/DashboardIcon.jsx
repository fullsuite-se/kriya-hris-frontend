import { RectangleGroupIcon as SolidDashboardIcon } from "@heroicons/react/24/solid";
import { RectangleGroupIcon as OutlineDashboardIcon } from "@heroicons/react/24/outline";

export const DashboardIcon = ({ size = 20, className, ...props }) => (
  <SolidDashboardIcon width={size} height={size} className={className} {...props} />
);

export const DashboardOutlineIcon = ({ size = 20, className, ...props }) => (
  <OutlineDashboardIcon width={size} height={size} className={className} {...props} />
);

export default DashboardIcon;
