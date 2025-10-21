import { useEffect, useState } from "react";
import { toast } from "sonner";

export const GlassToastContent = ({
  t,
  message,
  icon,
  duration,
  onUndo,
  textColor,
  bgColor,
  blur,
}) => {
  const [canUndo, setCanUndo] = useState(true);

  useEffect(() => {
    if (duration && onUndo) {
      const timeout = setTimeout(() => {
        setCanUndo(false);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [duration, onUndo]);

  const handleUndo = () => {
    onUndo?.();
    toast.dismiss(t.id);
  };

  const handleClose = () => {
    toast.dismiss(t.id);
  };

  return (
    <div
      className="relative rounded-2xl p-4 min-sm:w-85 shadow-md overflow-hidden"
      style={{
        background: bgColor,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: "1px solid rgba(255, 255, 255, 0.3)",
        color: textColor,
      }}
    >
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-xs opacity-70 hover:opacity-100 cursor-pointer"
      >
        ✕
      </button>

      {duration && onUndo && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-teal-600"
          style={{
            width: "100%",
            animation: `shrinkProgress ${duration}ms linear forwards`,
          }}
        />
      )}

      <div className="flex items-start gap-2 justify-between">
        {icon}
        <div className="flex-1 text-sm">{message}</div>
      </div>

      {onUndo && canUndo && (
        <div className="mt-2 text-right">
          <button
            onClick={handleUndo}
            className="cursor-pointer text-xs text-[#008080] no-underline hover:opacity-80"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
};
