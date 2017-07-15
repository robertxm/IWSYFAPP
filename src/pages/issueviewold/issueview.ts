import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LocalStorage } from '../../providers/local-storage';
//import { HTTP } from '@ionic-native/http';
import {HttpService} from '../../providers/HttpService';
import {APP_SERVE_URL} from '../../providers/Constants';
import { ShowimgPage } from '../../pages/imageeditor/showimg';

@Component({
	selector: 'page-issueview',
	templateUrl: 'issueview.html'
})
export class IssueviewPage {
	titlename: string;
	section: string;
	checkitem: string;
	itdesc: string;
	descplus: string;
	uglevel: string;
	vend: string;
	resunit: string;
	images: Array<string>;
	imagesfixed: Array<string>;
	imagesadd: Array<string> = [];
	registertime: string;
	duetime: string;
	fixtime: string;
	hidden: boolean;
	arrow: string;
	issueid: string;
	roodid: string;
	status: number;
	savetax: boolean;	
	mousestouch:Array<any>;
	onPaint: any;
	canvas: any;
	context: any;
	buildingname: string;
	imageC : any;
	constructor(public localStorage: LocalStorage, private camera: Camera, public navCtrl: NavController, public alertCtrl: AlertController, public params: NavParams,
	            private httpService: HttpService) {
		this.images = [];
		this.imagesfixed = [];
		this.hidden = true;
		this.arrow = "∨";
		this.roodid = this.params.get('roomid');		
		this.mousestouch = [];
		let val: any;
		this.imageC = new Image();
		this.localStorage.getItem(this.roodid).then(
			val => {
				this.localStorage.getItem("buildings").then(
					v1 => {
						let buildA: Array<any>;
						buildA = v1;
						buildA.forEach(v2 => {
							if (v2.buildingid == val.buildingid)
								this.buildingname = v2.name;
						})
					})

				this.localStorage.getItem(val.drawingid).then(
					v1 => {
						this.localStorage.getItem("b" + val.buildingid + "f" + val.floorid).then(
							v => {
								let rooms: Array<any>;
								rooms = v;
								rooms.forEach(v2 => {
									if (v2.roomid == this.roodid)
										this.titlename = v2.name;
								});
							}
						)
					})
			})
		this.issueid = this.params.get('issueid');
		let issuelist: any;
		this.localStorage.getItem('issue' + this.issueid).then(
			v => {
				issuelist = v;
				this.section = issuelist.sections;
				this.checkitem = issuelist.checkitem;
				this.itdesc = issuelist.itdesc;
				this.descplus = issuelist.descplus;
				this.uglevel = issuelist.uglevel;
				this.vend = issuelist.vend;
				this.resunit = issuelist.responsibility;
				this.registertime = issuelist.registertime;
				this.duetime = issuelist.duetime;
				this.fixtime = issuelist.fixtime;
				let timg: Array<string>;
				timg = issuelist.imgssumbit;
				if (timg) {
					timg.forEach(element => {
						this.localStorage.getItem(element).then(v => {
							this.images.push(v);
						})
					});
				}

				let timgfix: Array<string>;
				timgfix = issuelist.imagesfix;
				if (timgfix) {
					timgfix.forEach(element => {
						this.localStorage.getItem(element).then(v => {
							this.imagesfixed.push(v);
						})
					});
				}

				this.status = issuelist.status;
			})
		//var now = new Date();
		//this.registertime=now.toLocaleDateString()+"  "+now.toLocaleTimeString();		
		this.savetax = true;
	}

	itemchange() {

	}

	plusinfo() {
		document.getElementById("plusinfo").hidden = !document.getElementById("plusinfo").hidden;
		if (document.getElementById("plusinfo").hidden)
			this.arrow = "∨";
		else
			this.arrow = "∧";
	}
    
	cameraclick() {
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		}
		this.camera.getPicture(options).then((imageData) => {
			// imageData is either a base64 encoded string or a file URI
			// If it's base64:
			var src = 'data:image/jpeg;base64,' + imageData;
			this.savetax = true;
			var image = new Image();
			image.onload = val => {
				document.getElementById("canvasdisplay").style.display = "";
				this.canvas = document.getElementById("myCanvas");
				//this.canvas.width = 1;
				//this.canvas.height = 1;
				this.context = this.canvas.getContext("2d");
				this.context.lineWidth = 3;
				this.context.lineJoin = 'round';
				this.context.lineCap = 'round';
				this.context.strokeStyle = '#ff0000';
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
					mouse.x = event.changedTouches[0].pageX - this.canvas.offsetLeft;
					mouse.y = event.changedTouches[0].pageY - this.canvas.offsetTop;
					mouses.push({x:mouse.x,y:mouse.y});								
				}, false);

				this.canvas.addEventListener('touchstart', (event) => {
					this.context.strokeStyle = '#ff0000';
					//this.context.beginPath();					
					mouse ={ x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };  
					this.context.moveTo(mouse.x, mouse.y);
					//console.log(mouses);
                    mouses = [{x:mouse.x,y:mouse.y}];										
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
                    this.mousestouch.push(mouses);
					mouses = [];
				}, false);
				this.canvas.width = 330;//window.innerWidth;// image.width;
				this.canvas.height = 430;//window.innerHeight;//image.height-20;
				this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
				this.context.save();		
			}
			image.crossOrigin = "*";
			image.src = src;
			this.imageC.src = src;
		}, (err) => {
			// Handle error
		});
	}
    newsrc:any;
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
		this.newsrc = this.canvas.toDataURL('image/jpeg',0.78);		
		this.imagesfixed.push(this.newsrc);//'data:image/jpeg;base64,' + imageData);
		this.imagesadd.push(this.newsrc);//'data:image/jpeg;base64,' + imageData);										
		this.savetax = false;
		this.context.clearRect(0, 0, this.context.width, this.context.height);
		document.getElementById("canvasdisplay").style.display = "none";	
	}    

	ionViewWillEnter() {

	}

	passclick() {
		let now = new Date();
		let imgss = [];
		this.imagesadd.forEach(val => {
			let keystr = "img_s" + now.toTimeString + Math.random().toString();
			this.localStorage.setItem(keystr, val);
			imgss.push(keystr);
		})
		let issuelist: any;
		this.localStorage.getItem("issue" + this.issueid).then(
			val => {
				issuelist = val;
				issuelist.status = 4;
				issuelist.imagesfix = imgss;
				//issuelist.push({passtime:now.toLocaleDateString() + "  " + now.toLocaleTimeString()});
				// this.localStorage.removeitem(this.issueid);
				this.localStorage.setItem("issue" + this.issueid, issuelist);
				this.navCtrl.pop();
			})
		let roomlist: any;
		this.localStorage.getItem(this.roodid).then(
			val => {
				roomlist = val;
				roomlist.status = '已通过';
				//roomlist.sections.push(this.section);
				roomlist.issues.push({ issueid: this.issueid, status: "已通过" });
				//this.localStorage.removeitem(this.roodid);
				this.localStorage.setItem(this.roodid, roomlist);
				this.navCtrl.pop();
			})
	}

	rejectclick() {
		let now = new Date();
		let issuelist: any;
		this.localStorage.getItem("issue" + this.issueid).then(
			val => {
				issuelist = val;
				issuelist.status = 2;
				//issuelist.imgsfix = [];		
				//this.localStorage.removeitem(this.issueid);
				this.localStorage.setItem("issue" + this.issueid, issuelist);
				this.navCtrl.pop();
			})
		let roomlist: any;
		this.localStorage.getItem(this.roodid).then(
			val => {
				roomlist = val;
				roomlist.status = '待整改';
				//roomlist.sections.push(this.section);
				roomlist.issues.push({ issueid: this.issueid, status: "待分派" });
				//this.localStorage.removeitem(this.roodid);
				this.localStorage.setItem(this.roodid, roomlist);
				this.navCtrl.pop();
			})
	}

	closedclick() {
		let now = new Date();
		let issuelist: any;
		this.localStorage.getItem("issue" + this.issueid).then(
			val => {
				issuelist = val;
				issuelist.status = 9;
				//this.localStorage.removeitem(this.issueid);
				this.localStorage.setItem("issue" + this.issueid, issuelist);
				this.navCtrl.pop();
			})
		let roomlist: any;
		this.localStorage.getItem(this.roodid).then(
			val => {
				roomlist = val;
				roomlist.status = '非正常关闭';
				//roomlist.sections.push(this.section);
				roomlist.issues.push({ issueid: this.issueid, status: "非正常关闭" });
				//this.localStorage.removeitem(this.roodid);
				this.localStorage.setItem(this.roodid, roomlist);
				this.navCtrl.pop();
			})
	}

	//点击图片放大
	showBigImage(imageName) {  //传递一个参数（图片的URl）
		this.navCtrl.push(ShowimgPage,{imgdata:imageName});	
	};

	deleteimage(imagesrc) {
		let i = 0;
		this.imagesfixed.forEach(element => {
			if (element == imagesrc)
				this.imagesfixed.splice(i, 1);
			i++;
		});
		let j = 0;
		this.imagesadd.forEach(element => {
			if (element == imagesrc)
				this.imagesadd.splice(j, 1);
			j++;
		});
	}

	uploading(){		
		this.httpService.post(APP_SERVE_URL + '/MyDemotables/add',{id:7100,picstr:this.newsrc,Remark:'imagetest'});

		//http://117.29.177.122:8888/api/MyDemotables/add
		//'http://117.29.177.122:8888/api/MyDemotables/Retrieve?id=1000', {}, {}
	}
	loading(){
		this.httpService.get(APP_SERVE_URL + '/MyDemotables/Retrieve',{id:7100}).then(value=>{
            this.imagesfixed.push(value.Picstr);
		});
	}
}
