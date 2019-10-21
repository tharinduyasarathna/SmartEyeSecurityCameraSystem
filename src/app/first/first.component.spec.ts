import { NotifierService } from 'angular-notifier';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { RouterOutlet } from "@angular/router";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FirstComponent } from "./first.component";
import { BehaviorSubject, of } from "rxjs";
import { stringify } from 'querystring';



describe("FirstComponent", () => {
  let component: FirstComponent;
  let fixture: ComponentFixture<FirstComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [FirstComponent, RouterOutlet],
      providers: [
        
        { provide: AngularFirestore, useValue: FirestoreStub },
        { provide: AngularFireAuth, useValue: AngularFireMocks },
        { provide: NotifierService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstComponent);
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
      valueChanges: () => new BehaviorSubject([{payload: { doc : { data :() => { return{
        imgUrl : "xxxxxx",
      }}}}}]),
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
