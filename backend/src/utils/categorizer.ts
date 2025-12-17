// Simple rule-based categorization helper that can be expanded later.
// It searches for basic keywords in the description and returns a matching category name.
export function guessCategoryName(description: string): string | null {
  const lower = description.toLowerCase();

  if (lower.includes("hair") || lower.includes("cut") || lower.includes("style")) {
    return "Income";
  }

  if (lower.includes("rent") || lower.includes("booth")) {
    return "Salon Rent";
  }

  if (lower.includes("product") || lower.includes("supplies")) {
    return "Supplies";
  }

  if (lower.includes("coffee") || lower.includes("lunch") || lower.includes("food")) {
    return "Meals";
  }

  return null;
}
