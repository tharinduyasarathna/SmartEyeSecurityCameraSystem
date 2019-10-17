import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { User } from "../models/user.model";
import { AngularFireAuth } from "@angular/fire/auth";
import { NotifierService } from "angular-notifier";
import * as firebase from "firebase";

@Injectable({
  providedIn: "root"
})
export class UserServiceService {
  private notifier: NotifierService;
  constructor(
    private afs: AngularFirestore,
    private afa: AngularFireAuth,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  getUsers() {
    return this.afs.collection("users").snapshotChanges();
  }

  getUser(uid) {
    return this.afs
      .collection("users")
      .doc(uid)
      .get();
  }

  createUser(user: User) {
    const { email, password } = user;
    this.afa.auth
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        console.log("data", data);
        const { uid } = this.afa.auth.currentUser;
        this.afs
          .collection("users")
          .doc(uid)
          .set(user);
      })
      .then(() => {
        this.notifier.notify("success", "User Created Successfully!");
      }).catch(error => {
        this.notifier.notify("error", error);
      });
    // return this.firestore.collection("users").add(record);
  }

  updateUser(recordID, record) {
    this.afs
      .collection("users")
      .doc(recordID)
      .update(record);
      var user = firebase.auth().currentUser;
     
      // user.updatePassword(record.password).then(function() {
      //   // Update successful
      //   console.log('record', record.password)
      // }).catch(function(error) {
      //   console.log('error', error)
      // });
      this.notifier.notify("info", "User Details Updated!");
  }

  deleteUser(record_id) {
    this.afs.doc("users/" + record_id).delete().then(() =>{
     // firebase.auth().currentUser.delete();
    });
    
    this.notifier.notify("warning", "User Removed!");
  }

  updateUserPassWord(recordID, record) {
    this.afs
      .collection("users")
      .doc(recordID)
      .update(record);
      var user = firebase.auth().currentUser;
     
      user.updatePassword(record.password).then(function() {
        // Update successful
        console.log('record', record.password)
      }).catch(function(error) {
        console.log('error', error)
      });
      this.notifier.notify("info", "Logged out in few seconds , Please Sign with new credentials!");
  }
}
