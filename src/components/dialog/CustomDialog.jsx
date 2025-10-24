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

const titleSizes = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
};

const CustomDialog = ({
  open,
  onOpenChange,
  trigger,
  title = "Dialog Title",
  titleSize = "lg",
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
    <Dialog {...dialogProps} modal={true}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className={`
          ${widthClasses[width] || widthClasses.sm}
          ${heightClasses[height] || heightClasses.sm}
          flex flex-col
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
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className={`${titleSizes[titleSize]}`}>
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-xs">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {children && (
            <div
              className={`
    py-2 flex-1 
    ${scrollable ? "overflow-y-auto overflow-x-hidden custom-scrollbar" : ""}
  `}
            >
              {children}
            </div>
          )}

          {showFooter && (
            <DialogFooter className="mt-4 flex-shrink-0">
              {!hideCancel && (
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
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
