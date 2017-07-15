import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-builder',
  templateUrl: 'builder.html',
})
export class BuilderPage {

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
  selectedTab = "待指派";
  selectAll = false;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Builder');
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

}
