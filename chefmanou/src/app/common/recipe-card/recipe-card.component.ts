import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { Recipe } from 'src/app/model/recipe.model';
import { User } from 'src/app/model/user.model';
import { ProfileService } from 'src/app/services/profile.service';

import { TlCardComponent } from '../../tl-common/components/tl-card/tl-card.component';

@Component({
  selector: 'recipe-card',
  host: { 
      '[class]' : 'this.size + " outlined margined container-block"'
    },
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent extends TlCardComponent implements OnInit {

  /**
   * Input user
   */
  @Input() recipe: Recipe = new Recipe();
  
  /**
   * Image shape, may be 'square' or 'rectangle'
   * 'Square' by default
   */
  @Input() imageShape: string = 'square';
  
  /**
   * Give the image attribute to find recipe image to display
   * 'miniatureImageUrl' by default
   * May be 'imageUrl' to display the full sized image
   */
  @Input() imageAttribute: string = 'miniatureImageUrl';
  
  /**
   * Initially display all tags instead of showing only first tag line (with possibility to expand)
   * false by default
   */
  @Input() displayAllTags: boolean = false;
  
  /**
   * Tells if favorite flage shall be displayed
   * true by default
   */
  @Input() displayFavoriteFlag: boolean = true;
  
  /**
   * Tells if recipe card active image shall provide the image overlay
   * False by default
   */
  @Input() hasOverlay: boolean = false;
  
  /**
   * Outputs an event when users clicks on a recipe tag from a recipe card
   * Payload is the clicked tag
   */
  @Output() clickTag: EventEmitter<string> = new EventEmitter<string>();
  
  /**
   * Outputs an event when users clicks on a recipe tag from a recipe card
   * Payload is the clicked tag
   */
  @Output() clickUser: EventEmitter<User> = new EventEmitter<User>();
  
  /**
   * Tells if the 'show more tags' button shall be visible or not
   */
  public displayShowMoreTagsButton: boolean = false;
  
  /**
   * Tells if tags are unwrapped
   */
  public areTagsUnwrapped: boolean = false;
  
  /**
   * Tells if the recipe is a profile favorite one
   */
  public isFavorite: boolean = false;
  
  
  // Ad photo url, miniture url, show-controls, editable-photo, clickable, clicked url

  constructor(
    public profileService: ProfileService
  ) {
    super();
  }

  ngOnInit(): void {
    
    // Set the favorite flag if need
    if(this.displayFavoriteFlag){
      if(this.profileService.isLoaded && this.profileService.profile.user.favoriteRecipes.includes(this.recipe.id)){
        this.isFavorite = true;
      }
    }
    
    // Check if all tags shall be displayed displayed
    if(this.displayAllTags){
      this.areTagsUnwrapped = true;
    }
    
    // If not, Check if the 'show more tags' buttons shall be displayed after compoennt init
    else{
      setTimeout(() => {
        this.checkShowMoreTagsButton();
      }, 20);
    }
  }
  
  /**
   * Handles click on a tag from therecipe card
   * Actually emit the corresponding event
   */
  public clickOnTag(tag: string) {
    this.clickTag.emit(tag);
  }
  
  /**
   * Handles click on a tag from therecipe card
   * Actually emit the corresponding event
   */
  public clickOnUser(user: User) {
    this.clickUser.emit(user);
  }
  
  /**
   * Checks if the 'show more tag'' button shall be displayed
   */
  private checkShowMoreTagsButton() {
    let tagsBlock = document.getElementById(this.recipe.id + '_tags');
    if(tagsBlock.clientHeight != tagsBlock.scrollHeight) {
      this.displayShowMoreTagsButton = true;
    }
  }
}
