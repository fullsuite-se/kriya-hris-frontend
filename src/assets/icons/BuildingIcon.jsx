import { BuildingOfficeIcon as SolidBuildingOfficeIcon } from "@heroicons/react/24/solid";
import { BuildingOfficeIcon as OutlineBuildingOfficeIcon } from "@heroicons/react/24/outline";

export const BuildingIcon = ({ size = 20, className, ...props }) => (
  <SolidBuildingOfficeIcon width={size} height={size} className={className} {...props} />
);

export const BuildingOutlineIcon = ({ size = 20, className, ...props }) => (
  <OutlineBuildingOfficeIcon width={size} height={size} className={className} {...props} />
);

export default BuildingIcon;
