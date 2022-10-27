//js with functions using no global variables

//==== globals
var gv_filterTreshold = 123; //should be given into function of filter, but for now global instead
var gv_invert = 0;

// ======================================================================================
// ==== FILTERS =========================================================================
// ======================================================================================
//============ filter 1
//==== filter: apply black/transpirant filter to image object
function F_blackEngrave(img, iv_invert= 0, iv_treshold = 150){
	//custom filter
	gv_filterTreshold = iv_treshold;
	gv_invert = iv_invert;
	img.filters.push(new fabric.Image.filters.Engrave());
	img.applyFilters();
}

//==== black and transpirant
 fabric.Image.filters.Engrave = fabric.util.createClass(fabric.Image.filters.BaseFilter,  {
    type: 'Engrave',
    applyTo: function(canvasEl) {
      var context = canvasEl.getContext('2d'),
          imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
          data = imageData.data,
          len = imageData.width * imageData.height * 4,
          index = 0,
          average;

      while (index < len) {
		var lv_Intensity = data[index] + data[index + 1] + data[index + 2];
		var lv_newIntensity=0;
		var lv_treshold = gv_filterTreshold;
		//treshold
		if(lv_Intensity>(lv_treshold*3)){
			lv_newIntensity=255;
		}
		//invert gv_invert
		if(gv_invert===1){
			lv_newIntensity=255-lv_newIntensity;
		}
		//pixel processing
        data[index]     = lv_newIntensity;
        data[index + 1] = lv_newIntensity;
        data[index + 2] = lv_newIntensity;
		data[index + 3] = 255-lv_newIntensity;
        index += 4;
      }
      context.putImageData(imageData, 0, 0);
    }
});

//============= filter 2
//==== filter: apply gray/transpirant filter to image object
function F_grayEngrave(img, iv_invert= 0){
	//custom filter	
	gv_invert = iv_invert;
	img.filters.push(new fabric.Image.filters.EngraveGray());
	img.applyFilters();
}

//==== gray and trapsirant
 fabric.Image.filters.EngraveGray = fabric.util.createClass(fabric.Image.filters.BaseFilter,  {
    type: 'EngraveGray',
    applyTo: function(canvasEl) {
      var context = canvasEl.getContext('2d'),
          imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
          data = imageData.data,
          len = imageData.width * imageData.height * 4,
          index = 0,
          average;
	  //loop over pixels
      while (index < len) {
		var lv_Intensity = data[index] + data[index + 1] + data[index + 2];
		//invert gv_invert
		if(gv_invert==1){
			lv_Intensity=255-lv_Intensity;
		}
		//pixel procssing
        data[index]     = 0;
        data[index + 1] = 0;
        data[index + 2] = 0;
		if(data[index + 3]>0){ //keep original transpiricy
			data[index + 3] = 255-lv_Intensity;
		}
        index += 4;
      }
      context.putImageData(imageData, 0, 0);
    }
});
fabric.Image.filters.EngraveGray.fromObject = fabric.Image.filters.BaseFilter.fromObject; //!! important else unable to save objects to json

//====resize image
function F_resizeImage(img, scale=1){
	img.height = img.height*scale;
	img.width  = img.width *scale;
	
//	img.filters.push(
//               new fabric.Image.filters.Resize({
//                        resizeType: 'hermite',
//                        scaleX: scale,
//                        scaleY: scale
//                       })
//                     );
//	img.applyFilters();
}


// ======================================================================================
// ==== SAVE ============================================================================
// ======================================================================================
//====save canvas to svg to console
function F_save(iv_overlayEngraving,iv_overlayCut,iv_canvas){
	//store original render
	var lv_saveData = iv_canvas.toJSON();
	console.log("ORIGINAL:");
	console.log(lv_saveData);
	
	//remove background
	  if(iv_canvas.backgroundImage) {changeToColor(iv_canvas);}
	  else {changeToImage(iv_canvas);}
	//change forground - engraving
	  iv_canvas.setOverlayImage(iv_overlayEngraving, iv_canvas.renderAll.bind(iv_canvas));
	//update canvas after a delay
	  setTimeout(function() {F_engraveData(iv_canvas);}, 100); // 100 ms - should be enough to draw something simple
	
	//local functions
	function F_engraveData(iv_canvas) { 
		//show output
		console.log("SVG:");
		console.log(iv_canvas.toSVG());
		console.log("JSON:");
		console.log(iv_canvas.toJSON());
		console.log("OBJECT:");
		console.log(iv_canvas.toObject());
		//change forground - cut
		iv_canvas.setOverlayImage(iv_overlayCut, iv_canvas.renderAll.bind(iv_canvas));
		setTimeout(function() {F_cutData(iv_canvas);}, 100); // 100 ms - should be enough to draw something simple
	
		function F_cutData(iv_canvas) { 
			console.log("SVG:");
			console.log(iv_canvas.toSVG());
			//load original canvas
			iv_canvas.loadFromJSON(lv_saveData);
		}
	
	}
	
	// ====
	function changeToColor(iv_canvas) { 
		iv_canvas.backgroundImage = 0;
		iv_canvas.backgroundColor = '#fff';
		iv_canvas.renderAll();
	}
	
	// ====
	function changeToImage(iv_canvas) {
		iv_canvas.setBackgroundImage(null, function() {
		iv_canvas.renderAll();
		});
	}
}

// ======================================================================================
// ==== TEXT ============================================================================
// ======================================================================================
//hint: call upon  F_popupCreator to start popup
//====1 helper function for popup in F_textBut
function showDDFont() {
	document.getElementById("myDropdownFont").classList.toggle("show");
}
function showDDStyle() {
	document.getElementById("myDropdownStijl").classList.toggle("show");
}

//2. close the dropdown if the user clicks outside of it
window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {
		F_toggleDropdown();
	  }
}

//3.toggle dropdown
function F_toggleDropdown(){
	var dropdowns = document.getElementsByClassName("dropdown-content");
	var i;
	for (i = 0; i < dropdowns.length; i++) {
		var openDropdown = dropdowns[i];
		if (openDropdown.classList.contains('show')) {
			openDropdown.classList.remove('show');
		}
	}
}

//4. update text
var gv_textData=["Voorbeeld Tekst","Arial","normal"];
function F_textUpdateText(iv_text){
	gv_textData[0]=iv_text;
	F_updateText();
}
function F_textUpdateFont(iv_font){
	F_toggleDropdown();
	gv_textData[1]=iv_font;
	F_updateText();
}
function F_textUpdateStyle(iv_style){
	gv_textData[2]=iv_style;
	F_updateText();
}
function F_updateText(){
	//var lv_textCanvas = new fabric.Canvas("textCanvas");
	var lv_string=gv_textData[1].replace(/_/g,' '); // replace '_' with ' '
	F_text(0,gv_textData[0],lv_string,gv_textData[2],60,0,0);
}

//==== place text to canvas
function F_placeText(iv_canvas){
	F_placeTextLocal();
}

//==== content of text menu
function F_textCreator(iv_canvas,iv_element){
	/* When the user clicks on the button, 	toggle between hiding and showing the dropdown content */
	//iv_element= element to use as popup, just an empty div will work
	//custom content 
	var fonts = ["Times_New_Roman", "Arial", "Impact", "Papyrus","Courier_New","Calibri","Comic_Sans_MS","Brush_Script_MT"];
	var fontStyle = ["normal", "italic", "bold"];
	//content of modal
	var lv_modalContent = ''
	+'<div class="dropdown">'
	+'<button onclick="showDDFont()" class="dropbtn">Font</button>'
	+'  <div id="myDropdownFont" class="dropdown-content">';
	for(i=0;i<fonts.length;i++){
		var lv_add = '<a onclick=F_textUpdateFont("' + fonts[i] +'")>'+fonts[i]+'</a>';
		lv_modalContent=lv_modalContent+lv_add;	
	}
	lv_modalContent=lv_modalContent+''
	+'  </div>'
	+'</div>'
	+'<div class="dropdown">'
	+'<button onclick="showDDStyle()" class="dropbtn">Stijl</button>'
	+'  <div id="myDropdownStijl" class="dropdown-content">';;
		for(i=0;i<fontStyle.length;i++){
		var lv_add = '<a onclick=F_textUpdateStyle("' + fontStyle[i] +'")>'+fontStyle[i]+'</a>';
		lv_modalContent=lv_modalContent+lv_add;	
	}
	lv_modalContent=lv_modalContent+''
	+  '</div>'
	+'</div>'
	+'<button onclick="F_placeText()" class="dropbtn">Plaats</button>'
	+'<style>'
	+'.dropbtn {'
	+'    background-color: #555;'
	+'    color: white;'
	+'    padding: 16px;'
	+'    font-size: 16px;'
	+'    border: none;'
	+'    cursor: pointer;'
	+'	  margin: 4px'
	+'}'
	+'.dropbtn:hover, .dropbtn:focus {'
	+'    background-color: #4CAF50;'
	+'}'
	+'.dropdown {'
	+'    position: relative;'
	+'    display: inline-block;'
	+'}'
	+'.dropdown-content {'
	+'    display: none;'
	+'    position: absolute;'
	+'    background-color: #f1f1f1;'
	+'    min-width: 160px;'
	+'    overflow: auto;'
	+'    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);'
	+'    z-index: 1;'
	+'}'
	+'.dropdown-content a {'
	+'    color: black;'
	+'    padding: 12px 16px;'
	+'    text-decoration: none;'
	+'    display: block;'
	+'}'
	+'.dropdown a:hover {background-color: #ddd;}'
	+'.show {display: block;}'
	+'#tempCanvasDiv{text-align:center;display: inline-block;}'
	+'</style>'
	
	+'<br><div id=tempCanvasDiv><canvas id="textCanvas" width="600" height="100" style="border:0px solid #000000"></canvas></div>';
	
	F_popupCreator(iv_element, lv_modalContent); // 100 ms - should be enough to draw something simple
}

//==== popup creator menu
function F_popupCreator(iv_element, iv_contentHTML=''){
	//iv_element = element used for popup. empty div will work
	//iv_contentHTML = content to show in popup
	
	document.getElementById(iv_element).innerHTML =	'<style>'
	+'	.modal {'// The Modal (background) 
	+'		display: none;  ' // Hidden by default
	+'		position: fixed;  '// Stay in place
	+'		z-index: 1;  '// Sit on top
	+'		padding-top: 100px;  '// Location of the box
	+'		left: 0;'
	+'		top: 0;'
	+'		width: 100%; '// Full width
	+'		height: 100%; '// Full height
	+'		overflow: auto; '// Enable scroll if needed
	+'		background-color: rgb(0,0,0); '// Fallback color
	+'		background-color: rgba(0,0,0,0.4); '// Black w/ opacity
	+'	}'
	+'	.modal-content {'// Modal Content 
	+'		background-color: #fefefe;'
	+'		margin: auto;'
	+'		padding: 20px;'
	+'		border: 1px solid #888;'
	+'		width: 80%;'
	+'		border-radius:10px;'
	+'		text-align: center;'
	+'	}'		
	+'	.close {'// The Close Button 
	+'		color: #aaaaaa;'
	+'		float: right;'
	+'		font-size: 28px;'
	+'		font-weight: bold;'
	+'	}'
	+'		.close:hover,'
	+'	.close:focus {'
	+'		color: #000;'
	+'		text-decoration: none;'
	+'		cursor: pointer;'
	+'	}'
	+'</style>'
	//<!-- The Modal -->
	+'<div id="myModal" class="modal">'
	//<!-- Modal content -->
	+'  <div class="modal-content">'
	+'	<span class="close">&times;</span>'
	+ iv_contentHTML
	+'  </div>'
	+'</div>'
	
	+'<script>';
	// Get the modal
	var modal = document.getElementById("myModal");
	// Get the button that opens the modal
	//var iv_button = document.getElementById("myBtn");
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	// When the user clicks the button, open the modal 
	modal.style.display = "block";
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			F_closeModal(iv_element,modal);
		}
	}
	window.gv_initPopupCanvas = 0;
}

//==== close popup
//if you want to close the modal from F_popupCreator, use this function in your iv_contentHTML
function F_closeModal(iv_element,modal){
	//iv_element = use the elment used to make the popup
	//var modal = document.getElementById("myModal");
	if(modal==""){
		modal = document.getElementById("myModal");
	}
	modal.style.display = "none";
	document.getElementById(iv_element).innerHTML =	'';
}

//==== place text
function F_text(iv_canvas=0,iv_text="hello world", iv_font="Calibri",iv_style="normal",iv_size=60,iv_x=0,iv_y=0,iv_selectable=0,iv_canvasName="#textCanvas"){
	if(iv_x==0){ //standart position
		iv_x=$(iv_canvasName).width()/2;
	}
	if(iv_y==0){ //standart position
		//iv_y=$(iv_canvasName).height()/2;
		iv_y=20;
	}
	if(iv_canvas == 0){
		if(gv_initPopupCanvas == 0){
			window.gv_initPopupCanvas = 1;
			if(iv_canvas==0){
				window.gv_textCanvas = new fabric.Canvas("textCanvas");
			}
		}
		gv_textCanvas.clear();
	}
	else{
		window.gv_textCanvas = iv_canvas;
	}

	var text = new fabric.IText(
		  //text
		iv_text
		,{ //position
		left: iv_x
		,
		top: iv_y
		, //font
		fontFamily: iv_font
		,
		fontStyle: iv_style
		,
		fontSize: iv_size
	});
	text.selectable = iv_selectable;
	text.left = text.left-text.width/2;
	//text.top = text.left-text.height/4
	gv_textCanvas.add(text);
	gv_textCanvas.renderAll();
	
}
