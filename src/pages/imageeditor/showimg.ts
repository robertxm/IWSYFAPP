import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-showimg',
	templateUrl: 'showimg.html'
})
export class ShowimgPage {
	url: string;
	stage: any;
	height:number;
	constructor(public navCtrl: NavController,
		public params: NavParams) {

		this.url = this.params.get('imgdata');		//"assets/img/b1f2-103.jpg";//
		console.log(this.url);
		this.height = window.innerHeight;
	}

	ionViewWillLeave() {
	}

	ngOnInit() {
		var stage = document.getElementById('stage');
		this.stage = stage;
		var jQuery = window['jQuery'];
		let $stage = jQuery(stage);
		var $ = window['$'];
		let container:any = document.getElementById('container');

		// create a manager for that element
		var Hammer = window['Hammer'];
		var manager = new Hammer.Manager(stage);

		// create recognizers
		var Pan = new Hammer.Pan();
		var Pinch = new Hammer.Pinch();
		// add the recognizers
		manager.add(Pan);
		manager.add(Pinch);
		// subscribe to events
		var liveScale = 1;
		var currentRotation = 0;
		manager.on('rotatemove', function (e) {
			var rotation = currentRotation + Math.round(liveScale * e.rotation);
			$.Velocity.hook($stage, 'rotateZ', rotation + 'deg');
		});
		manager.on('rotateend', function (e) {
			currentRotation += Math.round(e.rotation);
		});

		var deltaX = 0;
		var deltaY = 0;
		manager.on('panmove', function (e) {
			var dX = deltaX + (e.deltaX);
			var dY = deltaY + (e.deltaY);

			if (Math.abs(dX) < $stage.width() - 50)
				$.Velocity.hook($stage, 'translateX', dX + 'px');
			if (Math.abs(dY) < $stage.height() - 50)
				$.Velocity.hook($stage, 'translateY', dY + 'px');
		});
		manager.on('panend', function (e) {
			deltaX = deltaX + e.deltaX;
			deltaY = deltaY + e.deltaY;
		});

		// subscribe to events
		var currentScale = 1;
		function getRelativeScale(scale) {
			return scale * currentScale;
		}
		manager.on('pinchmove', function (e) {
			// do something cool
			var scale = getRelativeScale(e.scale);
			$.Velocity.hook($stage, 'scale', scale);
		});
		manager.on('pinchend', function (e) {
			// cache the scale
			currentScale = getRelativeScale(e.scale);
			liveScale = currentScale;
		});
        console.log(this.height);
		console.log(this.stage.style.height);
		if (this.url) {
			// this.stage.style.height = (this.height-50)+"px";
			// container.style.height = (this.height-50) +"px";
			this.stage.style.backgroundImage = 'url(' + this.url + ')';
		} else {
			this.stage.style.backgroundImage = '';
			this.stage.style.textAlign = "center";
			this.stage.style.lineHeight = this.height;//"400px";
			this.stage.innerText = '没有数据！请返回。';
		}
		console.log(this.stage.style.height);
	}

	hideBigImage() {
		this.navCtrl.pop();
	};
}
