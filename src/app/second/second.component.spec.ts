import { UserServiceService } from './../services/user-service.service';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotifierService } from 'angular-notifier';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondComponent } from './second.component';
import { Input, Component} from '@angular/core';
import { PaginationControlsComponent, PaginatePipe, PaginationControlsDirective, PaginationService } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

describe('SecondComponent', () => {
  let component: SecondComponent;
  let fixture: ComponentFixture<SecondComponent>;

  beforeEach(function () {
    var store = {};
  
    spyOn(localStorage , 'getItem' ).and.callFake( function ( name:string) {
      return store[name] = "123";
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
      imports :[FormsModule],
      declarations: [ SecondComponent ,PaginationControlsDirective,PaginationControlsComponent ,PaginatePipe],
      providers: [
        
       PaginationService,
       { provide: AngularFirestore, useValue: FirestoreStub },
       { provide: AngularFireAuth, useValue: AngularFireMocks },
       {provide: NotifierService  },
      //  UserServiceService
     ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
