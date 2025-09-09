import { UserGroupIcon as SolidUserGroupIcon } from "@heroicons/react/24/solid";
import { UserGroupIcon as OutlineUserGroupIcon } from "@heroicons/react/24/outline";

export const EmployeesIcon = ({ size = 20, className, ...props }) => (
  <SolidUserGroupIcon width={size} height={size} className={className} {...props} />
);

export const EmployeesOutlineIcon = ({ size = 20, className, ...props }) => (
  <OutlineUserGroupIcon width={size} height={size} className={className} {...props} />
);

export default EmployeesIcon;
