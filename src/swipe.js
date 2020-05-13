
	var cas = document.getElementById('cas');
	var context = cas.getContext("2d");

	context.fillStyle = "#666";
	context.fillRect(0,0,320,569);
	context.globalCompositeOperation="destination-out";
// 构造函数
function Wipe(obj){
	this.id = obj.id;
	this.width = obj.width;
	this.height = obj.height;
	if(obj.coverType === "img"){
		this.img1 = new Image();
		this.img1.src = obj.mask;
	}
	if(obj.coverType==="color"){
		this.mask=obj.mask;
	}
	this.radius=obj.radius;
	this.isMouseDown = false;
	this.posX = 0;
	this.posY = 0;
	//判断是否移动设备
	this.init();
	this.addEvent();
}
Wipe.prototype.init = function(){
//检测用户的设备类型。移动端返回true,pc端返回false
	this.device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));

	this.clickEvent = this.device ? "touchstart" : "mousedown";
	this.moveEvent = this.device ? "touchmove" : "mousemove";
	this.endEvent = this.device ? "touchend" : "mouseup";
};
Wipe.prototype.addEvent = function(){
	// 各种事件
	
};

var options1 = {
	id:"cas",
	width:"320",
	height:"568",
	coverType:"img", // color表示遮罩为颜色，img表示遮罩为图片
	mask:"wipe2.jpg",
	radius:30
};
var options2 = {
	id:"box",
	width:"200",
	height:"100",
	coverType:"color", // color表示遮罩为颜色，img表示遮罩为图片
	mask:"red",
	radius:30
};
var wipe1 = new Wipe(options1);
var wipe2 = new Wipe(options2);
console.log( wipe1 );

	// 封装画圆函数
	function drawArc(context,x1,y1){
		context.beginPath();
		context.arc(x1,y1,20,0,2*Math.PI);
		context.fillStyle = "red";
		context.fill();
	}
	// 封装画线函数
	function drawLine(context,x1,y1,x2,y2){
		context.beginPath();
		context.moveTo(x1,y1);
		context.lineTo(x2,y2);
		context.lineCap = "round";
		context.lineWidth = 20;

		context.strokeStyle = "red";
		context.stroke();
	}

	// 封装函数，返回透明点的百分比
	function getPercentage(context,_w,_h){
		var num=0;
		// 获取canvas像素数据
		var img1 = context.getImageData(0,0,_w,_h);

		for (var y = 0; y < _h; y++) {
			for (var x = 0; x < _w; x++) {
				var pos = ((_w*y)+x)*4 + 3; //透明点在数组中的下标
				var alpha =  img1.data[pos]; //根据下标返回alpha值
				if(alpha===0){
					num++;
				}
			}
		}
		return (num/(_w*_h))*100;
	}

	//实现画线效果1：鼠标按下不放，移动鼠标，松开鼠标完成画线动作
	var isMouseDown = false;//鼠标状态，按下为true，没按下为false
	var posX = 0;
	var posY = 0;

	cas.addEventListener(clickEvent,function(evt){
		var event = evt || window.event;
		posX = device ?  event.touches[0].clientX : event.clientX;
		posY = device ?  event.touches[0].clientY : event.clientY;
		drawArc(context,posX,posY);
		isMouseDown = true;
	},false);

	cas.addEventListener(moveEvent,function(evt){
		//先检查鼠标是否按下
		if(isMouseDown){
			var event = evt || window.event;
			//执行画线
			//console.log("画线"+evt.clientX);
			//作业1：连续不断画圆
			//作业2：连续不断画线，将鼠标移动的坐标作为画线的结束点。此处有坑
			var x2 = device ? event.touches[0].clientX : event.clientX;
			var y2 = device ? event.touches[0].clientY : event.clientY;

			drawLine(context,posX,posY,x2,y2);
			// 需要把上一次移动的坐标点作为下一次画线的起始点
			posX = device ? event.touches[0].clientX : event.clientX;
			posY = device ? event.touches[0].clientY : event.clientY;

		}else{
			//啥也不干
			return false;
		}
	},false);
	cas.addEventListener(endEvent,function(evt){
		isMouseDown = false;
		var event = evt || window.event;
		// 使用lineTo() 实现画线，鼠标按下获得起始点，鼠标松开获得结束点
		// drawLine(context,posX,posY,event.clientX,event.clientY);
		// 判断透明点占总面积的百分比
		console.log("透明点占总面积为"+ getPercentage(context,320,568).toFixed(2) +"%");
		var percent = getPercentage(context,320,568).toFixed(2);
		//作业三：判断当百分比超过60时，显示完整的背景图。
		if( percent > 60 ){
			alert("擦除面积超过了60%");
			
		}

	});





