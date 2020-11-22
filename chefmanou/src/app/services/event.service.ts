import { Injectable } from '@angular/core';
import { RecipeService } from './recipe.service';
import { UserService } from './user.service';

import { Event } from "../model/event.model";

import { User } from '../model/user.model';
import { Recipe } from '../model/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
      private userService: UserService,
      private recipeService: RecipeService
    ) { }
    
  /**
   * Handles an unresolved event to resolve its potential referenced user and recipe
   */
  public resolveEvent(event: Event) {
    // If a user is referenced, resolve it
    const userRef = event.userRef;
    if(userRef != ''){
      this.userService.getUserFromIdOnServer(userRef).then((user: User) => {
          event.takeResolvedUser(user);
        });
    }
    
    // If a recipe is referenced, resolve it
    const recipeRef = event.recipeRef;
    if(recipeRef != ''){
      this.recipeService.getRecipeFromIdOnServer(recipeRef).then((recipe: Recipe) => {
          event.takeResolvedRecipe(recipe);
        });
    }
  }
}
