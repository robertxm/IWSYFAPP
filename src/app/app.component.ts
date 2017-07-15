import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { BuilderTabsPage } from '../pages/buildertabs/buildertabs';
import { NativeService } from '../providers/nativeservice';
import { LocalStorage } from '../providers/local-storage';
import { initBaseDB } from '../providers/initBaseDB';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public nativeservice: NativeService, public initBaseDB: initBaseDB
    , public localStorage: LocalStorage, ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.checklogin();
    });
  }

  checklogin() {
    this.localStorage.getItem('curuser').then(val => {
      if (val){
       let duetime = val.duetime;
      let now = new Date();
      let nowtime = now.getTime();
      if (duetime > nowtime) {
        // if (val.vendrole == true){
        //   this.rootPage = BuilderTabsPage
        // }       
        this.initBaseDB.initdb(val.userid + '.db', false).then(v => {
          this.rootPage = TabsPage;
        })
      }
      } else {
        this.rootPage = LoginPage;
      }
      
    }).catch(e => {
      console.log(e);
      this.rootPage = LoginPage;
    })
  }
}
