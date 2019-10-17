import { AdminGuard } from './admin/admin.guard';
import { UserServiceService } from "./services/user-service.service";
import {
  AngularFirestore,
  AngularFirestoreModule
} from "@angular/fire/firestore";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavigationComponent } from "./navigation/navigation.component";
import { SecondComponent } from "./second/second.component";
import { FirstComponent } from "./first/first.component";
import { RouterModule, Routes } from "@angular/router";
import { CustomMaterialModule } from "./core/material.module";
import { LoginComponent } from "./login/login.component";
import { SettingComponent } from "./setting/setting.component";
import { HistoryComponent } from "./history/history/history.component";
import { AboutComponent } from "./about/about.component";
import { ProfileComponent } from "./profile/profile.component";
import { environment } from "src/environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AuthGuard } from "./guard/auth.guard";
import { NgxPaginationModule } from 'ngx-pagination';
import { NotifierModule, NotifierOptions } from 'angular-notifier';




const appRoutes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "home",
    component: NavigationComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "first", pathMatch: "full" },
      {
        path: "setting",
        component: SettingComponent,
        data: { title: "Setting Component" }
      },
      {
        path: "first",
        component: FirstComponent,
        data: { title: "first Component" }
      },
      {
        path: "second",
        component: SecondComponent,
        data: { title: "second Component" }
      },
      {
        path: "history",
        component: HistoryComponent,
        data: { title: "History Component" }
      },
      {
        path: "about",
        component: AboutComponent,
        data: { title: "About Component" }
      },
      {
        path: "profile",
        component: ProfileComponent,
        data: { title: "Profile Component" }
      }
    ]
  }
];

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'middle',
			distance: 12
		},
		vertical: {
			position: 'top',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 3000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};
@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    SecondComponent,
    FirstComponent,
    LoginComponent,
    SettingComponent,
    HistoryComponent,
    AboutComponent,
    ProfileComponent,
    
    
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    CustomMaterialModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    ReactiveFormsModule,
    FormsModule,
    NotifierModule.withConfig(customNotifierOptions),
    NgxPaginationModule,
    
  ],
  providers: [AngularFirestore, UserServiceService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
