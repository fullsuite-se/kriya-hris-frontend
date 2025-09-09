import { PhoneIcon as SolidPhoneIcon } from "@heroicons/react/24/solid";
import { PhoneIcon as OutlinePhoneIcon } from "@heroicons/react/24/outline";

export const TelephoneIcon = ({ size = 20, className, ...props }) => (
  <SolidPhoneIcon width={size} height={size} className={className} {...props} />
);

export const TelephoneOutlineIcon = ({ size = 20, className, ...props }) => (
  <OutlinePhoneIcon width={size} height={size} className={className} {...props} />
);

export default TelephoneIcon;
