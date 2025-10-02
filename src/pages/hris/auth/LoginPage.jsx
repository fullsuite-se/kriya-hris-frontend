import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import ShowEyeIcon, { HideEyeIcon } from "@/assets/icons/EyeIcon";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { glassToast } from "@/components/ui/glass-toast";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/stores/useAuthStore";

import { useNavigate } from "react-router-dom";
import { useLoginUserAPI } from "@/hooks/useAuthAPI";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { loginUser, loading } = useLoginUserAPI();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      glassToast({
        message: "Please enter both email and password.",
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      return;
    }

    try {
      const { token } = await loginUser({ email, password });

      localStorage.setItem("token", token);
      console.log("TOKEN: ", token);

      const decoded = jwtDecode(token);
      const servicePermissionNames = decoded.servicePermissions.map(
        (p) => p.service_name
      );
      const accessPermissionNames = decoded.accessPermissions.map(
        (p) => p.feature_name
      );

      setAuth({
        systemUserId: decoded.system_user_id,
        systemCompanyId: decoded.system_company_id,
        systemUserEmail: decoded.system_user_email,
        servicePermissions: servicePermissionNames,
        accessPermissions: accessPermissionNames,
      });

      navigate("/", { replace: true });
    } catch (err) {
      glassToast({
        message:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Login failed. Please try again later.",
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "white",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
    }
  };

  return (
    <div className="dark flex p-10 items-center justify-center h-screen bg-gradient-to-tl from-[#008080] to-[#CC5500]">
      <div className="w-full max-w-md space-y-6 p-8 rounded-2xl shadow-xl border border-white/20 bg-white/10 backdrop-blur-md">
        <div className="flex justify-center">
          <img
            src="/kriya.svg"
            alt="Logo"
            className="h-10 animate-[spin-decelerate_1.5s_ease-out]"
          />
        </div>

        <div className="text-center">
          <p className="text-2xl font-semibold text-white">kriyaHRIS</p>
          <p className="text-white/60 text-sm">Log in to your account</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-white/50">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@getfullsuite.com"
              className="bg-white/20 text-white !placeholder-white/30 border-white/30"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="login-email"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-white/50">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-white/20 text-white !placeholder-white/30 border-white/30 pr-10"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="login-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex !items-center text-white/70 hover:text-white focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <HideEyeIcon className="cursor-pointer" size={18} />
                ) : (
                  <ShowEyeIcon className="cursor-pointer" size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end mb-10">
            <a href="/reset-password" className="text-xs text-white hover:underline">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mb-2 text-white shadow-xs bg-white/30 border-none hover:bg-white/40"
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
