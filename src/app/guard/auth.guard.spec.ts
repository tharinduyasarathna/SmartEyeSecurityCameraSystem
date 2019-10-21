import { NotifierService } from "angular-notifier";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { environment } from "./../../environments/environment";
import { RouterModule, Router } from "@angular/router";
import { TestBed, inject } from "@angular/core/testing";

import { AuthGuard } from "./auth.guard";
import { AngularFireModule } from "@angular/fire";
import { BehaviorSubject, of } from "rxjs";

describe("AuthGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forChild([]),
      //  AngularFireModule.initializeApp(environment.firebase)
      ],

      providers: [
        AuthGuard,
        {provide : Router},
        { provide: NotifierService },
        { provide: AngularFireAuth, useValue: AngularFireMocks },
        { provide: AngularFirestore, useValue: FirestoreStub }
      ]
    });
  });

  it("should ...", inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  const FirestoreStub = {
    collection: () => ({
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
