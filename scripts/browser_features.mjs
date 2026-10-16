import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(path.join(process.env.LABTRACK_NODE_MODULES||path.resolve('src/frontend/node_modules'),'package.json'));
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.LABTRACK_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function login(identifier){await page.getByLabel('Account identifier').fill(identifier);await page.getByLabel('Password',{exact:true}).fill(process.env.LABTRACK_DEMO_PASSWORD||'DemoOnly2026!');await page.getByRole('button',{name:'Open workspace',exact:true}).click();await page.getByRole('heading',{name:'Everything in its place.'}).waitFor();}
 await page.goto('http://127.0.0.1:8000');await login('DEMO-STU-001');await page.getByRole('button',{name:'Catalogue',exact:true}).click();await page.getByPlaceholder('Search components, categories or brands…').fill('HC-SR04');await page.getByRole('button',{name:'Explore catalogue alternatives'}).click();await page.getByRole('heading',{name:'Waterproof Sensor JSN-SR04T'}).waitFor();
 await page.screenshot({path:'.artifacts/browser/13-curated-alternatives.png'});await page.getByRole('button',{name:'Close dialog',exact:true}).click();
 await page.getByPlaceholder('Search components, categories or brands…').fill('Thermal imaging module');await page.getByRole('button',{name:'Record unmet component demand'}).click();await page.getByRole('dialog').getByLabel('Quantity needed').fill('3');await page.getByRole('dialog').getByRole('button',{name:'Record demand',exact:true}).click();await page.getByRole('dialog').waitFor({state:'hidden'});
 await page.getByRole('button',{name:'Sign out',exact:true}).click();await login('T00003');await page.getByRole('button',{name:'Reports',exact:true}).click();
 for(let attempt=0;attempt<5;attempt++){
  if(await page.getByRole('cell',{name:'Thermal imaging module',exact:true}).count())break;
  await page.waitForTimeout(2500);await page.getByRole('button',{name:'Refresh workspace',exact:true}).click();
 }
 await page.getByRole('cell',{name:'Thermal imaging module',exact:true}).waitFor();await page.screenshot({path:'.artifacts/browser/14-demand-report.png'});
 await page.getByRole('button',{name:'Incidents',exact:true}).click();await page.getByRole('heading',{name:'Condition, with context.'}).waitFor();
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByRole('heading',{name:'Sign in to LabTrack'}).waitFor();
 if(errors.length)throw new Error(errors.join('; '));
 await fs.writeFile('.artifacts/browser/feature-evidence.json',JSON.stringify({status:'PASS',checks:['live curated alternatives','unstocked demand form','outbox worker projection','HoD demand reporting','faculty incident screen','mobile sign-out','no browser exceptions']},null,2));console.log('PASS: seven additional browser feature checks');
}finally{await browser.close();}
