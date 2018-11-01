import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_END_POINTS, APP_CREDENTIALS } from "../constants";
declare var QB: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  errorMessage:string = '';
  // These are the end point API domains we are using for chat and notifications.
  public endpoints:any = APP_END_POINTS;
  // These are the credentials for app names 'Atheer-chat-app' on QuickBlox domain
  public CREDENTIALS:any = APP_CREDENTIALS;
  public user : any = {};
  constructor(
    private router: Router
  ) { }
  validateLogin(form: NgForm) {
    const value = form.value;
    // We need to intialize the quickblox context for our application using this method.
    QB.init(this.CREDENTIALS.appId, this.CREDENTIALS.authKey, this.CREDENTIALS.authSecret, this.endpoints );
    // We need to create to session to start chat using the credentials entered during login 
    QB.createSession({login: value.username, password: value.password}, (err, res) => {
      if(res){
        this.errorMessage = "";
        if(res.user_id){
          // Using session storage to store token details after conect established. 
          sessionStorage.setItem('sessionDetails',JSON.stringify(res));
          sessionStorage.setItem('loginDetails',JSON.stringify(value));
          // If the login is sucsess we are Navigating to dashboard.
          this.router.navigate(['dashboard']);
        }
      }else{
        this.errorMessage = "Please Enter Valid Credentials";
      }
    });
  }
}