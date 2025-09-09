export function extractAddressNames(data) {
  const addressFields = [
    "regionPermanent",
    "provincePermanent",
    "cityPermanent",
    "barangayPermanent",
    "regionPresent",
    "provincePresent",
    "cityPresent",
    "barangayPresent",
  ];

  const result = { ...data };

  for (const field of addressFields) {
    result[field] = data[field]?.name || "";
  }

  return result;
}

export function extractSupervisorId(data) {
  const result = { ...data };
  result.supervisor = data.supervisor?.id || null;
  return result;
}

export function extractDataForSaving(data) {
  const withAddress = extractAddressNames(data);
  const withSupervisor = extractSupervisorId(withAddress);
  return withSupervisor;
}
