import { Component, OnInit,Input,ElementRef } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
//import { Users } from '../../users';
import { UsersService } from '../../users.service';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  userData : any;
  loggedInUser : any;
  userLoginDetails : any;
  selectedUser : any;
  receivedChatObj : any;
  @Input() users: any;
  //users: Users[] = [];
  constructor(private userService: UsersService,
    private route : ActivatedRoute,
    private elementRef: ElementRef) { }

  // We are getting the required details for the user list content on loading the page
  ngOnInit() {
    let token = this.route.snapshot.params.token;
    let id = this.route.snapshot.params.id;
    this.userData = JSON.parse(sessionStorage.getItem('sessionDetails'));
    this.userLoginDetails = JSON.parse(sessionStorage.getItem('loginDetails'));
    // We are waiting for the any notification from user chat
    this.userService._notificationObj
      .subscribe((data) => {
        this.receivedChatObj = data;
        if( this.selectedUser == undefined || this.selectedUser.user.id !== data.from){
          var d = document.getElementById(data.from);
          d.className += " active";
        }else{
          this.userService._receivedChatObj.emit(this.receivedChatObj);
        }
      });

    this.userService.getLoggedInUserDetails(this.userLoginDetails.username, token)
      .subscribe((data:any) => {
        this.loggedInUser = data.user;
      });   
      this.userService.userSelected
      .subscribe((user: any) => {
        this.selectedUser = user;
      }); 
  }


}
