export function formatMonthYear(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function toMonthInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 7);
}
