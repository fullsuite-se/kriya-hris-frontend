import { createContext, useState } from "react";

export const CompanyDetailsContext = createContext();

export const CompanyDetailsProvider = ({ children }) => {
  const [companyEmail, setCompanyEmail] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [industryId, setIndustryId] = useState(null);
  const [industryType, setIndustryType] = useState(null);
  const [businessType, setBusinessType] = useState(null);
  const [companyBrn, setCompanyBrn] = useState(null);
  const [companyInfoId, setCompanyInfoId] = useState(null); 
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [companyPhone, setCompanyPhone] = useState(null);
  const [companyTin, setCompanyTin] = useState(null);
  const [companyTradeName, setCompanyTradeName] = useState(null);
  const [companyAddress, setCompanyAddress] = useState({});

  const value = {
    companyEmail,
    setCompanyEmail,
    companyId,
    setCompanyId,
    industryId,
    setIndustryId,
    industryType,
    setIndustryType,
    businessType,
    setBusinessType,
    companyBrn,
    setCompanyBrn,
    companyInfoId,
    setCompanyInfoId,
    companyLogo,
    setCompanyLogo,
    companyName,
    setCompanyName,
    companyPhone,
    setCompanyPhone,
    companyTin,
    setCompanyTin,
    companyTradeName,
    setCompanyTradeName,
    companyAddress,
    setCompanyAddress,
  };

  return (
    <CompanyDetailsContext.Provider value={value}>
      {children}
    </CompanyDetailsContext.Provider>
  );
};
