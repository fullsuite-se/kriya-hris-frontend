const nameLikeFields = [
  "firstName",
  "middleName",
  "lastName",
  "nickname",
  // "extensionName",
  "birthplace",
  "nationality",
  // "civilStatus",
  // "bloodType",
  "name",
  "fname",
  "mname",
  "lname",
  "relationship",
  // "department",
  // "division",
  // "office",
  // "team",
  // "jobTitle",
  // "supervisor",
];

function capitalizeWords(str) {
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function isEmptyObject(obj) {
  return (
    typeof obj === "object" &&
    obj !== null &&
    !Array.isArray(obj) &&
    Object.values(obj).every(
      (val) => val === "" || val === null || val === undefined
    )
  );
}

export function sanitizeData(data, currentKey = "") {
  if (Array.isArray(data)) {
    return data
      .map((item) => sanitizeData(item))
      .filter(
        (item) => item !== undefined && item !== null && !isEmptyObject(item)
      );
  }

  if (typeof data === "string") {
    const trimmed = data.trim();
    if (trimmed === "") return undefined;

    if (currentKey === "extensionName") {
      return trimmed.toUpperCase();
    }

    return nameLikeFields.includes(currentKey)
      ? capitalizeWords(trimmed)
      : trimmed;
  }

  return data;
}

