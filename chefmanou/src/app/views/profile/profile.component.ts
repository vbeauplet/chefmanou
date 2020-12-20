import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';
import { UserService } from 'src/app/services/user.service';
import { RecipeFilterService } from 'src/app/services/recipe-filter.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ThemeService, Theme } from 'src/app/layout/services/theme.service';
import { ColorItem } from 'src/app/common/color-picker/color-picker.component';

import { Event } from "../../model/event.model";
import { EventService } from 'src/app/services/event.service';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-profile',
  host: { 'class' : 'page'},
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  /**
   * Gives the info on server side loading status if a new name is provided
   */
  public nameInputLoadingStatus: number = -1;
  
  /**
   * Gives the info on server side loading status if a new photo is provided
   */
  public photoLoadingStatus: number = -1;
  
  /**
   * Initial theme color items, computed at color-picker init time
   */
  public initialThemeColorItems: ColorItem[] = [];
  
    
  /**
   * Initial theme color items
   */
  public initialSelectedThemeColorItem: ColorItem = null;

  /**
   * Build the Profile Component View
   */
  constructor(
            private recipeFilterService: RecipeFilterService,
            private themeService: ThemeService,
            private authService: AuthService,
            private eventService: EventService,
            public uploadService: UploadService,
            public userService: UserService,
            public profileService: ProfileService,
            public activityService: ActivityService,
            public router: Router) { }

  ngOnInit(): void {
    // Init initial theme color items
    this.initialThemeColorItems = this.computeInitialThemeColorItems();
  }
  
  /**
   * Gets possible Color Items corresponding to all registered themes
   */
  public computeInitialThemeColorItems(): ColorItem[]{
    let result: ColorItem[] = [];
    for (let i = 0; i < this.themeService.themes.length; i++){
      result.push(this.toColorItem(this.themeService.themes[i]));
    }
    return result;
  }
  
  /**
   * Gets the color item corresponding to the user selected theme
   */
  public getInitialSelectedThemeColorItem(): ColorItem {
    if(this.initialSelectedThemeColorItem != null){
      return this.initialSelectedThemeColorItem;
    }
    let themeName: string = this.profileService.profile.user.theme;
    this.initialSelectedThemeColorItem =  this.toColorItem(this.themeService.getTheme(themeName));
    return this.initialSelectedThemeColorItem;
  }
  
  /**
   * Convert theme object to ColorItem object
   */
  private toColorItem(theme: Theme): ColorItem {
    return {
        payload: theme.name,
        label: theme.label,
        colors: [
          theme.mainBgColor,
          theme.secondaryBgColor,
          theme.outlineContentColor,
          theme.mainContentColor
        ]
      };
  }
  
  public onClickInviteCookers(){
    this.router.navigate(['user', 'follow']);
  }
  
  public onClickSeeRecipes(){
    this.recipeFilterService.resetRecipeFilter();
    this.recipeFilterService.updateRecipeNature('Mes Recettes');
    this.router.navigate(['kitchen']);
  }
  
  /**
   * Handles click on disconnect
   */
  public onSignOut() {
    // Reset services
    this.profileService.reset();
    this.activityService.reset();
    this.recipeFilterService.reset();
    
    // Sign out
    this.authService.signOutUser();
  }
  
    /**
   * Create events on database corresponding to the recipe modification
   */
  public createProfilePictureModificationEvents(imageUrl: string){
    if(this.profileService.isLoaded){
      
      // Create recipe modification events for followers
      let event = new Event()
      event.init();
      event.code = 709;
      event.userRef = this.profileService.profile.user.userId;
      event.message = imageUrl;
      this.eventService.uploadEventsOnServer(event, this.profileService.profile.user.followers);
      
      // Create modification event for my own recipe
      let selfEvent = new Event()
      selfEvent.init();
      selfEvent.code = 710;
      selfEvent.message = imageUrl;
      this.eventService.uploadEventOnServer(selfEvent, this.profileService.profile.user.userId);
    }
  }
}
