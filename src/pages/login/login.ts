import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LocalStorage } from '../../providers/local-storage';
import { initBaseDB } from '../../providers/initBaseDB';
import { TabsPage } from '../tabs/tabs';
import { NativeService } from '../../providers/nativeservice';
import { APP_SERVE_URL } from '../../providers/Constants';
import { HttpService } from '../../providers/HttpService';
import { BuilderTabsPage } from '../buildertabs/buildertabs';
import { ChangePWPage } from '../changepw/changepw';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  imgheight: any;
  userid: string;
  password: string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public localStorage: LocalStorage, public initBaseDB: initBaseDB,
    public nativeservice: NativeService, private httpService: HttpService) {
    console.log("login start app");
    this.imgheight = window.innerHeight / 1.8;
    this.localStorage.getItem('curuser').then(val => {
      if (val && val.userid) {
        this.userid = val.userid;
        console.log(val.userid);
      }
    })
    // let d=[];
    // d.push("'ui'");d.push("'ee'");d.push("'2e'");d.push("'12'");
    // console.log('(#x#)'.replace('#x#', d.join(',')));
    //this.userid = '12345678901'; this.password = "123456";
    // let elements = document.querySelectorAll(".tabbar");
    // if (elements != null) {
    //   Object.keys(elements).map((key) => {
    //     elements[key].style.display = 'none';
    //   });
    // }
  }

  loginclick() {
    // this.httpService.post(APP_SERVE_URL + '/AppLogin/AddUser',{Token:"AFC5FA4E2E2C4D7F62D8D9EA82DB9A39",ProjId: "6a397ed5-3923-47e4-8f5a-033920062c02", 
    //                      UserId: "13545678905", Name: "TestProjAccount1"}).then(res=>{
    //       alert(res[0].Result);  
    //       console.log(res[0]);
    // }).catch(e=>{
    //    alert(e);
    //    console.log(e);  
    // })   
    // this.test().then(e => {
    //   console.log("e");
    // })
    //this.initBaseDB.testupdate();
    //data:image/jpg;base64,
    //this.initBaseDB.downloadimg('0f2b58a05f491323efd14a43bc095511.jpg');
    //this.initBaseDB.uploadimg("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");    
    //this.initBaseDB.testsql();
    // let d = []; var i = 0; i++;
    // console.log('dde'+i.toString());
    // d.push('test1');
    // d.push('test2');
    // d.push('');
    // d.push('test3');
    // d.push('test4');
    // console.log(d.join(','));
    // let x = [];
    // x.push("(#row#)".replace("#row#", d.join(',')));
    // console.log(x);
    // console.log(x.join(','));
    // let s1 = 'test1', s2 = 'test2',s3 = 'test3',s4 = 'test4';
    // d = [];
    // d.push(s1);d.push(s2),d.push(s3),d.push(s4);
    // console.log(d.join(','));
    // x = [];
    // x.push("(#row#)".replace("#row#", d.join(',')));
    // console.log(x);
    // console.log(x.join(','));
    //this.initBaseDB.testhttp();
    //this.navCtrl.push(BuilderTabsPage);
    // let d = new Date();
    // let t = new Date(d.getTime()+3*24*3600*1000);
    // let w = new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate(),15,59,59));
    // console.log(t.toLocaleDateString());
    // console.log(t.toLocaleTimeString());
    // console.log(w.toLocaleString());
    // console.log(t.toLocaleString());
    // console.log(t.toTimeString());
    this.nativeservice.isConnecting().then((val: boolean) => {
      if (val == false) {
        throw '无网络登陆失败';
      } else {
        this.nativeservice.showLoading('加载中,请稍后...');
        this.httpService.get(APP_SERVE_URL + '/AppLogin', { userAct: this.userid, password: this.nativeservice.encode64(this.userid + "$" + this.password) }).then(res => {
          console.log(res[0]);
          this.initData(res[0]).then(v => {
            this.nativeservice.hideLoading();
          })
        }).catch(e => {
          this.nativeservice.hideLoading();
          // this.localStorage.setItem('curproj', { projid: 'p0001', projname: '项目1' })
          // this.localStorage.setItem('curuser', { userid: 'admin', duetime: 1498121315683, token: "ejofwijfeoiwfjewi", username: 'adminname' });
          // this.navCtrl.push(TabsPage);
        })
      }
    })

  }

  ionViewWillLeave() {
    // let elements = document.querySelectorAll(".tabbar");
    // if (elements != null) {
    //   Object.keys(elements).map((key) => {
    //     elements[key].style.display = 'flex';
    //   });
    // }
  }

  initData(items): Promise<any> {
    return new Promise((resolve) => {
      let item = items[1];
      console.log(item.VendRole);
      console.log("first:" + item.First);
      //item.VendRole = false;
      // if (item.VendRole == false) {
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      resolve(promise.then((v1) => {
        return this.localStorage.setItem('curuser', { userid: this.userid, token: item.Token, duetime: item.AllowEnd, username: item.UserName, vendrole: item.VendRole, id: item.UserId });
      }).then((v2) => {
        return this.initBaseDB.initdb(this.userid + ".db", false);
      }).then((v3) => {
        return this.initBaseDB.initProjVersion(item.Token, item.VendRole);
      }).then((v4) => {
        console.log(v4);
        if (v4 == "no proj") {
          this.nativeservice.hideLoading();
          if (item.VendRole == true) {
            if (item.First == true) {
              this.navCtrl.push(ChangePWPage, { "first": item.first });
            } else {
              console.log(item.First);
              this.navCtrl.push(BuilderTabsPage);
            }
          } else {
            if (item.First == true) {
              this.navCtrl.push(ChangePWPage, { "first": item.first });
            } else {
              this.navCtrl.push(TabsPage);
            }
          }
          return 10;
        } else {
          if (item.VendRole == true) {
            return this.initBaseDB.downloadbuilderdata(item.Token, v4).then(v => {
              this.nativeservice.hideLoading();
              if (item.First == true) {
                this.navCtrl.push(ChangePWPage, { "first": item.first });
              } else {
                console.log(item.First);
                this.navCtrl.push(BuilderTabsPage);
              }
            })
          } else {
            return this.initBaseDB.initbuildingversion(item.Token, v4).then(v => {
              this.nativeservice.hideLoading();
              if (item.First == true) {
                this.navCtrl.push(ChangePWPage, { "first": item.first });
              } else {
                this.navCtrl.push(TabsPage);
              }
            })
          }
        }
      }).catch(err => {
        console.log(err);
        this.nativeservice.hideLoading();
        // return this.localStorage.setItem('curuser', { userid: 'admin', duetime: 1498121315683, token: "ejofwijfeoiwfjewi", username: 'adminname' }).then(v => {
        //   this.navCtrl.push(TabsPage);
        // })
      }))
      // }
      // else {
      //   let promise = new Promise((resolve) => {
      //     resolve(100);
      //   });
      //   resolve(promise.then((v1) => {
      //     return this.localStorage.setItem('curuser', { userid: this.userid, token: item.Token, duetime: item.AllowEnd, username: item.UserName, vendrole: item.vendrole });
      //   }).then((v2) => {
      //     return this.initBaseDB.initdb(this.userid + ".db", false);
      //   }).then((v3) => {
      //     return this.initBaseDB.initProjVersion(item.Token);
      //   }).then((v4) => {
      //     return this.navCtrl.push(BuilderTabsPage);
      //   }).catch(err => {
      //   console.log(err);
      //   return this.localStorage.setItem('curuser', { userid: 'admin', duetime: 1498121315683, token: "ejofwijfeoiwfjewi", username: 'adminname' }).then(v => {
      //     this.navCtrl.push(BuilderTabsPage);
      //   })
      // }))
      // }
    })
  }

  initData2(items): Promise<any> {
    return new Promise((resolve) => {
      let item = items[1];
      console.log(item.VendRole);
      // if (item.VendRole == false) {
      let promise = new Promise((resolve) => {
        resolve(100);
      });
      resolve(promise.then((v1) => {
        return this.localStorage.setItem('curuser', { userid: this.userid, token: item.Token, duetime: item.AllowEnd, username: item.UserName, vendrole: item.VendRole });
      }).then((v2) => {
        return this.navCtrl.push(TabsPage);
      }).catch(err => {
        console.log(err);
        return this.localStorage.setItem('curuser', { userid: 'admin', duetime: 1498121315683, token: "ejofwijfeoiwfjewi", username: 'adminname' }).then(v => {
          this.navCtrl.push(TabsPage);
        })
      }))
    })
  }


  // test(): Promise<any> {
  //   //this.initBaseTable("projver", "Projid,version integer");
  //   //this.initBaseTable("buildingupdver", "Projid,Building,Batchname,Version integer,Type integer");  
  //   return new Promise((resolve) => {
  //     let promise = new Promise((resolve) => {
  //       resolve(100);
  //     });
  //     resolve(promise.then((v1: number) => {
  //       console.log("v1");
  //       return v1 * 2;
  //     }).then((v2) => {
  //       console.log("v2");
  //       var pp = [];
  //       var promise2 = Promise.resolve([]);
  //       for (var i = 0; i < 10; i++) {
  //         console.log(i)
  //         promise2 = promise2.then(vx => {
  //           return this.localStorage.getItem('dwgb1f2-103');              
  //         }).then(vxx => {
  //           console.log(vxx);
  //           let v:any; v = vxx;
  //           let a: Array<any>; a = [];
  //             a = v.areas;
  //             let x: string; x = '';
  //             for (let j = 0; j < a.length; j++) {
  //               //console.log(a[j].name);
  //               x = x + a[j].name;
  //               console.log('j'+j);
  //             }
  //           console.log(pp);
  //           pp.push(x);
  //           return pp;
  //         });
  //       }
  //       console.log('v2 end');
  //       console.log(pp);
  //       return promise2;
  //     }).then((v3) => {
  //       console.log("v3"+v3);
  //       return v3;
  //     }).then((v4) => {
  //       console.log("v4");
  //       return v4;
  //     }).then((v5) => {
  //       console.log("v5");
  //       return v5;
  //     }).catch(err => {
  //       console.log(err);
  //     }))

  //   })
  // }


}
