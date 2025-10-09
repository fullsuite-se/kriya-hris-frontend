import { useEffect, useState } from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import { useNavigate } from "react-router-dom";
import {
  useChangePasswordAPI,
  useRequestResetPasswordAPI,
  useVerifyOtpAPI,
} from "@/hooks/useAuthAPI";
import { glassToast } from "@/components/ui/glass-toast";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import Step4 from "./steps/Step4";

const ResetPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp_code, setOtp_code] = useState("");
  const [otpSentAt, setOtpSentAt] = useState(null); // store timestamp

  const navigate = useNavigate();

  const { requestResetPassword } = useRequestResetPasswordAPI();
  const { verifyOTP } = useVerifyOtpAPI();
  const { changePassword } = useChangePasswordAPI();

  const handleSendOtp = async (enteredEmail) => {
    const now = Date.now();

    // Prevent resending OTP if same email is still in cooldown
    if (email === enteredEmail && otpSentAt && now - otpSentAt < 60 * 1000) {
      return { success: false, reason: "wait" };
    }

    try {
      await requestResetPassword(enteredEmail);

      setEmail(enteredEmail);
      setOtpSentAt(now);
      setStep(2);

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send OTP. Please try again later.";

      glassToast({
        message: errorMessage,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "white",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });

      console.error("Failed to send OTP:", errorMessage);
      return { success: false, reason: "error" };
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      await verifyOTP(email, otp);

      setOtp_code(otp);
      setStep(3);

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to verify OTP. Please try again later.";

      glassToast({
        message: errorMessage,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "white",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });

      console.error("Failed to verify OTP:", errorMessage);
      return { success: false, reason: "error" };
    }
  };

  const handleChangePassword = async (new_password) => {
    try {
      await changePassword(email, otp_code, new_password);

      setStep(4);

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to change password. Please try again later.";

      glassToast({
        message: errorMessage,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "white",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });

      console.error("Failed to change password:", errorMessage);
      return { success: false, reason: "error" };
    }
  };

  const handleBackToEmail = async () => {
    setStep(1);
  };

  useEffect(() => {
    document.title = "Reset Password";
  }, []);
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-tl from-[#008080] to-[#CC5500] p-6">
      <div className="w-full max-w-md space-y-6 p-8 rounded-2xl shadow-xl border border-white/20 bg-white/10 backdrop-blur-md">
        {step !== 4 && (
          <div className="flex justify-center">
            <img
              src="/kriya.svg"
              alt="Logo"
              className="h-10 animate-[spin-decelerate_1.5s_ease-out] cursor-pointer"
              onClick={() => navigate("/login")}
            />
          </div>
        )}
        {step === 1 && (
          <Step1 onNext={handleSendOtp} email={email} otpSentAt={otpSentAt} />
        )}
        {step === 2 && (
          <Step2
            onBack={handleBackToEmail}
            onVerify={handleVerifyOtp}
            email={email}
            otpSentAt={otpSentAt}
            setOtpSentAt={setOtpSentAt}
            handleResendOTP={handleSendOtp}
          />
        )}
        {step === 3 && <Step3 onChangePassword={handleChangePassword} />}

        {step === 4 && <Step4 />}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
