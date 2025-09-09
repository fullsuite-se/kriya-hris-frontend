import { Button } from "@/components/ui/button";

const FormActions = ({
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  loadingLabel = "Wait...",
  onCancel,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-end mt-6">
      {/* Mobile Submit */}
      <div className="block sm:hidden w-full">
        <Button
          type="submit"
          disabled={isLoading}
          className="text-xs w-full cursor-pointer border-none !text-white !bg-[#008080] hover:!bg-[#67a2a3]"
        >
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>

      <Button
        type="button"
        onClick={onCancel}
        variant="ghost"
        className="text-xs w-full sm:w-30 cursor-pointer border-none hover:!bg-[#67a2a3]/10 text-muted-foreground"
      >
        {cancelLabel}
      </Button>

      <div className="hidden sm:block">
        <Button
          type="submit"
          disabled={isLoading}
          className="text-xs sm:w-45 cursor-pointer border-none !text-white !bg-[#008080] hover:!bg-[#008080ef]"
        >
          {isLoading ? loadingLabel : submitLabel}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;
