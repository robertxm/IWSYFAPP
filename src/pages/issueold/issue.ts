import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LocalStorage } from '../../providers/local-storage';
import { NativeService } from "../../providers/nativeservice";
//import { ImgeditorPage } from '../../pages/imageeditor/imgeditor';
import { ShowimgPage } from '../../pages/imageeditor/showimg';
import { ImageEditorModal } from '../../pages/imageeditor/imageeditormodal';

@Component({
	selector: 'page-issue',
	templateUrl: 'issue.html'
})
export class IssuePage {
	titlename: string;
	section: string;
	checkitem: string;
	itdesc: string;
	descplus: string;
	uglevel: string;
	vend: string;
	resunit: string;
	sections: Array<string>;
	checkitems: Array<string>;
	itemdescs: Array<Array<string>>;
	itemdesc: Array<string>;
	urgencylevel: Array<string>;
	vendors: Array<string>;
	responsibilityunit: Array<string>;
	images: Array<string>;
	registertime: string;
	duetime: string;
	issueid: string;
	issue_x: number;
	issue_y: number;
	roodid: string;
	url: string;
	bigImage: boolean;	
	buildingname: string;
	constructor(public localStorage: LocalStorage, private camera: Camera, public navCtrl: NavController, public alertCtrl: AlertController,
		public params: NavParams, private nativeService: NativeService,private modalCtrl: ModalController) {
		this.sections = ["厨房", "餐厅", "客厅", "阳台", "主卧", "次卧", "公用卫生间", "主卧卫生间"];
		this.checkitems = ["插座", "灯具(户内)", "多媒体箱", "给排水管(立管与支管)", "红外探测器", "开关", "空调百叶", "空调洞口", "空调机位", "楼板(顶棚、地面)", "门头石"];
		this.itemdescs = [["布局不合理", "高低不一致", "松动", "损伤", "歪斜", "位置不合理", "污染", "型号安装错误", "遗漏或数量少", "周边墙面凹凸、不平整"]
			, ["灯不亮", "灯具缺损", "灯具位置不合理", "数量不合理", "其他"]
			, ["部件缺失", "锁缺失", "箱门变形、损坏", "线路不通", "布线杂乱"]
			, ["出水不洁净", "给水管渗漏"]];
		this.urgencylevel = ["一般", "紧急"];
		this.vendors = ["八达建设", "柏事特", "甲方", "盼盼安全门", "通力电梯", "维度化工"];
		this.responsibilityunit = ["八达建设", "柏事特", "甲方", "盼盼安全门", "通力电梯", "维度化工"];
		this.images = [];
		this.roodid = this.params.get('roomid');
		this.section = this.params.get('section');
		this.issue_x = this.params.get('x');
		this.issue_y = this.params.get('y');
		let val: any;
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
						this.sections = v1.sections;
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
		this.checkitem = '';
		this.itdesc = '';
		this.descplus = '';
		this.uglevel = '';
		this.vend = '';
		this.resunit = '';
		this.issueid = '';
		this.bigImage = false;
	}

	itemchange() {
		var index = this.checkitems.indexOf(this.checkitem);
		if (index > 4)
			this.itemdesc = ["布局不合理", "高低不一致", "松动", "损伤", "歪斜", "位置不合理", "污染", "型号安装错误", "遗漏或数量少"];
		else
			this.itemdesc = this.itemdescs[index];
	}


	cameraclick() {
		const options: CameraOptions = {
			quality: 85,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		}
		
		this.camera.getPicture(options).then((imageData) => {
			var src = 'data:image/jpeg;base64,' +imageData;
			const modal = this.modalCtrl.create(ImageEditorModal, {
                imageSrc: src
            });
            modal.onDidDismiss(result => {
                if(result) {
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



	uploaddata() {
		let now = new Date();
		let duedate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

		// let i:number;
		// i=1;
		let imgss = [];
		this.images.forEach(val => {
			let keystr = "img_s" + now.valueOf() + Math.random();
			this.localStorage.setItem(keystr, val);
			imgss.push(keystr);
		})
		let issuelist: any;
		issuelist = {
			sections: this.section, x: this.issue_x, y: this.issue_y, status: 1, checkitem: this.checkitem, itdesc: this.itdesc, descplus: this.descplus, uglevel: this.uglevel,
			vend: this.vend, responsibility: this.resunit, registertime: now.toLocaleDateString() + "  " + now.toLocaleTimeString(), duetime: duedate.toLocaleDateString(), imgssumbit: imgss
		};
		this.issueid = '' + now.valueOf() + Math.random();
		//this.localStorage.removeitem(this.issueid);
		this.localStorage.setItem('issue' + this.issueid, issuelist);

		let roomlist: any;
		this.localStorage.getItem(this.roodid).then(
			val => {
				roomlist = val;
				roomlist.status = '待整改';
				//roomlist.sections.push(this.section);
				roomlist.issues.push({ issueid: this.issueid, status: "待派单" });
				//this.localStorage.removeitem(this.roodid);
				this.localStorage.setItem(this.roodid, roomlist);
				this.navCtrl.pop();
			})

	}

	deleteimage(imagesrc){
		let i = 0;
		this.images.forEach(element => {
			if (element == imagesrc)
			    this.images.splice(i,1);
		    i++;
		});		
	}
	//点击图片放大
    showBigImage(imageName) {  //传递一个参数（图片的URl）
		this.navCtrl.push(ShowimgPage,{imgdata:imageName});
		//this.url = imageName;                   //$scope定义一个变量Url，这里会在大图出现后再次点击隐藏大图使用
		//this.bigImage = true;                   //显示大图		
    };

	hideBigImage() {
		this.bigImage = false;
	};
}
