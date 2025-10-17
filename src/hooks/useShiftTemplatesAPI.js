
import fetchAllShiftTemplatesAPI from "@/services/shiftTemplatesAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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



export default useFetchAllShiftTemplatesAPI;
