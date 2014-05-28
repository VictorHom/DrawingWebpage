
// Copyright 2010 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//original files are found here: http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/
//I am unsure if I am using the license properly and giving due credit.
//I simplified the drawing app so that buttons are used to select the drawing tools and organized differently.
//Added a few extra features - 
//feature 1 : saving a picture on the given page - you can then save it as name.png (the extension is important)
//feature 2 : loading less images
//feature 3 : showing what tools are selected in the output box
//feature 4 : output box shows date and time in the beginning as well
//colors are lacking but you can change that here in var colorchoices

var canvas;
var context;
var canvasWidth = 300;
var canvasHeight = 300;
var colorchoices = [{color:"purple", hex: "#cb3594"},
{color :"green", hex: "#659b41"},
{color: "yellow", hex:"#ffcf33"}, 
{color:"brown", hex:"#986928"},
{color:"cadet blue", hex:"#5F9EA0"},
{color:"cornflower blue", hex:"#6495ED"},
{color:"dark gray", hex:"#A9A9A9"},
{color:"dark orange", hex:"#FF8C00"},
{color:"dodger blue", hex:"#1E90FF"},
{color:"dark turquoise", hex:"#00CED1"},
{color:"green yellow", hex:"#ADFF2F"},
{color:"lavender", hex:"#E6E6FA"},
{color:"sea green", hex:"#2E8B57"},
{color:"rosy brown", hex:"#BC8F8F"},
{color:"mint cream", hex:"#F5FFFA"},
{color:"indian red", hex:"#CD5C5C"}
];
var sizechoices = [{size :"small", radius: "2"},{size :"normal", radius: "5"},{size: "large", radius: "10"}, {size: "huge", radius: "20"}];
var colorchoice;
var sizechoice;
var crayonTextureImage = new Image();
var clickX = new Array();
var clickY = new Array();
var clickColor = new Array();
var clickTool = new Array();
var clickSize = new Array();
var clickDrag = new Array();
var paint = false;
var curColor = colorchoices[0].hex;
var curTool = "crayon";
var curSize = "normal";

var drawingAreaWidth = canvasWidth;
var drawingAreaHeight = canvasHeight;

var totalLoadResources = 2;
var curLoadResNum = 0;
var outlineImage = new Image();
var crayonTextureImage = new Image();
var fill;

var weekday = new Array(7);
	weekday[0]=  "Sun";
	weekday[1] = "Mon";
	weekday[2] = "Tue";
	weekday[3] = "Wed";
	weekday[4] = "Thu";
	weekday[5] = "Fri";
	weekday[6] = "Sat";
var month = new Array(12);
	month[0] = "Jan";
	month[1] = "Feb";
	month[2] = "Mar";
	month[3] = "Apr";
	month[4] = "May";
	month[5] = "Jun";
	month[6] = "Jul";
	month[7] = "Aug";
	month[8] = "Sep";
	month[9] = "Oct";
	month[10] = "Nov";
	month[11] = "Dec";

var resourceLoaded =  function(){
	if(++curLoadResNum >= totalLoadResources){
		redraw();
	}
};
var prepareCanvas = function(){
	var canvasDiv = document.getElementById('canvasDiv');
canvas = document.createElement('canvas');
canvas.setAttribute('width', canvasWidth);
canvas.setAttribute('height', canvasHeight);
canvas.setAttribute('id', 'canvas');
canvasDiv.appendChild(canvas);

if(typeof G_vmlCanvasManager != 'undefined') {
	canvas = G_vmlCanvasManager.initElement(canvas);
}
context = canvas.getContext("2d");

crayonTextureImage.onload = function() { resourceLoaded(); 
};
crayonTextureImage.src = "images/crayon-texture.png";

outlineImage.onload = function() { resourceLoaded(); 
};
outlineImage.src = "images/blank.png";


$('#canvas').mousedown(function(e)
	{
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		
		paint = true;
		addClick(mouseX, mouseY, false);
		redraw();

});

$('#canvas').mousemove(function(e){
		if(paint==true){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
});

$('#canvas').mouseup(function(e){
		paint = false;
	  	redraw();
});

$('#canvas').mouseleave(function(e){
		paint = false;
});


$('#colorselections').change(function(){
	curColor = 
			
			$('#colorselections option:selected').val();

});

$('#strokesizes').change(function(){
	curSize = 
			
			$('#strokesizes option:selected').val();
			//console.log("dropdown being clicked" + context.fillStyle );
			//sizeSelection = true;
});

$('#clearbutton').mousedown(function(e){
	clickX = new Array();
	clickY = new Array();
	clickColor = new Array();
	clickSize = new Array();
	clickDrag = new Array();
	clearCanvas_Colors();
	$('#dateShow').each(function(){
		this.remove();
	})

	$('.cursor').remove();

	$('#body').append("<p id=dateShow></p>");
	$('#body').append("<div class=cursor></div>");
 
});


};


$(document).ready(function(){
	$('#colorselections').hide();
	$('#strokesizes').hide();
});


var getDropDownList= function(id, optionList) {
    var selected = $("#"+id);
    if (id == "colorselections"){
    	optionList.forEach(function (e) {
        	selected.append("<option" + " value="+ e.hex +">" + e.color + "</option>");
    	});
	} 
	if (id=="strokesizes"){
		optionList.forEach(function (e) {
        	selected.append("<option" + " value="+ e.size +" >" + e.size + "</option>");
    	});
	}
};





var showOptions = function(elem){
	$( "option" ).each(function(){
		this.remove();
	});


	var pressedbutton = elem.value;

	if (pressedbutton == "crayons" || pressedbutton =="markers"){
		if (pressedbutton == "crayons"){curTool = "crayon";}
		if (pressedbutton == "markers"){curTool = "marker";}
		getDropDownList("colorselections", colorchoices);
		getDropDownList("strokesizes", sizechoices);
		$('#colorselections').show();
		$('#strokesizes').show();
	} else {
		curTool = "eraser";
		getDropDownList("strokesizes", sizechoices);
		$('#strokesizes').show();
		$('#colorselections').hide();
	
	}

	

};

function addClick(x, y, dragging)
{

	clickX.push(x);
	clickY.push(y);
	clickTool.push(curTool);
	clickColor.push(curColor);
	clickSize.push(curSize);
	clickDrag.push(dragging);
}


/**
* Clears the canvas.
*/
var clearCanvas= function()
{
	context.clearRect(0, 0, canvasWidth, canvasHeight);
};

function clearCanvas_Colors()
{
	context.fillStyle = '#ffffff'; // Work around for Chrome
	context.fillRect(0, 0, canvasWidth, canvasHeight); // Fill in the canvas with white
	canvas.width = canvas.width; // clears the canvas 
}

var redraw = function(){
	// Make sure required resources are loaded before redrawing
	if(curLoadResNum < totalLoadResources){ return; }
	
	clearCanvas();

	context.save();
	context.beginPath();
	context.rect(0, 0, drawingAreaWidth, drawingAreaHeight);
	context.clip();

	var radius;
	var i = 0;
	for(; i < clickX.length; i++)
	{		
		if(clickSize[i] == "small"){
			radius = 2;
		}else if(clickSize[i] == "normal"){
			radius = 5;
		}else if(clickSize[i] == "large"){
			radius = 10;
		}else if(clickSize[i] == "huge"){
			radius = 20;
		}else{
			alert("Error: Radius is zero for click " + i);
			radius = 0;	
		}
		
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i], clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		
		if(clickTool[i] == "eraser"){
			//context.globalCompositeOperation = "destination-out"; // To erase instead of draw over with white
			context.strokeStyle = 'white';
		}else{
			//context.globalCompositeOperation = "source-over";	// To erase instead of draw over with white
			context.strokeStyle = clickColor[i];
		}
		context.lineJoin = "round";
		context.lineWidth = radius;
		context.stroke();
		
	}
	
	context.restore();

	// Overlay a crayon texture (if the current tool is crayon)
	if(curTool == "crayon"){
		context.globalAlpha = 0.4; // No IE support
		context.drawImage(crayonTextureImage, 0, 0, canvasWidth, canvasHeight);
	}
	context.globalAlpha = 1; // No IE support

	// Draw the outline image
	context.drawImage(outlineImage, 0, 0, drawingAreaWidth, drawingAreaHeight);
};



//posts the images on the same page
var convertCanvasToImage = function(){

	var image = document.getElementById("canvas").toDataURL("image/png")
	var img = new Image();
	img.src = image;
	$('#layouts').append(img);
	// var imageLocal = image.replace("image/png", "image/octet-stream");
	// window.location=imageLocal;

}

var checkSelect = function(){
	printStatus();

};

var printStatus = function(){
	$('#dateShow').append(curColor);
	$('#dateShow').append("</br/>");
	$('#dateShow').append(curTool);
	$('#dateShow').append("</br/>");

};




