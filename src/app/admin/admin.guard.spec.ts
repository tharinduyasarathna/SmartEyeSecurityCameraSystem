import { of } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { NotifierService } from "angular-notifier";
import {
  AngularFirestore,
  AngularFirestoreModule
} from "@angular/fire/firestore";
import { TestBed, async, inject } from "@angular/core/testing";

import { AdminGuard } from "./admin.guard";
import { AngularFireModule } from "@angular/fire";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

describe("AdminGuard", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AngularFirestoreModule],
      providers: [
        AdminGuard,
        { provide: NotifierService },
        { provide: AngularFireAuth, useValue: AngularFireMocks },
        { provide: Router },
        { provide: AngularFirestore, useValue: FirestoreStub }
      ]
    });
  });

  it("should ...", inject([AdminGuard], (guard: AdminGuard) => {
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
