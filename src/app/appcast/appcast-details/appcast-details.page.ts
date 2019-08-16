import { Component } from '@angular/core';
import {MoosmailService} from '../../services/moosmail/moosmail.service';
import {AppCast} from '../../services/moosmail/AppCast';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-appcast-details',
  templateUrl: 'appcast-details.page.html',
  styleUrls: ['appcast-details.page.scss']
})
export class AppcastDetailsPage {
  proc: AppCast;
  timer;

  constructor(private route: ActivatedRoute, private router: Router, private mm: MoosmailService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.proc = this.router.getCurrentNavigation().extras.state.proc;
      } else {
        console.warn("Proc not found, going back to appcast page");
        this.router.navigate(['/tabs/appcast']);
      }
    });
  }


  ionViewWillEnter() {
    this.timer = window.setInterval(() => {
      this.mm.knownClients.get("shoreside").sendMessage("APPCAST_REQ",
          "node=" + this.proc.nodeName + ",app=" + this.proc.procName + ",duration=1.0,threshold=any,key=MOOSMOBILE_DETAILS");
    }, 2000);
  }

  ionViewWillLeave() {
    window.clearInterval(this.timer);
  }
}
