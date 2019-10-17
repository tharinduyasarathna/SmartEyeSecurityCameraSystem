import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { DomSanitizer } from "@angular/platform-browser";
import { ImageData } from "../models/image-data";
import { NotifierService } from "angular-notifier";

@Injectable({
  providedIn: "root"
})
export class ImageService {
  private  notifier: NotifierService;
  constructor(
    private afs: AngularFirestore,
    private afa: AngularFireAuth,
    private domSanitizer: DomSanitizer,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  getImages() {
    return this.afs
      .collection("images")
      .snapshotChanges()
      .pipe(
        map(data =>
          data.map(e => {
            const vl: ImageData = {
              id: e.payload.doc.id,
              isEdit: false,
              imgName: e.payload.doc.data()["imgName"],
              imgUrl: this.domSanitizer.bypassSecurityTrustUrl(
                "data:image/png;base64," + e.payload.doc.data()["imgUrl"]
              )
            };
            return vl;
          })
        )
      );
  }

  deleteImage(record_id: string) {
    this.afs.doc("images/" + record_id).delete();
    this.notifier.notify("warning", "Recorded Image Removed from the database !");
  }
}
