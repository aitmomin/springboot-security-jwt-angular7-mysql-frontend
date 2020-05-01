import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../service/auth/auth.service';
import {ApiService} from '../service/api/api.service';
import {AlbumModule} from '../albums/album.module';

@Component({
  selector: 'app-add-album',
  templateUrl: './add-album.component.html',
  styleUrls: ['./add-album.component.scss']
})
export class AddAlbumComponent implements OnInit {

  success: boolean=false;
  form: FormGroup;
  file: File=null;
  fileValide: boolean=true;

  constructor(private fb: FormBuilder, private api: ApiService) { }

  ngOnInit() {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      genre: ['', Validators.required],
      photo: ['', Validators.required],
      description: [],
      user: []
    });
  }

  upload(event) {
    const test = event.target.files.item(0);
    if (test !== null) {
      if (test.type.match('image.*')) {
        this.file = event.target.files.item(0);
        this.fileValide = true;
      } else {
        this.fileValide = false;
      }
    } else {
      this.fileValide = true;
    }
  }

  create(){
    this.form.get('user').setValue(localStorage.getItem('CONNECTED_ID'));
    this.api.createNewAlbum(this.form.value, this.file).subscribe(value => {
      console.log('album créé !!!');
      this.success=true;
      this.form.reset();
    }, error => {
      console.log(error);
    });
  }
}
