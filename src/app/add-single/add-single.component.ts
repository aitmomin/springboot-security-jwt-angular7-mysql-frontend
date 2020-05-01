import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../service/api/api.service';
import {TokenStorageService} from '../service/auth/token-storage.service';
import {TrackModule} from '../tracks/track.module';

@Component({
  selector: 'app-add-single',
  templateUrl: './add-single.component.html',
  styleUrls: ['./add-single.component.scss']
})
export class AddSingleComponent implements OnInit {

  @ViewChild('dom_audio') dom_audio: ElementRef;
  success: boolean=false;
  form: FormGroup;
  file: File=null;
  file2: File=null;
  fileValide: boolean=true;
  fileValide2: boolean=true;
  duration: any;
  min: string;
  sec: string;

  constructor(private fb: FormBuilder, private api: ApiService, private token: TokenStorageService) { }

  ngOnInit() {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      single: ['', Validators.required],
      photo: ['', Validators.required],
      time: [],
      user: []
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

  upload2(event) {
    const test = event.target.files.item(0);
    if (test !== null) {
      if (test.type.match('image.*')) {
        this.file2 = event.target.files.item(0);
        this.fileValide2 = true;
      } else {
        this.fileValide2 = false;
      }
    } else {
      this.fileValide2 = true;
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
    this.form.get('time').setValue(this.min+':'+this.sec);
    this.form.get('user').setValue(localStorage.getItem('CONNECTED_ID'));
    this.api.createNewSingle(this.form.value, this.file, this.file2).subscribe(value => {
      console.log('chanson ajouté !!!');
      this.success=true;
      this.form.reset();
    }, error => {
      console.log(error);
    });
  }
}
