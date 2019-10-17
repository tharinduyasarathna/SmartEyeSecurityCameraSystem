import { AuthService } from './../services/auth/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  currentUserType: any;
  constructor(
    public authService: AuthService,
    public router: Router
  ){ 
}
ngOnInit() {
  
  this.currentUserType = JSON.parse(localStorage.getItem("logged_in_user")).userType;
 }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.currentUserType== 'admin' ) {
      return true;
    }
      
      this.router.navigate(['home/first']);
    
    
  }
}
