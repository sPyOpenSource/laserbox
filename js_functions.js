//functions html specific

//functions
function openNav() {
    document.getElementById("mySidebar").style.width = "100";
    document.getElementById("main").style.marginLeft = "250px";
}

//close and open menus
function iconMenuOpen() {
  document.getElementById("iconMenu").style.width = "100%";
}
function iconMenuClose() {
  document.getElementById("iconMenu").style.width = "0%";
}
function bgMenuOpen() {
  document.getElementById("bgMenu").style.width = "100%";
}
function bgMenuClose() {
  document.getElementById("bgMenu").style.width = "0%";
}

//import image
function loadImage(iv_url){
	fabric.Image.fromURL(iv_url, function(oImg) {
		if(oImg.get('width')>200){ //resize image
			var lv_resizer = 200/oImg.get('width');
			oImg.set({ width: oImg.get('width')*lv_resizer, height: oImg.get('height')*lv_resizer, fill: '#f55', opacity: 1 });
		}
		//F_grayEngrave(oImg, 0); //cors problem
		canvas1var.add(oImg);
	},{
		//crossOrigin: 'Anonymous', //!!cors
		left: $("#c").width()/4, //place in middle
		top: $("#c").width()/4
	});
	iconMenuClose();
	setTimeout(function() {canvas1var.renderAll();}, 350); // 100 ms - should be enough to draw something simple
}

//import image bg
function loadImageBg(iv_url){
	canvas1var.setBackgroundImage('images/bg' + iv_url +'.png', canvas1var.renderAll.bind(canvas1var));
	bgMenuClose();
}

//====image uploader
//---- proces data when file is selected from filemanager
$("#fileUpload").change(function() {
	F_readURL(this);

	//file will be shown on the canvas
	function F_readURL(input){
	  var reader = new FileReader();
	  reader.onload = function (event){
		var imgObj = new Image();
		imgObj.src = event.target.result;
		imgObj.onload = function () {
		  var image = new fabric.Image(imgObj);
		  //+resize image
		  var lv_h =image.get('height'), lv_w=image.get('width');
		  if(image.get('width')>200){
			var lv_resizer = 200/image.get('width');
			lv_w = image.get('width')*lv_resizer;
			lv_h = image.get('height')*lv_resizer;
		  }
		  //-
		  image.set({
				angle: 0,
				padding: 10,
				cornersize:10,
				height:lv_h,
				width:lv_w,
		  });

			//if(image.get('width')>200){ //resize image
			//var lv_resizer = 200/image.get('width');
			//image.set({ width: image.get('width')*lv_resizer, height: image.get('height')*lv_resizer, fill: '#f55', opacity: 1 });
			//}

		  canvas1var.centerObject(image);
		  canvas1var.add(image);
		  //add filter
		  F_grayEngrave(image);
		  //update canvas after a delay
		  setTimeout(function() {canvas1var.renderAll();}, 350); // 100 ms - should be enough to draw something simple
		}
	  }
	  reader.readAsDataURL(input.files[0]);
	}

	//black/white editor will be opened when file is selected
	function F_blackWhiteEditor(img){
		F_blackAndWhiteFilter(img);
	}
});

//==== text
