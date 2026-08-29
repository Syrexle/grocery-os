export type PilotStore = {
  id: string;
  name: string;
  brand: string;
  address: string;
  zipCode: string;
  distanceMiles: number;
  priceLevel: 'budget' | 'standard' | 'premium';
  pickupAvailable: boolean;
  notes: string;
};

export type PilotPriceOverride = {
  itemId: string;
  estimatedPrice: number;
  source: 'manual-pilot-estimate';
  confidence: 'low' | 'medium' | 'high';
};

export const pilotZip = '30022';

// Manual MVP seed data for the 30022 Johns Creek / Alpharetta pilot.
// Store locations seeded from OpenStreetMap results; prices are conservative
// starter estimates until retailer feeds or receipt checks are connected.
export const pilotStores30022: PilotStore[] = [
  {
    id: 'aldi-jones-bridge',
    name: 'ALDI - Jones Bridge Road',
    brand: 'ALDI',
    address: '10955 Jones Bridge Road, Johns Creek, GA',
    zipCode: pilotZip,
    distanceMiles: 2.2,
    priceLevel: 'budget',
    pickupAvailable: true,
    notes: 'Best first pass for a low-cost basket.',
  },
  {
    id: 'kroger-state-bridge',
    name: 'Kroger - State Bridge Road',
    brand: 'Kroger',
    address: '10945 State Bridge Road, Johns Creek, GA',
    zipCode: pilotZip,
    distanceMiles: 2.6,
    priceLevel: 'standard',
    pickupAvailable: true,
    notes: 'Good for digital coupons and familiar staples.',
  },
  {
    id: 'publix-haynes-bridge',
    name: 'Publix - Haynes Bridge Road',
    brand: 'Publix',
    address: '9925 Haynes Bridge Road, Alpharetta, GA',
    zipCode: pilotZip,
    distanceMiles: 3.1,
    priceLevel: 'standard',
    pickupAvailable: true,
    notes: 'Useful backup store with broad availability.',
  },
  {
    id: 'walmart-mansell',
    name: 'Walmart Supercenter - Mansell Road',
    brand: 'Walmart',
    address: '970 Mansell Road, Roswell, GA',
    zipCode: pilotZip,
    distanceMiles: 5.8,
    priceLevel: 'budget',
    pickupAvailable: true,
    notes: 'Strong fallback for pantry staples and pickup.',
  },
  {
    id: 'h-mart-abbotts',
    name: 'H Mart - Abbotts Bridge Road',
    brand: 'H Mart',
    address: '10820 Abbotts Bridge Road, Johns Creek, GA',
    zipCode: pilotZip,
    distanceMiles: 2.8,
    priceLevel: 'standard',
    pickupAvailable: false,
    notes: 'Good for rice, produce, tofu, and cultural food preferences.',
  },
];

export const pilotPriceBook30022: PilotPriceOverride[] = [
  { itemId: 'oats', estimatedPrice: 3.35, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'bananas', estimatedPrice: 1.65, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'apples', estimatedPrice: 3.89, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'raisins', estimatedPrice: 3.39, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'rice', estimatedPrice: 2.95, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'beans', estimatedPrice: 4.56, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'eggs', estimatedPrice: 3.85, source: 'manual-pilot-estimate', confidence: 'low' },
  { itemId: 'frozen-veg', estimatedPrice: 3.78, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'potatoes', estimatedPrice: 4.25, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'pasta', estimatedPrice: 1.75, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'tomatoes', estimatedPrice: 2.70, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'peanut-butter', estimatedPrice: 2.85, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'bread', estimatedPrice: 2.35, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'yogurt', estimatedPrice: 4.15, source: 'manual-pilot-estimate', confidence: 'low' },
  { itemId: 'tuna', estimatedPrice: 3.96, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'carrots', estimatedPrice: 2.15, source: 'manual-pilot-estimate', confidence: 'medium' },
  { itemId: 'lentils', estimatedPrice: 2.15, source: 'manual-pilot-estimate', confidence: 'medium' },
];
