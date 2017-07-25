import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuilderCloseIssue } from './builder-close-issue';

@NgModule({
  declarations: [
    BuilderCloseIssue,
  ],
  imports: [
    IonicPageModule.forChild(BuilderCloseIssue),
  ],
  exports: [
    BuilderCloseIssue
  ]
})
export class BuilderCloseIssueModule {}
