import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuilderIssuePosition } from './builder-issue-position';

@NgModule({
  declarations: [
    BuilderIssuePosition,
  ],
  imports: [
    IonicPageModule.forChild(BuilderIssuePosition),
  ],
  exports: [
    BuilderIssuePosition
  ]
})
export class BuilderIssuePositionModule {}
