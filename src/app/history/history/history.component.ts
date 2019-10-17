import { VideoService } from "./../../services/video/video.service";
import { Component, OnInit } from "@angular/core";
import { ImageService } from "src/app/services/image.service";
import { Observable } from "rxjs";
import { ImageData } from "src/app/models/image-data";
import { VideoData } from "src/app/models/video-data";
import Swal from "sweetalert2";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"]
})
export class HistoryComponent implements OnInit {
  imageData: Observable<ImageData[]>;
  videoData: Observable<VideoData[]>;
  currentUserType;
  disableRemoveButton: boolean;

  constructor(
    private imageService: ImageService,
    private videoService: VideoService
  ) {
    this.currentUserType = JSON.parse(localStorage.getItem("logged_in_user")).userType;
    if(this.currentUserType == 'admin'){
       this.disableRemoveButton = false;
    }else{
      this.disableRemoveButton=true;
  
    }
  }

  ngOnInit() {
    this.imageData = this.imageService.getImages();
    this.videoData = this.videoService.getVideos();
  }

  RemoveImage(rowID: string) {
    Swal.fire({
      title: "<p style='color: white'>Are you sure to Remove Record ? </p>",
      text: "You will not be able to recover this imaginary file!",
      type: "warning",
      showCancelButton: true,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      background: "rgba(43, 165, 137, 0.90)",
      backdrop: `
      rgba(52, 73, 94,0.75)
        center left
        no-repeat
      `
    }).then(result => {
      if (result.value) {
        this.imageService.deleteImage(rowID);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  RemoveVideo(rowID: string) {
    Swal.fire({
      title: "<p style='color: white'>Are you sure to Remove Record ? </p>",
      text: "You will not be able to recover this imaginary file!",
      type: "warning",
      showCancelButton: true,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      background: "rgba(43, 165, 137, 0.90)",
      backdrop: `
      rgba(52, 73, 94,0.75)
        center left
        no-repeat
      `
    }).then(result => {
      if (result.value) {
        this.videoService.deleteVideo(rowID);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
}
