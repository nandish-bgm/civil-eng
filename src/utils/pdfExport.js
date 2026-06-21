import { jsPDF } from 'jspdf';
import { CURRENCY_SYMBOLS } from '../data/materials.js';

export function exportToPDF({ projectName, projectType, dimensions, grade, currency, materials, results }) {
  const doc = new jsPDF();
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  const fmt = (n) => `${sym}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const date = new Date().toLocaleDateString();

  let y = 20;
  const lm = 20;
  const pageW = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(216, 90, 48);
  doc.rect(0, 0, pageW, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('BuildCalc — Construction Cost Report', lm, 10);

  y = 24;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(16);
  doc.text(projectName || 'Untitled Project', lm, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${date}`, lm, y);

  y += 10;
  doc.setDrawColor(220, 220, 220);
  doc.line(lm, y, pageW - lm, y);

  // Project details
  y += 8;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Project Details', lm, y);
  y += 6;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);

  const details = [
    ['Type', projectType ? projectType.charAt(0).toUpperCase() + projectType.slice(1) : '-'],
    ['Dimensions', `${dimensions.length}m × ${dimensions.width}m × ${dimensions.thickness}m`],
    ['Volume', `${results.volume?.toFixed(3)} m³`],
    ['Area', `${results.area?.toFixed(2)} m²`],
    ['Quality Grade', grade ? grade.charAt(0).toUpperCase() + grade.slice(1) : '-'],
    ['Currency', currency],
  ];
  details.forEach(([k, v]) => {
    doc.setTextColor(80, 80, 80);
    doc.text(k + ':', lm, y);
    doc.setTextColor(30, 30, 30);
    doc.text(v, lm + 45, y);
    y += 6;
  });

  y += 4;
  doc.line(lm, y, pageW - lm, y);

  // Materials breakdown
  y += 8;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text('Materials Breakdown', lm, y);
  y += 6;

  // Table header
  doc.setFillColor(245, 245, 245);
  doc.rect(lm, y - 4, pageW - lm * 2, 8, 'F');
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Material', lm + 2, y);
  doc.text('Quantity', lm + 60, y);
  doc.text('Unit Price', lm + 100, y);
  doc.text('Cost', lm + 140, y);
  y += 6;

  doc.setFont(undefined, 'normal');
  doc.setTextColor(30, 30, 30);

  const addRow = (label, qty, unitPrice, cost) => {
    doc.text(label, lm + 2, y);
    doc.text(qty, lm + 60, y);
    doc.text(unitPrice, lm + 100, y);
    doc.text(cost, lm + 140, y);
    y += 7;
  };

  if (materials.concrete && results.concrete) {
    const c = results.concrete;
    addRow(
      `Concrete (${c.cementBags} cement bags)`,
      `${c.quantity.toFixed(3)} m³`,
      `${fmt(c.unitPrice)}/m³`,
      fmt(c.cost)
    );
  }
  if (materials.steel && results.steel) {
    const s = results.steel;
    addRow(
      `Steel Rebar (${(s.reinPct * 100).toFixed(1)}% reinf.)`,
      `${s.weight.toFixed(3)} t`,
      `${fmt(s.unitPrice)}/t`,
      fmt(s.cost)
    );
  }
  if (materials.bricks && results.bricks) {
    const b = results.bricks;
    addRow(
      `Bricks (${b.mortarBags} mortar bags)`,
      `${b.quantity.toLocaleString()} bricks`,
      `${fmt(b.unitPrice * 1000)}/1000`,
      fmt(b.cost)
    );
  }

  y += 2;
  doc.line(lm, y, pageW - lm, y);
  y += 8;

  // Total
  doc.setFillColor(216, 90, 48);
  doc.rect(lm, y - 5, pageW - lm * 2, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(11);
  doc.text('Grand Total', lm + 2, y);
  doc.text(fmt(results.total || 0), lm + 140, y);

  y += 18;
  doc.setTextColor(140, 140, 140);
  doc.setFont(undefined, 'italic');
  doc.setFontSize(9);
  doc.text('* Excludes labour & transport costs. Estimates only — verify with a qualified engineer.', lm, y);

  doc.save(`${(projectName || 'buildcalc').replace(/\s+/g, '-').toLowerCase()}-estimate.pdf`);
}
