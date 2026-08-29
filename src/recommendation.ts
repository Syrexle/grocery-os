import { pilotPriceBook30022, pilotStores30022, pilotZip, type PilotStore } from './pilotData';

export type UserPreferences = {
  zipCode: string;
  weeklyBudget: number;
  householdSize: number;
  days: number;
  dietaryNeeds: string[];
  dislikes: string[];
  cookingLimitations: string[];
  keyConsiderations: string[];
  preferredStore: string;
};

export type GroceryItem = {
  id: string;
  name: string;
  category: 'protein' | 'grain' | 'produce' | 'breakfast' | 'dairy' | 'pantry' | 'snack';
  quantity: string;
  estimatedPrice: number;
  servings: number;
  tags: string[];
  why: string;
  confidence?: 'low' | 'medium' | 'high';
};

export type MealIdea = {
  title: string;
  ingredients: string[];
  steps: string[];
  timeMinutes: number;
};

export type Substitution = {
  avoid: string;
  use: string;
  reason: string;
};

export type Basket = {
  store: string;
  storeAddress: string;
  nearbyStores: PilotStore[];
  zipCode: string;
  budget: number;
  estimatedTotal: number;
  budgetBuffer: number;
  priceConfidence: 'pilot estimate' | 'generic estimate';
  dataFreshness: string;
  items: GroceryItem[];
  meals: MealIdea[];
  substitutions: Substitution[];
  explanation: string[];
};

const stapleCatalog: GroceryItem[] = [
  { id: 'oats', name: 'Old-fashioned oats', category: 'breakfast', quantity: '1 container', estimatedPrice: 3.49, servings: 10, tags: ['vegetarian', 'fiber', 'no-stove'], why: 'Low-cost breakfast with fiber.' },
  { id: 'bananas', name: 'Bananas', category: 'produce', quantity: '1 bunch', estimatedPrice: 1.75, servings: 6, tags: ['fruit', 'easy', 'no-cook', 'portable'], why: 'Cheap fruit that needs no cooking.' },
  { id: 'apples', name: 'Apples', category: 'snack', quantity: '3 lb bag', estimatedPrice: 3.99, servings: 10, tags: ['fruit', 'no-cook', 'portable'], why: 'Portable snack for work, school, or errands.' },
  { id: 'raisins', name: 'Raisins or trail mix packs', category: 'snack', quantity: '1 bag', estimatedPrice: 3.49, servings: 8, tags: ['snack', 'portable', 'no-cook'], why: 'Easy to carry for short breaks or busier days.' },
  { id: 'rice', name: 'Brown rice', category: 'grain', quantity: '2 lb bag', estimatedPrice: 2.79, servings: 18, tags: ['vegetarian', 'bulk'], why: 'Filling base for several meals.' },
  { id: 'beans', name: 'Canned black beans', category: 'protein', quantity: '4 cans', estimatedPrice: 4.76, servings: 8, tags: ['vegetarian', 'fiber', 'microwave'], why: 'Affordable protein and fiber.' },
  { id: 'eggs', name: 'Eggs', category: 'protein', quantity: '1 dozen', estimatedPrice: 3.49, servings: 6, tags: ['quick', 'low-sugar'], why: 'Flexible protein for breakfast or dinner.' },
  { id: 'frozen-veg', name: 'Frozen mixed vegetables', category: 'produce', quantity: '2 bags', estimatedPrice: 3.98, servings: 8, tags: ['vegetarian', 'microwave'], why: 'Usually cheaper than fresh and still nutritious.' },
  { id: 'potatoes', name: 'Potatoes', category: 'grain', quantity: '5 lb bag', estimatedPrice: 3.99, servings: 10, tags: ['bulk', 'low-sodium'], why: 'Filling, flexible, and inexpensive.' },
  { id: 'pasta', name: 'Whole wheat pasta', category: 'grain', quantity: '1 box', estimatedPrice: 1.69, servings: 8, tags: ['quick', 'vegetarian'], why: 'Easy base for fast meals.' },
  { id: 'tomatoes', name: 'Canned tomatoes', category: 'pantry', quantity: '2 cans', estimatedPrice: 2.58, servings: 6, tags: ['vegetarian'], why: 'Adds flavor to pasta, rice, and beans.' },
  { id: 'peanut-butter', name: 'Peanut butter', category: 'protein', quantity: '1 jar', estimatedPrice: 2.99, servings: 14, tags: ['snack', 'no-cook'], why: 'Cheap protein for toast, oats, or snacks.' },
  { id: 'bread', name: 'Whole wheat bread', category: 'grain', quantity: '1 loaf', estimatedPrice: 2.49, servings: 12, tags: ['easy', 'no-cook'], why: 'Simple base for sandwiches and toast.' },
  { id: 'yogurt', name: 'Plain yogurt tub', category: 'dairy', quantity: '32 oz tub', estimatedPrice: 3.99, servings: 5, tags: ['breakfast', 'no-cook'], why: 'Cheaper than single-serve cups.' },
  { id: 'tuna', name: 'Canned tuna', category: 'protein', quantity: '3 cans', estimatedPrice: 3.87, servings: 6, tags: ['quick', 'no-cook'], why: 'Shelf-stable protein for sandwiches or bowls.' },
  { id: 'carrots', name: 'Carrots', category: 'produce', quantity: '2 lb bag', estimatedPrice: 2.29, servings: 8, tags: ['snack', 'no-cook'], why: 'Crunchy low-cost vegetable for meals or snacks.' },
  { id: 'lentils', name: 'Dry lentils', category: 'protein', quantity: '1 lb bag', estimatedPrice: 1.99, servings: 10, tags: ['vegetarian', 'bulk'], why: 'Very low-cost protein for soups and bowls.' },
];

const replacements: Record<string, Substitution> = {
  tuna: { avoid: 'Canned tuna', use: 'Eggs or lentils', reason: 'Both are affordable protein options.' },
  'peanut butter': { avoid: 'Peanut butter', use: 'Eggs or yogurt', reason: 'Good protein alternatives if peanuts are disliked or unsafe.' },
  eggs: { avoid: 'Eggs', use: 'Beans or lentils', reason: 'Plant proteins are usually affordable and filling.' },
  pork: { avoid: 'Pork', use: 'Beans, lentils, tuna, or eggs', reason: 'Keeps protein affordable without pork.' },
};

const storePriceFactor: Record<string, number> = {
  ALDI: 0.95,
  Walmart: 0.97,
  Kroger: 1,
  Publix: 1.06,
  'H Mart': 1.02,
  Generic: 1,
};

function isPilotZip(zipCode: string) {
  return zipCode.trim() === pilotZip;
}

export function getAvailableStores(zipCode: string): PilotStore[] {
  if (isPilotZip(zipCode)) return pilotStores30022;
  return [
    {
      id: 'generic-budget-store',
      name: 'Nearby budget-friendly store',
      brand: 'Generic',
      address: `Near ${zipCode || 'your ZIP code'}`,
      zipCode: zipCode || 'unknown',
      distanceMiles: 0,
      priceLevel: 'budget',
      pickupAvailable: false,
      notes: 'Generic fallback until this ZIP has a local price book.',
    },
  ];
}

function selectStore(preferences: UserPreferences) {
  const stores = getAvailableStores(preferences.zipCode);
  const preferred = preferences.preferredStore.toLowerCase();
  return stores.find((store) => store.brand.toLowerCase() === preferred || store.name.toLowerCase().includes(preferred)) ?? stores[0];
}

function getPilotPrice(item: GroceryItem, store: PilotStore, zipCode: string): GroceryItem {
  const pilotOverride = isPilotZip(zipCode) ? pilotPriceBook30022.find((entry) => entry.itemId === item.id) : undefined;
  const basePrice = pilotOverride?.estimatedPrice ?? item.estimatedPrice;
  const multiplier = storePriceFactor[store.brand] ?? storePriceFactor.Generic;

  return {
    ...item,
    estimatedPrice: Number((basePrice * multiplier).toFixed(2)),
    confidence: pilotOverride?.confidence ?? 'low',
  };
}

function isDisliked(item: GroceryItem, dislikes: string[]) {
  const haystack = `${item.id} ${item.name}`.toLowerCase();
  return dislikes.some((dislike) => haystack.includes(dislike.toLowerCase()));
}

function conflictsWithDiet(item: GroceryItem, dietaryNeeds: string[]) {
  const needs = dietaryNeeds.map((need) => need.toLowerCase());
  if (needs.includes('vegetarian')) return ['tuna'].includes(item.id) === true;
  if (needs.includes('dairy-free')) return item.category === 'dairy';
  if (needs.includes('gluten free')) return ['pasta', 'bread'].includes(item.id);
  if (needs.includes('low sodium')) return item.id === 'tuna' || item.id === 'tomatoes';
  return false;
}

function requiredCategoryMissing(items: GroceryItem[], category: GroceryItem['category']) {
  return !items.some((item) => item.category === category);
}

export function generateBasket(preferences: UserPreferences): Basket {
  const store = selectStore(preferences);
  const targetSpend = preferences.weeklyBudget * 0.94;
  const selected: GroceryItem[] = [];
  const substitutions: Substitution[] = [];
  const keyConsiderations = preferences.keyConsiderations.map((item) => item.toLowerCase());
  const needsPortableFood = keyConsiderations.some((item) => item.includes('on-the-go') || item.includes('short lunch'));
  let total = 0;

  for (const catalogItem of stapleCatalog) {
    const item = getPilotPrice(catalogItem, store, preferences.zipCode);
    if (isDisliked(item, preferences.dislikes) || conflictsWithDiet(item, preferences.dietaryNeeds)) {
      const matched = preferences.dislikes.find((dislike) => `${item.id} ${item.name}`.toLowerCase().includes(dislike.toLowerCase()));
      const replacement = matched ? replacements[matched.toLowerCase()] : undefined;
      if (replacement) substitutions.push(replacement);
      if (item.id === 'tuna') substitutions.push({ avoid: 'Tuna', use: 'Lentils or eggs', reason: 'Keeps the basket protein-rich while respecting preferences.' });
      continue;
    }

    const microwaveOnly = preferences.cookingLimitations.some((limit) => limit.toLowerCase().includes('microwave'));
    if (microwaveOnly && ['rice', 'potatoes', 'lentils'].includes(item.id)) continue;

    const wouldStayWithinTarget = total + item.estimatedPrice <= targetSpend;
    const requiredCategories = needsPortableFood
      ? ['protein', 'grain', 'produce', 'breakfast', 'snack']
      : ['protein', 'grain', 'produce', 'breakfast'];
    const fillsRequiredCategory = requiredCategories.some(
      (category) => item.category === category && requiredCategoryMissing(selected, category as GroceryItem['category'])
    );

    if (wouldStayWithinTarget || fillsRequiredCategory) {
      selected.push(item);
      total += item.estimatedPrice;
    }
  }

  const estimatedTotal = Number(total.toFixed(2));
  const pilot = isPilotZip(preferences.zipCode);

  return {
    store: store.name,
    storeAddress: store.address,
    nearbyStores: getAvailableStores(preferences.zipCode),
    zipCode: preferences.zipCode,
    budget: preferences.weeklyBudget,
    estimatedTotal,
    budgetBuffer: Number((preferences.weeklyBudget - estimatedTotal).toFixed(2)),
    priceConfidence: pilot ? 'pilot estimate' : 'generic estimate',
    dataFreshness: pilot ? '30022 pilot seed data · verify before checkout' : 'Generic estimate · add a local price book for accuracy',
    items: selected,
    meals: buildMealIdeas(selected, preferences.cookingLimitations, preferences.keyConsiderations),
    substitutions: substitutions.length > 0 ? substitutions : [
      { avoid: 'Fresh berries', use: 'Bananas, apples, or frozen fruit', reason: 'Usually cheaper per serving and easier to pack.' },
      { avoid: 'Chicken breast', use: 'Beans, eggs, lentils, or tuna', reason: 'Lower-cost protein choices.' },
    ],
    explanation: [
      `This basket leaves about $${(preferences.weeklyBudget - estimatedTotal).toFixed(2)} spare in case prices are higher in the store.`,
      pilot ? 'It uses a starter price book and nearby stores for the 30022 pilot ZIP.' : 'It uses generic starter prices until this area has a local price book.',
      needsPortableFood ? 'It adds portable snacks and quick lunch ideas for busy days, errands, work, or school.' : 'It prioritizes affordable staples that can work across multiple meals.',
      'Frozen and shelf-stable foods help reduce waste while keeping meals practical.',
    ],
  };
}

function has(items: GroceryItem[], text: string) {
  return items.some((item) => item.name.toLowerCase().includes(text));
}

function buildMealIdeas(items: GroceryItem[], cookingLimitations: string[], keyConsiderations: string[]): MealIdea[] {
  const meals: MealIdea[] = [];
  const microwaveOnly = cookingLimitations.some((limit) => limit.toLowerCase().includes('microwave'));
  const considerations = keyConsiderations.map((item) => item.toLowerCase());
  const needsPortableFood = considerations.some((item) => item.includes('on-the-go') || item.includes('short lunch'));

  if (needsPortableFood && (has(items, 'banana') || has(items, 'apple') || has(items, 'raisins'))) {
    meals.push({
      title: 'Grab-and-go snack pack',
      ingredients: ['Bananas or apples', 'Raisins or trail mix', 'Peanut butter or yogurt if included'],
      steps: ['Pack one fruit.', 'Add a small protein or snack portion.', 'Keep it ready for errands, work, school, or a short lunch break.'],
      timeMinutes: 3,
    });
  }

  if (needsPortableFood && (has(items, 'tuna') || has(items, 'beans') || has(items, 'bread'))) {
    meals.push({
      title: 'Short-break lunch bowl',
      ingredients: ['Beans or tuna', 'Frozen vegetables or carrots', 'Rice, bread, or potatoes if included'],
      steps: ['Pack the protein in a small container.', 'Add vegetables or fruit on the side.', 'Choose the fastest base you have available.'],
      timeMinutes: 7,
    });
  }

  if (has(items, 'oats')) {
    meals.push({
      title: microwaveOnly ? 'Microwave oatmeal bowl' : 'Oatmeal bowl',
      ingredients: ['Old-fashioned oats', 'Bananas', 'Peanut butter if included'],
      steps: ['Cook oats with water or milk.', 'Top with sliced banana.', 'Add peanut butter for extra protein if available.'],
      timeMinutes: 8,
    });
  }

  if (has(items, 'rice') && has(items, 'beans')) {
    meals.push({
      title: 'Rice and bean bowl',
      ingredients: ['Brown rice', 'Black beans', 'Frozen mixed vegetables', 'Canned tomatoes'],
      steps: ['Cook rice.', 'Warm beans, vegetables, and tomatoes together.', 'Serve over rice.'],
      timeMinutes: 25,
    });
  }

  if (has(items, 'pasta')) {
    meals.push({
      title: 'Simple tomato pasta',
      ingredients: ['Whole wheat pasta', 'Canned tomatoes', 'Frozen mixed vegetables'],
      steps: ['Boil pasta.', 'Warm tomatoes and vegetables.', 'Mix together and save leftovers.'],
      timeMinutes: 20,
    });
  }

  if (has(items, 'eggs')) {
    meals.push({
      title: 'Eggs with toast or potatoes',
      ingredients: ['Eggs', 'Whole wheat bread or potatoes', 'Fruit or carrots'],
      steps: ['Cook eggs your preferred way.', 'Add toast or potatoes.', 'Serve with fruit or carrots.'],
      timeMinutes: 12,
    });
  }

  if (meals.length < 3 && has(items, 'bread')) {
    meals.push({
      title: 'No-cook toast plate',
      ingredients: ['Whole wheat bread', 'Peanut butter or yogurt', 'Bananas or carrots'],
      steps: ['Toast bread if possible.', 'Add protein.', 'Serve with fruit or vegetables.'],
      timeMinutes: 5,
    });
  }

  return meals.slice(0, 4);
}
