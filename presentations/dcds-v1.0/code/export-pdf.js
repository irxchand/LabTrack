import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
  console.log('Starting internal Vite server for DCDS PDF export...');
  const server = await createServer({
    root: __dirname,
    server: { port: 5185, host: '127.0.0.1' },
    logLevel: 'error'
  });
  await server.listen();
  const address = server.httpServer.address();
  const port = address.port;
  console.log(`Vite server active on http://127.0.0.1:${port}/`);

  const chromeCandidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser'
  ];

  const executablePath = chromeCandidates.find(p => fs.existsSync(p));
  if (!executablePath) {
    throw new Error('Google Chrome binary not found on this system.');
  }

  console.log(`Launching Chrome from ${executablePath}...`);
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 2 });
  
  console.log(`Navigating to http://127.0.0.1:${port}/ ...`);
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle0' });

  // Emulate print media type so @media print CSS triggers
  await page.emulateMediaType('print');

  const pdfDir = path.resolve(__dirname, '..', 'pdf');
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  const outputPath = path.resolve(pdfDir, 'LabTrack_DCDS_Presentation_v1.0.pdf');

  console.log(`Rendering PDF to ${outputPath}...`);
  await page.pdf({
    path: outputPath,
    width: '16in',
    height: '9in',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true
  });

  await browser.close();
  await server.close();
  console.log('PDF generation complete! Successfully generated:');
  console.log(`- ${outputPath}`);
}

generatePDF().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
