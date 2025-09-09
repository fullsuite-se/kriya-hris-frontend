import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";

const LogoutIcon = ({ size = 20, className, ...props }) => (
  <ArrowRightStartOnRectangleIcon width={size} height={size} className={className} {...props} />
);

export default LogoutIcon;
