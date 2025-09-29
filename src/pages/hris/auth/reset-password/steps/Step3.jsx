import PasswordField from "@/components/forms/fields/PasswordField";
import { resetPasswordSchema } from "@/components/forms/schemas/resetPasswordSchema";
import { Button } from "@/components/ui/button";
import { glassToast } from "@/components/ui/glass-toast";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Step3 = ({ onChangePassword }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = form.getValues();

    // Check if fields are empty
    if (!password || !confirmPassword) {
      // Optionally show a toast
      glassToast({
        message: "Both fields are required",
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "white",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      glassToast({
        message: "Passwords do not match",
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "white",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      await onChangePassword(password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark flex flex-col gap-10">
      <div className="text-center">
        <p className="text-xl font-semibold text-white">
          Enter Your New Password
        </p>
        <p className="text-white/60 text-sm">Please use a strong password.</p>
      </div>
      <div className="flex flex-col gap-5">
        <form onSubmit={handleChangePassword} className="space-y-10">
          <PasswordField
            name="password"
            label="Password"
            control={form.control}
            value={form.watch("password")}
            onValueChange={(val) => form.setValue("password", val)}
            required
            inputClassName="bg-white/20 text-white !placeholder-white/30 border-white/30"
            containerClassName="mb-4"
            labelClassName="text-white"
            errorClassName="text-[#CC5500] font-medium"
            requiredAsteriskClassName="text-white"
            iconColorClass="white"
            errorColorClass="white"
          />

          <PasswordField
            name="confirmPassword"
            label="Confirm Password"
            control={form.control}
            value={form.watch("confirmPassword")}
            onValueChange={(val) => form.setValue("confirmPassword", val)}
            errorMessage={
              form.watch("confirmPassword") &&
              form.watch("password") !== form.watch("confirmPassword")
                ? "Passwords do not match"
                : ""
            }
            required
            inputClassName="bg-white/20 text-white !placeholder-white/30 border-white/30"
            containerClassName="mb-4"
            labelClassName="text-white"
            errorClassName="text-[#CC5500] font-medium"
            requiredAsteriskClassName="text-white"
            iconColorClass="white"
            errorColorClass="white"
          />

          <Button
            type="submit"
            disabled={
              loading ||
              !form.formState.isValid ||
              form.watch("password") !== form.watch("confirmPassword")
            }
            className="w-full text-primary-color bg-white border-none hover:bg-gray-100 disabled:opacity-50 mt-10"
          >
            {loading ? "Updating password..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Step3;
