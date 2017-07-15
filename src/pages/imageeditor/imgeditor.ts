import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
	selector: 'page-imgeditor',
	templateUrl: 'imgeditor.html'
})
export class ImgeditorPage {
	images: Array<string>;
	savetax: boolean;
	url: string;
	mousestouch: Array<any>;
	onPaint: any;
	canvas: any;
	context: any;
	imageC: any;
	drawcolor: string;
	constructor( public navCtrl: NavController, public alertCtrl: AlertController,public params: NavParams) {
		this.images = [];
		this.images = this.params.get('img');
		this.mousestouch = [];
		this.imageC = new Image();
		let val: any;
		let elements = document.querySelectorAll(".tabbar");
		if (elements != null) {
			Object.keys(elements).map((key) => {
				elements[key].style.display = 'none';
			});
		}
		this.drawcolor = '#0000ff';
		this.editclick(this.params.get('imgdata'));

	}

	editclick(imageData) {

		// imageData is either a base64 encoded string or a file URI
		// If it's base64:
		var src = 'data:image/jpeg;base64,' + imageData;
		this.savetax = true;
		var image = new Image();
		image.onload = val => {
			//document.getElementById("canvasEditor").style.display = "";
			this.canvas = document.getElementById("myCanvasEditor");
			//this.canvas.width = 1;
			//this.canvas.height = 1;
			this.context = this.canvas.getContext("2d");
			this.context.lineWidth = 3;
			this.context.lineJoin = 'round';
			this.context.lineCap = 'round';
			this.context.strokeStyle = this.drawcolor;
			var mouse: any;
			var mouses: Array<any>;
			mouse = { x: 0, y: 0 };
			mouses = [];
			this.mousestouch = [];
			//this.painting = document.getElementById('paint');
			// this.onPaint = val => {
			// 	this.context.lineTo(this.mouse.x, this.mouse.y);
			// 	this.context.stroke();
			// }

			this.canvas.addEventListener('touchmove', (event) => {
				mouse.x = event.changedTouches[0].clientX - this.canvas.getBoundingClientRect().left;
				mouse.y = event.changedTouches[0].clientY - this.canvas.getBoundingClientRect().top;
				mouses.push({ x: mouse.x, y: mouse.y });
			}, false);

			this.canvas.addEventListener('touchstart', (event) => {				
				this.context.strokeStyle = this.drawcolor;					
			    this.context.beginPath();				
				mouse = { x: event.changedTouches[0].clientX - this.canvas.getBoundingClientRect().left, y: event.changedTouches[0].clientY - this.canvas.getBoundingClientRect().top };
				this.context.moveTo(mouse.x, mouse.y);
				//console.log(mouses);
				mouses = [{ x: mouse.x, y: mouse.y }];
				this.canvas.addEventListener('touchmove', (event) => {
					this.context.lineTo(mouse.x, mouse.y);
					this.context.stroke();
				}, false);
			}, false);

			this.canvas.addEventListener('touchend', (event) => {
				this.canvas.removeEventListener('touchmove', (event) => {
					this.context.lineTo(mouse.x, mouse.y);
					this.context.stroke();
				}, false);
				this.mousestouch.push(this.context.strokeStyle);
				this.mousestouch.push(mouses);
				mouses = [];
			}, false);
			this.canvas.width = window.innerWidth;//330;//window.innerWidth;// image.width;
			this.canvas.height = window.innerHeight - 70;//430;//window.innerHeight;//image.height-20;
			this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
			this.context.save();
		}
		image.crossOrigin = "*";
		image.src = src;
		this.imageC.src = src;
	}

	imageeditclick() {
		this.context.font = 15 + "px Arial";
		this.context.textBaseline = 'middle';//更改字号后，必须重置对齐方式，否则居中麻烦。设置文本的垂直对齐方式
		this.context.textAlign = 'right-side';
		//var tw = cxt.measureText(text).width;
		var ftop = this.canvas.height - 15;
		var fleft = this.canvas.width / 5;
		var now = new Date();
		var text = '黄宏拍摄于 ' + now.toLocaleDateString() + "  " + now.toLocaleTimeString();
		this.context.fillStyle = "#ffffff";
		this.context.fillText(text, fleft, ftop);//文本元素在画布居中方式
		this.context.save();
		let newsrc = this.canvas.toDataURL('image/jpeg', 0.78);
		this.images.push(newsrc);//'data:image/jpeg;base64,' + imageData);										
		this.savetax = false;
		this.context.clearRect(0, 0, this.context.width, this.context.height);
		//document.getElementById("canvasEditor").style.display = "none";
	}
    blueclick(){
		this.drawcolor = '#0000ff';
		//this.context.strokeStyle = this.drawcolor;
	}
	redclick(){
		this.drawcolor = '#ff0000';
		//this.context.strokeStyle = this.drawcolor;
	}
	redrawclick() {
		this.context.clearRect(0, 0, this.context.width, this.context.height);
		this.context.drawImage(this.imageC, 0, 0, this.canvas.width, this.canvas.height);
		this.mousestouch.pop();
		this.mousestouch.pop();
		var mouse: any;
		var mouses: Array<any>;
		mouses = [];		
		for (var i = 0; i < this.mousestouch.length; i+=2) {			
			mouses = this.mousestouch[i+1];
			mouse = mouses[0];
			this.context.strokeStyle = this.mousestouch[i];
			this.context.moveTo(mouse.x, mouse.y);
			this.context.beginPath();
			for (var j = 1; j < mouses.length; j++) {
				mouse = mouses[j];
				this.context.lineTo(mouse.x, mouse.y);
				this.context.stroke();
			}
		}
		this.context.save();
	}

	ionViewWillLeave() {
		let elements = document.querySelectorAll(".tabbar");
		if (elements != null) {
			Object.keys(elements).map((key) => {
				elements[key].style.display = 'flex';
			});
		}
	}
}
