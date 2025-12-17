import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { user_socket } from 'app/app.module';  // Updated to absolute path
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { UsersService } from '../../services/users.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-b-dashboard',
  templateUrl: './b-dashboard.component.html',
  styleUrls: ['./b-dashboard.component.scss']
})
export class BDashboardComponent extends DashboardComponent implements OnInit {
  moment: any = moment;
  
  constructor(public modalService: BsModalService,public route: ActivatedRoute,public router: Router,public toastr: ToastrService,public socket: user_socket,public usersService: UsersService,public ngxLoader: NgxUiLoaderService) 
  {
    super(modalService,route,router,toastr,socket,usersService,ngxLoader);
   }

  ngOnInit(): void {
  }

}
