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
  selector: 'app-p-dashboard',
  templateUrl: './p-dashboard.component.html',
  styleUrls: ['./p-dashboard.component.scss']
})
export class PDashboardComponent extends DashboardComponent implements OnInit {
  offer_data:any;
  banner_img:any;
  marquetext:any;
  dataLength:number;
  virtualCricketData:any;
  moment: any = moment;
  selectedSportData:any;
  targetElement: Element;
  tokenCheck:boolean=false;
  constructor(public modalService: BsModalService,public route: ActivatedRoute,public router: Router,public toastr: ToastrService,public socket: user_socket,public usersService: UsersService,public ngxLoader: NgxUiLoaderService) 
  { 
     super(modalService,route,router,toastr,socket,usersService,ngxLoader);
  }

  ngOnInit(): void {
  }

}
