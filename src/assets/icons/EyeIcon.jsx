import {
  EyeIcon as EyeOutlineIcon,
  EyeSlashIcon as EyeSlashOutlineIcon,
} from "@heroicons/react/24/outline";

export const ShowEyeIcon = ({ size = 20, className = "", ...props }) => (
  <EyeOutlineIcon width={size} height={size} className={className} {...props} />
);

export const HideEyeIcon = ({ size = 20, className = "", ...props }) => (
  <EyeSlashOutlineIcon width={size} height={size} className={className} {...props} />
);

export default ShowEyeIcon;
