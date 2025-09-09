import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const widthClasses = {
  sm: "w-[90vw] sm:max-w-[425px]",
  md: "w-[90vw] sm:max-w-[600px]",
  lg: "w-[90vw] sm:max-w-[800px]",
  xl: "w-[95vw] sm:max-w-[1000px]",
  full: "w-[100vw] sm:max-w-[90vw]",
};

const heightClasses = {
  sm: "max-h-[80vh] sm:max-h-[300px]",
  md: "max-h-[80vh] sm:max-h-[500px]",
  lg: "max-h-[80vh] sm:max-h-[650px]",
  xl: "max-h-[85vh] sm:max-h-[800px]",
  full: "max-h-[90vh]",
};

const CustomDialog = ({
  open,
  onOpenChange,
  trigger,
  title = "Dialog Title",
  description = "",
  className = "",
  children,
  width = "sm",
  height = "sm",
  scrollable = true,

  showFooter = true,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  hideCancel = false,

  onConfirm,
  onCancel,
  loading = false,
  isShownCloseButton = true,
  allowOutsideInteraction = false,
}) => {
  const dialogProps = open !== undefined ? { open, onOpenChange } : {};

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (onConfirm) onConfirm(formData);
  };

  return (
    <Dialog {...dialogProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className={`
          ${widthClasses[width] || widthClasses.sm}
          ${heightClasses[height] || heightClasses.sm}
          ${scrollable ? "overflow-y-auto" : ""}
          ${className}
        `}
        onInteractOutside={
          allowOutsideInteraction ? undefined : (e) => e.preventDefault()
        }
        onPointerDownOutside={
          allowOutsideInteraction ? undefined : (e) => e.preventDefault()
        }
        showCloseButton={isShownCloseButton}
        
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-xs">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {children && <div className="py-2">{children}</div>}

          {showFooter && (
            <DialogFooter className="mt-4">
              {!hideCancel && (
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={onCancel}>
                    {cancelLabel}
                  </Button>
                </DialogClose>
              )}
              <Button type="submit" disabled={loading}>
                {confirmLabel}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
