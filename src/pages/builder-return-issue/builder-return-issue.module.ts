import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuilderReturnIssue } from './builder-return-issue';

@NgModule({
  declarations: [
    BuilderReturnIssue,
  ],
  imports: [
    IonicPageModule.forChild(BuilderReturnIssue),
  ],
  exports: [
    BuilderReturnIssue
  ]
})
export class BuilderReturnIssueModule {}
