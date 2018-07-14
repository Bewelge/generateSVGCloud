var bgCanvas = null;
var ctx = null;
var bgCanvas2 = null;
var ctx2 = null;
var width = 0;
var height = 0;
var w2 = 0;
var h2 = 0;
var hlfSize = 0;
var qrtSize = 0;
var ctxBG = null;
var stars = [];
var blurMap;
var grass = [];
var widthSplit = 0.2;
var widthFill = 0.5;

var dt;
var image = null;
var circles=[];

$("#description").hide();

function showDescription() {

	$("#description").show();
	window.setTimeout(function() {
		window.addEventListener("click", descrClickListener)
	}, 500)
}

function descrClickListener() {
	closeDescription();
}

function closeDescription() {

	$("#description").hide();
	window.removeEventListener("click", descrClickListener)
}
var cloudshade;
function start() {
	width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth
	height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
	width = Math.floor(width);
	height = Math.floor(height);
	


	bgCanvas = createCanvas(width, height, 0, 0, "cnvBG", "cnvBG", 0, 0, true);
	ctx = bgCanvas.getContext("2d");
	bgCanvas2 = createCanvas(width, height, 0, 0, "cnvBG2", "cnvBG", 0, 0, true);
	ctx2 = bgCanvas2.getContext("2d");
	bgCanvas2.style.zIndex=-2;
	$("#main").prepend(bgCanvas2);


	
	$("#main").prepend(bgCanvas);

	hlfSize = Math.floor(Math.min(width, height) / 2) + 0.5;
	qrtSize = Math.floor(hlfSize / 2) + 0.5;
	



	paper.setup(ctx.canvas);
	chosenClouds = new paper.Group();
	
	let grass = new paper.Path();
	paper.view.onFrame = function(event) {
	
	}
	newClouds(9);
	paper.view.draw();
	document.addEventListener("mousemove", handleMouseMove);

}
var chosenClouds;
var amountChosen=0;
function chooseCloud(i) {
	let chosen = clouds[i].clone();
	chosen.setPosition(
		newPoint(
			width/2+150+150*(amountChosen%(Math.sqrt(9))),
			150+100*Math.floor(amountChosen/Math.sqrt(9))
		)
	);
	clouds[i].remove();
	clouds[i] = createCloud(150+150*(i%(Math.sqrt(9))),150+100*Math.floor(i/(Math.sqrt(9))),50,30)
	
	chosenClouds.addChild(chosen);
	amountChosen++;
}
function createTileset() {
	chosenClouds.translate(-width/2,0);

	 var url = "data:image/svg+xml;utf8," + encodeURIComponent(chosenClouds.exportSVG({asString:true}));

    var link = document.createElement("a");
    link.download = "CloudTileset.svg";
    link.href = url;
    link.click();

    chosenClouds.translate(width/2,0);
}
function newClouds(amount) {
	let el = document.getElementById("loader");
	let cnvL = document.getElementById("loaderCanv");
	cnvL.width = 200;
	cnvL.height = 100;
	let c = cnvL.getContext("2d");
	console.log(c);
	el.style.display = "block";
	window.setTimeout(function() {
		for (var i = clouds.length - 1; i >= 0; i--) {
			clouds[i].remove();
			clouds.splice(i,1)
		}
		for (let i=0;i<amount;i++) {
				
				c.font = "16px Arial black"
				//c.clearRect(0,0,200,100);
				let tx = (amount-i)+" Clouds left.";
				let wd = c.measureText(tx).width;
				c.fillText(tx,0,50);
				//clouds.push(createCloud( (width+350) * i/5 ,100+(height/2-100)*Math.random(),25+Math.random()*25,25+Math.random()*25));
				clouds.push(createCloud(150+150*(i%(Math.sqrt(amount))),150+100*Math.floor(i/(Math.sqrt(amount))),50,30)); 
				if (i==amount-1) {
					c.clearRect(0,0,200,100)
					el.style.display = "none";
				}
			
		}

	},500)

}
var mainShape
var clouds=[];
var cl;
function createCloud(x,y,w,h) {
	let amount = 50;
	let avgSize = Math.sqrt(w*h)/3;
	let siz = avgSize+Math.random()*avgSize;
	

	
	 mainShape = new paper.Path();

	let sx = x-(Math.random()*0.5+0.5)*(w - avgSize);
	let sy = y-(Math.random()*0.5+0.5)*(h - avgSize);	
	mainShape.add(newPoint(sx,sy))
	mainShape.add(newPoint(x-(Math.random()*0.5+0.5)*(w - avgSize),y))
	mainShape.add(newPoint(x-(Math.random()*0.5+0.5)*(w - avgSize),y+(Math.random()*0.5+0.5)*(h - avgSize)))

	mainShape.add(newPoint(x+(Math.random()*0.5+0.5)*(w - avgSize),y+(Math.random()*0.5+0.5)*(h - avgSize)))
	mainShape.add(newPoint(x+(Math.random()*0.5+0.5)*(w - avgSize),y))
	mainShape.add(newPoint(x+(Math.random()*0.5+0.5)*(w - avgSize),y-(Math.random()*0.5+0.5)*(h - avgSize)))
	
	
	mainShape.closed=true;
	mainShape.smooth();
	mainShape.fillColor="rgba(243,233,255,1)";


	let roundBorders = [];
	let shadeShape;
	let lastx=0;
	let lasty=0;
	let lastShap;
	for (let i = 0;i<mainShape.length-1-siz;i++) {
		siz = avgSize+Math.random()*avgSize;
		//console.log(mainShape.getLocationAt(i*5));
		let shap = new paper.Path.Circle(mainShape.getLocationAt(i)._point,siz)

		if (Distance(lastx,lasty,shap.position.x,shap.position.y)<siz) {
			shap.remove();
			
			i+=15;
			continue;
		}
		shap.fillColor="green"
		i+=siz*(1+0.5*Math.random());
		

		roundBorders.push(shap);
		lastx = shap.position.x;
		lasty = shap.position.y;

	}
	roundBorders.sort(randomSort)
	for (let i = 0;i<roundBorders.length;i++) {
		let shap = roundBorders[i];
		let dis = Distance(shap.position.x,shap.position.y,x,y);
		let ang = angle(shap.position.x,shap.position.y,x,y);
		if (dis > 0.1*Math.sqrt(w*h)) {
			let abs = shadeShape2(shap,Math.cos(ang)*dis/avgSize*10,-Math.sin(ang)*5,"rgba(243,233,255,1)")
			//abs.bringToFront();
			let tmpAbs;
			if (i>0) {
				for (let j = i-1;j>=0;j--) {
					tmpAbs = abs.subtract(roundBorders[j]);
					abs.remove();
					abs=tmpAbs;
				}
			}

			abs.bringToFront();
			if (!shadeShape) {
				shadeShape = abs.clone()
				
			} else {
				let tmp = shadeShape.clone();
				shadeShape.remove();
				shadeShape = tmp.unite(abs)
				tmp.remove();
				
			}
			abs.remove();
		}
		
		
	}

	cloudshade = shadeShape;
	let top = newPoint(x,y-h)
	let bottom = newPoint(x,y+h)
	
	cloudshade.fillColor= {
        gradient: {
            stops: ['rgba(245,245,255,0.8)', 'rgba(255,255,255,0)', 'rgba(0,0,70,0.3)']
        },
        origin: top,
        destination: bottom
    }
	for (let key in roundBorders) {
		let tmp = mainShape.clone();
		mainShape.remove();
		mainShape = tmp.unite(roundBorders[key]);
		tmp.remove();
		roundBorders[key].remove();
	}
		// mainShape.strokeColor="rgba(0,0,0,0.5)"
		// mainShape.strokeWidth = 5
		mainShape.sendToBack();


	let theCloud = new paper.Group();
	theCloud.addChild(mainShape);
	theCloud.addChild(cloudshade);
	theCloud.onClick=function() {
		console.log(123);
		chooseCloud(getCloudIndex(theCloud))
	}
	theCloud.onMouseEnter=function() {
		ctx2.fillStyle="rgba(0,0,0,0.05)"
		ctx2.fillRect(theCloud.bounds.x,theCloud.bounds.y,theCloud.bounds.width,theCloud.bounds.height);
	}
	theCloud.onMouseLeave=function() {
		ctx2.clearRect(theCloud.bounds.x-3,theCloud.bounds.y-3,theCloud.bounds.width+6,theCloud.bounds.height+6);
	}
	return theCloud;
}
function getCloudIndex(cloud) {
	for (let key in clouds) {
		if (clouds[key]===cloud) {
			return key;
		}
	}
}

function randomSort(a,b) {
	return Math.random()<0.5 ? true : false;
}
function sortByX(a,b) {
	if (a.point[0]<b.point[0]) {
		return true;
	}
	return false;
}
function sortByY(a,b) {
	if (a.point[1]<b.point[1]) {
		return true;
	}
	return false;
}
function getRandomOvalPoints(x, y, w, h, rnds, invX) {
	for (let i = 0; i < 8; i++) {
		if (!(rnds[i] > 0)) {
			rnds[i] = Math.random();
		}
	}
	let points = [];
	points.push(new paper.Point(x + 0 * w*0.5 * (0.1 + 0.9 * rnds[0]), y - 1 * h * 0.5 * (0.1 + 0.9 * rnds[1])));
	points.push(new paper.Point(x - 1 * w*0.5 * (0.1 + 0.9 * rnds[2]) * invX, y - 0 * h  * 0.5 * (0.1 + 0.9 * rnds[3])));
	points.push(new paper.Point(x - 0 * w*0.5 * (0.1 + 0.9 * rnds[4]), y + 1 * h * 0.5 * (0.1 + 0.9 * rnds[5])));
	points.push(new paper.Point(x + 1 * w*0.5 * (0.1 + 0.9 * rnds[6]) * invX, y - 0 * h * 0.5 * (0.1 + 0.9 * rnds[7])));
	return points;
}

function pathFromPoints(points) {
	let path = new paper.Path();
	path.strokeColor = 'black';
	for (let key in points) {
		path.add(points[key]);
	}
	path.closed = true;
	path.smooth();
	return path
}



function newPoint(x, y) {
	return new paper.Point(x, y);
}

function ySort(a, b) {
	//
	if (a._point.y < b._point.y) {
		//	
		return true
	}
	return false;
}


function getRoundRect(x, y, w, h, rad) {
	return new paper.Rectangle(new paper.Point(x, y), new paper.Point(x + w, y + h))
}



function shadeShape3(path, x, y, col) {
	let tmp = path.clone();
	tmp.scale(1 - x / 10, 1 - y / 10);
	let tmp2 = path.subtract(tmp);
	tmp.remove();
	tmp2.fillColor = col;
	tmp2.strokeColor = "rgba(0,0,0,0)"
	return tmp2;
}

function shadeShape2(path, x, y, col) {
	let tmp = path.clone();
	tmp.translate(-x, -y);
	tmp.scale(0.99,1);
	let tmp2 = path.subtract(tmp);
	tmp.remove();
	tmp2.fillColor = col;
	tmp2.strokeColor = "rgba(0,0,0,0)"
	return tmp2;
}
function shadeShape4(path, x, y, col) {
	let tmp = path.clone();
	tmp.translate(-x, -y);
	tmp.scale(0.99,1);
	let tmp2 = path.subtract(tmp);
	tmp.remove();
	tmp2.fillColor = col;
	tmp2.strokeColor = "rgba(0,0,0,0)"
	return tmp2;
}




var checkScrollBars = function() {
	var b = $('#mainCanvas');
	var normalw = 0;
	var scrollw = 0;
	if (b.prop('scrollHeight') > b.height()) {

		scrollw = width - b.width();
		$('#mainCanvas').css({
			marginRight: '-' + scrollw + 'px'
		});
	}
}

function tick() {

	window.requestAnimationFrame(tick);
}

var newestSplit = 0;
var mouseDown = false;
var mouseX;
var mouseY;
var lastMouseX = 0;
var lastMouseY = 0;
var mouseAng = 0;

function handleMouseMove(e) {
	let rect = e.target.getBoundingClientRect();

	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;
	mouseAng = angle(mouseX, mouseY, lastMouseX, lastMouseY);


	lastMouseX = mouseX;
	lastMouseY = mouseY;



}

function createCanvas(w, h, mL, mT, id, className, L, T, abs) {

	let tmpCnv = document.createElement("canvas");
	tmpCnv.id = id;
	tmpCnv.className = className;
	tmpCnv.width = w;
	tmpCnv.height = h;
	tmpCnv.style.marginTop = mT + "px";
	tmpCnv.style.marginLeft = mL + "px";
	tmpCnv.style.left = L + "px";
	tmpCnv.style.top = T + "px";
	if (abs) {
		tmpCnv.style.position = "absolute";
	}
	return tmpCnv;
}

function createDiv(id, className) {
	let but = document.createElement("div");
	but.id = id;
	but.className = className;


	return but;
}

function createButton(w, h, t, l, mT, mL, pos, bR, bgCol, bgColHov, id, className, clickEv, innerHTML) {
	let but = document.createElement("div");
	but.style.width = w;
	but.style.height = h;
	but.style.top = t;
	but.style.left = l;
	but.style.marginTop = mT;
	but.style.marginLeft = mL;
	but.style.position = pos;
	but.style.borderRadius = bR;
	but.style.backgroundColor = bgCol;
	but.id = id;
	but.className = className;
	but.innerHTML = innerHTML;

	but.addEventListener("mouseenter", function() {
		but.style.backgroundColor = bgColHov;
	})
	but.addEventListener("mouseleave", function() {
		but.style.backgroundColor = bgCol;
	})
	but.addEventListener("click", function() {


		clickEv();
	})
	return but;
}

function angle(p1x, p1y, p2x, p2y) {

	return Math.atan2(p2y - p1y, p2x - p1x);

}

function fillCircles(ct, arr) {
	ct.beginPath();
	for (let key in arr) {
		let s = arr[key];
		ct.arc(s[0], s[1], s[2], 0, Math.PI * 2, 0);
	}
	ct.fill();
	ct.closePath();
}

function fillCircle(ct, x, y, rad) {
	ct.beginPath();
	ct.arc(x, y, rad, 0, Math.PI * 2, 0);
	ct.fill();
	ct.closePath();
}



function drawTriangle(ct, t) {
	ct.beginPath();
	ct.moveTo(t.x, t.y);
	ct.lineTo(t.x1, t.y1);
	ct.lineTo(t.x2, t.y2);
}

function drawEvenTriangle(ct, x, y, rad, turn) {
	//triangles - even
	let ang1 = Math.PI * 2 / 3;
	
	ct.moveTo(x + Math.cos(turn) * rad, y + Math.sin(turn) * rad);
	ct.lineTo(x + Math.cos(turn + ang1) * rad, y + Math.sin(turn + ang1) * rad);
	ct.lineTo(x + Math.cos(turn + ang1 * 2) * rad, y + Math.sin(turn + ang1 * 2) * rad);
	

}

function drawTriangle(x1, y1, x2, y2, x3, y3) {
	ct.beginPath();
	ct.moveTo(x1, y1);
	ct.lineTo(x2, y2);
	ct.lineTo(x3, y3);
	ct.closePath();
}

function Distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}