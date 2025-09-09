
import fetchAllShiftTemplatesAPI from "@/services/shiftTemplatesAPI";
import { useCallback, useContext, useEffect, useState } from "react";

//all

export const useFetchAllShiftTemplatesAPI = () => {
  const [allShiftTemplates, setAllShiftTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAllShiftTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAllShiftTemplatesAPI();
      const sortedShiftTemplates = (response || []).sort((a, b) =>
        a.shift_name.localeCompare(b.shift_name)
      );
      setAllShiftTemplates(sortedShiftTemplates);
    } catch (err) {
      console.error("Failed to fetch all shift templates:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllShiftTemplates();
  }, [fetchAllShiftTemplates]);

  return { allShiftTemplates, error, loading, refetch: fetchAllShiftTemplates, setAllShiftTemplates };
};


export default useFetchAllShiftTemplatesAPI;
