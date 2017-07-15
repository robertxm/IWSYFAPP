import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { RoomPage } from '../room/room';
import { LocalStorage } from '../../providers/local-storage';
import { initBaseDB } from '../../providers/initBaseDB';

@Component({
  selector: 'page-floor',
  templateUrl: 'Floor.html'
})
export class FloorPage {
  buildingid: string;
  floors: Array<any>;
  floorsready: Array<any>;
  floorsforfix: Array<any>;
  floorsfixed: Array<any>;
  floorspass: Array<any>;
  selectedTab: string;
  buildingname: string;
  projid: string;
  batchid: string;
  type: number;
  readystr:string;
  passstr:string;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public params: NavParams, public initBaseDB: initBaseDB, public localStorage: LocalStorage) {
    let building: any; building = this.params.get('building');
    this.buildingid = building.buildingid;
    this.buildingname = building.buildingname;
    this.projid = this.params.get('projid');
    this.batchid = this.params.get('batchid');
    this.type = this.params.get('type');
    if (this.type == 3){
      this.readystr = "待交付";
      this.passstr = "已交付";
    }
  }

  itemSelected(room) {
    this.navCtrl.push(RoomPage, { "projid":this.projid,"batchid":this.batchid,"buildingid":this.buildingid,"buildingname":this.buildingname,"type":this.type,"roomid": room.roomid,"roomname":room.name });
  }

  ionViewWillEnter() {
    var tFloors: Array<any>;
    var tRooms: Array<any>;
    var thouses: any;
    var tstatus: Array<any>;
    this.floors = [];
    this.floorsready = [];
    this.floorsforfix = [];
    this.floorsfixed = [];
    this.floorspass = [];
    this.selectedTab = '全部';
    this.initBaseDB.getfloors(this.projid, this.batchid, this.buildingid, this.type).then(val => {      
      this.floors = val[0].items;
      this.floorsready = val[1].items;
      this.floorsforfix = val[2].items;
      this.floorsfixed = val[3].items;
      this.floorspass = val[4].items;
    })


  }

}
