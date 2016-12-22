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
    upimgWidth:'',
    upimgHeight:'',
    ctxUp:'',
    savebtn:'',
    mouseInitPosition:{
        width:'',
        height:'',
    },
    mouseMovePosition:{
        width:'',
        height:''
    },
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
        //裁剪按钮增加监听事件
        self.savebtn = document.getElementsByClassName("js-fic-crop");
        self.savebtn[0].addEventListener('click',saveCropImg,false);
        function saveCropImg(){
            if(self.UpimgBox == ''){
                alert('请上传需要裁剪的图片');
            }else{
                var base641 = document.getElementById("base64");
                // base64.src = self.UpimgBox.toDataURL('image/png');
                var base64 = self.UpimgBox.toDataURL('image/jpeg');
                //去掉url头，并转化成byte
                var bytes = window.atob(base64.split(',')[1]); 
                //处理异常,将ascii码小于0的转换为大于0
                var ab = new ArrayBuffer(bytes.length);  
                var ia = new Uint8Array(ab);  
                for (var i = 0; i < bytes.length; i++) {  
                    ia[i] = bytes.charCodeAt(i);  
                }      
                var blobFile = new Blob( [ab] , {type : 'image/jpeg'}); 
                blobFile.name = 'test';
                //console.log(blobFile);
                //console.log(URL.createObjectURL(blobFile));
                //上传jpg格式文件
                base641.src = URL.createObjectURL(blobFile);
            }
        }
	},
    readFile: function(){
        var self = this;
        self.ficInput = document.getElementById("fic-upimg");
        //self.ficImage = document.getElementById("ficImage");
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
        //缩放监测
        self.scrollScale();
    },
    drawCanvasUpImg: function(){
        var self = this;
        self.UpimgBox = document.getElementById("fic-iUpcav");
        self.ctxUp = self.UpimgBox.getContext('2d');
        self.upimgWidth = self._img.width*180/300;
        self.upimgHeight = self._img.height*240/400;
        self.UpimgBox.style.display = "block";
        self.ctxUp.drawImage(self._img,0,0,self.upimgWidth,self.upimgHeight,0,0,180,240);
        self.upCanvasEvent();
    },
    upCanvasEvent: function(){
        var self = this;
        self.UpimgBox.addEventListener('mousedown',function(e){
            if(self.mouseInitPosition.width == ''){
                self.mouseInitPosition.width = e.screenX;
                self.mouseInitPosition.height = e.screenY;
            }
            self.UpimgBox.addEventListener('mousemove',MouseMoveEvent,false);
        },false);
        self.UpimgBox.addEventListener('mouseup',function(){
            self.UpimgBox.removeEventListener('mousemove',MouseMoveEvent,false);
        },false);
        function MouseMoveEvent(e){
            self.mouseMovePosition.width = e.screenX - self.mouseInitPosition.width;
            self.mouseMovePosition.height = e.screenY - self.mouseInitPosition.height;
            var drawWidth = parseInt(self.mouseMovePosition.width/300*self._img.width);
            var drawHeight = parseInt(self.mouseMovePosition.height/400*self._img.height);
            //重新绘制顶部图片
            if(drawWidth < 0){
                drawWidth = 0;
            }else if(drawWidth > 120*self._img.width/300){
                drawWidth = 120*self._img.width/300;
            }
            if(drawHeight < 0){
                drawHeight = 0;
            }else if(drawHeight > 160*self._img.height/400){
                drawHeight = 160*self._img.height/400;
            }
            self.ctxUp.drawImage(self._img,drawWidth,drawHeight,self.upimgWidth,self.upimgHeight,0,0,180,240);
            //顶部图片的位移
            if(self.mouseMovePosition.width < 0){
                self.mouseMovePosition.width = 0;
            }else if(self.mouseMovePosition.width>120){
                self.mouseMovePosition.width = 120;
            }
            if(self.mouseMovePosition.height < 0){
                self.mouseMovePosition.height = 0;
            }else if(self.mouseMovePosition.height>160){
                self.mouseMovePosition.height = 160;
            }
            self.UpimgBox.style.left = self.mouseMovePosition.width+'px';
            self.UpimgBox.style.top = self.mouseMovePosition.height+'px';
        }
    },
    scrollScale: function(){
        var self = this;
        window.addEventListener('onmousewheel',MouseScrollEvent,false);
        function MouseScrollEvent(e){
            alert(1);
        }
    }
}