import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import {
  AngularFirestoreDocument,
  AngularFirestore
} from "@angular/fire/firestore";
import { Injectable, NgZone } from "@angular/core";
import { User } from "src/app/models/user.model";
import { Router } from "@angular/router";
import { NotifierService } from "angular-notifier";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private notifier: NotifierService;
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        this.ngZone.run(() => {
          this.router.navigate(["first"]);
          console.log("result", result);
        });
        this.SetUserData(result.user);
      })
      .catch(error => {
        // console.log('error', error)
        //window.alert(error.message)
        this.notifier.notify("error", error.message);
      });
  }

  // Sign up with email/password
  SignUp(email, password) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
      })
      .catch(error => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
      this.router.navigate(["verify-email-address"]);
    });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        
        this.notifier.notify("info", "Password reset email sent, check your inbox");
        
      })
      .catch(error => {
        this.notifier.notify("error", error);
      });
  }

  // Returns true when user is looged in and email is verified
  get authenticated(): boolean {
    return this.afAuth.authState !== null ? true : false;
  }

  // get isLoggedIn(): boolean {
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   return (user !== null && user.emailVerified !== false) ? true : false;
  // }

  isLoggedIn() {
    if (localStorage.getItem("logged_in_user") != null) {
      return true;
    } else {
      console.log("fuckkkkkkkkk");
      return false;
    }
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(result => {
        this.ngZone.run(() => {
          this.router.navigate(["first"]);
        });
        this.SetUserData(result.user);
      })
      .catch(error => {
        // console.log('error', error)
        // window.alert(error)
        this.notifier.notify("error", error);
      });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      id: user.uid,
      email: user.email,
      name: user.name,
      password: user.password,
      phone: user.phone,
      userType: user.role,
      image: user.image
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign out
  logout() {
    this.afAuth.auth.signOut().then(res => this.router.navigate(["login"]));
    this.notifier.notify("warning", "Logged Out Successfully!");
  }
}
