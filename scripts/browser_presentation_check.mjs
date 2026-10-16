import fs from 'node:fs/promises';import path from 'node:path';import {createRequire} from 'node:module';import {pathToFileURL} from 'node:url';
const require=createRequire(path.join(process.env.LABTRACK_NODE_MODULES||path.resolve('src/frontend/node_modules'),'package.json'));const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.LABTRACK_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve('presentations/v2/output/LabTrack_Execution_Presentation_v2.2.html')).href);
 if(await page.locator('.slide').count()!==22)throw new Error('Slide count');
 await page.evaluate(async()=>{await Promise.all([...document.querySelectorAll('.slide img')].map(i=>i.decode()));});
 await page.screenshot({path:'.artifacts/presentation-build/browser-cover.png'});
 await page.getByRole('button',{name:'Next slide'}).click();if(await page.locator('#position').textContent()!=='2 / 22')throw new Error('Next control');
 await page.keyboard.press('End');if(await page.locator('#position').textContent()!=='22 / 22')throw new Error('End key');
 await page.keyboard.press('Home');await page.getByRole('button',{name:'Notes',exact:true}).click();await page.locator('#notes').waitFor({state:'visible'});
 if(!(await page.locator('#notes').textContent()).includes('Source:'))throw new Error('Source notes absent');
 await page.keyboard.press('Escape');await page.setViewportSize({width:390,height:844});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Mobile overflow');
 await page.screenshot({path:'.artifacts/presentation-build/browser-mobile.png'});
 if(errors.length)throw new Error(errors.join('; '));
 await fs.writeFile('.artifacts/presentation-build/browser-validation.json',JSON.stringify({status:'PASS',slides:22,checks:['all embedded images decode','next button','Home/End navigation','speaker source notes','mobile viewport no overflow','no browser exceptions'],errors},null,2));console.log('PASS: self-contained 22-slide browser presentation');
}finally{await browser.close();}
