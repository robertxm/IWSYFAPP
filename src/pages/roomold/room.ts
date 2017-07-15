import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { LocalStorage } from '../../providers/local-storage';
import { IssuePage } from '../issue/issue';
import { IssueviewPage } from '../issueview/issueview';
import { RejectPage } from '../reject/reject';
import { ReceiptPage } from '../receipt/receipt';

@Component({
	selector: 'page-room',
	templateUrl: 'room.html',
})
export class RoomoldPage implements OnInit {

	buildingid: string;
	buildingname: string;
	roomid: string;
	roomname: string;
	roomInfo: any;
	dwgInfo: any;
	dwgFactor: number
	statList: any;
    listview:boolean;
	selectedTab:string;
	issues = [{
    issueId: '1505100031',
    prjid: 'sldfkjsf029323', prjname: '同美花园2期',
    buildingid: '10930414234', buildingname: '18号楼',
    floorid: '10920419kdsjf023', floorname: '21楼',
    roomid: 'ieko098390293lkfs123df', roomname: '2001单元',
    catagory: '墙面', description: '掉漆严重',
    duedate: '2017-06-03', overdays: 19, returntimes: 3,
    ownerid: '10293810012323', ownername: '李小龙',
    assigntoid: '1290301390123', assigntoname: '黄飞鸿',
    status: '已整改'
  }, {
    issueId: '1505100032',
    prjid: 'sldfkjsf029323', prjname: '同美花园2期',
    buildingid: '73187318381', buildingname: '13号楼',
    floorid: '194182479u8uf38', floorname: '10楼',
    roomid: 'ieko098390293lkfs123df', roomname: '0912单元',
    catagory: '照明', description: '开关破损',
    duedate: '2017-06-05', overdays: 0, returntimes: 1,
    ownerid: '10293810012323', ownername: '李小龙',
    assigntoid: '1290301390123', assigntoname: '黄飞鸿',
    status: '待整改'
  }, {
    issueId: '1505100033',
    prjid: 'sldfkjsf029323', prjname: '同美花园2期',
    buildingid: '10930414234', buildingname: '18号楼',
    floorid: '10920419kdsjf023', floorname: '21楼',
    roomid: 'ieko098390293lkfs123df', roomname: '2001单元',
    catagory: '墙面', description: '掉漆严重',
    duedate: '2017-06-03',overdays: 3, returntimes: 0,
    ownerid: '10293810012323', ownername: '李小龙',
    assigntoid: '1290301390123', assigntoname: '黄飞鸿',
    status: '已整改'
  }, {
    issueId: '1505100034',
    prjid: 'sldfkjsf029323', prjname: '同美花园2期',
    buildingid: '10930414234', buildingname: '18号楼',
    floorid: '10920419kdsjf023', floorname: '21楼',
    roomid: 'ieko098390293lkfs123df', roomname: '2001单元',
    catagory: '墙面', description: '掉漆严重',
    duedate: '2017-06-03', overdays: 3, returntimes: 1,
    ownerid: '10293810012323', ownername: '李小龙',
    assigntoid: '1290301390123', assigntoname: '黄飞鸿',
    status: '被退回'
  }, {
    issueId: '1505100035',
    prjid: 'sldfkjsf029323', prjname: '同美花园2期',
    buildingid: '10930414234', buildingname: '18号楼',
    floorid: '10920419kdsjf023', floorname: '21楼',
    roomid: 'ieko098390293lkfs123df', roomname: '2001单元',
    catagory: '墙面', description: '掉漆严重',
    duedate: '2017-06-03', overdays: 0, returntimes: 0,
    ownerid: '10293810012323', ownername: '李小龙',
    assigntoid: '', assigntoname: '',
    status: '待指派'
  }, {
    issueId: '1505100036',
    prjid: 'sldfkjsf029323', prjname: '同美花园2期',
    buildingid: '10930414234', buildingname: '18号楼',
    floorid: '10920419kdsjf023', floorname: '21楼',
    roomid: 'ieko098390293lkfs123df', roomname: '2001单元',
    catagory: '墙面', description: '掉漆严重',
    duedate: '2017-06-03',
    ownerid: '10293810012323', ownername: '李小龙',
    assigntoid: '1290301390123', assigntoname: '黄飞鸿',
    status: '已整改'
  }, {
    issueId: '1505100037',
    prjid: 'sldfkjsf029323', prjname: '同美花园2期',
    buildingid: '10930414234', buildingname: '18号楼',
    floorid: '10920419kdsjf023', floorname: '21楼',
    roomid: 'ieko098390293lkfs123df', roomname: '2001单元',
    catagory: '墙面', description: '掉漆严重',
    duedate: '2017-06-03', overdays: 4, returntimes: 0,
    ownerid: '10293810012323', ownername: '李小龙',
    assigntoid: '1290301390123', assigntoname: '黄飞鸿',
    status: '待整改'
  }, {
    issueId: '1505100038',
    prjid: 'sldfkjsf029323', prjname: '同美花园2期',
    buildingid: '10930414234', buildingname: '18号楼',
    floorid: '10920419kdsjf023', floorname: '21楼',
    roomid: 'ieko098390293lkfs123df', roomname: '2001单元',
    catagory: '墙面', description: '掉漆严重',
    duedate: '2017-06-03', overdays: 0, returntimes: 4,
    ownerid: '10293810012323', ownername: '李小龙',
    assigntoid: '1290301390123', assigntoname: '黄飞鸿',
    status: '被退回'
  }];
	constructor(public navCtrl: NavController, public navParams: NavParams,
		public localStorage: LocalStorage, public loadingCtrl: LoadingController) {
        this.listview = false;
		this.selectedTab = "待整改";
		this.roomid = navParams.get('roomid');
		let val: any;
		this.localStorage.getItem(this.roomid).then(
			val => {
				if (val) {
					this.buildingid = val.buildingid;
					this.localStorage.getItem("buildings").then(
						v1 => {
							let buildA: Array<any>;
							buildA = v1;
							buildA.forEach(v2 => {
								if (v2.buildingid == this.buildingid)
									this.buildingname = v2.name;
							})
						})
					this.localStorage.getItem("b" + val.buildingid + "f" + val.floorid).then(
						v3 => {
							let rooms: Array<any>;
							rooms = v3;
							rooms.forEach(v4 => {
								if (v4.roomid == this.roomid)
									this.roomname = v4.name;
							});
						}
					)
				}
			})




			
	}
    testclick(){
		console.log("ok");
		document.getElementById("actionbtn").hidden = !document.getElementById("actionbtn").hidden;
		this.listview = !this.listview ;
	}
	doReject() {
		this.navCtrl.push(RejectPage, { "roomid": this.roomid });
	}

	doReceipt() {
		this.navCtrl.push(ReceiptPage, { "roomid": this.roomid });
	};

	drawIssue(issueid: string, issue: any) {
		this.localStorage.getItem('status' + issue.status).then(
			stat => {
				let div = document.createElement('div');
				div.style.backgroundColor = stat ? stat.color : 'red';
				div.style.width = '16px';
				div.style.height = '16px';
				div.style.borderRadius = '8px';
				div.style.position = 'absolute';
				div.style.left = (issue.x / this.dwgFactor - 8) + 'px';
				div.style.top = (issue.y / this.dwgFactor - 8) + 'px';
				div.onclick = (e) => {
					e.preventDefault();
					e.stopPropagation();
					console.log(e);
					this.navCtrl.push(IssueviewPage, { roomid: this.roomid, issueid: issueid });
				}
				document.getElementById('stage').appendChild(div);
			}
		)
	}
getIssues(status: string): Array<object>{
     var ret = []; 
     for(let issue of this.issues){
       if(issue.status==status){
          ret.push(issue);
       }
     }
     return ret;
  }
	ionViewDidEnter() {
		this.loadRommInfo();
	}

	stageClick(e: MouseEvent) {
		let cX: number = e.offsetX * this.dwgFactor;
		let cY: number = e.offsetY * this.dwgFactor;
		let sec: string;
		if (this.dwgInfo.areas) {
			this.dwgInfo.areas.forEach(
				a => {
					// if (a.left <= cX && a.top <= cY && a.right >= cX && a.bottom >= cY)
					// 	sec = a.name;
					//var s = this.inPolygon(cX, cY, a.points);
					let s = this.inPolygon(358.89,312.88,[{x:238,y:339},{x:241,y:194},{x:369,y:195},{x:373,y:336}]);
					console.log("s:"+s);
					if (s == '1')
						sec = a.name;
					else
						sec = '';
				}
			)
		}
		// document.getElementById("clickX")['innerText'] = cX + 'px';
		// document.getElementById("clickY")['innerText'] = cY + 'px';
		// document.getElementById('statusMessage').innerText = "点击部位：" + sec;
		console.log(sec);
		//this.navCtrl.push(IssuePage, { roomid: this.roomid, x: cX, y: cY, section: sec });
	}

	loadRommInfo() {
		console.log(this.roomid);
		this.localStorage.getItem(this.roomid).then(v1 => {
			this.roomInfo = v1;
			if (v1) {
				this.localStorage.getItem(this.roomInfo.drawingid).then(
					v2 => {
						this.dwgInfo = v2;
						this.dwgFactor = this.dwgInfo.width / this.stage.offsetWidth;
						this.showInfo();
					})
			} else {
				this.stage.style.backgroundImage = '';
				this.stage.style.textAlign = "center";
				this.stage.style.lineHeight = "400px";
				this.stage.innerText = '没有数据！请返回。';
			}
		})
	}

	showInfo() {
		console.log(this.roomInfo);
		console.log(this.dwgInfo);
		this.stage.style.backgroundImage = 'url(' + this.dwgInfo.src + ')';   //
		var issues = this.roomInfo.issues;
		issues.forEach(
			i => {
				this.localStorage.getItem('issue' + i.issueid).then(
					issue => {
						//console.log(i);
						//console.log(issue);
						this.drawIssue(i.issueid, issue);
					}
				);
			}
		)
	}

	stage: any;
	ngOnInit() {
		var stage = document.getElementById('stage');
		this.stage = stage;
		var jQuery = window['jQuery'];
		let $stage = jQuery(stage);
		var $ = window['$'];

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
	}

	/**
	* @description 射线法判断点是否在多边形内部
	* @param {number} px 待判断点的X坐标
	* @param {number} py 待判断点的Y坐标 
	* @param {Array} poly 多边形顶点，数组成员的格式 [{ x: X坐标, y: Y坐标 },{ x: X坐标, y: Y坐标 }...]
	* @return {String} 点 p 和多边形 poly 的几何关系
	*/  //312,358
	inPolygon(px: number, py: number, poly: [{ x: number, y: number }]) {
		let flag = false
		for (let i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
			let sx = poly[i].x,
				sy = poly[i].y,
				tx = poly[j].x,
				ty = poly[j].y
			console.log("sx:"+sx);console.log("sy:"+sy);console.log("tx:"+tx);console.log("ty:"+ty);
			if ((sx === px && sy === py) || (tx === px && ty === py)) { return '1' }
			if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
				let x = sx + (py - sy) * (tx - sx) / (ty - sy)  
				console.log("x:"+x);
				if (x === px) { return '1' }
				if (x > px) { flag = !flag }
			}
		}
		return flag ? '1' : '0'
	}

}
