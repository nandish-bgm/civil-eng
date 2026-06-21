import {
  BASE_PRICES,
  GRADE_MULTIPLIERS,
  CURRENCY_RATES,
  REINFORCEMENT_PCT,
} from '../data/materials.js';

export function calcVolume(length, width, thickness) {
  return length * width * thickness;
}

export function calcArea(length, width) {
  return length * width;
}

export function calcConcrete(volume, grade, currency) {
  const quantity = volume * 1.07;
  const cementBags = Math.ceil(quantity * 320 / 50);
  const unitPrice = BASE_PRICES.concrete * CURRENCY_RATES[currency];
  const cost = quantity * unitPrice * GRADE_MULTIPLIERS[grade].concrete;
  return { quantity, cementBags, unitPrice, cost };
}

export function calcSteel(volume, projectType, grade, currency) {
  const reinPct = REINFORCEMENT_PCT[projectType] || 0.015;
  const weight = volume * reinPct * 7850 / 1000 * 1.05;
  const unitPrice = BASE_PRICES.steel * CURRENCY_RATES[currency];
  const cost = weight * unitPrice * GRADE_MULTIPLIERS[grade].steel;
  return { weight, reinPct, unitPrice, cost };
}

export function calcBricks(area, grade, currency) {
  const quantity = Math.ceil(area * 60 * 1.10);
  const mortarBags = Math.ceil(quantity / 50);
  const unitPrice = BASE_PRICES.bricks * CURRENCY_RATES[currency];
  const cost = quantity * unitPrice * GRADE_MULTIPLIERS[grade].bricks;
  return { quantity, mortarBags, unitPrice, cost };
}

export function calcAll({ length, width, thickness, projectType, grade, currency, materials }) {
  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const t = parseFloat(thickness) || 0;

  const volume = calcVolume(l, w, t);
  const area = calcArea(l, w);

  const results = { volume, area };

  if (materials.concrete) {
    results.concrete = calcConcrete(volume, grade, currency);
  }
  if (materials.steel) {
    results.steel = calcSteel(volume, projectType, grade, currency);
  }
  if (materials.bricks) {
    results.bricks = calcBricks(area, grade, currency);
  }

  const total =
    (results.concrete?.cost || 0) +
    (results.steel?.cost || 0) +
    (results.bricks?.cost || 0);

  results.total = total;
  return results;
}
