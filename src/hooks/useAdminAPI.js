import { fetchFeaturesAndServicesAPI } from "@/services/adminAPI";
import { useEffect, useState } from "react";

export const useFetchFeaturesAndServicesAPI = (serviceId) => {
  const [servicesAndFeatures, setServicesAndFeatures] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeaturesAndServices = async () => {
      setLoading(true);
      try {
        const response = await fetchFeaturesAndServicesAPI(serviceId);
        setServicesAndFeatures(response || []);
      } catch (err) {
        console.error("Failed to fetch services and features:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturesAndServices();
  }, [serviceId]);

  return { servicesAndFeatures, error, loading };
};
