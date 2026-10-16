import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(path.join(process.env.LABTRACK_NODE_MODULES||path.resolve('src/frontend/node_modules'),'package.json'));
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.LABTRACK_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const checks=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 async function login(id){await page.getByLabel('Account identifier').fill(id);await page.getByLabel('Password',{exact:true}).fill(process.env.LABTRACK_DEMO_PASSWORD||'DemoOnly2026!');await page.getByRole('button',{name:'Open workspace',exact:true}).click();await page.getByRole('heading',{name:'Everything in its place.'}).waitFor();}
 await page.goto('http://127.0.0.1:8000');await login('DEMO-STU-001');
 for(const mode of ['old401','oldSuccess']){
  let signalStarted,release;const started=new Promise(r=>signalStarted=r),held=new Promise(r=>release=r);
  let intercept=true;
  const handler=async route=>{
   if(!intercept){await route.continue();return;}
   intercept=false;
   const response=mode==='oldSuccess'?await route.fetch():null;
   signalStarted();await held;
   if(response)await route.fulfill({response});
   else await route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({error:{code:'UNAUTHENTICATED',message:'Delayed old session expired'}})});
  };
  await page.route('**/api/requests',handler);
  await page.getByRole('button',{name:'Refresh workspace',exact:true}).click();await started;
  await page.getByRole('button',{name:'Sign out',exact:true}).click();await login('T00003');
  await page.getByRole('button',{name:'Reports',exact:true}).waitFor();
  const oldResponse=page.waitForResponse(r=>r.url().endsWith('/api/requests')&&r.request().method()==='GET');release();await oldResponse;
  // Allow the delayed fetch body and React state callbacks to settle, then assert the new role remains.
  await page.waitForTimeout(250);
  if(await page.getByLabel('Account identifier').count())throw new Error(`${mode} cleared the newer login`);
  await page.getByRole('button',{name:'Reports',exact:true}).click();await page.getByRole('heading',{name:'Hardware in use.'}).waitFor();
  await page.unroute('**/api/requests',handler);checks.push(`${mode}: delayed previous session cannot clear or overwrite HoD workspace`);
  await page.getByRole('button',{name:'Sign out',exact:true}).click();await login('DEMO-STU-001');
  if(await page.getByRole('button',{name:'Reports',exact:true}).count())throw new Error('Previous faculty navigation leaked into student session');
 }
 const unavailable=route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:{code:'DATABASE_UNAVAILABLE',message:'Temporary test outage'}})});
 await page.route('**/api/requests',unavailable);
 await page.getByRole('button',{name:'Refresh workspace',exact:true}).click();await page.getByRole('alert').filter({hasText:'Temporary test outage'}).waitFor();
 if(await page.getByLabel('Account identifier').count())throw new Error('Transient outage cleared valid login');
 await page.unroute('**/api/requests',unavailable);checks.push('Transient refresh outage preserves valid login and shows an error');
 if(errors.length)throw new Error(errors.join('; '));
 await fs.writeFile('.artifacts/browser/session-regression.json',JSON.stringify({status:'PASS',checks,browserErrors:errors},null,2));console.log(`PASS: ${checks.length} deterministic session regression scenarios`);
}finally{await browser.close();}
