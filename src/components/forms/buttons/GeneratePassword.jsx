import { useState } from "react";
import { useWatch } from "react-hook-form";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { glassToast } from "@/components/ui/glass-toast";

const GeneratePasswordButton = ({ form }) => {
  const firstName =
    useWatch({ control: form.control, name: "firstName" }) || "";
  const lastName = useWatch({ control: form.control, name: "lastName" }) || "";
  const employeeId = useWatch({ control: form.control, name: "employeeId" });

  const handleGeneratePassword = () => {
    if (!employeeId || !firstName || !lastName) {
      glassToast({
        message: (
          <>
            Please fill in{" "}
            <span className="text-primary-color font-semibold">First Name</span>
            ,{" "}
            <span className="text-primary-color font-semibold">Last Name</span>,
            and{" "}
            <span className="text-primary-color font-semibold">
              Employee ID
            </span>{" "}
            first.
          </>
        ),
        icon: <ExclamationTriangleIcon className="text-[#CC5500] w-5 h-5" />,
        textColor: "black",
        bgColor: "rgba(255, 255, 255, 0.2)",
        blur: 12,
        duration: 4000,
      });
      return;
    }

    const password = `${employeeId}-${lastName
      .replace(/\s+/g, "")
      .toUpperCase()}-${firstName.replace(/\s+/g, "").toLowerCase()}`;

    form.setValue("password", password, { shouldValidate: true });
    form.setValue("confirmPassword", password, { shouldValidate: true });
  };

  return (
    <Button
      variant={"link"}
      type="button"
      className={`text-primary-color m-0 p-0`}
      onClick={handleGeneratePassword}
    >
      Generate Password
    </Button>
  );
};

export default GeneratePasswordButton;
