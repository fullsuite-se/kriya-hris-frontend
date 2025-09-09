import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export const LeftArrowIcon = ({ size = 15, className, ...props }) => {
  return (
    <ArrowLeftIcon
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
};

export const RightArrowIcon = ({ size = 15, className, ...props }) => {
  return (
    <ArrowRightIcon
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
};

export default LeftArrowIcon;
