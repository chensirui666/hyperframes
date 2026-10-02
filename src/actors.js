import {clamp,rand} from './timeline.js';
const C={red:['#dd503c','#a63130','#f07753','#35658b','#213d58'],yellow:['#d7ad43','#987132','#efcc6a','#855134','#5a342a'],blue:['#4d8faa','#315b72','#76acc0','#494445','#302d31'],green:['#728957','#475e43','#94a372','#a89368','#766444'],purple:['#a08ac1','#70618f','#c2afd6','#e9dcbc','#b6a68e'],tiga:['#b84649','#822e42','#ea7770','#6d4f89','#49355e']};
const canvas=document.createElement('canvas');canvas.width=128;canvas.height=160;const c=canvas.getContext('2d');const O='#352934',SKIN='#f2c992',SS='#d99b6e';
const box=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function p(points,color,outline=true){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=color;c.fill();if(outline){c.strokeStyle=O;c.lineWidth=2;c.lineJoin='miter';c.stroke();}}
function limb(x,y,len,w,angle,col,shade,tip,leg=false){c.save();c.translate(Math.round(x),Math.round(y));c.rotate(angle);box(-w/2-1,0,w+2,len+2,O);box(-w/2,1,w,len,col);box(w/2-3,1,3,len,shade);if(leg){box(-w/2-3,len-1,w+5,5,O);box(-w/2-2,len-1,w+3,2,tip);}else{box(-w/2-1,len-3,w+2,8,O);box(-w/2,len-2,w,6,tip);box(-w/2,len+2,2,2,SS);}c.restore();}
function hair(id){const dark=id==='blue'?'#302d2c':'#523329',hi=id==='blue'?'#514849':'#855234';
 if(id==='purple'){p([[55,8],[58,4],[72,4],[78,10],[78,18],[72,23],[57,23],[52,17]],dark);box(58,8,10,3,hi);}
 const pts=id==='yellow'?[[43,27],[43,22],[47,22],[47,17],[53,17],[53,12],[58,15],[65,12],[73,17],[79,15],[79,21],[84,21],[84,28],[89,31],[84,37],[81,36],[81,44],[76,36],[75,29],[68,30],[67,26],[63,31],[59,31],[58,28],[52,35],[47,44],[44,38],[39,36],[39,30]]:
 id==='green'?[[44,28],[46,18],[53,16],[60,17],[62,13],[67,16],[79,17],[83,24],[83,37],[79,40],[77,29],[73,29],[73,33],[68,33],[68,29],[61,29],[61,33],[55,33],[55,28],[49,30],[48,41],[44,38]]:
 [[44,27],[42,23],[48,21],[46,16],[54,16],[55,12],[60,15],[68,11],[70,15],[79,16],[80,21],[85,22],[83,28],[86,31],[81,38],[77,39],[76,28],[71,26],[65,34],[60,37],[60,31],[54,35],[50,34],[48,43],[43,40]];
 p(pts,dark);for(let i=0;i<13;i++){const x=49+rand(i*7+id.length)*29,y=17+rand(i+991)*10;box(x,y,3+rand(i+439)*4,2,hi);}if(id==='purple'){box(45,25,7,3,'#ffd86b');box(47,22,3,9,'#ffd86b');}}
function face(id,expression,t,side=false){
 let eyes=expression==='shock'?'shock':expression==='wish'?'closed':expression==='sleep'?'closed':'open';if(expression==='normal'&&(t%3.8)>.0&&(t%3.8)<.11)eyes='closed';
 if(side){box(67,37,4,6,O);box(78,43,5,3,SS);box(73,49,6,2,O);if(id==='green'){box(62,35,14,12,O);box(64,37,10,8,SKIN);box(68,38,3,6,O);box(48,36,14,2,O);}return;}
 let eyeY=38;if(eyes==='closed'){box(51,eyeY+3,7,2,O);box(70,eyeY+3,7,2,O);}else if(eyes==='shock'){box(50,eyeY-2,9,12,'#fff4d6');box(70,eyeY-2,9,12,'#fff4d6');box(53,eyeY+1,3,7,O);box(73,eyeY+1,3,7,O);}else{box(53,eyeY,4,7,O);box(72,eyeY,4,7,O);box(53,eyeY,1,2,'#fff0d0');box(72,eyeY,1,2,'#fff0d0');}
 box(49,47,4,2,'#e9a083');box(77,47,4,2,'#e9a083');box(63,45,2,2,SS);
 if(expression==='shock'){box(60,50,9,8,O);box(63,51,4,4,'#ab5752');}
 else if(expression==='talk'&&Math.floor(t*9)%3){box(60,51,8,5,O);box(62,54,4,1,'#e48778');}
 else if(expression==='worried'){box(59,54,10,2,O);box(57,35,4,2,O);box(70,34,5,2,O);}
 else {box(60,52,8,2,O);box(58,50,2,2,O);box(68,50,2,2,O);}
 if(id==='green'){let drop=expression==='shock'?5:0;for(let x of [48,68]){box(x,36+drop,13,12,O);box(x+2,38+drop,9,8,SKIN);box(x+5,38+drop,3,7,O);box(x+2,38+drop,3,2,'#fff0d7');}box(61,40+drop,7,2,O);box(44,38+drop,4,2,O);box(81,38+drop,4,2,O);}
}
function head(id,expression,t,side=false){if(id==='tiga'){
 p([[48,30],[51,24],[57,21],[61,15],[62,5],[66,3],[68,17],[74,23],[81,26],[83,33],[83,48],[77,56],[69,60],[57,59],[48,51],[45,42],[45,33]],'#c0c1b9');
 p([[64,8],[65,22],[71,32],[66,33],[62,23]],'#eee9d6',false);p([[49,31],[52,28],[61,32],[64,38],[60,39],[54,34]],'#858d92',false);p([[78,31],[71,32],[66,38],[69,40],[77,35]],'#828d96',false);
 p([[49,36],[55,36],[61,40],[61,46],[55,46],[50,43]],'#fff0b2');p([[68,41],[75,36],[81,36],[78,43],[70,46],[67,46]],'#fff0b2');box(51,37,4,2,'#fffceb');box(74,37,5,2,'#fffceb');p([[62,26],[65,22],[68,26],[66,32],[63,31]],'#9264bf');box(58,51,14,3,'#7e8589');box(61,53,8,4,'#dfdbcb');return;}
 p([[48,28],[78,27],[83,32],[83,47],[78,54],[70,58],[57,57],[49,52],[46,45],[43,43],[43,36],[47,35]],SKIN);box(45,38,3,7,SS);box(78,45,3,5,'#e5af7b');hair(id);face(id,expression,t,side);
}
export function actor(ctx,id,x,y,scale=4,opt={}){
 const {pose='stand',face:expression='normal',t=0,rotation=0,flip=false,alpha=1,side=false,prop=null}=opt;
 const pal=C[id]||C.red;c.clearRect(0,0,128,160);c.imageSmoothingEnabled=false;
 const tick=Math.floor(t*12)/12;let walk=pose==='walk'||pose==='run';let cycle=Math.sin(tick*(pose==='run'?19:11));let bodyBob=walk?Math.abs(cycle)*2:Math.sin(t*2)*.4;
 c.save();c.translate(0,16-bodyBob);
 const hero=id==='tiga';let legY=83,legLen=29,armLen=hero&&(pose==='push'||pose==='fly')?64:27;
 const seated=pose==='sit'||pose==='lie';let legA=walk?cycle*.4:hero?-.12:0,legB=walk?-cycle*.4:hero?.12:0;
 if(pose==='fly'||pose==='push'){legA=.16;legB=-.14;}
 if(seated){legY=82;legLen=19;legA=-.38;legB=.38;}
 if(pose==='run'){legA=cycle*.7;legB=-cycle*.7;}
 limb(55,legY,legLen,11,legA,pal[3],pal[4],id==='blue'||id==='purple'?'#e4ddc7':'#61544b',true);
 limb(73,legY,legLen,11,legB,pal[3],pal[4],id==='blue'||id==='purple'?'#e4ddc7':'#61544b',true);
 if(hero){box(51,101,9,11,'#b7c1c3');box(71,101,9,11,'#d1d4c8');}
 if(id==='blue'||opt.pack){box(39,55,11,29,O);box(40,57,10,25,id==='blue'?'#426782':'#897450');box(41,61,6,11,'#638296');}
 let left=walk?-cycle*.4:.08,right=walk?cycle*.4:-.08;
 if(pose==='phone'){right=-2.4;left=.1;}
 if(pose==='wave'){right=-2.6+Math.sin(tick*13)*.2;}
 if(pose==='raise'){right=-Math.PI+.25;left=.1;}
 if(pose==='wish'){right=2.6;left=-2.6;}
 if(pose==='panic'){right=-2.5;left=2.5;}
 if(pose==='fly'||pose==='push'){right=-3.04;left=3.04;}
 if(pose==='food'){right=-1.9;left=.05;}
 if(pose==='camera'){right=2.4;left=-2.4;}
 if(pose==='stow'){right=1.2;left=-.25;}
 const sleeve=id==='green'?'#e8dabc':hero?'#76548e':pal[0],sleeveShadow=id==='green'?'#baa480':pal[1],hand=hero?'#ced1c5':SKIN;
 limb(46,57,armLen,10,left,sleeve,sleeveShadow,hand);limb(81,57,armLen,10,right,sleeve,sleeveShadow,hand);
 p([[49,54],[55,51],[73,51],[80,55],[80,82],[76,87],[48,87],[46,81],[46,61]],pal[0]);box(49,78,27,7,pal[1]);box(49,59,4,18,pal[2]);box(73,63,5,16,pal[1]);
 if(id==='red'){box(58,62,12,12,'#fff1d3');box(54,78,15,2,'#a94234');box(57,54,2,8,'#f4d6a6');box(69,54,2,8,'#f4d6a6');}
 if(id==='yellow'||id==='blue'){box(59,54,11,29,'#efe4c8');box(59,54,2,29,pal[1]);box(69,55,2,28,pal[1]);}
 if(id==='green'){box(62,54,5,33,'#e2d5b8');box(50,67,9,8,'#4b633f');box(69,66,8,9,'#4b633f');box(69,64,6,4,'#e8dfb1');box(71,65,3,2,'#84a3ac');box(51,79,8,4,'#485e3d');box(70,79,7,4,'#485e3d');box(42,81,3,10,'#555852');box(42,88,3,2,'#eed17b');}
 if(id==='purple'){box(57,56,2,11,'#f7e7cd');box(71,56,2,11,'#f7e7cd');box(55,76,16,6,'#8a76ab');box(57,75,12,1,'#71618e');}
 if(hero){p([[49,57],[54,56],[64,65],[74,56],[79,58],[74,67],[64,73],[53,66]],'#d8c079');p([[50,60],[55,63],[64,69],[74,62],[78,61],[73,70],[64,77],[54,71]],'#d4d4c7',false);p([[51,73],[64,82],[76,71],[73,80],[65,86],[56,81]],'#e0dace',false);p([[61,62],[66,61],[69,65],[67,70],[62,70],[59,66]],'#286b98');box(62,63,4,5,'#58d6e9');box(62,63,2,2,'#d5ffff');}
 if(id==='red'){p([[73,55],[77,57],[56,84],[52,83]],'#49362b',false);box(43,77,15,19,O);box(45,78,12,16,'#62472e');box(46,80,11,5,'#806240');box(49,84,3,5,'#d0a761');}
 if(id==='blue'&&pose!=='camera'){box(54,76,24,14,O);box(56,78,20,10,'#555353');box(64,78,9,10,'#b0ada5');box(66,80,5,6,'#282b30');box(55,77,4,2,'#d0cdc1');box(58,72,3,5,O);box(72,72,3,5,O);}
 head(id,expression,t,side);
 // Foreground hands / props make intention readable even at wide scale.
 if(pose==='phone'){box(81,35,8,17,O);box(82,37,5,11,'#79b8c1');box(80,43,3,7,SKIN);}
 if(pose==='wish'){box(60,61,9,12,O);box(61,62,7,10,SKIN);box(64,61,1,11,SS);}
 if(pose==='camera'){c.save();c.translate(65,61);c.rotate(expression==='shock'?Math.PI:.0);box(-13,-6,26,15,O);box(-11,-4,22,11,'#535453');box(-1,-4,10,11,'#bfc1b7');box(1,-2,6,7,'#222835');box(-8,-8,8,4,O);c.restore();}
 if(pose==='food'){c.save();c.translate(84,41);c.rotate(-.4);box(0,0,2,27,'#bfa475');for(let i=0;i<3;i++){box(-3,i*7+3,8,6,'#6d3e29');box(-2,i*7+3,6,4,'#bd7737');}c.restore();}
 if(id==='yellow'&&opt.pack){box(29,85,17,19,O);box(30,85,15,17,'#ead3a4');box(33,77,2,9,'#ad9465');box(42,77,2,9,'#ad9465');}
 if(id==='green'&&opt.pack){box(80,78,14,12,'#f1e1bd');box(84,78,2,12,'#bfc6a0');box(87,81,4,3,'#859d80');}
 c.restore();
 ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.scale(flip?-scale:scale,scale);ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;ctx.drawImage(canvas,-64,-135);ctx.restore();
}
