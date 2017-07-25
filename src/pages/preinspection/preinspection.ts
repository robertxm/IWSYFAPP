import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { FloorPage } from '../floor/Floor';
import { LocalStorage } from '../../providers/local-storage';
import { initBaseDB } from '../../providers/initBaseDB';
import { NativeService } from '../../providers/nativeservice';
import { FlooroldPage } from '../floorold/Floor';

@Component({
  selector: 'page-preinspection',
  templateUrl: 'preinspection.html'
})
export class PreinspectionPage {
  buildings: Array<any>;
  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public localStorage: LocalStorage, public initBaseDB: initBaseDB,
    public nativeservice: NativeService) {
    console.log("PreinspectionPage");
    // this.localStorage.getItem('buildings').then(
    //   val => this.buildings = val
    // )
    //this.Buildings=["1号楼","2号楼","3号楼","4号楼","5号楼","6号楼","7号楼","8号楼","9号楼"];
  }

  itemSelected(item: string) {
    this.navCtrl.push(FlooroldPage, { "buildingid": item });    
  }

  resetclick() {
    if (this.nativeservice.isConnecting())
       this.initBaseDB.initdb("name1.db", true);
    
    this.localStorage.setItem("initialed", null).then(v => {
      this.localStorage.init();
    });

  }

}
