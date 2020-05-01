import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from '../service/api/api.service';
import {Router} from '@angular/router';
import {ArtistModule} from './artist.module';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {

  artists: Observable<string[]>;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.allArtists();
    console.log('load !');
  }

  allArtists(){
    this.artists=this.apiService.getArtists();
  }

  goToAlbums(artist: number){
      localStorage.removeItem("artistID");
      localStorage.setItem("artistID", artist.toString());
      this.router.navigate(['albums']);
  }
}
