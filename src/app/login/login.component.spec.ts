import { AuthService } from './../services/auth/auth.service';
import { of, BehaviorSubject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { Router } from '@angular/router';

class MockAuthService { 
  authenticated = true;
  isLoggedIn() {
    return this.authenticated;
  }
}


describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;  

  let service: MockAuthService;
 
 beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        
       {provide: Router },
        { provide: AngularFirestore, useValue: FirestoreStub },
        { provide: AngularFireAuth, useValue: AngularFireMocks },
        { provide: NotifierService } ,
        // {provide: AuthService, useValue:AuthServiceStub},      
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    service = new MockAuthService();
    fixture.detectChanges();
  });



  it("should create", () => {
    expect(component).toBeTruthy();
  });



  it("canLogin returns false when the user is not authenticated", () => {
    service.authenticated = false; 
    expect(!service.isLoggedIn()).toBeTruthy();
  });
 

  it("canLogin returns true when the user is authenticated", () => {
    service.authenticated = true; 
    expect(!service.isLoggedIn()).toBeFalsy();
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
                password:'123456',
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
