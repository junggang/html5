//----Canvas variables----//
clicked = false;
startX = 0;
startY = 0;
canvasWidth = 600;
canvasHeight = 500;
var img;

var savedStep = [];
var removedStep = [];
var emptyStep = [];
maxStep = 10;
colorNum=24;
lastStep = false;

//sticker
var savedBackground;
var currentSticker;
isSticker = false;


//----3D model variables----//
isPaused = false;
preview_clicked = false;
preview_startX = 0;
preview_startY = 0;
previewWidth = 300;
previewHeight = 500;
preview_sensitivity = 0.1;

var renderer, scene, camera, monsterMesh;
var meshRot = 0;
var loader;

var mine =
{
        strokestyle : "black",
        linewidth : 10,
        
        stepArray : new Array(),
        step : 0,
        isPen : true,
	pattern : new Image()
}
        
function clickStatus(e) 
{
        clicked = true;
        startX = e.offsetX;
        startY = e.offsetY;
}

//----MASK------//
function coverMask()
{
	//requestAnimationFrame(coverMask);
	var Ele = document.getElementById('maskCanvas');
        var context = Ele.getContext('2d');
        //마스크 셋팅//
        var imageObj = new Image();
        imageObj.onload = function()
        {
                context.drawImage(imageObj, 0,0,canvasWidth,canvasHeight);
        }

        imageObj.src = "images/mask_nemo.png";
	
}
//----PREFABS-----//
function loadPrefabs()
{
	var backCan = document.getElementById('myCanvas');
        var backCont = backCan.getContext('2d');
        
	var imageObj = new Image();
        imageObj.onload = function()
        {
		backCont.drawImage(imageObj, 0,0);
        }
        imageObj.src = "images/prefab_nemo0.png";
	
	//이거 안 먹냐 왜?
	storeStep();
	
}

//----STICKER-----//
var stickerSources = 
{
        sticker_zigzag: 'images/sticker_zigzag.png',
        sticker_flower: 'images/sticker_flower.png'
};

function loadStickers(stickerSources, callback) 
{			
        var images = {};
        var loadedStickers = 0;
        var stickerNum = 0;
        for(var src in stickerSources) 
        {
          stickerNum++;
        }
        for(var src in stickerSources) 
        {
                images[src] = new Image();
                images[src].onload = function() 
                {
                        if(++loadedStickers >= stickerNum) 
                        {
                                callback(images);
                        }
                };
        images[src].src = stickerSources[src];
        }
}

function putSticker(e)
{
	//스티커를 붙일 때 기존 캔버스는 편집 불가하게 바꿈
	var can = document.getElementById('myCanvas');
	var backContext = can.getContext('2d');
        savedBackground = can.toDataURL();
	console.log(savedBackground);
	
	isSticker = true;
	can.style.pointerEvents = 'none';
	document.getElementById('stickerUI').style.display = '';
	
	
	document.getElementById('editCanvas').style.pointerEvents = '';
	
        var Ele = document.getElementById('editCanvas');
        var context = Ele.getContext('2d');
        var stickerName = e.target.id;
        var imageObj = new Image();
	currentSticker = imageObj;
	
        imageObj.onload = function()
        {
//                context.drawImage(imageObj, Math.floor((Math.random() * canvasWidth) + 1),Math.floor((Math.random() * canvasHeight) + 1));
		context.drawImage(imageObj, 100,100);
		backContext.drawImage(imageObj,100,100);

        }

        imageObj.src = "images/"+stickerName+".png";
	//조심해>드래그한 후 놓을 때 storeStep해줘야 함.
}

function startSticker(e)
{
	clicked = true;
        startX = e.offsetX;
        startY = e.offsetY;
}

function moveSticker(e)
{
	if (clicked == true) {
		resetEditCanvas();
		var Ele = document.getElementById('editCanvas');
		var context = Ele.getContext('2d');
		var backCan = document.getElementById('myCanvas');
		var backContext = backCan.getContext('2d');
		
		fx = e.offsetX;
		fy = e.offsetY;
		console.log(fx,fy);
		context.drawImage(currentSticker, (fx-50),(fy-50));
		
		startX = fx;
		startY = fy;	//code
		
		var imageObj = new Image();
		imageObj.onload = function()
		{
			backContext.drawImage(imageObj, 0,0);
			backContext.drawImage(Ele,0,0);
		}
		imageObj.src = savedBackground;
	}
	
}

function endSticker(e)
{
	clicked = false;
}

function confirmSticker()
{
	isSticker = false;
	document.getElementById('myCanvas').style.pointerEvents = '';
	document.getElementById('stickerUI').style.display = 'none';
	
	
	document.getElementById('editCanvas').style.pointerEvents = 'none';
	resetEditCanvas();
	storeStep();
}

function resetSticker()
{
	console.log('resetSticker');
	resetEditCanvas();
	
	var backCan = document.getElementById('myCanvas');
	var backContext = backCan.getContext('2d');
	
	var imageObj = new Image();
		imageObj.onload = function()
		{
			backContext.drawImage(imageObj, 0,0);
		}
	imageObj.src = savedBackground;
}

function resetEditCanvas()
{
	var editCanvas = document.getElementById('editCanvas');
	var editContext = editCanvas.getContext('2d');
	editContext.clearRect(0,0,canvasWidth,canvasHeight);
}

function drawLine(e) 
{
	if (isSticker == true) {
		return;
	}
        if (clicked == true) 
        {
                fx = e.offsetX;
                fy = e.offsetY;
                //console.log(fx,fy);
                
        var can = document.getElementById('myCanvas');
        var context = can.getContext('2d');
        context.lineCap ="round";
        context.lineJoin="round";

        //img=document.getElementById("colorPick");
        //mine.pattern=context.createPattern($('colorPick'),"repeat");
        
        context.strokeStyle = mine.strokestyle;
        //console.log(mine.strokestyle);
        
        context.beginPath();
        
        context.lineWidth = mine.linewidth;
        context.moveTo (startX,startY);
        context.lineTo (fx,fy);
        startX = fx;
        startY = fy;
        context.closePath();
        context.stroke();
        }
}
//removeEventHandeler 를 쓸 수 있다. mousedown/up만 쓸 수 있겠지~


function endCoordinate(e) 
{
	if (clicked) {
		storeStep();
		lastStep = true;
	}
        clicked = false;
}

function changePenTool(e) {
	mine.isPen =true;
	var ele = e.target.id;
	switch (ele) {
		case "pen":
			showColorHexes();
			mine.strokestyle = "#C44D58";
			break;
		case "crayon":
			changeToCrayon();
			mine.strokestyle = mine.pattern;
			break;
		case "eraser":
			mine.strokestyle = "#ffffff";
	}
}

function changeToCrayon()
{
	var con = document.getElementById('myCanvas');
	var context = con.getContext('2d');
	mine.isPen = false;
	var nodes = document.getElementById('colorHex').childNodes;
	for (var i = 0; i < 8; i++) {
		var str = "url('images/color";
		str = str.concat(i);
		str = str.concat(".png')");
		nodes[i].style.background=str;			
	}
	mine.pattern=context.createPattern($('colorPick'),"repeat");
}

function changeColor(e) 
{
	var can = document.getElementById('myCanvas');
	var context = can.getContext('2d');
	//스티커 만들다가 색 변경시
	if (isSticker) {
		confirmSticker();
	}
	//고쳐>흐트믈 color로 바꿀까
        var ele = e.target;
	
        if (mine.isPen == true) 
        {
		document.getElementById('penPre').style.background = ele.style.background;
		mine.strokestyle = ele.style.background;
                //e.target.style.border = "4px solid #6A4A3C";
        }
        else
        {
                $('colorPick').src=ele.style.backgroundImage.slice(4, -1);
		mine.pattern=context.createPattern($('colorPick'),"repeat");
                //console.log($('colorPick').src);
                mine.strokestyle = mine.pattern;
                //img=document.getElementById("colorPick");
        }
}

function changePenThickness1(e)
{
	if (e.target.id == 'penThicker') {
		mine.linewidth += 1;
	}
	if (e.target.id == 'penThinner') {
		mine.linewidth -= 1;
	}
	
	document.getElementById('penPre').style.width = mine.linewidth+'px';
	document.getElementById('penPre').style.height = mine.linewidth+'px';
	document.getElementById('penPre').style.marginTop = (30-mine.linewidth)/2 + 'px';
	
}

function changePenThickness(rangeVal)
{
	mine.linewidth = rangeVal.value;
	
	document.getElementById('penPre').style.width = mine.linewidth+'px';
	document.getElementById('penPre').style.height = mine.linewidth+'px';
	document.getElementById('penPre').style.marginTop = (30-mine.linewidth)/2 + 'px';
}


function saveCanvas() 
{
        var can = document.getElementById('myCanvas');
        //var context = can.getContext('2d');
        var dataURL = can.toDataURL();
        var backArea = $('savePop').childNodes[1];
        var saveBTN = $('imgPop').querySelector('a');
        
        
        $('canvasImg').src = dataURL;
        showPop("savePop");
        
        backArea.addEventListener('click',function()
                { $('savePop').style.display="none";},false);
        saveBTN.href=dataURL;
        //prompt로 가능
        saveBTN.download="image";
        //context.save();
        console.log("saved");
}

function shareCanvas()
{
	var can = document.getElementById('myCanvas');
        //var context = can.getContext('2d');
        var dataURL = can.toDataURL();
        var backArea = $('sharePop').childNodes[1];
	
	var Ele = document.getElementById('shareCanvas');
        var context = Ele.getContext('2d');
        
	var imageObj = new Image();
        imageObj.onload = function()
        {
                context.drawImage(imageObj, 0,0);
        }
        imageObj.src = dataURL;
	
	var coverObj = new Image();
        coverObj.onload = function()
        {
                context.drawImage(coverObj, 0,0);
        }
        coverObj.src = "images/share_nemo.png";
	
	var fileURL = Ele.toDataURL();
	document.getElementById('imageInput').value = fileURL;
	
	
        //$('shareImg').src = dataURL;
        showPop("sharePop");
        
        backArea.addEventListener('click',function()
                { $('sharePop').style.display="none";},false);
}

function exportCanvas()
{
	var can = document.getElementById('myCanvas');
        var dataURL = can.toDataURL();
		
	var Ele = document.getElementById('exportCanvas');
        var context = Ele.getContext('2d');
        context.fillStyle = "white";
        context.fillRect(0,0,595,842);
	var backArea = $('exportPop').childNodes[1];

        
	var imageObj = new Image();
        imageObj.onload = function()
        {
                context.drawImage(imageObj, 48,128);
        }
        imageObj.src = dataURL;
	
	var coverObj = new Image();
        coverObj.onload = function()
        {
                context.drawImage(coverObj, 48,128);
        }
        coverObj.src = "images/mask_nemo_print.png";
	
	//logo image
	var logo = new Image();
        logo.onload = function()
        {
                context.drawImage(logo, 0,0);
        }
        logo.src = "images/export_logo.png";
	
	//make print-out
	var printURL = Ele.toDataURL();
	
	showPop("exportPop");
	backArea.addEventListener('click',function()
                { $('exportPop').style.display="none";},false);
	
}

function restoreCanvas() 
{
        var can = document.getElementById('myCanvas');
        var context = can.getContext('2d');
        context.restore();
        console.log("saved");
}

function showPop(category) 
{
        $(category).style.display="";
}
        
function $(ele)
{
        return document.getElementById(ele);
}

function init() 
{
        //초기화
        c=document.getElementById("myCanvas");
        var first=c.getContext("2d");
        first.fillStyle = "white";
        first.fillRect(0,0,canvasWidth,canvasHeight);
}


function postCanvasToURL() 
{
        var can = document.getElementById('myCanvas');
        var data = can.toDataURL("image/png");
        var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
        var decodedPng = Base64Binary.decode(encodedPng);
}

function showColorPalette() 
{
        var str= "";
        for (var i = 0;i<colorNum;i++) 
        {
                str = str.concat("<div class='colorhex' ");
                str = str.concat("style='background:white'></div>");
        }
        $('colorHex').innerHTML = str;
}
  
function showColorHexes() 
{
        var request = new XMLHttpRequest();
        request.open("GET", "colorHex.json",true);
        request.send(null);
        var nodes = document.getElementById('colorHex').childNodes;
        request.onreadystatechange = function(){
                if (request.readyState == 4 && request.status == 200) 
                {
                        var sResult = request.responseText;
                        var obj = JSON.parse(sResult);
                        for (var i=0;i<obj.length;i++) 
                        {
                                console.log(obj[i]);
                                nodes[i].style.background=obj[i];
                        }
                }
        }
}

function clearCanvas() 
{
	//원상태로 돌리되 step만 저장함.
	storeStep();
        var backCan = document.getElementById('myCanvas');
        var backCont = backCan.getContext('2d');
        
	//스티커 편집중이었다면
	document.getElementById('stickerUI').style.display = 'none';
	resetEditCanvas();
	
        backCont.fillStyle='white';
	backCont.fillRect(0,0,canvasWidth,canvasHeight);	
}

//----UNDO , REDO----//
function storeStep()
{
	var can = document.getElementById('myCanvas');
        var dataURL = can.toDataURL();
	
	if (savedStep.length>=maxStep) {
		savedStep.shift();
	}
	savedStep.push(dataURL);
	console.log(savedStep);
}

function undoStep()
{
	if (savedStep.length <= 1) {
		console.log("nothing to UNDO");
		return;
	}
	
	//우선 현재 상태를 저장하고 이를 removedStep에 넣는다.
	var poppedURL = savedStep.pop();
	if (removedStep.length>=maxStep) {
		removedStep.shift();
	}
	removedStep.push(poppedURL);
	
	var can = document.getElementById('myCanvas');
        var context = can.getContext('2d');
	var idx = savedStep.length - 1;
        var imageObj = new Image();
        imageObj.onload = function()
        {
                context.drawImage(imageObj, 0,0,canvasWidth,canvasHeight);
        }
	imageObj.src = savedStep[idx];
	
	console.log(savedStep);
}


function redoStep()
{
	if (removedStep.length <= 0) {
		console.log("nothing to REDO");
		return;
	}
	
	savedStep.push(removedStep.pop());
	
	var can = document.getElementById('myCanvas');
        var context = can.getContext('2d');
	var idx = savedStep.length - 1;
        var imageObj = new Image();
        imageObj.onload = function()
        {
                context.drawImage(imageObj, 0,0,canvasWidth,canvasHeight);
        }
	imageObj.src = savedStep[idx];
}


                
function showPreview(){
	//조심해>>이부분 최적화할것.
        var can = document.getElementById('myCanvas');
        var dataURL = can.toDataURL();
	var texture;
	
	if (monsterMesh == undefined) {
		return;
	}
	
	if (preview_clicked == false && isPaused == false) {
		meshRot += 0.005;
		monsterMesh.rotation.set(0,meshRot,0);
	}
	
	texture = monsterMesh.children[0].children[0].material.map.image;
	if (texture != undefined) {
		texture.src = dataURL;
	}
		
	//console.log(obj);

	//obj.mesh.material.uniforms.texture.value = THREE.ImageUtils.loadTexture("test_.png");
	//obj.mesh.material.uniforms.texture.needsUpdate = true;
}


//-----3D------//
function init3D()
{
        renderer = new THREE.WebGLRenderer();
	renderer.setSize(previewWidth, previewHeight);
	document.getElementById('preview').appendChild(renderer.domElement);
			
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(45, (previewWidth / previewHeight), 1, 1000);
	camera.position.set(0,5,20);
	camera.lookAt( scene.position );	
	renderer.setClearColor(0xffffff, 1);
	
	scene.add( new THREE.AmbientLight( 0xeeeeee,1.0 ) );

	var directionalLight_main = new THREE.PointLight(0xffffff, 1, 0 );
	var directionalLight_0 = new THREE.PointLight(0xffffff, 1, 0 );

	directionalLight_main.position.set(100,80,50); // 위치 : (x, y, z(시야에서의 깊이를 의미 /증가할수록 나랑 가까움))
	directionalLight_0.position.set(-100,80,50);
	scene.add( directionalLight_main );
	scene.add( directionalLight_0 );
	

}

function prepareModel()
{
	loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	
	loader.load('model/back1.dae',function(collada){
		var backModel = collada.scene;
		backModel.position.set(0,0,0);
		scene.add(backModel);
	});
			      
	loader.load( 'model/monster_nemo.dae', function ( collada ) {
	var dae = collada.scene;
	
	monsterMesh = dae;
	dae.position.set(0,0,0);
	dae.rotation.set(0,0,0);
	dae.name = 'monster';
	scene.add(dae);
	
	});
}

function drawModel()
{
	requestAnimationFrame(drawModel);
	
	showPreview();
	
	renderer.render(scene, camera);
}
function rotateModel(e)
{
	if (preview_clicked ==false) {
		return;
	}
	var fx,fy;
	fx = e.offsetX;
	fy = e.offsetY;
	meshRot += (fx - preview_startX) * preview_sensitivity;
	preview_startX = fx;
	preview_startY = fy;
	monsterMesh.rotation.set(0,meshRot,0);
	
	
}

function pauseRotation(e)
{
	previewClickStatus(e);
	//이미 멈춰져 있으면 play한후 리턴
	if (isPaused) {
		isPaused = false;
		document.getElementById('pausePbtn').innerHTML = 'pause';
		return;
	}
	
	
	isPaused = true;
	document.getElementById('pausePbtn').innerHTML = 'play';
	monsterMesh.rotation.set(0,meshRot,0);
}

function changeView(e)
{
	isPaused = true;
	document.getElementById('pausePbtn').innerHTML = 'play';
	switch (e.target.id) {
		case 'frontV':
			{meshRot = 0;}
			break;
		case 'leftV':
			{meshRot = 90 * Math.PI / 180;}
			break;
		case 'rightV':
			{meshRot = -90 * Math.PI / 180;}
			break;
		case 'backV':
			{meshRot = 180 * Math.PI / 180;}
			break;
	}
	monsterMesh.rotation.set(0,meshRot,0);
}

function previewClickStatus(e)
{
	preview_clicked = true;
	preview_startX = e.offsetX;
	preview_startY = e.offsetY;	
}

function previewReset()
{
	preview_clicked = false;
}

window.addEventListener('load',function(){
        var Ele = document.getElementById('myCanvas');
        var bar = document.getElementById('pen_range');
        var hex = document.getElementsByClassName('colorHex');
        var context = Ele.getContext('2d');
	var preview = document.getElementById('preview');
	var editCanvas = document.getElementById('editCanvas');
	var confirmbtn = document.getElementById('confirmSticker');
	var resetSbtn = document.getElementById('resetSticker');
	var penBar = document.getElementById('penBar');
	
        
	document.onselectstart = new Function('return false');
        init();
	//mask();
	init3D();
	prepareModel();
	drawModel();
        
	//----CANVAS-----//
        showColorPalette();
        showColorHexes();
        Ele.addEventListener('mousedown',clickStatus,false);
        Ele.addEventListener('mouseout',endCoordinate,false);
        Ele.addEventListener('mouseup',endCoordinate,false);
        Ele.addEventListener('mousemove',drawLine,false);
        
	//TOOLS
	$('prefabs').addEventListener('mousedown',loadPrefabs,false);
	$('tool_picker').addEventListener('mousedown',changePenTool,false);
	$('colorHex').addEventListener('mousedown',changeColor,false);
	//$('penThickness').addEventListener('mousedown',changePenThickness,false);
	penBar.addEventListener('change',function(){changePenThickness(penBar)},false);
        $('stickers').addEventListener('mousedown',putSticker,true);      
        //$('savebtn').addEventListener('click',saveCanvas,false);
	$('exportbtn').addEventListener('click',exportCanvas,false);
	$('sharebtn').addEventListener('click',shareCanvas,false);
        $('clearbtn').addEventListener('click',clearCanvas,false);
	$('gallerybtn').addEventListener('click',function(){window.location.href = "gallery.html"},false);
	$('undobtn').addEventListener('click',undoStep,false);
	$('redobtn').addEventListener('click',redoStep,false);
	coverMask();
	storeStep();
	//---sticker----
	editCanvas.addEventListener('mousedown',startSticker,false);
	editCanvas.addEventListener('mousemove',moveSticker,false);
	editCanvas.addEventListener('mouseup',endSticker,false);
	confirmbtn.addEventListener('mousedown',confirmSticker,false);
	resetSbtn.addEventListener('mousedown',resetSticker,false);
	
	
	//----3D MODEL-----//
	preview.addEventListener('mousedown',previewClickStatus,false);
	preview.addEventListener('mousemove',rotateModel,false);
	preview.addEventListener('mouseup',previewReset,false);
	//previewUI
	$('pausePbtn').addEventListener('mousedown',pauseRotation,false);
	$('frontV').addEventListener('mousedown',changeView,false);
	$('leftV').addEventListener('mousedown',changeView,false);
	$('rightV').addEventListener('mousedown',changeView,false);
	$('backV').addEventListener('mousedown',changeView,false);
	
	
	
},false);

