import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {UsersService} from '../users.service';
declare var QB: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorText:string = '';
  // These are the end point API domains we are using for chat and notifications.
  public endpoints:any = 
    {
      "api_endpoint": "https://api.quickblox.com",
      "chat_endpoint": "chat.quickblox.com",
      "turnserver_endpoint": "turnserver.quickblox.com"
  };
  // These are the credentials for app names 'Atheer-chat-app' on QuickBlox domain
  public CREDENTIALS:any = {
    appId: 74282,
    authKey: 'ENFggvVB2trchUa',
    authSecret: 'MQTsDR6cFLWHdOq'
  };
  public user : any = {
    login: '',
    pass: '',
    token : ''
  };
  constructor(
    private router: Router,
    public userService: UsersService
  ) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    const value = form.value;
    // We need to intialize the quickblox context for our application using this method.
    QB.init(this.CREDENTIALS.appId, this.CREDENTIALS.authKey, this.CREDENTIALS.authSecret, this.endpoints );
    // We need to create to session to start chat using the credentials entered during login 
    QB.createSession({login: value.username, password: value.password}, (err, res) => {
      if(res){
        this.errorText = "";
        if(res.user_id){
          sessionStorage.setItem('sessionDetails',JSON.stringify(res));
          sessionStorage.setItem('loginDetails',JSON.stringify(value));
          this.user.login = value.username;
          this.user.password = value.password;
          this.user.token = res.token;
          // If the login is sucsess we are Navigating to dashboard.
          this.router.navigate(['main',this.user.token, res.user_id ]);
        }
      }else{
        this.errorText = "Please Enter Valid Credentials";
      }
    });
  }
  
}
