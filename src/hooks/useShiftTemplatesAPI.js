
import fetchAllShiftTemplatesAPI, { addShiftTemplateAPI, editShiftTemplateAPI , deleteShiftTemplateAPI} from "@/services/shiftTemplatesAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

//all


export const useFetchAllShiftTemplatesAPI = () => {
  const queryClient = useQueryClient();

  const {
    data: allShiftTemplates = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["shiftTemplates"],
    queryFn: async () => {
      const response = await fetchAllShiftTemplatesAPI();
      const sortedShiftTemplates = (response || []).sort((a, b) =>
        a.shift_name.localeCompare(b.shift_name)
      );
      return sortedShiftTemplates;
    },
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

  const setAllShiftTemplates = (newTemplates) => {
    queryClient.setQueryData(["shiftTemplates"], newTemplates);
  };

  return {
    allShiftTemplates,
    loading,
    error: isError ? error : null,
    refetch,
    setAllShiftTemplates,
  };
};


export const useAddShiftTemplateAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addShiftTemplate = async ({
    shift_name,
    start_time,
    end_time,
    break_start_time,
    break_end_time,
    day_of_week,
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addShiftTemplateAPI({
        shift_name,
        start_time,
        end_time,
        break_start_time,
        break_end_time,
        day_of_week,
      });
      console.log("Shift Template added successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to add Shift Template:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addShiftTemplate, loading, error };
}


export const useEditShiftTemplateAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editShiftTemplate = async ({
    shift_template_id,
    shift_name,
    start_time,
    end_time,
    break_start_time,
    break_end_time,
    day_of_week,
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await editShiftTemplateAPI({
        shift_template_id,
        shift_name,
        start_time,
        end_time,
        break_start_time,
        break_end_time,
        day_of_week,
      });
      console.log("Shift Template edited successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to edit Shift Template:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editShiftTemplate, loading, error };
};

export const useDeleteShiftTemplateAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteShiftTemplate = async (shift_template_id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteShiftTemplateAPI(shift_template_id);
      console.log("Shift Template deleted successfully:", response);
      return response;
    } catch (err) {
      console.error("Failed to delete Shift Template:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteShiftTemplate, loading, error };
}



export default useFetchAllShiftTemplatesAPI;



