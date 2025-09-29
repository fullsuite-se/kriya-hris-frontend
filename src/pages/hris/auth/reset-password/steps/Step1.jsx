import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { glassToast } from "@/components/ui/glass-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RESEND_DELAY = 60 * 1000; // 1 minute

const Step1 = ({ onNext, email }) => {
  const [userEmail, setUserEmail] = useState(email || "");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("otpData") || "{}");
    if (stored.email && stored.timestamp) {
      const diff = Date.now() - stored.timestamp;
      if (diff < RESEND_DELAY) {
        setCooldown(Math.ceil((RESEND_DELAY - diff) / 1000));
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const stored = JSON.parse(localStorage.getItem("otpData") || "{}");

      if (
        stored.email === userEmail &&
        stored.timestamp &&
        Date.now() - stored.timestamp < RESEND_DELAY
      ) {
        const wait = Math.ceil(
          (RESEND_DELAY - (Date.now() - stored.timestamp)) / 1000
        );
        glassToast({
          message: `Please wait ${wait}s before requesting another OTP for this email.`,
          icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
          textColor: "white",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });
        return;
      }

      const { success } = await onNext(userEmail);

      if (success) {
        localStorage.setItem(
          "otpData",
          JSON.stringify({ email: userEmail, timestamp: Date.now() })
        );
        setCooldown(RESEND_DELAY / 1000);

        glassToast({
          message: "OTP sent to your email.",
          icon: <CheckCircleIcon className="text-[#008080] w-5 h-5" />,
          textColor: "white",
          bgColor: "rgba(255, 255, 255, 0.2)",
          blur: 12,
          duration: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="text-center">
        <p className="text-xl font-semibold text-white">Reset Password</p>
        <p className="text-white/60 text-sm">
          Enter your email to receive a One-Time Passcode (OTP).
        </p>
      </div> 
      <div className="flex flex-col gap-5">
        <form onSubmit={handleSubmit} className="space-y-10">
          <Input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="bg-white/20 text-white !placeholder-white/30 border-white/30"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-primary-color bg-white border-none hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </form>
        {/* <div className="flex justify-center">
          <a href="/login" className="text-xs text-white hover:underline">
            Back to log in
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default Step1;
