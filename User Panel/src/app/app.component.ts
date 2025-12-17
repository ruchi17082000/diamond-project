import { Component, HostListener, OnInit } from "@angular/core";
import { NgxLoader } from "ngx-http-loader";
import { Router } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { user_socket, admin_socket } from "../app/app.module";
import { UsersService } from "./services/users.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  favIcon: HTMLLinkElement = document.querySelector("#appIcon");
  appTitle: HTMLLinkElement = document.querySelector("#appTitle");
  favicon: any;
  userDetails: any;
  public loader = NgxLoader;
  maintenance_page: boolean;
  inactive_usr: boolean;
  router_outlet: boolean;

  @HostListener("touchstart", ["$event"])
  onEvent(event: MouseEvent) {
    this.usersService.set_listner("listner");
  }

  constructor(
    private socket: user_socket,
    private adminSocket: admin_socket,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private usersService: UsersService,
    public toastr: ToastrService
  ) {
    this.getSettings();
    sessionStorage.setItem("page_type", "diamond");
    const isDesktopDevice = this.deviceService.isDesktop();
    sessionStorage.setItem("is_desktop", JSON.stringify(isDesktopDevice));
  }

  ngOnInit(): void {
    this.adminSocket.on(
      "maintenance-page-success",
      function (res: any) {
        if (res.status) {
          this.maintenance();
        } else {
          this.routerOutlet();
        }
      }.bind(this)
    );
    this.getWalletNotification();
    this.usrLogOut();

    this.usersService.get_alert().subscribe((data) => {
      this.inactive_alert_msg();
    });
  }

  usrLogOut() {
    this.socket.on(
      "logout",
      function (data: any) {
        this.logoutUser();
      }.bind(this)
    );
  }

  getWalletNotification() {
    this.adminSocket.on(
      "get-notification",
      function (res: any) {
        this.toastr.info(res.message);
        this.getUserBalance();
      }.bind(this)
    );
  }

  getSettings() {
    this.usersService.rmTokenPost("getSetting", null).subscribe((res: any) => {
      console.warn(res); // Log the entire response

      if (res.success) {
        if (res.data?.maintenancepage === "true") {
          this.maintenance();
        } else {
          this.routerOutlet();
        }
      } else {
        this.toastr.error(res.message, "!Error");
      }
    });
  }

  getUserBalance() {
    this.usersService.Post("getUserDetails", null).subscribe((res: any) => {
      if (res.success) {
        this.usersService.updateUserBalanceSubject(res.doc);
      } else {
        console.warn(res.message);
      }
    });
  }

  async findHostName() {
    return window.location.hostname;
  }

  async changeIcon() {
    const hostname = await this.findHostName();
    const splithostname = hostname.split(".");
    this.favicon = splithostname[0];
    sessionStorage.setItem("host", this.favicon);
    
    if (this.favicon) {
      if (
        this.favicon === "diamond222" ||
        this.favicon === "diamond444" ||
        this.favicon === "play11game" ||
        this.favicon === "up365"
      ) {
        sessionStorage.setItem("page_type", "diamond");
      } else if (this.favicon === "fairbets247") {
        sessionStorage.setItem("page_type", "betHonk");
      } else if (this.favicon === "dubaiclub247") {
        sessionStorage.setItem("page_type", "paisaexch");
      }
    }
  }

  async getDetails() {
    try {
      const data = sessionStorage.getItem("userDetails");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to parse user details:', e);
      return null;
    }
  }

  async checkLogout() {
    this.userDetails = await this.getDetails();
    this.socket.on(
      "login-check",
      function (data: any) {
        if (this.userDetails && data.output === this.userDetails.verifytoken) {
          this.toastr.info(data.message + " !", "X");
          this.logoutUser();
        }
      }.bind(this)
    );
  }

  routerOutlet() {
    this.maintenance_page = false;
    this.inactive_usr = false;
    this.router_outlet = true;
  }

  maintenance() {
    this.maintenance_page = true;
    this.inactive_usr = false;
    this.router_outlet = false;
  }

  inactive_alert_msg() {
    this.maintenance_page = false;
    this.inactive_usr = true;
    this.router_outlet = false;
  }

  socketDisconnect() {
    this.socket.on(
      "disconnect",
      function (data: any) {
        this.socketConnect();
      }.bind(this)
    );
  }

  socketConnect() {
    this.socket.emit("connected");
  }

  logoutUser() {
    sessionStorage.clear();
    this.router.navigate(["login"]);
    window.location.reload();
  }
}
