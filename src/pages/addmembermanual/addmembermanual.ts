import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { LocalStorage } from '../../providers/local-storage';
import { NativeService } from '../../providers/nativeservice';
import {APP_SERVE_URL} from '../../providers/Constants';
import {HttpService} from '../../providers/HttpService';

@Component({
  selector: 'page-addmembermanual',
  templateUrl: 'addmembermanual.html'
})
export class AddmembermanualPage {
  projid:string;
  name:string;
  phone:string;
  token:string;
  constructor(public navCtrl: NavController, public params: NavParams, public localStorage: LocalStorage, public nativeservice: NativeService,private httpService: HttpService) {
    this.projid = this.params.get('projid');
    this.name = "";this.phone = '';
    this.localStorage.getItem("curuser").then(val=>{
      this.token = val.token;
    })
  }

  submitclick(){
    console.log({token:this.token, Projid: this.projid, Userid: this.phone, Name: this.name});
    this.httpService.post(APP_SERVE_URL + '/AppLogin/AddUser',{Token:this.token, ProjId: this.projid, UserId: this.phone, Name: this.name}).then(res=>{
          console.log(res);
          if (res[0][0][0] == "true")
          {
            this.nativeservice.showToast("添加成功.");
            this.navCtrl.pop();
          } 
          else
          {
            this.nativeservice.showToast("添加失败.");
            console.log(res[0][0][1]);
          }
		}).catch(e=>{
       alert(e);
       console.log(e);  
    })    
  }
}
