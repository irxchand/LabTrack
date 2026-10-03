import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
  console.log('Launching browser to generate PDF...');
  
  const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 2 });
  
  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Emulate print media type so @media print CSS triggers
  await page.emulateMediaType('print');

  const outputPath = path.resolve(__dirname, '..', 'pdf', 'LabTrack_Pitch_Deck_v1.pdf');

  console.log(`Generating PDF at ${outputPath}...`);
  await page.pdf({
    path: outputPath,
    width: '16in',
    height: '9in',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true
  });

  await browser.close();
  console.log('PDF generation complete!');
}

generatePDF().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
