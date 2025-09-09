import { XMarkIcon } from "@heroicons/react/24/solid";

const CloseIcon = ({ size = 20, className, ...props }) => (
  <XMarkIcon width={size} height={size} className={className} {...props} />
);

export default CloseIcon;
