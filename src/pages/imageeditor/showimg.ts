import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-showimg',
	templateUrl: 'showimg.html'
})
export class ShowimgPage {
	url:string;
	constructor(public navCtrl: NavController,
		public params: NavParams) {
        
        let elements = document.querySelectorAll(".tabbar");
		if (elements != null) {
			Object.keys(elements).map((key) => {
				elements[key].style.display = 'none';
			});
		}
		this.url = this.params.get('imgdata');
	}

	ionViewWillLeave() {
		let elements = document.querySelectorAll(".tabbar");
		if (elements != null) {
			Object.keys(elements).map((key) => {
				elements[key].style.display = 'flex';
			});
		}
	}

	hideBigImage() {
		this.navCtrl.pop();
	};
}
