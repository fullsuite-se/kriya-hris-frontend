import { createContext, useState, useEffect, useCallback, useMemo } from "react";

export const UserContext = createContext();

const CACHE_KEY = "user_data_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [designations, setDesignations] = useState([]);
  const [employmentInfo, setEmploymentInfo] = useState(null);
  const [salaryInfo, setSalaryInfo] = useState(null);
  const [hr201, setHr201] = useState(null);
  const [governmentIds, setGovernmentIds] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [isCacheLoaded, setIsCacheLoaded] = useState(false);

  // Load from cache on mount - ONLY ONCE
  useEffect(() => {
    const loadFromCache = () => {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (!cached) {
          setIsCacheLoaded(false);
          return false;
        }

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid
        if (now - timestamp < CACHE_DURATION) {
          setUser(data.user);
          setPersonalInfo(data.personalInfo);
          setDesignations(data.designations);
          setEmploymentInfo(data.employmentInfo);
          setSalaryInfo(data.salaryInfo);
          setHr201(data.hr201);
          setGovernmentIds(data.governmentIds);
          setAddresses(data.addresses);
          setEmergencyContacts(data.emergencyContacts);
          setJobDetails(data.jobDetails);
          setIsCacheLoaded(true);
          return true;
        } else {
          sessionStorage.removeItem(CACHE_KEY);
          setIsCacheLoaded(false);
        }
      } catch (error) {
        console.error("Error loading cache:", error);
        sessionStorage.removeItem(CACHE_KEY);
        setIsCacheLoaded(false);
      }
      return false;
    };

    loadFromCache();
  }, []); 

  useEffect(() => {
    if (!user) return;

    try {
      const cacheData = {
        data: {
          user,
          personalInfo,
          designations,
          employmentInfo,
          salaryInfo,
          hr201,
          governmentIds,
          addresses,
          emergencyContacts,
          jobDetails,
        },
        timestamp: Date.now(),
      };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error saving cache:", error);
    }
  }, [
    user,
    personalInfo,
    designations,
    employmentInfo,
    salaryInfo,
    hr201,
    governmentIds,
    addresses,
    emergencyContacts,
    jobDetails,
  ]);

  const clearUserCache = useCallback(() => {
    console.log("🗑️ Clearing cache");
    sessionStorage.removeItem(CACHE_KEY);
    setUser(null);
    setPersonalInfo(null);
    setDesignations([]);
    setEmploymentInfo(null);
    setSalaryInfo(null);
    setHr201(null);
    setGovernmentIds([]);
    setAddresses([]);
    setEmergencyContacts([]);
    setJobDetails(null);
    setIsCacheLoaded(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      setLoading,
      personalInfo,
      setPersonalInfo,
      designations,
      setDesignations,
      employmentInfo,
      setEmploymentInfo,
      salaryInfo,
      setSalaryInfo,
      hr201,
      setHr201,
      governmentIds,
      setGovernmentIds,
      addresses,
      setAddresses,
      emergencyContacts,
      setEmergencyContacts,
      jobDetails,
      setJobDetails,
      isCacheLoaded,
      setIsCacheLoaded,
      clearUserCache,
    }),
    [
      user,
      loading,
      personalInfo,
      designations,
      employmentInfo,
      salaryInfo,
      hr201,
      governmentIds,
      addresses,
      emergencyContacts,
      jobDetails,
      isCacheLoaded,
      clearUserCache,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};