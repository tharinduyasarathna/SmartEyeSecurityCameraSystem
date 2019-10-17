import { AuthService } from './../services/auth/auth.service';
import { UserServiceService } from './../services/user-service.service';
import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: any;
  private  notifier: NotifierService;
  isForgotPassword: boolean;
  userEmail:string;

  constructor(
    private afa: AngularFireAuth,
    private router: Router,
    private fb: FormBuilder,
    private userservice: UserServiceService,
    private notifierService: NotifierService,
    private authService:AuthService
 
  ) {this.notifier = notifierService; this.isForgotPassword = false;}

  ngOnInit() {
    
    this.loginForm = this.fb.group({
      userEmail: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ]
      ],
      userPassword: ["", Validators.required]
    });
  }

  loginUser = () => {
    const userEmail = this.loginForm.controls["userEmail"].value;
    const userPassword = this.loginForm.controls["userPassword"].value;
    console.log("clicked");
    this.afa.auth
      .signInWithEmailAndPassword(userEmail,window.btoa(userPassword) )
      .then((authenticatedUserData) => {
        
        this.userservice.getUser(authenticatedUserData.user.uid).subscribe(user=>{
          
          localStorage.setItem("logged_in_user",JSON.stringify(user.data()));
          localStorage.setItem("logged_in_user_id",JSON.stringify(authenticatedUserData.user.uid));
           this.notifier.notify( 'success', "Hi ! Welcome"  );
           this.router.navigate(["home"]);
        });

      })
      .catch(error => {
       //console.log('error', error)
       // alert(error.message);
       this.notifier.notify( 'error', "There is no user record corresponding to this identifier !" );
         
      
      });
  };

  forgotPassword() {
    console.log('this.userEmail', this.userEmail);
    this.authService.ForgotPassword(this.userEmail)
   
      .then(res => {
        console.log(res);
        this.isForgotPassword = false;
        
      }, error => {
        this.notifier.notify("error", error);
       
      });
  }
  
}
