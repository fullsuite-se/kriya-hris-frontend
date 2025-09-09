import { createContext, useContext, useState } from "react";

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [headerConfig, setHeaderConfig] = useState({
    title: "",
    description: "",
    button: null,
    isHidden: true,
    backLabel: "Back",
    backPath: null,
    rightContent: null, 
  });

  return (
    <HeaderContext.Provider value={{ headerConfig, setHeaderConfig }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);
