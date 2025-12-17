import { CategoryType } from '@prisma/client';

// Simple keyword-based categorization helper.
// In a real app this could rely on ML models or user-defined rules.
export function categorizeByDescription(description: string) {
  const text = description.toLowerCase();

  if (text.includes('hair') || text.includes('style')) {
    return { type: CategoryType.income, isBusiness: true, isPersonal: false };
  }

  if (text.includes('rent') || text.includes('supplies')) {
    return { type: CategoryType.business_expense, isBusiness: true, isPersonal: false };
  }

  if (text.includes('grocer') || text.includes('food')) {
    return { type: CategoryType.personal, isBusiness: false, isPersonal: true };
  }

  // Default fallback when nothing matches
  return { type: CategoryType.personal, isBusiness: false, isPersonal: true };
}
