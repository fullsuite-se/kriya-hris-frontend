import { useEffect } from "react";
import { useHeader } from "@/context/HeaderContext";

export const usePageHeader = ({ title, description, button }) => {
  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({ title, description, button });
  }, [title, description, button]);
};
