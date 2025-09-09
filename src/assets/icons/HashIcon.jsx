import { HashtagIcon } from "@heroicons/react/24/solid";

export const HashIcon = ({ size = 20, className, ...props }) => (
  <HashtagIcon width={size} height={size} className={className} {...props} />
);



export default HashIcon;
