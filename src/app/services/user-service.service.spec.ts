import { NotifierService } from 'angular-notifier';
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreModule
} from "@angular/fire/firestore";
import { TestBed, inject } from "@angular/core/testing";

import { UserServiceService } from "./user-service.service";
import { AngularFireModule } from "@angular/fire";
import { BehaviorSubject, of } from "rxjs";

describe("UserServiceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserServiceService,
        { provide: AngularFirestore, useValue: FirestoreStub },
        { provide: AngularFireAuth, useValue: AngularFireMocks },
        {provide: NotifierService  }
      ]
    });
  });

  it("should be created", inject(
    [UserServiceService],
    (service: UserServiceService) => {
      expect(service).toBeTruthy();
    }
  ));

  const FirestoreStub = {
    collection: (name: string) => ({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: "bar" }),
        set: (_d: any) => new Promise((resolve, _reject) => resolve())
      })
    })
  };

  const AngularFireMocks = {
    auth: of({ uid: "ABC123" })
  };
});
