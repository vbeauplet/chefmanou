import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { AuthService, AuthInfos } from '../../auth/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { Router } from '@angular/router';
import { Recipe } from 'src/app/model/recipe.model';
import { RecipeFilterService } from 'src/app/services/recipe-filter.service';


@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  /**
   * Menu wrapping status
   */
  @Input() wrapped = false;
  
  /**
   * Output events
   */
  @Output() closeMenu: EventEmitter<any> = new EventEmitter();
  
  /**
   * Tells if user is authenticated or not
   */
  public isAuth: boolean = false;


  constructor(
    public profileService: ProfileService,
    private recipeService: RecipeService,
    private authService: AuthService, 
    private router: Router,
    private recipeFilterService: RecipeFilterService) { }
  

  ngOnInit(): void {
    // Subscribe to any new auth info emmited by the AuthService
    this.authService.authInfosSubject.subscribe(
      (authInfos: AuthInfos) => {
          this.isAuth = authInfos.isAuth;
        }
    );
  }
  
  /**
   * Handles click on new recipe
   */
  public onNewRecipe() {
    let newRecipeId = this.recipeService.createNewRecipeId();
    this.router.navigate(['recipe', 'edit', newRecipeId]);
  }
  
  /**
   * Handles click on avatar
   */
  public onClickAvatar() {
    this.router.navigate(['profile']);
  }
  
  /**
   * Handles click on hoem button
   */
  public onClickHome() {
    this.router.navigate(['activity']);
  }
  
  
  /**
   * Handles click on recipe
   */
  public onClickRecipe(recipe: Recipe) {
    this.router.navigate(['recipe', recipe.id]);
  }
  
  /**
   * Handles click on recipe tag
   */
  public onClickTag(tag: string) {
    this.recipeFilterService.resetRecipeFilter();
    this.recipeFilterService.updateTags([tag]);
    this.router.navigate(['kitchen']);
  }
  
  /**
   * Handles click on disconnect
   */
  public onSignOut() {
    this.authService.signOutUser();
    this.router.navigate(['auth', 'signin']);
  }
  
  /**
   * Emit Close menu event
   */
  public emitCloseMenu(){
    this.closeMenu.emit();
  }
}
