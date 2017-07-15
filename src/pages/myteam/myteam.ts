import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocalStorage } from '../../providers/local-storage';
import { NativeService } from '../../providers/nativeservice';
import { AddteammemberPage } from '../addteammember/addteammember';
import { ActionSheetController } from 'ionic-angular'
import { AddmembermanualPage } from '../addmembermanual/addmembermanual';
import { AddphonecontactsPage } from '../addphonecontacts/addphonecontacts';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

@Component({
  selector: 'page-myteam',
  templateUrl: 'myteam.html'
})
export class MyTeamPage {
  teams: Array<string>;
  userids: Array<string>;
  projid: string;
  constructor(public navCtrl: NavController, public localStorage: LocalStorage, public nativeservice: NativeService, public actionSheetCtrl: ActionSheetController,
    private contacts: Contacts) {
    this.teams = []; this.userids = [];
    this.localStorage.getItem('curproj').then(val => {
      this.projid = val.projid;
      this.localStorage.getItem('myteam' + this.projid).then(val => {
        let items: Array<any>;
        items = val;
        items.forEach(element => {
          console.log(element);
          this.teams.push(element.username + "    " + element.userid);
          this.userids.push(element.userid);
        });
      })
    })
  }

  addclick() {
    //this.navCtrl.push(AddteammemberPage);
    let actionSheet = this.actionSheetCtrl.create({
      title: '选择添加方式',
      buttons: [
        {
          text: '添加手机联系人',
          //role: 'destructive',
          handler: () => {
            this.getcontacts();
            //this.navCtrl.push(AddphonecontactsPage);
          }
        },
        {
          text: '添加新成员',
          handler: () => {
            this.navCtrl.push(AddmembermanualPage, { projid: this.projid });
          }
        },
        {
          text: '取消',
          //role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  getcontacts() {
    let contacts: Array<any>;
    let options: any;
    options = { filter: "", multiple: true };
    this.contacts.find(["displayName"], options).then(val => {
      let items: Array<any>;
      items = val;
      contacts = [];
      items.forEach(contact => {
        if (contact) {
          console.log(JSON.stringify(contact));
          console.log(contact.displayName);
          if (contact.phoneNumbers) {
            let phones: Array<any>;
            phones = contact.phoneNumbers;
            console.log('phones:' + phones);
            if (phones[0].type == "mobile" && phones[0].value != 'null' && phones[0].values != '') {
              console.log(phones[0].value);
              if (this.userids.indexOf(phones[0].value) == -1)
                contacts.push({ name: contact.displayName, phone: phones[0].value, added: false, btnname: "添加" });
              else
                contacts.push({ name: contact.displayName, phone: phones[0].value, added: true, btnname: "已添加" });
            }
          }

        }

      });
      this.navCtrl.push(AddphonecontactsPage, { projid: this.projid, items: contacts });
    });
  }
}
