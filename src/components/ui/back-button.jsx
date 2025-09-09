import { useNavigate } from "react-router-dom";
import { ArrowHeadLeftIcon } from "@/assets/icons/ArrowHeadIcon";

const BackButton = ({
  label = "Back",
  fallback = "/",
  className = "",
  iconClassName = "",
  labelClassName = "",
  isHidden = true,
  backPath = null,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (backPath) {
      navigate(backPath);
      return;
    }
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  if (isHidden) return null;

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1 cursor-pointer !text-[12px] text-primary-color hover:text-[#008080d6] transition-colors ${className}`}
    >
      <ArrowHeadLeftIcon size={15} className={iconClassName} />
      <span className={labelClassName}>{label}</span>
    </button>
  );
};

export default BackButton;
