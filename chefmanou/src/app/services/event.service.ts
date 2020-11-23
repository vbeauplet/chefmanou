import { Injectable } from '@angular/core';
import { RecipeService } from './recipe.service';
import { UserService } from './user.service';

import * as firebase from 'firebase';

import { Event, eventConverter } from "../model/event.model";
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
  
  /**
   * Uploads a particular event within a particular user activity
   * Will appear as an event into the provided user timeline
   */
  public uploadEventOnServer(event: Event, forUser: string){
    const eventCollectionRef = this.computeEventCollectionRef(forUser);
    console.log('Collection ref is');
    console.log(eventCollectionRef);
    const newEventDoc = firebase.firestore().collection(eventCollectionRef).doc(event.id);
    newEventDoc.withConverter(eventConverter).set(event);
  }
  
  /**
   * Uploads a particular event within for multiple users
   * Will appear as an event into the provided users timeline
   */
  public uploadEventsOnServer(event: Event, forUsers: string[]){
    console.log('Upload for users...')
    console.log(forUsers);
    for(let i = 0; i < forUsers.length; i++){
      this.uploadEventOnServer(event, forUsers[i]);
    }
  }
  
  /**
   * Compute firestore reference of the event collection for a particular user
   */
  public computeEventCollectionRef(userId: string): string{
    return 'users/' + userId + '/events';
  }
  
  
}
