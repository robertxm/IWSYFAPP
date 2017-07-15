import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorage } from '../../providers/local-storage';
import { NativeService } from '../../providers/nativeservice';
import {APP_SERVE_URL} from '../../providers/Constants';
import {HttpService} from '../../providers/HttpService';

@Component({
  selector: 'page-addphonecontacts',
  templateUrl: 'addphonecontacts.html'
})
export class AddphonecontactsPage {
  items:Array<any>;
  projid:string;
  token:string;
  constructor(public navCtrl: NavController, public params: NavParams, public localStorage: LocalStorage, public nativeservice: NativeService,private httpService: HttpService) {
    this.items = []; 
    this.items = this.params.get('items');
    this.projid = this.params.get('projid');
    this.localStorage.getItem("curuser").then(val=>{
      this.token = val.token;
    })
    // this.items.push({name:'name1', phone:'234576890198', added: false, btnname: "添加"});
    // this.items.push({name:'name2', phone:'221576890198', added: true, btnname: "已添加"});
    // this.items.push({name:'name3', phone:'323576890198', added: true, btnname: "已添加"});
    // this.items.push({name:'name4', phone:'438576890198', added: false, btnname: "添加"});
  }
  
  addclick(item){      
    this.localStorage.getItem('myteam'+this.projid).then(val=>{
      let teams:Array<any>; teams = [];
      if (!val){
        this.localStorage.setItem('myteam'+this.projid,teams);
      } else {
        teams = val;
      }            
      console.log(this.token);
      this.httpService.post(APP_SERVE_URL + '/AppLogin/AddUser',{Token:this.token, ProjId: this.projid, UserId: item.phone, Name: item.name}).then(res=>{
          console.log(res);        
          this.nativeservice.showToast("添加成功.");  
          let i = this.items.indexOf(item);
          this.items[i].added = true;    
          this.items[i].btnname = "已添加";   
          teams.push({userid:item.phone,username:item.name});       
      }).catch(e=>{
        alert(e);
        console.log(e);  
      })          
    })  
  } 
}
