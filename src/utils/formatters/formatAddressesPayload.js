export const formatAddressesPayload = (data) => {
  return {
    addresses: [
      {
        building_num: data.buildingNumPresent || null,
        street: data.streetPresent || null,
        barangay: data.barangayPresent?.name || null,
        barangayCode: data.barangayPresent?.code || null,
        city: data.cityPresent?.name || null,
        cityCode: data.cityPresent?.code || null,
        postal_code: data.postalCodePresent || null,
        province: data.provincePresent?.name || null,
        provinceCode: data.provincePresent?.code || null,
        region: data.regionPresent?.name || null,
        regionCode: data.regionPresent?.code || null,
        country: data.countryPresent || null,
        address_type: "CURRENT",
      },
      {
        building_num: data.buildingNumPermanent || null,
        street: data.streetPermanent || null,
        barangay: data.barangayPermanent?.name || null,
        barangayCode: data.barangayPermanent?.code || null,
        city: data.cityPermanent?.name || null,
        cityCode: data.cityPermanent?.code || null,
        postal_code: data.postalCodePermanent || null,
        province: data.provincePermanent?.name || null,
        provinceCode: data.provincePermanent?.code || null,
        region: data.regionPermanent?.name || null,
        regionCode: data.regionPermanent?.code || null,
        country: data.countryPermanent || null,
        address_type: "PERMANENT",
      },
    ],
  };
};
