import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthLoginInfo} from '../service/auth/auth-login-info';
import {TokenStorageService} from '../service/auth/token-storage.service';
import {AuthService} from '../service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {


  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  hide = true;
  isLoginFailed = false;
  errorMessage = '';
  isLoggedIn = false;
  roles: string[] = [];
  private loginInfo: AuthLoginInfo;

  constructor(private router: Router, private authService: AuthService, private tokenStorage: TokenStorageService) { }

  ngOnInit() {
  }

  login(){
    console.log(this.username.value+'-'+this.password.value);
    this.loginInfo = new AuthLoginInfo(
      this.username.value,
      this.password.value);

    this.authService.attemptAuth(this.loginInfo).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveAuthorities(data.authorities);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getAuthorities();
        window.location.replace('home');
        console.log('success yeah !!!');
      },
      error => {
        console.log('error auth : '+error);
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  getErrorMessageLogin() {
    // return this.email.hasError('required') ? 'You must enter a value' :
    //   this.email.hasError('email') ? 'Not a valid email' :
    //     '';
    return this.username.hasError('required')?'You must enter a login' : '';
  }

  getErrorMessagePassword() {
    // return this.email.hasError('required') ? 'You must enter a value' :
    //   this.email.hasError('email') ? 'Not a valid email' :
    //     '';
    return this.password.hasError('required')?'You must enter a password' : '';
  }

  register(): void {
    this.router.navigate(['auth/register']);
  }
}
