import { Button } from "@/components/ui/button";
import { useHeader } from "@/context/HeaderContext";
import React, { useEffect } from "react";

const AtsDashboardPage = () => {
  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      title: "ATS Dashboard",
      description: "Summary or analytcis heree",
    });
  }, []);

  return (
    <div className="hidden ">
    
    </div>
  );
};

export default AtsDashboardPage;
