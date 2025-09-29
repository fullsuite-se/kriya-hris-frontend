import LoadingAnimation from "@/components/Loading";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Step4 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex flex-col gap-10 text-center">
      <div className="text-center">
        <p className="text-xl font-semibold text-white">
          Password Reset Successful
        </p>
        <p className="text-white/60 text-sm">Redirecting you to login...</p>
      </div>
      <div className="flex justify-center">
        <img
          src="/loading-1.svg"
          alt="loading"
          width={60}
          height={60}
          className="rotate-90"
        />
      </div>
    </div>
  );
};

export default Step4;
