import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LocalStorage } from '../../providers/local-storage';
import { NativeService } from "../../providers/nativeservice";
//import { ImgeditorPage } from '../../pages/imageeditor/imgeditor';
import { ShowimgPage } from '../../pages/imageeditor/showimg';
import { ImageEditorModal } from '../../pages/imageeditor/imageeditormodal';
import { initBaseDB } from '../../providers/initBaseDB';

@Component({
	selector: 'page-issue',
	templateUrl: 'issue.html'
})
export class IssuePage {
	roomname: string;
	position: string;
	positionid: string;
	checkitem: string;
	checkitemid: string;
	itdesc: string;
	descplus: string;
	uglevel: string;
	vend: string;
	vendid: string;
	resunit: string;
	resunitid: string;
	positions: Array<string>;
	checkitems: Array<any>;
	checkitemids:Array<any>;
	itemdescs: Array<Array<string>>;
	urgencylevel: Array<string>;
	vendors: Array<any>;
	vendids: Array<any>;
	responsibilityunits: Array<any>;
	responsibilityunitids: Array<any>;
	images: Array<string>;
	registertime: string;
	duetime: string;
	issueid: string;
	issue_x: number;
	issue_y: number;
	roomid: string;
	url: string;
	buildingname: string;
	projid: string;
	batchid: string;
	positionids: Array<string>;
	fixedchecked: boolean;
	first: boolean;
	buildingid: string;
	userid: string;
	username: string;
	type: number;
	vendmanagers:Array<string>;
    manager:string;
	constructor(public localStorage: LocalStorage, private camera: Camera, public navCtrl: NavController, public alertCtrl: AlertController, public initBaseDB: initBaseDB,
		public params: NavParams, private nativeService: NativeService, private modalCtrl: ModalController) {
		this.projid = this.params.get('projid');
		this.buildingname = this.params.get('buildingname');
		this.roomid = this.params.get('roomid');
		this.position = this.params.get('section');
		this.issue_x = this.params.get('x');
		this.issue_y = this.params.get('y');
		this.roomname = this.params.get('roomname');
		this.batchid = this.params.get('batchid');
		this.buildingid = this.params.get('buildingid');
		this.type = this.params.get('type');
		let areas: Array<any>; areas = []; areas = this.params.get('areas');
		this.positions = [];
		this.positionids = [];
		areas.forEach(v => {
			this.positions.push(v.name); //this.positions = ["厨房", "餐厅", "客厅", "阳台", "主卧", "次卧", "公用卫生间", "主卧卫生间"];
			this.positionids.push(v.positionid);
		})
		console.log(this.positions);
		this.checkitems = [];
		this.checkitemids = [];
		this.itemdescs = [];
		this.vendors = [];
		this.vendids = [];
		this.vendmanagers = [];
		this.responsibilityunits = [];
		this.responsibilityunitids = [];
		// this.checkitems = ["插座", "灯具(户内)", "多媒体箱", "给排水管(立管与支管)", "红外探测器", "开关", "空调百叶", "空调洞口", "空调机位", "楼板(顶棚、地面)", "门头石"];
		// this.itemdescs = [["布局不合理", "高低不一致", "松动", "损伤", "歪斜", "位置不合理", "污染", "型号安装错误", "遗漏或数量少", "周边墙面凹凸、不平整"]
		// 	, ["灯不亮", "灯具缺损", "灯具位置不合理", "数量不合理", "其他"]
		// 	, ["部件缺失", "锁缺失", "箱门变形、损坏", "线路不通", "布线杂乱"]
		// 	, ["出水不洁净", "给水管渗漏"]];
		this.urgencylevel = ["一般", "紧急"];
		// this.vendors = ["八达建设", "柏事特", "甲方", "盼盼安全门", "通力电梯", "维度化工"];
		// this.responsibilityunit = ["八达建设", "柏事特", "甲方", "盼盼安全门", "通力电梯", "维度化工"];
		this.images = [];
		this.checkitem = '';
		this.itdesc = '';
		this.descplus = '';
		this.uglevel = '一般';
		this.vend = '';
		this.resunit = '';
		this.issueid = '';
		this.fixedchecked = false;
		this.first = true;
		this.localStorage.getItem('curuser').then(val => {
			this.userid = val.userid; this.username = val.username;
		})

		if (this.position) {
			this.positionid = this.positionids[this.positions.indexOf(this.position)];
			this.initBaseDB.getcheckitem(this.projid, this.roomid, this.positionid).then(val => {
				val.forEach(v=>{
                  this.checkitems.push(v.name);
				  this.checkitemids.push(v.id);
				})				
			})
		}
	}

	positionchange() {
		this.positionid = this.positionids[this.positions.indexOf(this.position)];
		this.initBaseDB.getcheckitem(this.projid, this.roomid, this.positionid).then(val => {
			console.log(val);
			this.checkitems = [];this.checkitemids = [];
			val.forEach(v=>{
                  this.checkitems.push(v.name);
				  this.checkitemids.push(v.id);
				})	
		})
	}

	itemchange() {
		this.checkitemid = this.checkitemids[this.checkitems.indexOf(this.checkitem,0)];
		this.initBaseDB.getcheckitemdescvend(this.projid, this.roomid, this.checkitemid).then(val => {
			console.log(val);
			this.itemdescs = val[0];
			this.responsibilityunits = [];this.responsibilityunitids = []; this.vendids = []; this.vendors = [];
			val[1].forEach(v=>{
				this.responsibilityunits.push(v.name);
				this.responsibilityunitids.push(v.id);
				this.vendors.push(v.name);
				this.vendids.push(v.id);
				this.vendmanagers.push(v.manager);
			})
		})
	}

	vendorchange() {
		this.vendid = this.vendids[this.vendors.indexOf(this.vend,0)];
		console.log("vendorid:" + this.vendid);		
		this.manager = this.vendmanagers[this.vendors.indexOf(this.vend,0)];
	}

	responsibilityunitchange() {
		this.resunitid = this.responsibilityunitids[this.responsibilityunits.indexOf(this.resunit,0)];		
	}

	fixedchange(event) {
		console.log(event);
		console.log(this.fixedchecked);
		console.log(event.checked);	
		this.fixedchecked = event.checked;	
	}

	cameraclick() {
		const options: CameraOptions = {
			quality: 85,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		}

		this.camera.getPicture(options).then((imageData) => {
			var src = 'data:image/jpeg;base64,' + imageData;
			const modal = this.modalCtrl.create(ImageEditorModal, {
				imageSrc: src, username: this.username
			});
			modal.onDidDismiss(result => {
				if (result) {
					this.images.push(result);
				}
			});
			modal.present();
		}, (err) => {
			// Handle error
		});

	}

	//   private getPictureSuccess(imageBase64) {
	//     this.isChange = true;        	
	// 	this.images.push('data:image/jpeg;base64,' + imageBase64);

	//   }

	//   saveAvatar() {
	//     if (this.isChange) {
	//       console.log(this.imageBase64);//这是头像数据.
	//       this.nativeService.showLoading('正在上传....');
	//       this.viewCtrl.dismiss({avatarPath: this.avatarPath});//这里可以把头像传出去.
	//     } else {
	//       this.dismiss();
	//     }
	//   }

	//   dismiss() {
	//     this.viewCtrl.dismiss();
	//   }


	ionViewWillEnter() {

	}

	uploaddata(): Promise<Array<any>> {
		return new Promise((resolve) => {
			let promise = new Promise((resolve) => {
				resolve(100);
			});
			resolve(promise.then((v1) => {
				return this.initBaseDB.updateImgData(this.projid,this.batchid,this.buildingid, this.images);
			}).then((v2: any) => {
				let sql = "insert into #tablename# (Id,BatchId,IssueId,RoomId,PositionId,CheckItemId,PlusDesc,IssueDesc,UrgencyId,IssueStatus,VendId,ResponVendId,ProjId,RegisterDate,VersionId,BuildingId,EngineerPhone,EngineerName,X,Y,manager #imgfields# #reformdate#) values (#values#)"
				let value = [];
				let now = new Date();
				let refields = "";
				this.issueid = '' + now.valueOf() + Math.random();
				let IssueStatus = '待派单';
				if (this.fixedchecked) {
					IssueStatus = '已整改';
					refields = ',ReFormDate,ReviewDate';
				}
                console.log("x:"+this.issue_x+"y:"+this.issue_y);
				value.push("'" + this.issueid + "'");
				value.push("'" + this.batchid + "'");
				value.push("'新增问题'");
				value.push("'" + this.roomid + "'");
				value.push("'" + this.positionid + "'");
				value.push("'" + this.checkitemid + "'");
				value.push("'" + this.descplus + "'");
				value.push("'" + this.itdesc + "'");
				value.push("'" + this.uglevel + "'");
				value.push("'" + IssueStatus + "'");
				value.push("'" + this.vendid + "'");
				value.push("'" + this.resunitid + "'");
				value.push("'" + this.projid + "'");
				value.push("datetime('now', 'localtime')");
				value.push("0");
				value.push("'" + this.buildingid + "'");
				value.push("'" + this.userid + "'");
				value.push("'" + this.username + "'");
				value.push(this.issue_x);
				value.push(this.issue_y);
				value.push("'" + this.manager + "'");
				let imgfields = '';
				for (var i = 0; i < v2.length; i++) {
					imgfields += ',ImgBefore' + (i+1).toString();
					value.push("'" + v2[i] + "'");
					console.log(imgfields);
				}
				if (IssueStatus == '已整改') {
					value.push("datetime('now', 'localtime')");
					value.push("datetime('now', 'localtime')");
				}// #imgfields# #reformdate#) values (#values#)"
				sql = sql.replace('#imgfields#', imgfields).replace('#reformdate#', refields).replace('#values#', value.join(',')).replace('#tablename#',this.initBaseDB.getissuetablename(this.type));
				console.log(sql);
				return this.initBaseDB.updateIssue([sql]);
			}).then((v3) => {
				return this.initBaseDB.updateuploadflag(this.projid, this.batchid, this.buildingid, this.type);
			}).catch(err => {
				console.log('问题提交失败:' + err);
				alert('问题提交失败:' + err);
			}))
		})
	}

	uploadclick() {
		this.uploaddata().then(v=>{
			this.navCtrl.pop();
		})
	}

	deleteimage(imagesrc) {
		let i = 0;
		this.images.forEach(element => {
			if (element == imagesrc)
				this.images.splice(i, 1);
			i++;
		});
	}
	//点击图片放大
	showBigImage(imageName) {  //传递一个参数（图片的URl）
		this.navCtrl.push(ShowimgPage, { imgdata: imageName });
		//this.url = imageName;                   //$scope定义一个变量Url，这里会在大图出现后再次点击隐藏大图使用
		//this.bigImage = true;                   //显示大图		
	};
}
