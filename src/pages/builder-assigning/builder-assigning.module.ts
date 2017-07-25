import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuilderAssigning } from './builder-assigning';

@NgModule({
  declarations: [
    BuilderAssigning,
  ],
  imports: [
    IonicPageModule.forChild(BuilderAssigning),
  ],
  exports: [
    BuilderAssigning
  ]
})
export class BuilderAssigningModule {}
