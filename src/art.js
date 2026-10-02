import {clamp,lerp,out,rand} from './timeline.js';
export const W=1920,H=1080,INK='#392f38',CREAM='#fff2d6';
const grain=document.createElement('canvas');grain.width=480;grain.height=270;const g=grain.getContext('2d');
for(let i=0;i<16000;i++){g.fillStyle=i%3?'rgba(45,31,29,.06)':'rgba(255,247,218,.14)';g.fillRect(rand(i*3)*480,rand(i*3+1)*270,rand(i*3+2)*1.5+.2,.5);}
export function texture(c,amount=.3){c.save();c.globalAlpha=amount;c.drawImage(grain,0,0,W,H);c.restore();}
export function paper(c,night=false){c.fillStyle=night?'#202b48':'#f0e4c9';c.fillRect(0,0,W,H);c.strokeStyle=night?'#e6dec90a':'#67574010';c.lineWidth=1;for(let x=0;x<W;x+=52){c.beginPath();c.moveTo(x,0);c.lineTo(x+3,H);c.stroke();}for(let y=0;y<H;y+=52){c.beginPath();c.moveTo(0,y);c.lineTo(W,y-2);c.stroke();}}
export function poly(c,pts,fill,stroke=INK,lw=4){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.lineJoin='round';c.stroke();}}
export function line(c,pts,color=INK,lw=4){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=lw;c.lineCap='round';c.lineJoin='round';c.stroke();}
export function ellipse(c,x,y,rx,ry,color,stroke=null,lw=3){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
export function star(c,x,y,r=10,color=CREAM,turn=0){c.save();c.translate(x,y);c.rotate(turn);poly(c,[[0,-r],[r*.22,-r*.22],[r,0],[r*.22,r*.22],[0,r],[-r*.22,r*.22],[-r,0],[-r*.22,-r*.22]],color,null);c.restore();}
export function skyStars(c,t,amount=65){for(let i=0;i<amount;i++){const x=rand(i+84)*W,y=rand(i+492)*850;const a=.25+.6*(.5+.5*Math.sin(t*1.3+i));c.globalAlpha=a;star(c,x,y,2+rand(i+319)*5,'#f8edcf');}c.globalAlpha=1;}
export function cover(c,img,zoom=1,fx=.5,fy=.5){if(!img)return;const s=Math.max(W/img.width,H/img.height)*zoom;const w=img.width*s,h=img.height*s;c.drawImage(img,(W-w)*fx,(H-h)*fy,w,h);}
export function bubble(c,text,x,y,w,tx,ty,{p=1,kind='round',font=48,color=CREAM}={}){
 const ls=text.split('\n'),h=ls.length*font*1.28+44,scale=out(p);
 if(scale<.01)return;
 c.save();c.translate(x+w/2,y+h/2);c.scale(scale,scale);c.translate(-x-w/2,-y-h/2);
 const tailX=clamp(tx,x+30,x+w-30),bottom=ty>=y+h/2,edgeY=bottom?y+h-5:y+5;
 c.save();c.translate(7,9);c.fillStyle='#30253755';c.beginPath();c.roundRect(x,y,w,h,kind==='shock'?7:26);c.fill();c.restore();
 if(kind==='thought'){ellipse(c,tx,ty,7,7,color,INK,3);ellipse(c,lerp(tx,tailX,.6),lerp(ty,edgeY,.6),13,11,color,INK,3);}
 else poly(c,[[tailX-16,edgeY],[tx,ty],[tailX+18,edgeY]],color,INK,4);
 if(kind==='shock'){
  const pts=[];for(let j=0;j<7;j++)pts.push([x+j*w/6,y+(j%2?-13:0)]);for(let j=0;j<4;j++)pts.push([x+w+(j%2?10:0),y+j*h/3]);for(let j=6;j>=0;j--)pts.push([x+j*w/6,y+h+(j%2?13:0)]);for(let j=3;j>=0;j--)pts.push([x-(j%2?10:0),y+j*h/3]);poly(c,pts,color,INK,4);
 }else{c.beginPath();c.roundRect(x,y,w,h,26);c.fillStyle=color;c.fill();c.lineWidth=4;c.strokeStyle=INK;c.stroke();}
 c.textAlign='center';c.textBaseline='middle';c.font=`700 ${font}px Film, sans-serif`;c.fillStyle=INK;ls.forEach((s,i)=>c.fillText(s,x+w/2,y+24+font*.64+i*font*1.28));c.restore();
 window.__bubbleBounds?.push({x,y,w,h,tx,ty,text});
}
export function speedLines(c,x,y,t,color='#fff1c4',n=20,strength=1){c.save();c.globalAlpha=.4*strength;for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2+.05*Math.sin(i);const r=130+rand(i+77)*200,le=130+rand(i+23)*700;line(c,[[x+Math.cos(a)*r,y+Math.sin(a)*r],[x+Math.cos(a)*(r+le),y+Math.sin(a)*(r+le)]],color,2+rand(i)*3);}c.restore();}
export function meteor(c,x,y,r,t,angle=-2.35,trail=1){
 c.save();c.translate(x,y);c.rotate(angle);
 // Flame points face opposite the meteor's direction of travel.
 for(let layer=2;layer>=0;layer--){const len=r*(3.9+layer*.85)*trail;poly(c,[[-r*.55,-r*.9],[len*.72,-r*.65],[len,-r*.27],[len*1.27,0],[len*.55,r*.66],[-r*.35,r]],['#ffd58a','#ef8144','#e45a363a'][layer],null);}
 c.shadowColor='#ffb957';c.shadowBlur=30;const pts=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const rr=r*(.87+rand(i+14)*.18);pts.push([Math.cos(a)*rr,Math.sin(a)*rr]);}poly(c,pts,'#615056','#f5b167',Math.max(3,r*.04));c.shadowBlur=0;
 poly(c,[[-r*.7,-r*.4],[-r*.25,-r*.8],[r*.32,-r*.62],[r*.05,-r*.06],[-r*.38,r*.08]],'#907367',null);poly(c,[[r*.16,r*.02],[r*.8,-r*.12],[r*.63,r*.54],[r*.06,r*.68]],'#423c50',null);
 for(let i=0;i<9;i++){let a=i*2.7;let q=.15+rand(i+122)*.5;ellipse(c,Math.cos(a)*r*q,Math.sin(a)*r*q,r*(.05+rand(i+200)*.07),r*.06,'#473c47');}
 line(c,[[-r*.5,r*.2],[-r*.16,r*.05],[r*.01,r*.4],[r*.3,r*.2]],'#eab177',Math.max(2,r*.023));
 for(let i=0;i<16;i++){const phase=(t*1.5+rand(i+30))%1;c.fillStyle=i%2?'#f7d187':'#e68a4f';const q=r*.035*(1-phase)+2;c.fillRect(r+phase*r*4,(rand(i+2)-.5)*r*2,q,q);}
 c.restore();
}
export function sparkLence(c,x,y,s=1,open=1,rotation=0){c.save();c.translate(x,y);c.rotate(rotation);c.scale(s,s);const edge='#543a31';poly(c,[[-6,6],[6,6],[9,55],[5,64],[-5,64],[-9,55]],'#e9dbad',edge,3);line(c,[[-6,48],[7,48]],'#a77733',5);line(c,[[-5,59],[5,59]],'#a77733',4);for(let sign of [-1,1]){c.save();c.scale(sign,1);c.rotate((1-open)*-.65);poly(c,[[0,8],[7,-22],[20,-35],[37,-18],[32,0],[13,17]],'#d7a649',edge,3);line(c,[[8,3],[17,-20],[30,-17]],'#fff0ac',3);c.restore();}poly(c,[[0,-23],[11,-7],[7,13],[0,20],[-7,13],[-11,-7]],'#b2e3ea',edge,3);poly(c,[[0,-19],[5,-6],[0,11],[-4,-5]],'#fffad9',null);c.restore();}
export function mountains(c,t,ground=true,twilight=false){paper(c,true);if(twilight){const dusk=c.createLinearGradient(0,0,0,850);dusk.addColorStop(0,"#647082");dusk.addColorStop(1,"#cb9a8b");c.fillStyle=dusk;c.fillRect(0,0,W,H);}skyStars(c,t,twilight?14:65);poly(c,[[0,720],[230,535],[395,630],[730,388],[990,560],[1200,440],[1530,610],[1710,505],[1920,625],[1920,1080],[0,1080]],'#3b4a67','#283750',5);for(let j=0;j<22;j++){const xx=500+j*20,yy=640-Math.sin(j/22*Math.PI)*130;line(c,[[xx,yy],[xx+80,yy+150],[xx+150,yy+205]],'#83909b26',3);}poly(c,[[0,855],[320,705],[530,795],[830,628],[1200,809],[1520,701],[1920,799],[1920,1080],[0,1080]],'#293d50','#1d3044',5);if(ground){poly(c,[[0,975],[350,872],[740,924],[1100,847],[1540,917],[1920,835],[1920,1080],[0,1080]],'#445b53','#203b43',5);for(let i=0;i<50;i++){let x=rand(i+645)*W,y=980+rand(i+988)*100;line(c,[[x-5,y+10],[x,y-8],[x+3,y+10],[x+12,y-4]],'#79826a',2);}}}
export function earth(c,x,y,r){c.save();c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle='#66a3aa';c.fill();c.clip();poly(c,[[x-r,y-r*.25],[x-r*.55,y-r*.63],[x-r*.18,y-r*.79],[x+r*.05,y-r*.37],[x-r*.28,y-r*.13],[x-r*.1,y+r*.1],[x-r*.35,y+r*.24]],'#a5bb91',null);poly(c,[[x+r*.3,y-r*.85],[x+r*.65,y-r*.7],[x+r*.83,y-r*.14],[x+r*.49,y+r*.12],[x+r*.14,y-r*.16]],'#96b385',null);for(let i=0;i<5;i++)line(c,[[x-r+i*180,y-r*.5+i*78],[x-r*.4+i*160,y-r*.57+i*76],[x+i*170,y-r*.4+i*64]],'#e0e7d6',12);c.restore();c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.strokeStyle='#a5d7d1';c.lineWidth=13;c.stroke();c.beginPath();c.arc(x,y,r+22,Math.PI*1.03,Math.PI*1.95);c.strokeStyle='#8ccad343';c.lineWidth=16;c.stroke();}
