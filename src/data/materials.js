export const BASE_PRICES = {
  concrete: 120,  // USD per m³
  steel: 850,     // USD per ton
  bricks: 0.6,    // USD per brick (600/1000)
};

export const GRADE_MULTIPLIERS = {
  standard: {
    concrete: 0.75,
    steel: 0.75,
    bricks: 0.75,
  },
  medium: {
    concrete: 1.0,
    steel: 1.0,
    bricks: 1.0,
  },
  premium: {
    concrete: 1.35,
    steel: 1.40,
    bricks: 1.30,
  },
};

export const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1540,
  KES: 129,
  INR: 83,
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NGN: '₦',
  KES: 'KSh',
  INR: '₹',
};

export const REINFORCEMENT_PCT = {
  slab: 0.015,
  column: 0.03,
  foundation: 0.02,
  wall: 0.01,
};

export const PROJECT_TYPES = [
  { value: 'slab', label: 'Floor Slab' },
  { value: 'wall', label: 'Wall' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'column', label: 'Column' },
];

export const GRADES = ['standard', 'medium', 'premium'];

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'INR'];
