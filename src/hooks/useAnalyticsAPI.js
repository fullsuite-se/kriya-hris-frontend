import { fetchMonthlyTrendsAPI, fetchAvailableYearsAPI, fetchAttritionRateAPI, fetchSexDistributionAPI, fetchAgeDistributionAPI } from '@/services/analyticsAPI';
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";

export const useFetchMonthlyTrendsAPI = (year = null) => {
  const query = useQuery({
    queryKey: ["monthly-trends", year],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append("year", year);

      const result = await fetchMonthlyTrendsAPI(params);

      if (!result) throw new Error("No response received from server");
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    data: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
  };
};



export const useFetchAvailableYearsAPI = () => {
  const query = useQuery({
    queryKey: ["available-years"],
    queryFn: async () => {
      const result = await fetchAvailableYearsAPI();

      if (!result) throw new Error("No response received from server");
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    years: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
  };
};


export const useFetchAttritionRateAPI = (year = null) => {
  const query = useQuery({
    queryKey: ["attrition-rate", year],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append("year", year);

      const result = await fetchAttritionRateAPI(params);

      if (!result) throw new Error("No response received from server");
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    data: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
  };
};



export const useFetchSexDistributionAPI = () => {
  const query = useQuery({
    queryKey: ["sex-distribution"],
    queryFn: async () => {
      const result = await fetchSexDistributionAPI();

      if (!result) throw new Error("No response received from server");
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    data: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
  };
};


export const useFetchAgeDistributionAPI = () => {
  const query = useQuery({
    queryKey: ["age-distribution"],
    queryFn: async () => {
      const result = await fetchAgeDistributionAPI();

      if (!result) throw new Error("No response received from server");
      if (!result.success) throw new Error(result.message);

      return result.data;
    },
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    data: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
  };
};

