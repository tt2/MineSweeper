var bSe;
var cSe;
var type;
var flags;
var opend;
var panel;
var result;
var gameLock;
var ftm=true;
var mode=true;
var m={x:0,y:0};
var id={x:0,y:0};
var gameOver=false;
window.onload=()=>{
	canv=document.getElementById('game');
	cont=canv.getContext('2d');
	bSe=new Audio();
	cSe=new Audio();
	bSe.src='se/se_maoudamashii_explosion06.mp3';
	cSe.src='se/SE_Cmaj_bpm130_Seikou_05_byOtogets_mp3.mp3';
	type=true;
	initControl();
	init(0,0,true);
	opend=[];
	setInterval(()=>{
		cont.clearRect(0,0,940,740);
		if(gameLock!=='$ESC_GMR_35')drawDisplay();
		callControlMethod();
	},1000/60);
	canv.addEventListener('mousemove',e=>{
		let rect=e.target.getBoundingClientRect();
		m.x=e.clientX-rect.left;
		m.y=e.clientY-rect.top;
		id.x=~~(m.x/80);
		id.y=~~(m.y/80);
	});
	canv.addEventListener('click',e=>{
		if(mode&&opend.indexOf(`${id.x}_${id.y}`)<0){
			mode=false;
			mx=id.x;
			my=id.y;
			if(ftm){init(mx,my);ftm=false;}
			if(type&&!flags[my][mx]&&opend.indexOf(`${mx}_${my}`)<0){
				if(panel[my][mx]!='*'){
					if(panel[my][mx]=='_'){
						searchByDepth(panel,mx,my).forEach(e=>{opend.push(e)});
					}else{
						opend.push(`${mx}_${my}`);
					}
					if(countLastPanel()==71){
						gameLock='$ESC_GMR_35';
						cSe.play();
					}
				}else{
					gameOver=true;
					bSe.play();
				}
			}else if(!type){
				flags[my][mx]=!flags[my][mx];
			}
		mode=true;
		}
	});
}
function init(x,y,done){
	flags=[];panel=[];
	for(i=0;i<9;i++){
		panel.push(['_','_','_','_','_','_','_','_','_']);
		flags.push([false,false,false,false,false,false,false,false,false]);
	}
	if(done)return 0;
	let rx,ry;
	let usedPos=[];
	for(i=0;i<10;i++){
		rx=~~(Math.random()*9);
		ry=~~(Math.random()*9);
		if(usedPos.indexOf(`${rx}_${ry}`)>-1||(rx==x&&ry==y)){
			while(usedPos.indexOf(`${rx}_${ry}`)>-1||(rx==x&&ry==y)){
				rx=~~(Math.random()*9);
				ry=~~(Math.random()*9);
			}
		}
		usedPos.push(`${rx}_${ry}`);
	}
	usedPos.forEach((e,i)=>{usedPos[i]=e.split('_')});
	for(i=0;i<10;i++){
		stc=usedPos[i];
		stc[0]=~~stc[0];
		stc[1]=~~stc[1];
		panel[stc[1]][stc[0]]='*';
	}
	for(i=0;i<9;i++){
		for(j=0;j<9;j++){
			if(panel[i][j]=='_'){
				let mines=0;
				if(panel[i-1]!=void(0)){
					mines+=panel[i-1][j]=='*';
					mines+=panel[i-1][j+1]=='*';
					mines+=panel[i-1][j-1]=='*';
				}
				if(panel[i+1]!=void(0)){
					mines+=panel[i+1][j]=='*';
					mines+=panel[i+1][j+1]=='*';
					mines+=panel[i+1][j-1]=='*';
				}
				mines+=panel[i][j+1]=='*';
				mines+=panel[i][j-1]=='*';
				if(mines>0)panel[i][j]=mines+'';
			}
		}
	}
	if(panel[y][x]!='_')init(x,y)
}
function drawDisplay(){
	let dx,dy=40;
	for(dyC=0;dyC<9;dyC++){
		dIx=0;
		dx=40;
		for(dxC=0;dxC<9;dxC++){
			if(opend.indexOf(`${dxC}_${dyC}`)<0&&!gameOver||flags[dyC][dxC]){
				cont.drawFillBox(dx,dy,80,'rgba(255,255,255,0.97)');
				if(flags[dyC][dxC]){
					cont.drawImage(flagUi,dx-30,dy-30,60,60);
				}
			}else{
				if(panel[dyC][dxC]!='*'&&panel[dyC][dxC]!='_'){
					cont.drawText(panel[dyC][dxC],dx-5,dy+35,'Arial',3,100,'#222',true,true)
				}else if(panel[dyC][dxC]=='*'){
					cont.drawFillBox(dx,dy,80,'#333');
					cont.drawDot(dx,dy,20,'#000');
					cont.drawLine(dx,dy,dx,dy-27,5,'#000');
					cont.drawLine(dx,dy,dx,dy+27,5,'#000');
					cont.drawLine(dx,dy,dx-27,dy,5,'#000');
					cont.drawLine(dx,dy,dx+27,dy,5,'#000');
					cont.drawLine(dx,dy,dx-20,dy-20,5,'#000');
					cont.drawLine(dx,dy,dx+20,dy-20,5,'#000');
					cont.drawLine(dx,dy,dx-20,dy+20,5,'#000');
					cont.drawLine(dx,dy,dx+20,dy+20,5,'#000');
				}
			}		
			dx+=80;
		}
		dy+=80;
	}
	cont.drawGrid(360,360,80,9,9,2,'#333');
}
function searchByDepth(Array,x,y){
	let elm='_';
	result=[`${x}_${y}`];
	opend.push(`${x}_${y}`);
	searchOther=Array[y][x]=='_';
	getDataOf(Array,x,y-1,elm);
	getDataOf(Array,x+1,y,elm);
	getDataOf(Array,x,y+1,elm);
	getDataOf(Array,x-1,y,elm);
	let lng=result.length;
	for(;;){
		let max=result.length;
		for(i=0;i<max;i++){
			let stack=result[i].split('_');
			let stackX=~~stack[0];
			let stackY=~~stack[1];

			getDataOf(Array,stackX,stackY-1,elm);
			getDataOf(Array,stackX+1,stackY,elm);
			getDataOf(Array,stackX,stackY+1,elm);
			getDataOf(Array,stackX-1,stackY,elm);			
		}
		if(lng==result.length)break;
		lng=result.length;
	}
	if(searchOther){
		copy=result;
		copy.forEach((e,i)=>{copy[i]=e.split('_');copy[i][0]=~~copy[i][0];copy[i][1]=~~copy[i][1];});
		copy.forEach(e=>{
if(panel[e[1]-1]!==void(0)){
subSearch(e[0]+1,e[1]-1)
subSearch(e[0],e[1]-1)
subSearch			(e[0]-1,e[1]-1)
}
if(panel[e[1]+1]!==void(0)){
subSearch(e[0]+1,e[1]+1)
subSearch(e[0],e[1]+1)
subSearch		(e[0]-1,e[1]+1)
}
subSearch(e[0]+1,e[1])
subSearch(e[0]-1,e[1])
});
	}
	return result;
}
function getDataOf(Array,x,y,e){
	if(Array[y]==void(0))return false;
	if(Array[y][x]==e&&result.indexOf(`${x}_${y}`)<0)result.push(`${x}_${y}`);
}
function countLastPanel(){
	$INDEX=0;
	for(cy=0;cy<9;cy++){for(cx=0;cx<9;cx++){$INDEX+=opend.indexOf(`${cx}_${cy}`)>-1}}
	return $INDEX;
}
Object.prototype.setup=function(x,y,width,height,img){this.x=x;this.y=y;this.w=width;this.h=height;this.i=new Image();this.i.src=img;}
subSearch=(x,y)=>{
if(result.indexOf(`${x}_${y}`)<0&&panel[y][x]!='*')result.push(`${x}_${y}`)
}