import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(path.join(process.env.LABTRACK_NODE_MODULES||path.resolve('src/frontend/node_modules'),'package.json'));
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.LABTRACK_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:900}});
const cleanupLogin=await context.request.post('http://127.0.0.1:8000/api/auth/login',{data:{identifier:'N00001',password:process.env.LABTRACK_DEMO_PASSWORD||'DemoOnly2026!'}});
const cleanupHeaders={Authorization:'Bearer '+(await cleanupLogin.json()).token,'Idempotency-Key':crypto.randomUUID()};
const previous=await context.request.get('http://127.0.0.1:8000/api/requests',{headers:cleanupHeaders});
for(const r of await previous.json()){
 if(r.project_name.startsWith('Browser-validated Rover ')&&['ISSUED','IN_USE'].includes(r.state)){
  const response=await context.request.post(`http://127.0.0.1:8000/api/requests/${r.id}/return`,{headers:{...cleanupHeaders,'Idempotency-Key':crypto.randomUUID()},data:{lines:r.lines.map(l=>({line_id:l.id,asset_conditions:Object.fromEntries(l.barcodes.map(b=>[b,'GOOD'])),functional:'PASS'})),remarks:'Synthetic browser-test recovery after interrupted test'}});
  if(!response.ok())throw new Error('Could not reconcile interrupted synthetic browser test');
 }
}
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const output=path.resolve('.artifacts/browser');await fs.mkdir(output,{recursive:true});
const screenshots=[];
async function shot(name){await page.screenshot({path:path.join(output,name+'.png'),fullPage:false});screenshots.push(name);console.log('Captured '+name);}
async function login(identifier){await page.getByLabel('Account identifier').fill(identifier);await page.getByLabel('Password',{exact:true}).fill(process.env.LABTRACK_DEMO_PASSWORD||'DemoOnly2026!');await page.getByRole('button',{name:'Open workspace',exact:true}).click();await page.getByRole('heading',{name:'Everything in its place.'}).waitFor();}
async function logout(){await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByRole('heading',{name:'Sign in to LabTrack'}).waitFor();}
await page.goto('http://127.0.0.1:8000');await page.getByRole('heading',{name:'Sign in to LabTrack'}).waitFor();await shot('01-login');
await login('DEMO-STU-001');await shot('02-overview');
await page.getByRole('button',{name:'Catalogue',exact:true}).click();await page.getByRole('heading',{name:'Find your next component.'}).waitFor();await shot('03-catalogue');
await page.getByRole('button',{name:'Projects',exact:true}).click();await page.getByRole('button',{name:'Create project',exact:true}).click();
const projectName='Browser-validated Rover '+Date.now();await page.getByLabel('Project name',{exact:true}).fill(projectName);await page.getByLabel('Description',{exact:true}).fill('Synthetic UI lifecycle validation');await page.getByRole('dialog').getByRole('button',{name:'Create project'}).click();await page.getByRole('dialog').waitFor({state:'hidden'});await shot('04-projects');
await page.getByRole('button',{name:'Catalogue',exact:true}).click();await page.getByPlaceholder('Search components, categories or brands…').fill('Jetson');await page.getByRole('button',{name:'Add to request',exact:true}).click();await page.getByRole('button',{name:/Review request/}).click();
await page.getByRole('dialog').getByRole('button',{name:'Submit for faculty review'}).click();await page.getByRole('dialog').waitFor({state:'hidden'});
await page.getByRole('button',{name:new RegExp(projectName)}).first().click();await page.locator('.request-summary').getByText('Mentor review').waitFor();
const requestHeading=await page.getByRole('heading',{name:/Request #/}).innerText();const rid=Number(requestHeading.match(/\d+/)[0]);await shot('05-request-pending');
for(const identifier of ['T00001','T00002','T00003']){
 await logout();await login(identifier);await page.getByRole('button',{name:/^Requests/}).click();await page.getByRole('button',{name:new RegExp(projectName)}).first().click();await page.getByRole('button',{name:'Approve',exact:true}).waitFor();
 if(identifier==='T00003')await shot('06-hod-review');
 await page.getByRole('button',{name:'Approve',exact:true}).click();await page.getByRole('status').filter({hasText:'Approval recorded'}).waitFor();
}
await logout();await login('N00001');await page.getByRole('button',{name:/^Requests/}).click();await page.getByRole('button',{name:new RegExp(projectName)}).first().click();await page.getByRole('button',{name:'Claim order',exact:true}).click();await page.getByLabel('Barcode 1 for Jetson Nano').waitFor();await page.getByLabel('Barcode 1 for Jetson Nano').selectOption({index:1});await page.getByLabel('All approved items are physically verified and ready for the full handover.').check();await page.getByRole('button',{name:'Confirm full issue'}).click();await page.getByRole('button',{name:'Inspect & reconcile'}).waitFor();await shot('07-active-asset');
await page.getByRole('button',{name:'Inspect & reconcile'}).click();await page.getByRole('dialog').waitFor();await page.getByLabel('Functional test',{exact:true}).selectOption('PASS');await shot('08-return-inspection');await page.getByRole('button',{name:'Reconcile full return'}).click();await page.getByRole('dialog').waitFor({state:'hidden'});await page.locator('.request-summary').getByText('Closed',{exact:true}).waitFor();await shot('09-return-timeline');
await logout();await login('DEMO-STU-001');
await page.getByRole('button',{name:'Reservations',exact:true}).click();await shot('10-reservations');
await page.getByRole('button',{name:'Notifications',exact:true}).click();await shot('11-notifications');
await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Catalogue',exact:true}).click();await page.getByRole('heading',{name:'Find your next component.'}).waitFor();await shot('12-mobile-catalogue');
const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
if(overflow)throw new Error('Mobile viewport has horizontal overflow');
if(errors.length)throw new Error('Browser errors: '+errors.join('; '));
await fs.writeFile(path.join(output,'browser-evidence.json'),JSON.stringify({status:'PASS',request_id:rid,project:projectName,screenshots,checks:['UI login','UI project create','UI asset request','mentor/incharge/HoD approval','claim','physical issue','return inspection','timeline','responsive viewport','no uncaught errors'],errors},null,2));
await browser.close();console.log(JSON.stringify({status:'PASS',request_id:rid,screenshots:screenshots.length}));
