import { Button } from "@/components/ui/button";
import { useHeader } from "@/context/HeaderContext";
import React, { useEffect } from "react";

const AllApplicantsPage = () => {
  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      title: "Applicants",
      description: "list heree",
    });
  }, []);

  return (
    <div className="hidden ">
    
    </div>
  );
};

export default AllApplicantsPage;
