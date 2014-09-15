//----Canvas variables----//
clicked = false;
startX = 0;
startY = 0;
canvasWidth = 500;
canvasHeight = 500;
var img;

var savedStep = [];
var removedStep = [];
var emptyStep = [];
maxStep = 10;
lastStep = false;

//----3D model variables----//
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
        isPen : true
}
        
function clickStatus(e) 
{
        clicked = true;
        startX = e.offsetX;
        startY = e.offsetY;
}

//----MASK------//
function mask()
{
	//조심해>마스크 어떻게 하지. 그냥 다 그리고 씌우기 하면...
        var Ele = document.getElementById('myCanvas');
        var context = Ele.getContext('2d');
        //마스크 셋팅//
        var imageObj = new Image();
        imageObj.onload = function()
        {
                context.drawImage(imageObj, 0,0,500,500);
        }

        imageObj.src = "images/test_blank.png";
        //context.globalCompositeOperation='source-in';
        
        //console.log("MASK");
        
}

function coverMask()
{
	requestAnimationFrame(coverMask);
	var Ele = document.getElementById('myCanvas');
        var context = Ele.getContext('2d');
        //마스크 셋팅//
        var imageObj = new Image();
        imageObj.onload = function()
        {
                context.drawImage(imageObj, 0,0,500,500);
        }

        imageObj.src = "images/test_blank.png";
	
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
        var Ele = document.getElementById('myCanvas');
        var context = Ele.getContext('2d');
        var stickerName = e.target.id;
        
        var imageObj = new Image();
        imageObj.onload = function()
        {
                context.drawImage(imageObj, Math.floor((Math.random() * canvasWidth) + 1),Math.floor((Math.random() * canvasHeight) + 1));
        }

        imageObj.src = "images/"+stickerName+".png";
	
	//조심해>드래그한 후 놓을 때 storeStep해줘야 함.
}



function drawLine(e) 
{
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
        pat=context.createPattern($('colorPick'),"repeat");
        
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


function changeColor(e) 
{
	//고쳐>흐트믈 color로 바꿀까
        var ele = e.target;
        if (mine.isPen == true) 
        {
                mine.strokestyle = ele.style.background;
                //e.target.style.border = "4px solid #6A4A3C";
        }
        else
        {
                $('colorPick').src=ele.style.backgroundImage.slice(4, -1);
                //console.log($('colorPick').src);
                mine.strokestyle = pat;
                //img=document.getElementById("colorPick");
        }
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

function exportCanvas()
{
	var can = document.getElementById('myCanvas');
        var dataURL = can.toDataURL();
	
	var Ele = document.getElementById('exportCanvas');
        var context = Ele.getContext('2d');
        context.fillStyle = "white";
        context.fillRect(0,0,595,842);
        
	var imageObj = new Image();
        imageObj.onload = function()
        {
                context.drawImage(imageObj, 48,128);
        }

        imageObj.src = dataURL;
	
	//logo image
	var logo = new Image();
        logo.onload = function()
        {
                context.drawImage(logo, 0,0);
        }

        logo.src = "images/export_logo.png";
	
	//make print-out
	var printURL = Ele.toDataURL();
	
	//window.win = open(printURL, "_self");
        //setTimeout('win.document.execCommand("Print")', 500);
	
	showPop("exportPop");
	$('printbtn').addEventListener('click',function(){window.win=open(printURL)},false);
	//backArea.addEventListener('click',function(){ $('savePop').style.display="none";},false);
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
        for (var i = 0;i<8;i++) 
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
	storeStep();
        var can = document.getElementById('myCanvas');
        var context = can.getContext('2d');
        
        context.clearRect(0,0,can.width,can.height);
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
                context.drawImage(imageObj, 0,0,500,500);
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
                context.drawImage(imageObj, 0,0,500,500);
        }
	imageObj.src = savedStep[idx];
}


                
function showPreview(){  
        var can = document.getElementById('myCanvas');
        var dataURL = can.toDataURL();
	var texture;
	
	if (monsterMesh == undefined) {
		return;
	}
	
	if (preview_clicked == false) {
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
	camera.position.set(0,5,30);
	camera.lookAt( scene.position );	
	renderer.setClearColor(0xffffff, 1);
	
	scene.add( new THREE.AmbientLight( 0xeeeeee,1.0 ) );

	var directionalLight_main = new THREE.PointLight(0xffffff, 0.5, 0 );
	var directionalLight_0 = new THREE.PointLight(0xffffff, 0.5, 0 );

	directionalLight_main.position.set(100,80,50); // 위치 : (x, y, z(시야에서의 깊이를 의미 /증가할수록 나랑 가까움))
	directionalLight_0.position.set(-100,80,50);
	scene.add( directionalLight_main );
	scene.add( directionalLight_0 );
	

}

function prepareModel()
{
	loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
			      
	loader.load( 'model/test1.dae', function ( collada ) {
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
        $('colorHex').addEventListener('mousedown',changeColor,false);
        $('stickers').addEventListener('mousedown',putSticker,true);      
   
        $('savebtn').addEventListener('click',saveCanvas,false);
	$('exportbtn').addEventListener('click',exportCanvas,false);
        $('clearbtn').addEventListener('click',clearCanvas,false);
	$('undobtn').addEventListener('click',undoStep,false);
	$('redobtn').addEventListener('click',redoStep,false);
	coverMask();
	storeStep();
        //console.log(mine.stroketype);
	
	//----3D MODEL-----//
	preview.addEventListener('mousedown',previewClickStatus,false);
	preview.addEventListener('mousemove',rotateModel,false);
	preview.addEventListener('mouseup',previewReset,false);
	
	
	
},false);

