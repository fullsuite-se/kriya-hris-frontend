
import { toast } from "sonner";
import { GlassToastContent } from "./glass-toast-content";
export function glassToast({
  message,
  icon,
  textColor = "#1f2937",
  bgColor = "rgba(255, 255, 255, 0.25)",
  blur = 10,
  duration = 5000,
  progressDuration = null,
  onUndo = null,
}) {
  return toast.custom(
    (t) => (
      <GlassToastContent
        key={t.id}
        t={t}
        message={message}
        icon={icon}
        duration={progressDuration}
        onUndo={onUndo}
        textColor={textColor}
        bgColor={bgColor}
        blur={blur}
      />
    ),
    { duration }
  );
}
