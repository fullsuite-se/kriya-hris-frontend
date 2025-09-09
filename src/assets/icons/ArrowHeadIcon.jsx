import { ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export const ArrowHeadDownIcon = ({ size = 15, className, ...props }) => {
  return (
    <ChevronDownIcon
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
};

export const ArrowHeadUpIcon = ({ size = 15, className, ...props }) => {
  return (
    <ChevronUpIcon
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
};

export const ArrowHeadRightIcon = ({ size = 15, className, ...props }) => {
  return (
    <ChevronRightIcon
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
};


export const ArrowHeadLeftIcon = ({ size = 15, className, ...props }) => {
  return (
    <ChevronLeftIcon
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
};

export default ArrowHeadDownIcon;
