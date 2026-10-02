import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8090/index.html',{waitUntil:'load'});await page.evaluate(()=>window.__filmReady);
await fs.mkdir('output/frames',{recursive:true});
const times=[1.8,4.0,8.2,11.4,13.6,15.25,16.8,19.4,21.1,24.2,26.0,28.4,30.3,31.8,34.0,35.6,36.8,38.2,39.5,41,43.3,46,47.25];
const hashes={};const frames=[];
for(const t of times){await page.evaluate(t=>{window.__timelines.main.seek(t,false);},t);const actual=await page.evaluate(()=>({time:window.__filmTime,shot:window.__shot,bubbles:window.__bubbleBounds}));if(Math.abs(actual.time-t)>.0001)throw Error(`Timeline stuck ${t} ${actual.time}`);const data=await page.screenshot({timeout:15000,path:`output/frames/${t.toFixed(2)}.png`});hashes[t]=crypto.createHash('sha256').update(data).digest('hex');frames.push({time:t,...actual});}
await page.evaluate(()=>{window.__timelines.main.seek(8.2,true);});const repeat=await page.screenshot({timeout:15000});if(crypto.createHash('sha256').update(repeat).digest('hex')!==hashes[8.2])throw Error('Frame is not deterministic when callbacks suppressed');
await fs.writeFile('output/browser-check.json',JSON.stringify({errors,deterministic:true,frames},null,2));await browser.close();if(errors.length)throw Error(errors.join('\n'));console.log(`Verified ${times.length} frames, deterministic seek, no JavaScript errors.`);
