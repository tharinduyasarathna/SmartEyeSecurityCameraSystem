import { AuthService } from "./../services/auth/auth.service";
import { UserServiceService } from "./../services/user-service.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"]
})
export class NavigationComponent implements OnInit {
  currentUser;
  currentUserType;
   showUserTab : boolean ;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("logged_in_user")).name;
    this.currentUserType = JSON.parse(localStorage.getItem("logged_in_user")).userType;
    if(this.currentUserType == 'admin'){
       this.showUserTab = true;
    }else{
      this.showUserTab=false;
  
    }

  }
  logout() {
    Swal.fire({
      title: "<p style='color: white'>Are you sure to Logout ? </p> ",
      text: "You will be logged out from current session ! ",
      type: "warning",
      showCancelButton: true,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      background: "rgba(43, 165, 137, 0.90)",
      backdrop: `
      rgba(52, 73, 94,0.75)
        center left
        no-repeat
      `
    }).then(result => {
      if (result.value) {
        this.authService.logout();
        localStorage.clear();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

    // this.router.navigate(["login"]);
  }
}
