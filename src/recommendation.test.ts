import { describe, expect, it } from 'vitest';
import { generateBasket } from './recommendation';

const basePreferences = {
  zipCode: '48201',
  weeklyBudget: 50,
  householdSize: 2,
  days: 7,
  dietaryNeeds: [] as string[],
  dislikes: [] as string[],
  cookingLimitations: [] as string[],
  keyConsiderations: [] as string[],
  preferredStore: 'Aldi',
};

describe('generateBasket', () => {
  it('creates a basket that stays below the user budget with a buffer', () => {
    const basket = generateBasket(basePreferences);

    expect(basket.estimatedTotal).toBeLessThanOrEqual(50);
    expect(basket.budgetBuffer).toBeGreaterThanOrEqual(2);
    expect(basket.items.length).toBeGreaterThanOrEqual(8);
  });

  it('includes practical healthy staples across core food categories', () => {
    const basket = generateBasket(basePreferences);
    const categories = basket.items.map((item) => item.category);

    expect(categories).toEqual(
      expect.arrayContaining(['protein', 'grain', 'produce', 'breakfast'])
    );
  });

  it('respects disliked foods and suggests substitutions', () => {
    const basket = generateBasket({ ...basePreferences, dislikes: ['tuna', 'peanut butter'] });
    const itemNames = basket.items.map((item) => item.name.toLowerCase()).join(' ');

    expect(itemNames).not.toContain('tuna');
    expect(itemNames).not.toContain('peanut butter');
    expect(basket.substitutions.length).toBeGreaterThan(0);
  });

  it('returns simple meal ideas using basket ingredients', () => {
    const basket = generateBasket(basePreferences);

    expect(basket.meals.length).toBeGreaterThanOrEqual(3);
    expect(basket.meals[0]).toMatchObject({
      title: expect.any(String),
      steps: expect.any(Array),
    });
  });

  it('removes common gluten items when gluten free is selected', () => {
    const basket = generateBasket({ ...basePreferences, dietaryNeeds: ['Gluten free'] });
    const itemNames = basket.items.map((item) => item.name.toLowerCase()).join(' ');

    expect(itemNames).not.toContain('pasta');
    expect(itemNames).not.toContain('bread');
  });

  it('adds portable snack ideas for on-the-go and short lunch break needs', () => {
    const basket = generateBasket({ ...basePreferences, keyConsiderations: ['On-the-go', 'Short lunch breaks'] });
    const itemNames = basket.items.map((item) => item.name.toLowerCase()).join(' ');
    const mealTitles = basket.meals.map((meal) => meal.title.toLowerCase()).join(' ');

    expect(itemNames).toMatch(/apples|raisins|trail mix/);
    expect(mealTitles).toContain('grab-and-go snack pack');
    expect(basket.explanation.join(' ')).toMatch(/portable snacks/i);
  });
});
