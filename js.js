//js for functions directly called in html

// ======================================================================================
// ==== buttons top menu ================================================================
// ======================================================================================
// ====
function butDel(){
	if (canvas1var.getActiveGroup()) {
	  canvas1var.getActiveGroup().forEachObject(function(a) {
		canvas1var.remove(a);
	  });
	  canvas1var.discardActiveGroup();
	}
	else if (canvas1var.getActiveObject()) {
		canvas1var.remove(canvas1var.getActiveObject());
		canvas1var.discardActiveGroup();
	}
	canvas1var.renderAll();
};

// ====
function butUp(){
	var obj = canvas1var.getActiveObject();
	canvas1var.bringForward(obj);
	canvas1var.renderAll();
};

// ====
function butDown(){
	var obj = canvas1var.getActiveObject();
	canvas1var.sendBackwards(obj);
	canvas1var.renderAll();
};

// ======================================================================================
// ==== canvas ==========================================================================
// ======================================================================================
// ====
function F_initCanvas(iv_bg,iv_fg){
	//overlay/onder masks
	canvas1var.setBackgroundImage(iv_bg, canvas1var.renderAll.bind(canvas1var));
	canvas1var.setOverlayImage(iv_fg, canvas1var.renderAll.bind(canvas1var));
	canvas1var.renderAll();
}


// ======================================================================================
// ==== buttons bottom menu =============================================================
// ======================================================================================
// ====
function butLoadImage(){
	document.getElementById('fileUpload').click();
};

// ====
function butEmote(){
	iconMenuOpen();
};

// ====
function butText(){
	F_textCreator(canvas1var,"textEditorMenu");
	//F_text(canvas1var);
};

// ====
function butOk(iv_overlayEngraving,iv_overlayCut){
	F_save(iv_overlayEngraving,iv_overlayCut,canvas1var);
};

//====
function butUnselect(){
	canvas1var.deactivateAll().renderAll();
};

//==== place text to canvas
function F_placeTextLocal(){
	lv_canvas=canvas1var;
	var lv_string=gv_textData[1].replace(/_/g,' '); // replace '_' with ' '
	F_text(lv_canvas,gv_textData[0],lv_string,gv_textData[2],60,0,0,1,"#c");
	
	F_closeModal("textEditorMenu",'');
	//iv_element = use the elment used to make the popup
	//var modal = document.getElementById("myModal");
}

// ======================================================================================
// ==== overlay menus ===================================================================
// ======================================================================================
// ==== menu for icons
function HtmlIconMenu(){
	var lv_nrOfImages =  181;
	var out = '';
	// close button
	out = out + '<a href="javascript:void(0)" class="closebtn" onclick="iconMenuClose()">&times;</a>'
	out = out + '<div id="IconMenuContent" class="overlay-content">';
	//placing each image
	for(i=1;i<lv_nrOfImages;i++){
		out = out + '<div class="iconImage">'+
		'<img src="http://fabricjs.com/assets/' +i +'.svg" width="200" heigth="200" onclick=loadImage("'+ 
		'http://fabricjs.com/assets/'+i+'.svg' +
		'")></div>';
	}
	out = out + '</div>';
	//output HTML
	document.getElementById("iconMenu").innerHTML = out;
}

// ==== menu for backgrounds
function HtmlBgMenu(){
	var lv_nrOfImages =  5+1;
	var out = '';
	// close button
	out = out + '<a href="javascript:void(0)" class="closebtn" onclick="bgMenuClose()">&times;</a>'
	out = out + '<div id="IconMenuContent" class="overlay-content">';
	//placing each image
	for(i=1;i<lv_nrOfImages;i++){
		out = out + '<div class="iconImage"><img src="images/bg' + i +'.png" width="200" heigth="200" onclick="loadImageBg('+ i +')"></div>';
	}
	out = out + '</div>';
	//output HTML
	document.getElementById("bgMenu").innerHTML = out;
}
