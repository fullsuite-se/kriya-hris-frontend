import { Button } from "@/components/ui/button";
import { useHeader } from "@/context/HeaderContext";
import React, { useEffect } from "react";

const AllApplicantsPage = () => {
  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      title: "Applicants",
      description: "list here",
    });
  }, []);

  return <div className="hidden "></div>;
};

export default AllApplicantsPage;
