import { Component, OnInit } from '@angular/core';

import { User } from '../../model/user.model';

import { UserService } from '../../services/user.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Profile } from 'src/app/model/profile.model';

@Component({
  selector: 'follow-user',
  host: { 'class' : 'margined-top page'},
  templateUrl: './follow-user.component.html',
  styleUrls: ['./follow-user.component.scss']
})
export class FollowUserComponent implements OnInit {

  /**
   * Bindable list of displayed users
   */
  public displayedUsers: User[] = [];
  
  /**
   * Tells if users to be displayed are loaded
   */
  public isLoaded = false;
  
  /**
   * Max number of result displayed on page
   */
  private maxNumberOfResults: number = 10;
  
  /**
   * Current free search value
   */
  private currentSearchValue: string = '';
  
  /**
   * Id of currently connected user
   */
  private currentUserId: string = '';

  constructor(
    public userService: UserService, 
    public profileService: ProfileService) { }

  ngOnInit(): void {
    
    // Launch search when profile is first loaded
    
    this.profileService.profileSubject.subscribe(
      (profile: Profile) => {
        if(profile.user.userId !== this.currentUserId){
          this.currentUserId = profile.user.userId;
          this.search('');
        }
      });
    
    if(this.profileService.isLoaded){
      this.currentUserId = this.profileService.profile.user.userId;
      this.search('');
    }
  }
  
  /**
   * Launches a user search from a free string value
   */
  public search(value: string){
    this.isLoaded = false;
    this.currentSearchValue = value;
    this.userService.searchUsersOnServer(this.maxNumberOfResults, value, [this.profileService.profile.user]).then((result: User[]) => {
        this.displayedUsers = result;
        this.isLoaded = true;
      });
  }
  
  /**
   * Show more results
   * Add 5 to the current number and launches a new search
   */
  public showMore(){
    this.maxNumberOfResults = this.maxNumberOfResults + 5;
    this.search(this.currentSearchValue);
  }

}
