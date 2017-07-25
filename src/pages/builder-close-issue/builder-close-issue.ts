import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NativeService } from "../../providers/nativeservice";
import { ShowimgPage } from '../../pages/imageeditor/showimg';
import { ImageEditorModal } from '../../pages/imageeditor/imageeditormodal';

@IonicPage()
@Component({
	selector: 'page-builder-close-issue',
	templateUrl: 'builder-close-issue.html',
})
export class BuilderCloseIssue {
	username: string;
	images: Array<any>;
	imagesafter: Array<any>;
	fixeddesc: string;
	overdays: number;
	reasonovertime: string = '';
	reasonovertimeother: string = '';
	reasonsovertimes = ["上个工序未按时完成", "人手不够", "部分工程师请假", "其他"];
	//{"issueid":this.issueid,"userid":this.userid,"username":this.username,"images":this.images,"imagesfixed":this.imagesfixed}
	constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private modalCtrl: ModalController,
		public params: NavParams, private viewCtrl: ViewController) {
	}

	ionViewDidLoad() {
		this.images = []; this.imagesafter = [];
		this.images = this.navParams.get('images');
		//this.imagesafter = this.navParams.get('imagesfixed');
		this.username = this.navParams.get('username');
		this.overdays = this.navParams.get('overdays');
	}

    close() {
        this.viewCtrl.dismiss();
    }

	cancel() {
		this.close();
	}

	cansubmit(): boolean {
		let ret: boolean = true;
		if (this.overdays > 0 && this.reasonovertime == '') {
			ret = false;
			alert("已超时，需选择超时原因.")
		} else if (this.reasonovertime == "其他" && this.reasonovertimeother == '') {
			ret = false;
			alert("超时原因选择其他，需填写其他说明.");
		}
		return ret;
	}

	submit() {
		if (this.cansubmit() == true) {			
			let result = this.reasonovertime;
			if (this.reasonovertime == '其他') {
				result = this.reasonovertimeother;
			}
			let results: Array<any>; results = [];
			results.push({ reason: result, img: this.imagesafter,fixeddesc:this.fixeddesc });
			console.log('confirmed:' + results);
			this.viewCtrl.dismiss(results);
		}
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
					this.imagesafter.push(result);
				}
			});
			modal.present();
		}, (err) => {
			// Handle error
		});
	}

	deleteimage(imagesrc) {
		let i = 0;
		this.imagesafter.forEach(element => {
			if (element == imagesrc)
				this.imagesafter.splice(i, 1);
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
