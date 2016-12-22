/*
 * aim:crop images just in front
 * author:JJW
 * write-time:2016-12-20
 */
function fontImageCrop(saveCallBack){
	this.init();
}

fontImageCrop.prototype = {
    fiCrop:'',
    ficInput:'',
    ficImage:'',
    _img:'',
    imgBox:'',
    UpimgBox:'',
    init: function(){
		var self = this;
		self.fiCrop = document.getElementById("fiCrop");
        self.fiCrop.innerHTML = '<div class="fic-toolbox">'+
                                    '<label for="fic-upimg">上传</label> '+
                                    '<button class="js-fic-rotate" type="text">旋转</button> '+
                                    '<button class="js-fic-crop" type="text">裁剪</button>'+
                                '</div>'+
                                '<div class="fic-img">'+
                                    '<div class="fic-input">'+
                                        '<p><b>+</b>添加图片</p>'+
                                        '<input type="file" id="fic-upimg" value="上传图片"  accept="image/*">'+
                                    '</div>'+
                                    '<img src="" id="ficImage" alt="crop-img">'+
                                    '<canvas id="fic-icav" width="300px" height="400px"></canvas>'+
                                    '<canvas id="fic-iUpcav" width="180px" height="240px"></canvas>'+
                                '</div>';
        self.readFile();
	},
    readFile: function(){
        var self = this;
        self.ficInput = document.getElementById("fic-upimg");
        self.ficImage = document.getElementById("ficImage");
        if(typeof FileReader==='undefined'){ 
		    alert("抱歉，你的浏览器不支持 FileReader"); 
		    input.setAttribute('disabled','disabled'); 
		}else{ 
		    self.ficInput.addEventListener('change', readFile, false);
		} 
        function readFile(){
		    var file = this.files[0]; 
		    var reader = new FileReader(); 
		    reader.readAsDataURL(file); 
		    reader.onload = function(e){
                //ficImage.src = this.result;
                //ficImage.style.display = 'block';                
		        self.drawCanvasImg(this.result);//this.result为base64编码的src
		    } 
		}
    },
    drawCanvasImg: function(src){
        var self = this;
        self._img = new Image();
        self._img.src = src;
        self.imgBox = document.getElementById("fic-icav");
        //绘制底部图片
        var ctx = self.imgBox.getContext('2d');
        ctx.drawImage(self._img, 0, 0,300,400);
        //绘制透明图层
        ctx.beginPath();
        ctx.fillStyle="rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, 300, 400);
        //绘制顶部图片
        self.drawCanvasUpImg();
    },
    drawCanvasUpImg: function(){
        var self = this;
        self.UpimgBox = document.getElementById("fic-iUpcav");
        var ctxUp = self.UpimgBox.getContext('2d');
        var upimgWidth = self._img.width*180/300;
        var upimgHeight = self._img.height*240/400;
        ctxUp.drawImage(self._img,0,0,upimgWidth,upimgHeight,0,0,180,240);
        self.upCanvasEvent();
    },
    upCanvasEvent: function(){
        var self = this;
         
    }
}