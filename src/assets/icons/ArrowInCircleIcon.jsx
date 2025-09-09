import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

export const ArrowLeftInCircleIcon = ({ size = 20, className, ...props }) => (
  <ArrowLeftCircleIcon
    width={size}
    height={size}
    className={className}
    {...props}
  />
);

export const ArrowRightInCircleIcon = ({ size = 20, className, ...props }) => (
  <ArrowRightCircleIcon
    width={size}
    height={size}
    className={className}
    {...props}
  />
);

export default ArrowLeftInCircleIcon;
