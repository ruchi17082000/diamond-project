import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from 'app/header/header.component';
import { Router } from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users.service';
import { user_socket } from 'app/app.module';  // Updated to absolute path
import { SidenavService } from 'app/services/sidenav.service';

@Component({
  selector: 'app-p-header',
  templateUrl: './p-header.component.html',
  styleUrls: ['./p-header.component.scss']
})
export class PHeaderComponent extends HeaderComponent implements OnInit {
  loginButtnStatus: boolean;

  constructor(public router: Router, public toastr: ToastrService, public sidenav: SidenavService, public socket: user_socket, public _location: Location, public modalService: BsModalService, public httpClient: UsersService) {
    super(router, toastr, sidenav, socket, _location, modalService, httpClient);
    this.loginButtnStatus = true;
  }

  ngOnInit(): void {
  }

}
