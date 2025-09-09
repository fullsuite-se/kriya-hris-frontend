import { useHeader } from "@/context/HeaderContext";
import BackButton from "../ui/back-button";

const Header = () => {
  const { headerConfig } = useHeader();
  const {
    title,
    description,
    button,
    backLabel,
    isHidden,
    backPath,
    rightContent,
  } = headerConfig;

  const hasTitle = title && title.trim() !== "";
  const hasDescription = description && description.trim() !== "";

  return (
    <div>
      <BackButton label={backLabel} isHidden={isHidden} backPath={backPath} />
      {hasTitle || hasDescription || button ? (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-6">
          <div className="w-full">
            {hasTitle && (
              <p className="m-0 text-xl md:text-2xl font-bold">{title}</p>
            )}
            {hasDescription && (
              <p className="text-gray-500 text-sm md:text-base">
                {description}
              </p>
            )}
          </div>

          {button ? (
            <div className="flex justify-end items-center">{button}</div>
          ) : (
            rightContent && (
              <div className="flex justify-end items-center">
                {rightContent}
              </div>
            )
          )}
        </div>
      ) : (
        <div className="py-2" />
      )}
    </div>
  );
};

export default Header;
