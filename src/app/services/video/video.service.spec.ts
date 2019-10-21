import { AngularFirestore } from '@angular/fire/firestore';
import { TestBed, inject } from '@angular/core/testing';

import { VideoService } from './video.service';
import { BehaviorSubject } from 'rxjs';
import { NotifierService } from 'angular-notifier';

describe('VideoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
     
      providers: [VideoService,{provide: NotifierService  },{ provide: AngularFirestore, useValue: FirestoreStub }]
    });
  });

  it('should be created', inject([VideoService], (service: VideoService) => {
    expect(service).toBeTruthy();
  }));

  const FirestoreStub = {
    collection: () => ({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
        set: (_d: any) => new Promise((resolve, _reject) => resolve()),
      }),
    }),
  };

  
});
