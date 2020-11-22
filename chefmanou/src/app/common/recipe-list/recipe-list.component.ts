import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recipe } from 'src/app/model/recipe.model';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'recipe-list',
  host: {'class' : 'full col-dir hor-center flex-block'},
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  /**
   * Tels if list of recipes provided as input (see 'recipes') is loaded yet. If not, a laoder is displayed
   */
  @Input() isLoading: boolean = false;
  
  /**
   * List of recipes to display
   */
  @Input() recipes: Recipe[] = [];
  
  /**
   * Tells if click on the recipe card shall redirect to recipe edition page instead of the recipe view
   */
  @Input() clickToEdit: boolean = false;
   
  /**
   * Outputs an event when users clicks on a recipe tag from a recipe card
   * Payload is the clicked tag
   */
  @Output() clickTag: EventEmitter<string> = new EventEmitter<string>();
  
  /**
   * Outputs an event when users clicks on a recipe author from a recipe card
   * Payload is the clicked author
   */
  @Output() clickUser: EventEmitter<User> = new EventEmitter<User>();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  
  /**
   * Handles click on recipe
   */
  public clickOnRecipe(recipe: Recipe){
    if(this.clickToEdit){
      this.router.navigate(['/recipe/edit/' + recipe.id]);
    }
    else{
      this.router.navigate(['/recipe/' + recipe.id]);
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
}
