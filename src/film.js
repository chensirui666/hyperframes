import {shotAt,clamp} from './timeline.js';
import {texture} from './art.js';
import {home,phone,arrival,hiking,barbecue,wishing} from './scenes-life.js';
import {approaching,danger,drawDevice,transformation,reactions,liftoff,rescue,finale} from './scenes-action.js';
const canvas=document.getElementById('picture'),c=canvas.getContext('2d',{alpha:false});
const images={};let ready=false,now=0;
export function renderFrame(time){now=clamp(time,0,47.999999);if(!ready)return;c.resetTransform();c.globalAlpha=1;c.clearRect(0,0,1920,1080);window.__bubbleBounds=[];const shot=shotAt(now);
 const functions=[home,home,phone,phone,arrival,hiking,barbecue,wishing,approaching,danger,drawDevice,transformation,reactions,liftoff,rescue,finale];
 c.save();functions[shot.id-1](c,now,images);c.restore();texture(c,.46);
 // A subtle page edge unifies the backgrounds, sprites and comic lettering.
 c.save();c.lineWidth=3;c.strokeStyle=shot.id<8?'#44393291':'#eadcbc24';c.beginPath();c.roundRect(15,15,1890,1050,22);c.stroke();c.restore();
 window.__filmTime=now;window.__shot=shot.id;
}
const clock={get time(){return now},set time(v){renderFrame(v)}};
window.__timelines=window.__timelines||{};const tl=window.__timelines.main;tl.to(clock,{time:48,duration:48,ease:'none'},0);window.__timelines.main=tl;
window.renderFrame=renderFrame;
window.__filmReady=Promise.all(['home','camp','sky'].map(name=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{images[name]=img;resolve()};img.onerror=()=>reject(new Error('Missing '+name));img.src=`assets/${name}.png`;})).concat([document.fonts.load('700 52px Film')])).then(()=>{ready=true;renderFrame(now);window.__filmLoaded=true;});
