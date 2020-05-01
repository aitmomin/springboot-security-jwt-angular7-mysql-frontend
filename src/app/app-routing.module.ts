import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './home/home.component';
import { CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ListComponent} from './list/list.component';
import {ArtistsComponent} from './artists/artists.component';
import {AlbumsComponent} from './albums/albums.component';
import {TracksComponent} from './tracks/tracks.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {AddAlbumComponent} from './add-album/add-album.component';
import {AddTrackComponent} from './add-track/add-track.component';
import {AddSingleComponent} from './add-single/add-single.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {Home2Component} from './home2/home2.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // { path: 'home', component: Home2Component },
  { path: 'artists', component: ArtistsComponent },
  { path: ':id/:name/albums', component: AlbumsComponent },
  { path: ':id/:name/albums/:id_Album/:name_Album/tracks', component: TracksComponent },
  { path: 'list', component: ListComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'profile', component: MyProfileComponent },
  { path: 'new/album', component: AddAlbumComponent },
  { path: 'new/single', component: AddSingleComponent },
  { path: 'new/track', component: AddTrackComponent },
  { path: 'list/dashboard', component: DashboardComponent },
  { path: '***', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule { }
