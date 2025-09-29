import { useState, useEffect } from "react";
import { glassToast } from "@/components/ui/glass-toast";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Step2 = ({ onBack, onVerify, email, otpSentAt, setOtpSentAt }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!otpSentAt) return;

    const interval = setInterval(() => {
      const timePassed = Math.floor((Date.now() - otpSentAt) / 1000);
      const remaining = 60 - timePassed;
      setTimer(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSentAt]);

  const handleResend = () => {
    if (timer > 0) {
      glassToast({
        message: `Wait ${timer}s before resending.`,
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      return;
    }

    setOtpSentAt(Date.now());
    glassToast({
      message: "OTP resent successfully.",
      icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
      textColor: "black",
      bgColor: "rgba(255, 255, 255, 0.2)",
      blur: 12,
      duration: 4000,
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      glassToast({
        message: "Enter a valid 6-digit OTP.",
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      await onVerify(otp);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="text-center">
        <p className="text-xl font-semibold text-white">Enter OTP</p>
        <p className="text-white/60 text-sm">
          We sent a 6-digit OTP to{" "}
          <span className="font-medium underline">{email}</span>.
        </p>
      </div>
      <div className="flex flex-col gap-5">
        <form onSubmit={handleVerify} className="space-y-10">
          <Input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            maxLength={6}
            className="bg-white/20 text-white !placeholder-white/30 border-white/30"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-primary-color bg-white border-none hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>

        <div className="flex justify-between select-none">
          <Button
            onClick={onBack}
            variant={"link"}
            className="text-white text-xs font-light p-0 m-0"
            disabled={loading}
          >
            ← Change Email
          </Button>
          <Button
            variant={"link"}
            onClick={handleResend}
            className="text-white text-xs font-light p-0 m-0"
            disabled={timer > 0 || loading}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step2;
