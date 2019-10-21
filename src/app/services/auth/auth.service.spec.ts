import { NotifierService } from 'angular-notifier';
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreModule
} from "@angular/fire/firestore";
import { TestBed, inject } from "@angular/core/testing";

import { AuthService } from "./auth.service";
import { BehaviorSubject, of } from "rxjs";
import { Router } from '@angular/router';

describe("AuthService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
         AuthService ,
         { provide: Router},
        { provide: AngularFirestore, useValue: FirestoreStub },
        { provide: AngularFireAuth, useValue: AngularFireMocks },
        {provide: NotifierService  }
      ]
    });
  });

  it("should be created", inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  // const FirestoreStub = {
  //   collection: (name: string) => ({
  //     doc: (_id: string) => ({
  //       valueChanges: () => new BehaviorSubject({ foo: "bar" }),
  //       set: (_d: any) => new Promise((resolve, _reject) => resolve())
  //     })
  //   })
  // };

  const FirestoreStub = {
    collection: (name: string) => ({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: "bar" }),
        set: (_d: any) => new Promise((resolve, _reject) => resolve())
      }),
      valueChanges: () => new BehaviorSubject({ foo: "bar" }),
      snapshotChanges: () => new BehaviorSubject([{ 
        payload:{
          doc:{
            id:'123',
            data:()=>{
              return {
                name:"kamal",
                email:'asd@asdf.com',
                password:'asd',
                phone:'123123',
                userType:'admin'
              }
            }
          } 
        }
      }])
    })
  };

  const AngularFireMocks = {
    auth: of({ uid: "ABC123" })
  };

  
});
