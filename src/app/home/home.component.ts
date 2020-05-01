import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ApiService} from '../service/api/api.service';
import {forEach} from '@angular/router/src/utils/collection';
import {ArtistModule} from '../artists/artist.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  artists: ArtistModule[] = [];

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.getUsersRandom();
    console.log('load');
  }

  getUsersRandom(){
    this.apiService.getUsersRandom().subscribe(value => {
      this.artists=value;
      console.log('good !');
    }, error => {
      console.log(error);
    });
  }

  goToAlbums(artist: ArtistModule){
    localStorage.removeItem("artistID");
    localStorage.setItem("artistID", artist.id.toString());
    this.router.navigate([artist.id, artist.nickname, 'albums']);
  }
}
