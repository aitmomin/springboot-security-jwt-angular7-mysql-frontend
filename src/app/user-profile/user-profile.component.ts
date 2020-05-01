import { Component, OnInit } from '@angular/core';
import {ArtistModule} from '../artists/artist.module';
import {ApiService} from '../service/api/api.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: ArtistModule;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getArtistById(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      this.user = value;
    });
  }

}
