import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { MyPage } from '../mypage/mypage';
import { BuilderPage } from '../builder/builder';
import { PreinspectionPage } from '../preinspection/preinspection';

@Component({
  templateUrl: 'buildertabs.html'
})
export class BuilderTabsPage {
  tab1Root = BuilderPage;
  tab2Root = PreinspectionPage;
  tab3Root = MyPage;

  constructor() {

  }
}
