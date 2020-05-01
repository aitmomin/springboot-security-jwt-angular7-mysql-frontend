import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatTableModule,
  MatPaginatorModule,
  MatRadioModule,
  MatDatepickerModule,
  MatSortModule,
  MatDividerModule,
  MatTabsModule,
  MatMenuTrigger,
  MatMenuModule,
  MatOptionModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import { MatFormFieldModule, MatInputModule, MatToolbarModule, MatListModule, MatIconModule, MatCardModule,
        MatProgressSpinnerModule, MatStepperModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import {ChartModule, FileUploadModule, GalleriaModule, ProgressBarModule, RadioButtonModule} from 'primeng/primeng';
import {ApiService} from './service/api/api.service';
import { ListComponent } from './list/list.component';
import {HttpClientModule} from '@angular/common/http';
import {CardModule} from 'primeng/card';
import { AlbumsComponent } from './albums/albums.component';
import { TracksComponent } from './tracks/tracks.component';
import { ArtistsComponent } from './artists/artists.component';
import { TrackComponent } from './track/track.component';
import { TrackControlComponent } from './track/track-control/track-control.component';
import {httpInterceptorProviders} from './service/auth/auth-interceptor';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import { AddAlbumComponent } from './add-album/add-album.component';
import { AddTrackComponent } from './add-track/add-track.component';
import { AddSingleComponent } from './add-single/add-single.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ConfirmPasswordDirective} from './register/ConfirmPassword.directive';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { Home2Component } from './home2/home2.component';
import {ChartsModule} from 'ng2-charts';
import { MysinglesComponent } from './mysingles/mysingles.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { PlaylistComponent } from './playlist/playlist.component';
import {CountoDirective, CountoModule} from 'angular2-counto';
import {CountoModuleNgFactory} from 'angular2-counto/src/counto.module.ngfactory';

// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ListComponent,
    AlbumsComponent,
    TracksComponent,
    ArtistsComponent,
    TrackComponent,
    TrackControlComponent,
    UserProfileComponent,
    AddAlbumComponent,
    AddTrackComponent,
    AddSingleComponent,
    DashboardComponent,
    ConfirmPasswordDirective,
    MyProfileComponent,
    Home2Component,
    MysinglesComponent,
    PlaylistComponent
  ],
  imports: [
    MDBBootstrapModule.forRoot(),
    CountoModule,
    // ProgressbarModule.forRoot(),
    ChartsModule,
    ChartModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule, MatCheckboxModule, MatTableModule, MatFormFieldModule, MatInputModule,
    MatToolbarModule, MatListModule, MatIconModule, MatCardModule, MatProgressSpinnerModule, MatStepperModule,
    MatRadioModule, MatDatepickerModule, RadioButtonModule, FileUploadModule, CardModule, MatSortModule,
    MatPaginatorModule, MatDividerModule, MatTabsModule, GalleriaModule, MatMenuModule, MatOptionModule, MatSelectModule,
    MatTooltipModule
  ],
  providers: [ApiService, httpInterceptorProviders, {provide: LOCALE_ID, useValue: 'fr' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
