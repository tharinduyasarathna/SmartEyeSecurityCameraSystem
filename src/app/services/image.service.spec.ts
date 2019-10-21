import { NotifierService } from 'angular-notifier';
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreModule
} from "@angular/fire/firestore";
import { TestBed, inject } from "@angular/core/testing";

import { ImageService } from "./image.service";
import { AngularFireModule } from "@angular/fire";
import { BehaviorSubject, of } from "rxjs";

describe("ImageService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImageService,
        { provide: AngularFirestore, useValue: FirestoreStub },
        { provide: AngularFireAuth, useValue: AngularFireMocks },
        {provide: NotifierService  }
      ]
    });
  });

  it("should be created", inject([ImageService], (service: ImageService) => {
    expect(service).toBeTruthy();
  }));

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
