import { ChartPieIcon } from "@heroicons/react/24/solid";
import { ChartPieIcon as OutlineChartPieIcon } from "@heroicons/react/24/outline";

export const AnalyticsIcon = ({ size = 20, className, ...props }) => (
  <ChartPieIcon width={size} height={size} className={className} {...props} />
);

export const OutlineAnalyticsIcon = ({ size = 20, className, ...props }) => (
  <OutlineChartPieIcon width={size} height={size} className={className} {...props} />
);

export default AnalyticsIcon;
