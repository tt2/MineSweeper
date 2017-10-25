var cv_sub,ct_sub,x_sub;
var mouseUi,flagUi;
function initControl(){
	cv_sub=document.getElementById('control');
	ct_sub=cv_sub.getContext('2d');
	mouseUi=new Image();flagUi=new Image();
	mouseUi.src='image/mouse.png';
	flagUi.src='image/flag.png';

	cv_sub.addEventListener('mousemove',e=>{
		let rect_sub=e.target.getBoundingClientRect();
		x_sub=e.clientX-rect_sub.left});
	cv_sub.addEventListener('click',e=>{type=x_sub<125});
}
function callControlMethod(){
	ct_sub.clearRect(0,0,250,100);
	ct_sub.drawLine(125,0,125,100,5,'#AAA');
	colorAsset=[['#BBB','#EEE'],['#EEE','#BBB']][type+0];

	ct_sub.drawDot(62.5,45,45,colorAsset[0]);
	ct_sub.drawImage(mouseUi,30,10,70,70);
	ct_sub.drawText('OPEN MODE',47,95,'Arial',5,17,'#111',true,true);

	ct_sub.drawDot(187.5,45,45,colorAsset[1]);
	ct_sub.drawImage(flagUi,157,15,60,60);
	ct_sub.drawText('FLAG MODE',250-72,95,'Arial',5,17,'#111',true,true);
}