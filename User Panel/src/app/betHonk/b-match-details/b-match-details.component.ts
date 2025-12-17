import { Component, OnInit } from '@angular/core';
import { MatchDetailComponent } from 'app/match-detail/match-detail.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { ConnectionService } from 'ng-connection-service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Location } from '@angular/common';
// In b-match-details.component.ts
import { user_socket } from 'app/app.module'; // or adjust relative path if needed
import { Match } from 'app/model/match';
import { UsersService } from 'app/services/users.service';


@Component({
  selector: 'app-b-match-details',
  templateUrl: './b-match-details.component.html',
  styleUrls: ['./b-match-details.component.scss']
})
export class BMatchDetailsComponent extends MatchDetailComponent implements OnInit {

  constructor(public router: Router,public route: ActivatedRoute, public sanitizer: DomSanitizer, public toastr: ToastrService,
    public matchModel: Match, public modalService: BsModalService, public usersService: UsersService,
    public socket: user_socket,public connectionService: ConnectionService,public ngxLoader: NgxUiLoaderService,public _location: Location) {
    super(router,route,sanitizer,toastr,matchModel,modalService, usersService,socket,connectionService,ngxLoader,_location);

   }

  ngOnInit(): void {
  }

}
