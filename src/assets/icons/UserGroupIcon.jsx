import { UserGroupIcon as SolidUserGroupIcon } from "@heroicons/react/24/solid";
import { UserGroupIcon as OutlineUserGroupIcon } from "@heroicons/react/24/outline";

export const UserGroupIcon = ({ size = 20, className, ...props }) => (
  <SolidUserGroupIcon width={size} height={size} className={className} {...props} />
);

export const UserGroupOutlineIcon = ({ size = 20, className, ...props }) => (
  <OutlineUserGroupIcon width={size} height={size} className={className} {...props} />
);

export default UserGroupIcon;
