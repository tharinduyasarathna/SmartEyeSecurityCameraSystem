import { AngularFireAuth } from "@angular/fire/auth";
import { Component, OnInit } from "@angular/core";
import { UserServiceService } from "../services/user-service.service";
import { AngularFireList, AngularFireObject } from "@angular/fire/database";
import { NotifierService } from "angular-notifier";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  user: any;
  currentUser: any;
  currentPhone: any;
  currentEmail: any;
  usersRef: AngularFireList<any>;
  userRef: AngularFireObject<any>;
  currentId: any;
  currentPassword: any;
  oldpassword: string;
  newpassword: string;
  newpasswordconfirmation: string;
  private notifier: NotifierService;

  constructor(
    private userservice: UserServiceService,
    private afa: AngularFireAuth,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.currentId = JSON.parse(localStorage.getItem("logged_in_user")).id;
    this.currentUser = JSON.parse(localStorage.getItem("logged_in_user")).name;
    this.currentEmail = JSON.parse(
      localStorage.getItem("logged_in_user")
    ).email;
    this.currentPhone = JSON.parse(
      localStorage.getItem("logged_in_user")
    ).phone;
    this.currentPassword = JSON.parse(
      localStorage.getItem("logged_in_user")
    ).password;
    this.user = JSON.parse(localStorage.getItem("logged_in_user"));
  }

  UpdateRecord() {
    const { uid } = this.afa.auth.currentUser;
    console.log("uid", this.afa.auth.currentUser);
    let record = {};
    record["name"] = this.currentUser;
    record["email"] = this.currentEmail;
    record["phone"] = this.currentPhone;
    record["userType"] = JSON.parse(
      localStorage.getItem("logged_in_user")
    ).userType;
    record["password"] = JSON.parse(
      localStorage.getItem("logged_in_user")
    ).password;
    console.log("record", record);
    this.userservice.updateUser(uid, record);
    localStorage.clear();
    localStorage.setItem("logged_in_user", JSON.stringify(record));
    setTimeout(function() {
      window.location.reload();
    }, 2000);
  }

  ChangePassword() {
    const { uid } = this.afa.auth.currentUser;
    let password = {};
    // this.oldpassword=this.encryptData(this.oldpassword);
    console.log("this.oldpassword", this.oldpassword);
    this.oldpassword;
    this.newpassword;
    this.newpasswordconfirmation;
    console.log("pwd", this.currentPassword);
    if (this.currentPassword == window.btoa(this.oldpassword)) {
      if (this.newpassword == this.newpasswordconfirmation) {
        password["password"] = window.btoa(this.newpassword);
        this.userservice.updateUserPassWord(uid, password);
        this.notifier.notify("success", "Successfully changed password !");

        localStorage.clear();
        setTimeout(function() {
          window.location.reload();
        }, 2000);
      } else {
        this.notifier.notify(
          "error",
          "New password is not match, Please correct !"
        );
      }
    } else {
      this.notifier.notify(
        "error",
        "Sorry ! Entered password is wrong , Please check it again"
      );
    }
  }

  refresh(): void {
    window.location.reload();
  }
}
