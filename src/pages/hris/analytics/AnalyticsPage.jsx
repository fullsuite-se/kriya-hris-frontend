import { useHeader } from "@/context/HeaderContext";
import { useEffect } from "react";

export default function AnalyticsPage() {
  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      title: "Analytics",
      description: "insights here",
    });
  }, []);

  return <div></div>;
}
