import { BriefcaseIcon as SolidBriefcaseIcon } from "@heroicons/react/24/solid";
import { BriefcaseIcon as OutlineBriefcaseIcon } from "@heroicons/react/24/outline";

export const BriefCaseIcon = ({ size = 20, className, ...props }) => (
  <SolidBriefcaseIcon width={size} height={size} className={className} {...props} />
);

export const BriefCaseOutlineIcon = ({ size = 20, className, ...props }) => (
  <OutlineBriefcaseIcon width={size} height={size} className={className} {...props} />
);

export default BriefCaseIcon;
