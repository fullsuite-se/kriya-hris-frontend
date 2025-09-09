
import { useEffect, useState, useRef } from "react";

export function useAddress({ regionCode, provinceCode, cityCode }) {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [loading, setLoading] = useState({
    regions: false,
    provinces: false,
    cities: false,
    barangays: false,
  });

  const prevRegionCode = useRef();
  const prevProvinceCode = useRef();
  const prevCityCode = useRef();

  //  regions 
  useEffect(() => {
    const fetchRegions = async () => {
      setLoading((prev) => ({ ...prev, regions: true }));
      try {
        const res = await fetch("https://psgc.gitlab.io/api/regions/");
        const data = await res.json();
        setRegions(data);
      } catch (err) {
        console.error("Error fetching regions:", err);
      } finally {
        setLoading((prev) => ({ ...prev, regions: false }));
      }
    };

    fetchRegions();
  }, []);

  // Region changed - fetch provinces
  useEffect(() => {
    if (!regionCode) {
      setProvinces([]);
      setCities([]);
      setBarangays([]);
      return;
    }

    if (prevRegionCode.current && prevRegionCode.current !== regionCode) {
      setProvinces([]);
      setCities([]);
      setBarangays([]);
    }

    prevRegionCode.current = regionCode;

    const fetchProvinces = async () => {
      setLoading((prev) => ({ ...prev, provinces: true }));
      try {
        const res = await fetch(
          `https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`
        );
        const data = await res.json();
        setProvinces(data);
      } catch (err) {
        console.error("Error fetching provinces:", err);
      } finally {
        setLoading((prev) => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();
  }, [regionCode]);

  // Province changed - fetch cities
  useEffect(() => {
    if (!provinceCode) {
      setCities([]);
      setBarangays([]);
      return;
    }

    if (prevProvinceCode.current && prevProvinceCode.current !== provinceCode) {
      setCities([]);
      setBarangays([]);
    }

    prevProvinceCode.current = provinceCode;

    const fetchCities = async () => {
      setLoading((prev) => ({ ...prev, cities: true }));
      try {
        const res = await fetch(
          `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`
        );
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Error fetching cities:", err);
      } finally {
        setLoading((prev) => ({ ...prev, cities: false }));
      }
    };

    fetchCities();
  }, [provinceCode]);

  // City changed - fetch barangays
  useEffect(() => {
    if (!cityCode) {
      setBarangays([]);
      return;
    }

    if (prevCityCode.current && prevCityCode.current !== cityCode) {
      setBarangays([]);
    }

    prevCityCode.current = cityCode;

    const fetchBarangays = async () => {
      setLoading((prev) => ({ ...prev, barangays: true }));
      try {
        const res = await fetch(
          `https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`
        );
        const data = await res.json();
        setBarangays(data);
      } catch (err) {
        console.error("Error fetching barangays:", err);
      } finally {
        setLoading((prev) => ({ ...prev, barangays: false }));
      }
    };

    fetchBarangays();
  }, [cityCode]);

  return {
    regions,
    provinces,
    cities,
    barangays,
    loading,
  };
}
