import { EnvelopeIcon as SolidEnvelopeIcon } from "@heroicons/react/24/solid";
import { EnvelopeIcon as OutlineEnvelopeIcon } from "@heroicons/react/24/outline";

export const EmailIcon = ({ size = 20, className, ...props }) => (
  <SolidEnvelopeIcon width={size} height={size} className={className} {...props} />
);

export const EmailOutlineIcon = ({ size = 20, className, ...props }) => (
  <OutlineEnvelopeIcon width={size} height={size} className={className} {...props} />
);

export default EmailIcon;
