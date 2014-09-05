//----Canvas variables----//
clicked = false;
startX = 0;
startY = 0;
canvasWidth = 500;
canvasHeight = 500;
var img;

//----3D model variables----//
preview_clicked = false;
preview_startX = 0;
preview_startY = 0;
previewWidth = 500;
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
        //save current Step
        //mine.stepArray[mine.step] = can.toDataURL();
        //console.log(mine.stepArray[mine.step]);
        //mine.step = mine.step + 1;
        }
}
//removeEventHandeler 를 쓸 수 있다. mousedown/up만 쓸 수 있겠지~


function endCoordinate(e) 
{
        clicked = false;
        //console.log(clicked);
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
	//고쳐>클리어할 때 기본 도안은 지우면 안됨.
        var can = document.getElementById('myCanvas');
        var context = can.getContext('2d');
        
        context.clearRect(0,0,can.width,can.height);
}
                
function showPreview(){  
        var can = document.getElementById('myCanvas');
        var dataURL = can.toDataURL();
	var texture;
        //var backArea = $('savePop').childNodes[1];
        
        //document.getElementById('preview').style.backgroundImage="url('"+dataURL+"')";
	//prepareModel();
	//drawModel();
	
	//조심해>이거 js안쓰고 이렇게 하는게 안전할까 ㅜㅜ
	
	
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
	renderer.setSize(canvasWidth, canvasHeight);
	document.getElementById('preview').appendChild(renderer.domElement);
			
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(45, (canvasWidth / canvasHeight), 1, 1000);
	camera.position.set(0,5,30);
	camera.lookAt( scene.position );	
	renderer.setClearColorHex(0xffffff, 1);
	
	scene.add( new THREE.AmbientLight( 0x404040 ) );

	var directionalLight = new THREE.PointLight(0xffffff,0.8 );

	directionalLight.position.set(-100,200,100);
	scene.add( directionalLight );
}

function prepareModel()
{
	loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
			      
	loader.load( 'model/test.dae', function ( collada ) {
	var dae = collada.scene;
	monsterMesh = dae;
	dae.position.set(0,-5,0);
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
        $('clearbtn').addEventListener('click',clearCanvas,false);
	coverMask();
        //console.log(mine.stroketype);
	
	//----3D MODEL-----//
	preview.addEventListener('mousedown',previewClickStatus,false);
	preview.addEventListener('mousemove',rotateModel,false);
	preview.addEventListener('mouseup',previewReset,false);
	
	
	
},false);

