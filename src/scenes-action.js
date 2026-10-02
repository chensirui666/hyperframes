import {actor} from './actors.js';
import {W,H,INK,CREAM,paper,poly,line,ellipse,star,cover,bubble,sparkLence,mountains,skyStars,speedLines,meteor,earth} from './art.js';
import {clamp,lerp,out,smooth,rand,DIALOGUE} from './timeline.js';
const ids=['yellow','blue','green','purple'];
export function approaching(c,t,img){cover(c,img.sky,1.08,.5,.32);skyStars(c,t,32);const p=(t-22)/3;meteor(c,lerp(1450,1190,p),lerp(225,450,p),lerp(13,164,p*p),t,-.63,1);c.save();c.globalAlpha=.12*p;const gr=c.createRadialGradient(1190,450,20,1190,450,900);gr.addColorStop(0,'#f8b369');gr.addColorStop(1,'#f8b36900');c.fillStyle=gr;c.fillRect(0,0,W,H);c.restore();
 if(t>23.6){const e=out((t-23.6)/.3);['red',...ids].forEach((id,i)=>actor(c,id,355+i*285,1250-e*170,2.45,{pose:'sit',t,face:'worried'}));bubble(c,'？',880,590,160,981,890,{p:(t-23.8)/.2,font:79,kind:'thought'});}
}
export function danger(c,t,img){const q=(t-25)/2;const shake=Math.sin(t*63)*q*5;c.save();c.translate(shake,Math.cos(t*48)*q*4);cover(c,img.camp,1.05,.5,.65);c.save();c.fillStyle='#202542';c.globalAlpha=.3;c.fillRect(0,0,W,H);c.restore();meteor(c,1200-q*80,190+q*95,250+q*120,t,-.7,1);c.save();const gr=c.createLinearGradient(0,0,0,1000);gr.addColorStop(0,'#ffb45b99');gr.addColorStop(1,'#e9a56405');c.fillStyle=gr;c.fillRect(0,0,W,H);c.restore();
 ['red',...ids].forEach((id,i)=>{const up=out((t-25-i*.07)/.25);actor(c,id,355+i*295+(i-2)*q*15,1065-up*80,2.8,{pose:id==='red'?'stow':'panic',t,face:id==='red'?'worried':'shock'});});bubble(c,'？！',1178,492,230,1280,684,{p:(t-25.12)/.15,font:78,kind:'shock'});c.restore();
}
export function drawDevice(c,t,img){cover(c,img.camp,1.5,.47,.8);c.save();c.globalAlpha=.42;c.fillStyle='#232a44';c.fillRect(0,0,W,H);c.restore();const p=out((t-27)/1.2);for(let i=0;i<4;i++)actor(c,ids[i],160+i*535,1030,1.45,{pose:'panic',face:'shock',t});
 actor(c,'red',900,1340,8.3,{pose:t<27.7?'stow':'raise',t,face:'worried'});
 const x=lerp(748,1096,p),y=lerp(1010,489,p);sparkLence(c,x,y,2.15,clamp((t-28.7)/.3),lerp(.3,0,p));
 if(t>28.3){const e=clamp((t-28.3)/.7);for(let i=0;i<14;i++){let a=i/14*Math.PI*2;star(c,x+Math.cos(a)*(210-e*155),y+Math.sin(a)*(210-e*155),2+e*6,'#ffefb8');}}
}
export function transformation(c,t){
 paper(c,true);const q=(t-29)/3.5;skyStars(c,t,25);const col=['#dbb979','#d9d9b8','#ece3be'];
 speedLines(c,960,545,t,'#e1d8aa',35,.7);const flare=out((t-29)/.6);
 for(let i=0;i<21;i++){const width=(48+Math.sin(i*2.1)*22)*flare;const x=960+(i-10)*38*flare;const hh=450+rand(i+874)*900;poly(c,[[x-width/2,1090],[x-width/2,1080-hh*.55],[x-9,1080-hh*.55],[x-9,1080-hh],[x+width/2,1080-hh],[x+width/2,1090]],col[i%3]+(i%2?'c0':'80'),null);}
 for(let i=0;i<90;i++){const phase=(t*.55+rand(i+690))%1;const x=960+(rand(i+400)-.5)*1250;const y=H-phase*1500;const s=5+rand(i+732)*15;c.fillStyle=i%3?'#fff6d6':'#adcfd5';c.globalAlpha=1-phase;c.fillRect(x,y,s,s);}c.globalAlpha=1;
 if(t<30.25){actor(c,'red',960,1090,4.7+out((t-29)/1.25)*2.5,{pose:'raise',t,face:'normal'});const s=4.7+out((t-29)/1.25)*2.5;sparkLence(c,960+23.7*s,1090-88.2*s-121,2.2,1,0);}
 if(t>=30.05){let p=out((t-30.05)/1.45);c.save();c.globalAlpha=out((t-30.05)/.35);actor(c,'tiga',960,1120,lerp(3.8,8.15,p),{pose:'stand',t});c.restore();}
 if(t>30.0&&t<30.6){c.save();c.globalAlpha=Math.sin(clamp((t-30.0)/.6)*Math.PI)*.72;c.fillStyle='#fff9dd';c.fillRect(0,0,W,H);c.restore();}
 if(t>=31.5){const p=out((t-31.5)/.45);c.save();c.globalAlpha=p;for(let i=0;i<4;i++)actor(c,ids[i],255+i*472,1105,1.05,{pose:'stand',t,face:'shock'});c.restore();star(c,960,660,13+Math.sin(t*9)*4,'#d4fbff');}
}
export function reactions(c,t){paper(c,true);const warm=['#59525c','#3e5264','#4a5c58','#635267'];for(let i=0;i<4;i++){const x=i*480;c.fillStyle=warm[i];c.fillRect(x,0,480,1080);const offset=t<33?0:Math.min(1,(t-33-i*.15)/.16);speedLines(c,x+240,535,t,'#efe3bd',8,.12);actor(c,ids[i],x+240,1054,4.75,{pose:i===0?'food':i===1?'camera':i===3&&t>35.1?'wish':'stand',t:t<33?32.5:t,face:'shock'});if(i<3)line(c,[[x+480,0],[x+481,1080]],INK,6);}
 if(t>33){bubble(c,'…',144,155,192,242,486,{p:(t-33)/.1,font:66});}
 if(t>33.25){bubble(c,'！',651,150,145,727,488,{p:(t-33.25)/.1,font:69,kind:'shock'});}
 const d=DIALOGUE.find(d=>t>=d.start&&t<d.end&&d.start>=33);if(d){const x=d.speaker==='green'?985:1465;const cx=d.speaker==='green'?1200:1695;bubble(c,d.text,x,d.speaker==='green'?110:168,430,cx,492,{p:(t-d.start)/.17,font:d.speaker==='green'?49:46,kind:'shock'});}
}
export function liftoff(c,t){mountains(c,t);const q=t-36;const take=out((t-37.6)/1.4);const x=q<1.6?lerp(490,940,q/1.6):lerp(940,1480,take);const y=q<1.6?1055:lerp(1055,-120,take);const scale=q<1.6?5.6:lerp(5.6,3.5,take);
 for(let i=0;i<4;i++)actor(c,ids[i],90+i*104,1000,1.0,{t,face:'shock'});
 if(q<1.6){for(let i=0;i<14;i++){let a=(q*2+rand(i+200))%1;ellipse(c,x-80-a*300,1020-a*60,14+a*28,9+a*9,'#cfbd8b'+(a<.5?'90':'40'));}}
 else{for(let i=0;i<18;i++){const a=i/18*Math.PI;const p=clamp((q-1.6)/.7);ellipse(c,940+Math.cos(a)*p*330,1040-Math.sin(a)*p*90,14+p*40,8+p*15,'#c8c5a87a');}line(c,[[920,990],[x-7,y+100],[x,y]],'#e6e4bd',11);line(c,[[950,1040],[x+16,y+110]],'#89cbd1',6);}
 actor(c,'tiga',x,y,scale,{pose:q<1.6?'run':'fly',t,rotation:q<1.6?.12:.4});
 if(q>1.62&&q<1.85){speedLines(c,940,1030,t,'#dedabd',18,.8);}
}
export function rescue(c,t){
 paper(c,true);skyStars(c,t,80);const q=t-39;const def=smooth((t-42)/2.7);const zoom=lerp(1,.68,clamp((t-41.4)/3.6));
 // Earth remains below-left; the joined pair visibly accelerates up-right.
 earth(c,270,1680,790);c.save();c.translate(960,520);c.scale(zoom,zoom);c.translate(-960,-520);
 const x=lerp(1230,1480,def),y=lerp(420,100,def);const inP=out((t-39)/.3);const heroX=x-lerp(900,466,inP),heroY=y+lerp(820,562,inP);
 meteor(c,x,y,216,t,t<42?-.78:lerp(-.78,2.35,def),lerp(1,.52,def));
 if(t<39.32){line(c,[[heroX-260,heroY+330],[heroX,heroY]],'#a6dee0',12);}
 actor(c,'tiga',heroX,heroY,4.45,{pose:'push',rotation:.70,t});
 if(t>39.3&&t<40.05){const p=(t-39.3)/.75;for(let i=0;i<10;i++){const a=i/10*Math.PI*2;line(c,[[x-145+Math.cos(a)*(35+p*100),y+178+Math.sin(a)*(35+p*100)],[x-145+Math.cos(a)*(55+p*180),y+178+Math.sin(a)*(55+p*180)]],'#fff0bd',5*(1-p)+1);}}
 if(t>40&&t<42){for(let i=0;i<6;i++){const s=rand(i+122)*130;line(c,[[heroX-50-s,heroY+70],[heroX-130-s,heroY+165]],'#d9e5c2',3);}}
 if(t>42){const p=clamp((t-42)/3);line(c,[[750,980],[835,883],[935,735],[x-260,y+310]],'#a7d5d5',6);for(let i=0;i<18;i++){const a=(t*.7+rand(i+267))%1;star(c,x-60-a*510,y+90+a*600,4*(1-a)+1,'#e7eccc');}}
 c.restore();
}
export function finale(c,t){paper(c,true);skyStars(c,t,90);earth(c,270,1680,790);const q=clamp((t-45)/2.1),shrink=1-out(q);const x=lerp(1313.6,1635,q),y=lerp(234.4,114,q);
 line(c,[[835,865],[1010,647],[1215,434],[x,y]],'#94bcc26a',6);line(c,[[987,675],[1220,432],[x,y]],'#e7e3c773',2);
 if(t<47.1){meteor(c,x,y,146.88*shrink,t,2.35,.52);actor(c,'tiga',x-316.88*shrink,y+382.16*shrink,3.026*shrink,{pose:'push',rotation:.70,t});}
 if(t>=47.1){const a=clamp((t-47.1)/.34);c.save();c.globalAlpha=1-clamp((t-47.43)/.55);star(c,1635,114,lerp(72,12,a),'#fff5ca');star(c,1635,114,lerp(35,6,a),'#ffffff',Math.PI/4);c.restore();}
}
