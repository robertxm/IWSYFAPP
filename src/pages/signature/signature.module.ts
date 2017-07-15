import { NgModule } from '@angular/core';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { SignaturePadModule } from 'angular2-signaturepad';
import { Signature } from './signature';

@NgModule({
  declarations: [
    Signature,
  ],
  imports: [
      IonicPageModule.forChild(Signature),
  ],
  exports: [
    Signature
  ]
})
export class SignatureModule {}
