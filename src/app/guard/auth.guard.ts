import { AuthService } from './../services/auth/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private  notifier: NotifierService;
  constructor(private router: Router, private authservice: AuthService, notifierService: NotifierService){this.notifier = notifierService;}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authservice.isLoggedIn()==true){
      
         console.log("true");
         return true
       } else  {        
         // Hands the user to the LogIn page 
         
         this.router.navigate( ["login"] );
         this.notifier.notify( 'error', "You are currently not logged in, please provide Login!" );
        // alert("You are currently not logged in, please provide Login!")
        
         return false
 
       }
  }
}
