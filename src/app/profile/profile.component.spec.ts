import { of, BehaviorSubject } from "rxjs";
import { NotifierService } from "angular-notifier";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProfileComponent } from "./profile.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

describe("ProfileComponent", () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  beforeEach(function () {
    var store = {};
  
    spyOn(localStorage , 'getItem' ).and.callFake( function ( id:string) {
      return store[id] = "123";
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value + '';
    });
    spyOn(localStorage, 'clear').and.callFake(function () {
        store = {};
    });
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ProfileComponent],
      providers: [
        { provide: AngularFirestore, useValue: FirestoreStub },
        { provide: AngularFireAuth, useValue: AngularFireMocks },
        { provide: NotifierService }
        //  UserServiceService
      ]
    }).compileComponents();
  }));  
 


  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  const FirestoreStub = {
    collection: () => ({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: "bar" }),
        set: (_d: any) => new Promise((resolve, _reject) => resolve())
      }),
      valueChanges: () => new BehaviorSubject({ foo: "bar" }),
      snapshotChanges: () =>
        new BehaviorSubject([
          {
            payload: {
              doc: {
                id: "123",
                data: () => {
                  return {
                    id: "123",
                    name: "kamal",
                    email: "asd@asdf.com",
                    password: "asd",
                    phone: "123123",
                    userType: "admin"
                  };
                }
              }
            }
          }
        ])
    })
  };

  const AngularFireMocks = {
    auth: of({ uid: "ABC123" })
  };

  let store = {};
});
