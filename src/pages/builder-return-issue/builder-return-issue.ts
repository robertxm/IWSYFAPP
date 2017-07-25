import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BuilderReturnIssue page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-builder-return-issue',
  templateUrl: 'builder-return-issue.html',
})
export class BuilderReturnIssue {

  return_message: string;
  issues = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.issues = navParams.get('issues');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuilderReturnIssue');
  }

  submit() {
    if (this.issues == undefined || this.issues.length < 1) {
      alert("未选择有效的问题，请返回！");
    } else {
      for (var i = 0; i < this.issues.length; i++) {
        alert("SET RETURN of " + this.issues[i]);
      }
    }

    this.navCtrl.pop();
  }

}
