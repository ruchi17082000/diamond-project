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
  selector: 'app-b-header',
  templateUrl: './b-header.component.html',
  styleUrls: ['./b-header.component.scss']
})
export class BHeaderComponent extends HeaderComponent implements OnInit {

  constructor(public router: Router, public toastr: ToastrService, public sidenav: SidenavService, public socket: user_socket, public _location: Location, public modalService: BsModalService, public httpClient: UsersService) {
    super(router, toastr, sidenav, socket, _location, modalService, httpClient);
  }

  ngOnInit(): void {
  }

  openNav() {
    document.getElementById("lefttSidenav").style.width = "250px";
  }

  closeNav() {
    document.getElementById("lefttSidenav").style.width = "0";
  }

}
