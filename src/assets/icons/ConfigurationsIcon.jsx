import { Cog6ToothIcon as SolidConfigurationsIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon as OutlineConfigurationsIcon } from "@heroicons/react/24/outline";

export const ConfigurationsIcon = ({ size = 20, className, ...props }) => (
  <SolidConfigurationsIcon width={size} height={size} className={className} {...props} />
);

export const ConfigurationsOutlineIcon = ({ size = 20, className, ...props }) => (
  <OutlineConfigurationsIcon width={size} height={size} className={className} {...props} />
);

export default ConfigurationsIcon;
