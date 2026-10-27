const puppeteer = require('/Users/tzierrr/LabTrack/presentations/v1/code/node_modules/puppeteer-core');
const fs = require('fs');

async function generatePDF() {
  const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!fs.existsSync(executablePath)) {
    throw new Error('Google Chrome binary not found at ' + executablePath);
  }

  console.log('Launching Chrome from ' + executablePath);
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 2 });

  console.log('Navigating to http://127.0.0.1:5174/ ...');
  await page.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle0' });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');

  console.log('Emulating print media...');
  await page.emulateMediaType('print');

  const outputPath = '/Users/tzierrr/LabTrack/LabTrack_CCE_Presentation_v3.pdf';
  console.log('Rendering PDF to ' + outputPath);
  await page.pdf({
    path: outputPath,
    width: '16in',
    height: '9in',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true
  });

  await browser.close();
  console.log('PDF generated successfully at ' + outputPath);
}

generatePDF().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
