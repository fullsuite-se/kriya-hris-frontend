import { Bars3Icon } from "@heroicons/react/24/solid";

const BarsIcon = ({ size = 20, className, ...props }) => (
  <Bars3Icon width={size} height={size} className={className} {...props} />
);

export default BarsIcon;
