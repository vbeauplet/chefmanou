import { Component, OnInit, Input } from '@angular/core';

import { User } from '../../model/user.model';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';
import { RecipeFilterService } from 'src/app/services/recipe-filter.service';
import { Router } from '@angular/router';
import { Event } from "../../model/event.model";
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'user-card',
  host: { 
      '[class]' : 'this.size + " margined col-dir flex-block"'
    },
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  /**
   * Input user
   */
  @Input() user: User = new User();
  
  /**
   * Size of the card, can be big, medium, small (...). Medium by default
   */ 
  @Input() size: string = 'medium';
  
  /**
   * Status of the user follow/unfollow action on server
   */
  public userFollowStatus: number = -1;

  constructor(
    private recipeFilterService: RecipeFilterService,
    private eventService: EventService,
    public userService: UserService,
    public profileService: ProfileService,
    public router: Router) {
  }

  ngOnInit(): void {
  }
  
  /**
   * Handles click on Follow
   */
  public onClickFollow(){
    this.userFollowStatus = 0;
    if(this.profileService.profile.user.followings.includes(this.user.userId)){
      this.profileService.unfollow(this.user);
    }
    else{
      this.profileService.follow(this.user);
      
      // Create associate events
      this.createFollowUserEvents();
    }
    setTimeout(() => {
        this.userFollowStatus = -1;
      }, 1500)
  }
  
  /**
   * Handles click on Follow
   */
  public onClickSeeRecipes(){
    // Reset and set recipe filter
    this.recipeFilterService.resetRecipeFilter();
    this.recipeFilterService.updateAuthors([this.user]);
    
    // Go to dashboard view
    this.router.navigate(['kitchen']);
  }
  
  /**
   * Create events on database corresponding to a user follow event
   */
  public createFollowUserEvents(){
    if(this.profileService.isLoaded){
      
      // Tells connected user follow a new user
      let event1 = new Event()
      event1.init();
      event1.code = 705;
      event1.userRef = this.user.userId;
      this.eventService.uploadEventOnServer(event1, this.profileService.profile.user.userId);
      
      // Tells to the user that he is now followed by the connected user
      let event2 = new Event()
      event2.init();
      event2.code = 706;
      event2.userRef = this.profileService.profile.user.userId;
      this.eventService.uploadEventOnServer(event2, this.user.userId);
    }
  }

}
