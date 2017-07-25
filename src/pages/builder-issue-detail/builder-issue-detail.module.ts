import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuilderIssueDetail } from './builder-issue-detail';

@NgModule({
  declarations: [
    BuilderIssueDetail,
  ],
  imports: [
    IonicPageModule.forChild(BuilderIssueDetail),
  ],
  exports: [
    BuilderIssueDetail
  ]
})
export class BuilderIssueDetailModule {}
