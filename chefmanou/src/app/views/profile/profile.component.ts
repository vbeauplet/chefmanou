import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';
import { UserService } from 'src/app/services/user.service';
import { RecipeFilterService } from 'src/app/services/recipe-filter.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-profile',
  host: { 'class' : 'margined-top page'},
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
   * Build the Profile Component View
   */
  constructor(
            private recipeFilterService: RecipeFilterService,
            private authService: AuthService,
            public uploadService: UploadService,
            public userService: UserService,
            public profileService: ProfileService,
            public router: Router) { }

  ngOnInit(): void {
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
    this.recipeFilterService.reset();
    
    // Sign out
    this.authService.signOutUser();
  }
}
