import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NotifierService } from "angular-notifier";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, of } from "rxjs";
import { RouterOutlet, Router, RouterModule } from "@angular/router";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NavigationComponent } from "./navigation.component";
import {
  MatIcon,
  MatToolbar,
  MatNavList,
  MatSidenav,
  MatSidenavContent,
  MatSidenavContainer,
  MatToolbarRow
} from "@angular/material";
import { FormsModule } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("NavigationComponent", () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(function() {
    var store = {};

    spyOn(localStorage, "getItem").and.callFake(function(id: string) {
      return (store[id] = "123");
    });
    spyOn(localStorage, "setItem").and.callFake(function(key, value) {
      return (store[key] = value + "");
    });
    spyOn(localStorage, "clear").and.callFake(function() {
      store = {};
    });
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, BrowserAnimationsModule, RouterModule.forRoot([])],
      declarations: [
        NavigationComponent,
        MatIcon,

        MatToolbar,
        MatNavList,
        MatSidenav,
        MatSidenavContent,
        MatSidenavContainer,
        MatToolbarRow
      ],
      providers: [
        { provide: AngularFirestore, useValue: FirestoreStub },
        { provide: AngularFireAuth, useValue: AngularFireMocks },
        { provide: NotifierService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
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
});
