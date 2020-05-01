import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SignUpInfo} from '../service/auth/signup-info';
import {AuthService} from '../service/auth/auth.service';
import {ArtistModule} from '../artists/artist.module';
import {ApiService} from '../service/api/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isLinear = false;
  form: FormGroup;
  etape1: FormGroup;
  etape2: FormGroup;
  etape3: FormGroup;
  user: ArtistModule = new ArtistModule();
  isSignedUp = false;
  isSignUpFailed = false;
  errorMessage = '';
  file: File;
  sizeFile: number=0;
  validFile: boolean=true;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {

    this.etape1 = this.formBuilder.group({
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      birthdate: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      city: ['', Validators.required]
    });
    this.etape2 = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required]
    });
    this.etape3 = this.formBuilder.group({
      // profile: []
    });

    this.form = this.formBuilder.group({
      etape1 : this.etape1,
      etape2 : this.etape2,
      //etape3 : this.etape3
    });
  }

  getErrorEmail() {
    return this.etape2.get('email').hasError('pattern') ? 'entrer un email valide':'';
  }

  getErrorPass(form: FormGroup) {
    // if (this.etape2.get('confirmpassword').value === this.etape2.get('password').value){
    //   return true;
    // }else {
    //   return false;
    // }
  }

  upload(event){
    const test=event.target.files.item(0);
    if(test !== null){
      if (test.type.match('image.*')) {
        this.file=event.target.files.item(0);
        this.sizeFile=this.file.size;
        this.validFile=true;
      } else {
        alert('invalid format!');
        this.validFile=false;
      }
    }else{
      this.validFile=true;
    }
    //console.log(this.file);
  }

  inscrire(){
    this.user.lastname=this.etape1.get('lastname').value;
    this.user.firstname=this.etape1.get('firstname').value;
    this.user.birthdate=this.etape1.get('birthdate').value;
    this.user.city=this.etape1.get('city').value;
    this.user.gender=this.etape1.get('gender').value;
    this.user.address=this.etape1.get('address').value;
    this.user.username=this.etape2.get('username').value;
    this.user.password=this.etape2.get('password').value;
    this.user.email=this.etape2.get('email').value;

    if(this.sizeFile === 0){
      this.authService.signUp(this.user, null).subscribe(value => {
        this.isSignedUp=true;
        this.isSignUpFailed=false;
        console.log("register succefull");
      }, error => {
        this.errorMessage = error.error.message;
        this.isSignUpFailed=true;
        console.log("register error : "+this.errorMessage);
      });
    }else {
      this.authService.signUp(this.user, this.file).subscribe(value => {
        this.isSignedUp=true;
        this.isSignUpFailed=false;
        console.log("register succefull");
      }, error => {
        this.errorMessage = error.error.message;
        this.isSignUpFailed=true;
        console.log("register error : "+this.errorMessage);
      });
    }
  }

  goLogin(){
    this.router.navigate(['auth/login']);
  }
}
