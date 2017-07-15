import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { FloorPage } from '../floor/Floor';
import { LocalStorage } from '../../providers/local-storage';
import { initBaseDB } from '../../providers/initBaseDB';
import { Dialogs } from '@ionic-native/dialogs';
import { NativeService } from '../../providers/nativeservice';

@Component({
  selector: 'page-openinspection',
  templateUrl: 'openinspection.html'
})
export class OpeninspectionPage {
  batchbuildings: Array<any>;
  projid: string;
  projname: string;
  token: string;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public params: NavParams, public localStorage: LocalStorage,
    public initBaseDB: initBaseDB, public dialogs: Dialogs, public nativeservice:NativeService) {
    // this.projid = this.params.get('projid');
    // this.projname = this.params.get('projname');
    // console.log(this.projid);
    this.batchbuildings = [];
    this.localStorage.getItem('curuser').then(val=>{
      this.token = val.token;      
    })
  }

  ngOnInit() {    
    //this.batchbuildings.push({batchid:'6a397ed5-3923-47e4-8f5a-033920062555',batchname:'TYPE-A',buildings:[{buildingid:'test',buildingname:'7号楼',needtype:1},{buildingid:'test2',buildingname:'8号楼',needtype:2}]});

    this.localStorage.getItem('curproj').then(val => {
      this.projid = val.projid;
      this.projname = val.projname;
      this.initbatch();
    })
  }

  getbatch(projid, type): Promise<Array<any>> {
    return new Promise((resolve) => {  
      let bbuildings: Array<any>; bbuildings = [];
      bbuildings.push({batchid:'6a397ed5-3923-47e4-8f5a-033920062555',batchname:'TYPE-A',buildings:[{buildingid:'test1',buildingname:'7号楼',needtype:1},{buildingid:'test2',buildingname:'6号楼',needtype:2},{buildingid:'test3',buildingname:'5号楼',needtype:3}]});
      bbuildings.push({batchid:'3335',batchname:'TYPE44-A',buildings:[{buildingid:'test',buildingname:'9号楼',needtype:0}]});
      console.log(bbuildings);
      resolve(bbuildings);
    })
  }

  initbatch() {
    console.log('initbatch');
    // this.getbatch(this.projid, 3).then((batlist:Array<any>) => {
    //   console.log(batlist); 
    //   this.batchbuildings = batlist;
    //   console.log(this.batchbuildings);
    // })
    this.initBaseDB.getbatch(this.projid, 2,this.token).then((batlist:Array<any>) => {
      console.log('af initbatch');
      console.log(batlist);      
      this.batchbuildings = batlist;
      console.log(this.batchbuildings);
    })
  }  

  itemSelected(batchid, building) {
    if (building.needtype == 1) {
      alert("必须先下载才能使用!");
    }
    else if (building.needtype != 0) {
      this.dialogs.confirm('基础数据未更新，请先更新基础数据', '', ['暂不更新', '立即更新']).then(val => {
        if (val = 1) {
          this.navCtrl.push(FloorPage, { "building": building });
        }
        else {
          if (building.needtype == 1) {
            this.downloadclicked(batchid, building).then(v => {
              this.navCtrl.push(FloorPage, { "building": building });
            })
          }
          else if (building.needtype == 2) {
            this.uploadclicked(batchid, building).then(v => {
              this.navCtrl.push(FloorPage, { "building": building });
            })
          }
          else if (building.needtype == 3) {
            this.updateclicked(batchid, building).then(v => {
              this.navCtrl.push(FloorPage, { "building": building });
            })
          }
        }
      })
    }
  }

  uploadclicked(batchid, building): Promise<any> {
    return new Promise((resolve) => {
      this.initBaseDB.uploadbuildinginfo(this.token,this.projid, batchid, building.buildingid,2).then(v => {
        building.needtype = 0;
        this.nativeservice.showToast('上传完成.');
      }).catch(err => {
        console.log('楼栋加载错误:' + err);
      })
    })
  }

  downloadclicked(batchid, building): Promise<any> {
    return new Promise((resolve) => {
      this.initBaseDB.downloadbuildinginfo(this.token,this.projid, batchid, building.buildingid,2).then(v => {
        console.log('af dlc');
        console.log(v);
        building.needtype = 0;
        this.nativeservice.showToast('下载完成.');
      }).catch(err => {
        console.log('楼栋加载错误:' + err);
      })
    })
  }

  updateclicked(batchid, building): Promise<any> {
    return new Promise((resolve) => {
      this.initBaseDB.updatebuildinginfo(this.token,this.projid, batchid, building.buildingid,2).then(v => {
        building.needtype = 0;
        this.nativeservice.showToast('更新完成.');
      }).catch(err => {
        console.log('楼栋加载错误:' + err);
      })
    })
  }
}
