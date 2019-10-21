import { NotifierService } from 'angular-notifier';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, BehaviorSubject } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import { PaginatePipe, PaginationControlsComponent, PaginationControlsDirective, PaginationService } from 'ngx-pagination';
import { Router } from '@angular/router';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

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
      declarations: [ HistoryComponent,PaginationControlsDirective,PaginationControlsComponent ,PaginatePipe ],
      providers: [
        PaginationService,
        {provide: Router},
         { provide: AngularFirestore, useValue: FirestoreStub },
         { provide: AngularFireAuth, useValue: AngularFireMocks },
         { provide: NotifierService }       
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const FirestoreStub = {
    collection: () => ({
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
