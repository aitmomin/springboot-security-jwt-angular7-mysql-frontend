import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../service/auth/auth.service';
import {Observable} from 'rxjs';
import {ApiService} from '../service/api/api.service';
import {TokenStorageService} from '../service/auth/token-storage.service';
import {ArtistModule} from '../artists/artist.module';
import {AlbumModule} from '../albums/album.module';
import {TrackModule} from '../tracks/track.module';

@Component({
  selector: 'app-add-track',
  templateUrl: './add-track.component.html',
  styleUrls: ['./add-track.component.scss']
})
export class AddTrackComponent implements OnInit {

  @ViewChild('dom_audio') dom_audio: ElementRef;
  success: boolean=false;
  form: FormGroup;
  file: File=null;
  fileValide: boolean=true;
  albums: AlbumModule[] = [];
  id: string;
  duration: any;
  min: string;
  sec: string;

  constructor(private fb: FormBuilder, private api: ApiService, private token: TokenStorageService) { }

  ngOnInit() {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      album: ['', Validators.required],
      track: ['', Validators.required],
      time: []
    });
    this.id=localStorage.getItem('CONNECTED_ID');
    this.getAlbums();
  }

  getAlbums(){
    this.api.getAlbumsByConnected(this.id).subscribe(value => {
      this.albums=value;
    }, error => {
      console.log('error here : '+error);
    });
  }

  upload(event) {
    const test = event.target.files.item(0);
    if (test !== null) {
      if (test.type.match('audio.*')) {
        this.file = event.target.files.item(0);
        let obUrl = URL.createObjectURL(this.file);
        this.dom_audio.nativeElement.setAttribute('src', obUrl);
        this.fileValide = true;
      } else {
        this.fileValide = false;
      }
    } else {
      this.fileValide = true;
    }
  }

  setDuration(load_event): void {
    this.duration = Math.round(load_event.currentTarget.duration);
    console.log('duration = '+this.duration);
    this.sec = (this.duration % 60).toString();
    this.min = Math.floor(this.duration / 60).toString();
    if (this.min.length === 1)  this.min='0'+this.min;
    if (this.sec.length === 1)  this.sec='0'+this.sec;
    console.log(this.min+':'+this.sec);
  }

  create(){
    let time = this.min+':'+this.sec;
    this.form.get('time').setValue(time);
    console.log('test time '+this.form.get('time'));
    this.api.createNewTrack(this.form.value, this.file).subscribe(value => {
      console.log('chanson ajouté !!!');
      this.success=true;
      this.form.reset();
    }, error => {
      console.log(error);
    });
  }
}
