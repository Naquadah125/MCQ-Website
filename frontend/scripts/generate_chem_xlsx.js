const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const csvPath = path.resolve(__dirname, '../../data/mcq_questions_chem_12.csv');
const outPath = path.resolve(__dirname, '../../data/mcq_questions_chem_12.xlsx');

try {
  const csv = fs.readFileSync(csvPath, 'utf8');
  const ws = XLSX.utils.csv_to_sheet(csv);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, outPath);
  console.log('Wrote', outPath);
} catch (err) {
  console.error('Failed to generate xlsx:', err);
  process.exit(1);
}
