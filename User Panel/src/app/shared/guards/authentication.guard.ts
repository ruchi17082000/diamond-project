import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthguradServiceService } from '../services/authgurad-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private authGuardService: AuthguradServiceService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userDetailsString = sessionStorage.getItem('userDetails');
    const userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;

    // Check if userDetails exists and has the necessary properties
    if (userDetails && userDetails.details && userDetails.details.transctionpasswordstatus !== undefined) {
      const trans_pass = parseInt(userDetails.details.transctionpasswordstatus);

      if (this.authGuardService.gettoken() && trans_pass) {
        return true;
      } else {
        this.router.navigate(['login']);
        return false;
      }
    } else {
      // If userDetails is null or doesn't have the required structure
      this.router.navigate(['login']);
      return false;
    }
  }
}
