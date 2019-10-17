import { SafeUrl } from "@angular/platform-browser";

export interface ImageData {
    id:string;
    isEdit:boolean;
    imgName: string;
    imgUrl:SafeUrl;
}
