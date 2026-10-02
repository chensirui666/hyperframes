export const DURATION=48;
export const SHOTS=[
 [0,3,'客厅伏笔'],[3,6,'坐直与收包'],[6,7.5,'电话五分屏'],[7.5,13,'露营邀约'],
 [13,14.5,'山脚集合'],[14.5,16,'爬山'],[16,18,'烧烤'],[18,22,'草地许愿'],
 [22,25,'流星变大'],[25,27,'危机'],[27,29,'掏出神光棒'],[29,32.5,'变身'],
 [32.5,36,'朋友震惊'],[36,39,'助跑起飞'],[39,45,'推离陨石'],[45,48,'太空闪光']
].map(([start,end,name],i)=>({id:i+1,start,end,name}));
export const shotAt=t=>SHOTS.find(s=>t>=s.start&&t<s.end)||SHOTS[t<0?0:15];
export const EVENTS={sit:3.12,stow:4.45,ring:6,transform:29,reveal:31.5,reaction:32.5,run:36,liftoff:37.6,contact:39.3,deflect:42,flash:47.1};
export const DIALOGUE=[
 {start:.6,end:3,speaker:'tv',text:'今晚，史上最大\n规模的流星雨！',pitch:72},
 {start:7.8,end:9.15,speaker:'red',text:'今晚流星雨！',pitch:64},
 {start:9.15,end:10.8,speaker:'red',text:'星见山露营，\n走不走？',pitch:64},
 {start:10.8,end:12,speaker:'yellow',text:'带烤串！',pitch:55},
 {start:11.25,end:12.35,speaker:'blue',text:'走！',pitch:76},
 {start:11.7,end:12.65,speaker:'green',text:'安排！',pitch:60},
 {start:12.15,end:13,speaker:'purple',text:'冲！',pitch:81},
 {start:33,end:35.2,speaker:'green',text:'不是，\n你来真的？！',pitch:60},
 {start:35.2,end:36,speaker:'purple',text:'这么灵？！',pitch:81}
].map(d=>({...d,presentation:'bubble'}));
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const lerp=(a,b,t)=>a+(b-a)*clamp(t);
export const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
export const out=t=>1-(1-clamp(t))**3;
export const rand=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453123;return x-Math.floor(x)};
