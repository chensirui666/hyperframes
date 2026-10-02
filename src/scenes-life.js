import {actor} from './actors.js';
import {W,H,INK,CREAM,paper,poly,line,ellipse,star,cover,bubble,sparkLence,mountains,skyStars} from './art.js';
import {clamp,lerp,out,smooth,rand,DIALOGUE} from './timeline.js';
const ids=['red','yellow','blue','green','purple'];
const dialogue=(speaker,t)=>DIALOGUE.find(d=>d.speaker===speaker&&t>=d.start&&t<d.end);
export function home(c,t,img){
 cover(c,img.home,1.015+Math.min(t,3)*.007,.4,.5);
 const bob=Math.sin(t*1.9)*2;
 if(t<3){
  ellipse(c,603,801,123,20,'#3b302437');actor(c,'red',610,805+bob,4.0,{pose:'sit',t,rotation:-.08,face:t<.8?'sleep':'normal'});
  // TV's meteor gently pulses, so the announcement is part of the set.
  c.save();c.globalAlpha=.1+.035*Math.sin(t*5);poly(c,[[1517,202],[1872,146],[1874,536],[1514,512]],'#8ab7fc',null);c.restore();
  const d=dialogue('tv',t);if(d)bubble(c,d.text,1000,75,735,1700,360,{p:(t-d.start)/.2,font:52});
 }else{
  // Close composition moves the original tabletop prop out of view.
  c.save();c.translate(960,530);c.scale(1.82,1.82);c.translate(-660,-420);cover(c,img.home,1.03,.4,.5);c.restore();
  const sit=out((t-3)/.27);actor(c,'red',780,1122-lerp(0,48,sit),6.4,{pose:t<3.65?'sit':t<5.12?'stow':'phone',t,face:t<3.6?'shock':t>5.12?'talk':'normal'});
  if(t<3.7)bubble(c,'！',1010,95,125,930,385,{p:(t-3)/.15,font:78,kind:'shock'});
  if(t>=3.65&&t<4.5){const p=smooth((t-3.65)/.85);sparkLence(c,lerp(1090,677,p),lerp(860,840,p),lerp(1.8,.25,p),.3,lerp(-.8,.1,p));}
  if(t>=4.5&&t<5.02){star(c,660,850,15*(1-clamp((t-4.5)/.52)),'#f2d299');}
  if(t>5.1){for(let i=0;i<2;i++){c.save();c.globalAlpha=.35+.2*Math.sin(t*9);line(c,[[1040+i*22,538-i*13],[1065+i*22,552],[1069+i*22,579]],'#655548',5);c.restore();}}
  const d=dialogue('tv',t);if(d)bubble(c,d.text,1080,88,660,1840,420,{p:1,font:44});
 }
}
function panelRoom(c,x,y,w,h,id){
 const bg={red:'#eee1c3',yellow:'#ede0b8',blue:'#c9d4d0',green:'#d6d7b6',purple:'#dacddc'}[id];c.fillStyle=bg;c.fillRect(x,y,w,h);
 c.strokeStyle='#65564517';c.lineWidth=1;for(let xx=x+20;xx<x+w;xx+=42){line(c,[[xx,y],[xx,y+h]],'#65564517',1);}for(let yy=y+20;yy<y+h;yy+=42)line(c,[[x,yy],[x+w,yy]],'#65564517',1);
 line(c,[[x+20,y+h*.82],[x+w-20,y+h*.81]],'#766653',3);
 if(id==='yellow'){poly(c,[[x+36,y+180],[x+156,y+180],[x+156,y+300],[x+36,y+300]],'#c9b071','#877456',3);line(c,[[x+49,y+220],[x+140,y+220]],'#807354',3);ellipse(c,x+95,y+209,26,9,'#dfbd7a','#81724e',2);}
 if(id==='blue'){poly(c,[[x+w-142,y+171],[x+w-40,y+171],[x+w-40,y+291],[x+w-142,y+291]],'#eee4c9','#877561',3);poly(c,[[x+w-129,y+275],[x+w-95,y+221],[x+w-62,y+272]],'#668e92',null);}
 if(id==='green'){poly(c,[[x+43,y+182],[x+158,y+169],[x+169,y+291],[x+52,y+301]],'#e9e0bd','#8c8967',3);line(c,[[x+71,y+265],[x+88,y+203],[x+143,y+236]],'#819073',5);}
 if(id==='purple'){ellipse(c,x+w-98,y+252,33,11,'#a594ae','#78657d',2);line(c,[[x+w-98,y+250],[x+w-98,y+199]],'#778a67',5);ellipse(c,x+w-110,y+218,15,7,'#859977');ellipse(c,x+w-85,y+207,16,8,'#859977');}
}
export function phone(c,t){paper(c);const q=out((t-6)/.38),centerLeft=610,centerRight=1310;
 const panels=[{id:'yellow',x:0,y:0,w:610,h:540,cx:315,cy:525,s:2.8,at:6.12},{id:'blue',x:0,y:540,w:610,h:540,cx:315,cy:1065,s:2.8,at:6.35},{id:'green',x:1310,y:0,w:610,h:540,cx:1615,cy:525,s:2.8,at:6.58},{id:'purple',x:1310,y:540,w:610,h:540,cx:1615,cy:1065,s:2.8,at:6.81}];
 panelRoom(c,centerLeft,0,700,1080,'red');actor(c,'red',975,955,4.65,{pose:'phone',t,face:t>7.8&&t<10.8?'talk':'normal'});
 for(let p of panels){c.save();c.beginPath();c.rect(p.x,p.y,p.w,p.h);c.clip();const enter=out((t-p.at)/.27);c.translate((p.x<600?-1:1)*(1-enter)*p.w,0);panelRoom(c,p.x,p.y,p.w,p.h,p.id);const d=dialogue(p.id,t);actor(c,p.id,p.cx,p.cy,p.s,{pose:d?'wave':'phone',t,face:d?'talk':'normal'});
 if(d)bubble(c,d.text,p.x+78,p.y+47,453,p.cx,p.y+215,{p:(t-d.start)/.16,font:49});
 else if(t<7.5&&t>=p.at) {bubble(c,'···',p.x+195,p.y+75,220,p.cx,p.y+232,{p:(t-p.at)/.14,font:50});}
 c.restore();}
 const d=dialogue('red',t);if(d)bubble(c,d.text,655,d.text.includes('\n')?205:277,610,967,434,{p:(t-d.start)/.18,font:52});
 if(t<7.5)bubble(c,'喂？',802,195,325,1010,425,{p:(t-6)/.2,font:62});
 line(c,[[610,0],[607,540],[613,1080]],INK,7);line(c,[[1310,0],[1315,540],[1309,1080]],INK,7);line(c,[[0,540],[610,538]],INK,7);line(c,[[1310,541],[1920,541]],INK,7);
 if(q<1){c.save();c.globalAlpha=1-q;c.fillStyle=CREAM;c.fillRect(0,0,610*(1-q),1080);c.fillRect(1920-610*(1-q),0,610*(1-q),1080);c.restore();}
}
function trailSign(c,x,y){poly(c,[[x+20,y+20],[x+40,y+20],[x+46,y+228],[x+25,y+230]],'#9d7453',INK,4);poly(c,[[x-90,y],[x+125,y-7],[x+160,y+32],[x+125,y+72],[x-90,y+74]],'#c6a271',INK,4);c.save();c.font='700 38px Film';c.fillStyle=INK;c.textAlign='center';c.fillText('星见山',x+16,y+48);c.restore();}
export function arrival(c,t){
 mountains(c,t,true,true);c.save();c.globalAlpha=.08;c.fillStyle='#e6b18c';c.fillRect(0,0,1920,1080);c.restore();
 poly(c,[[630,1080],[1010,834],[1120,831],[905,1080]],'#b4a183','#77745e',3);trailSign(c,237,713);
 ids.forEach((id,i)=>{const step=out((t-13-i*.075)/.4);const x=560+i*249;ellipse(c,x,990,57,11,'#1e313940');actor(c,id,x,978+(1-step)*65,2.55,{pose:'stand',t,pack:true});});
 poly(c,[[1453,905],[1546,905],[1551,966],[1450,966]],'#c2aa76',INK,3);line(c,[[1480,905],[1480,892],[1518,892],[1518,905]],INK,4);
}
function pine(c,x,y,s){poly(c,[[x,y-s*1.2],[x+s*.28,y-s*.7],[x+s*.12,y-s*.7],[x+s*.39,y-s*.3],[x+s*.22,y-s*.3],[x+s*.5,y],[x-s*.5,y],[x-s*.22,y-s*.3],[x-s*.39,y-s*.3],[x-s*.12,y-s*.7],[x-s*.28,y-s*.7]],'#344c4d','#243b41',3);line(c,[[x,y],[x,y+s*.16]],'#413c35',8);}
export function hiking(c,t){mountains(c,t,true,true);poly(c,[[0,1110],[1920,485],[1920,1080]],'#76876b','#40544e',6);poly(c,[[0,1014],[1920,400],[1920,474],[0,1090]],'#bdad8b','#746f5b',4);const k=(t-14.5);for(let i=0;i<9;i++)pine(c,i*280-100-k*85,930-i*77,120+rand(i+222)*85);
 ids.forEach((id,i)=>{const x=395+i*272+k*150;const y=1007-x*.315;actor(c,id,x,y,2.1,{pose:'walk',t:t+i*.11,pack:true,side:true,face:id==='yellow'?'worried':'normal'});});
 if(k>.3){bubble(c,'呼…',680+k*110,408,190,695+k*150,525,{p:(k-.3)/.2,font:37});}
}
function grill(c,x,y,t){poly(c,[[x-115,y],[x+115,y],[x+90,y+74],[x-90,y+74]],'#524949',INK,5);for(let i=0;i<7;i++)line(c,[[x-99,y+7+i*8],[x+98,y+7+i*8]],'#a89477',3);line(c,[[x-70,y+74],[x-85,y+160]],INK,7);line(c,[[x+70,y+74],[x+87,y+160]],INK,7);for(let i=0;i<7;i++){const yy=y-30-(t*65+i*18)%140;const xx=x-80+i*28+Math.sin(t*4+i)*12;star(c,xx,yy,3+rand(i)*4,'#ecbb6b');}}
export function barbecue(c,t,img){cover(c,img.camp,1.16,.12,.65);c.save();c.globalAlpha=.1;c.fillStyle='#e7b86d';c.fillRect(0,0,W,H);c.restore();const positions=[[545,842],[825,950],[1455,912],[1700,885],[1130,883]];ids.forEach((id,i)=>{actor(c,id,...positions[i],i===1?3.0:2.65,{pose:id==='yellow'?'food':id==='blue'?'camera':id==='purple'?'wave':'stand',t:t+i*.2,face:'normal'});});for(let i=0;i<12;i++){const p=(t*1.2+i*.1)%1;star(c,405+(rand(i+87)-.5)*150,846-p*165,3*(1-p)+1,'#ffe1a0');}c.save();c.translate(431,879);c.rotate(Math.sin(t*9)*.11);line(c,[[-65,0],[70,0]],'#d4b573',4);for(let k=0;k<4;k++){ellipse(c,-45+k*28,0,11,8,k%2?'#dc9852':'#b76a34',INK,2);}c.restore();
 if(t>17){const p=clamp((t-17)/1);for(let i=0;i<28;i++){const x=759+(rand(i+711)-.4)*1700*p,y=850-p*(420+rand(i+992)*470);star(c,x,y,3+rand(i+183)*4,'#ffe0a0');}}
}
export function wishing(c,t,img){
 if(t<20.1){
  cover(c,img.camp,1.08,.5,.66);c.save();c.globalAlpha=.24;c.fillStyle='#182c4b';c.fillRect(0,0,W,H);c.restore();
  // Reclined figures on a gently tilted grass plane, with their heads toward the sky.
  ids.forEach((id,i)=>{const x=470+i*297,y=999+Math.sin(i)*12;const hx=x-175,hy=y-145;c.save();c.translate(x-80,y-80);c.rotate(-.84);ellipse(c,0,0,65,146,'#172f374d');c.restore();actor(c,id,x,y,2.45,{pose:t>19?'wish':'stand',rotation:-.87,t,face:t>19?'wish':'normal'});});
  if(t>18.8){const prompts=['✦','烤串','★','平安','♥'];ids.forEach((id,i)=>{if(t>18.8+i*.14)bubble(c,prompts[i],203+i*297,570-i%2*28,190,295+i*297,807,{p:(t-18.8-i*.14)/.2,font:42,kind:'thought'});});}
  if(t>19.75){c.save();c.globalAlpha=clamp((t-19.75)/.35);cover(c,img.sky);c.restore();}
 }else{
  cover(c,img.sky,1.025+(t-20.1)*.018,.5,.25);skyStars(c,t,38);
  const p=clamp((t-20.25)/1.2);if(p>0&&p<1){const x=lerp(1460,700,p),y=lerp(190,510,p);line(c,[[x+135,y-55],[x,y]],'#fff0c7',3);star(c,x,y,8,'#fff6df');}
  const a=out((t-20.1)/.5);for(let i=0;i<5;i++){actor(c,ids[i],390+i*277,1220,1.6,{pose:'lie',t,face:'wish',alpha:a});}
 }
}
