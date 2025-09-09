const BASE_URL = "https://psgc.gitlab.io/api";

export const fetchRegions = async () => {
  const res = await fetch(`${BASE_URL}/regions/`);
  return res.json();
};

export const fetchProvinces = async (regionCode) => {
  const res = await fetch(`${BASE_URL}/regions/${regionCode}/provinces/`);
  return res.json();
};

export const fetchCities = async (provinceCode) => {
  const res = await fetch(`${BASE_URL}/provinces/${provinceCode}/cities-municipalities/`);
  return res.json();
};

export const fetchBarangays = async (cityCode) => {
  const res = await fetch(`${BASE_URL}/cities-municipalities/${cityCode}/barangays/`);
  return res.json();
};
