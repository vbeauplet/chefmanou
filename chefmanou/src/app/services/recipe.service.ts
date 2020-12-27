import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe, recipeConverter } from '../model/recipe.model';

import * as firebase from 'firebase';
import { ProfileService } from './profile.service';
import { User } from '../model/user.model';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  /**
   * Contextual recipe stored by recipe service
   */
  public recipe: Recipe = new Recipe();
  
  /**
   * Recipe subject, notify and provide recipe when recipe is refreshed
   */
  public recipeSubject: Subject<Recipe> = new Subject<Recipe>();
  
  /**
   * Resolved admins of the recipe; shall be refreshed everytime recipe is refreshed
   */
  public resolvedAdmins: User[] = [];
  
  /**
   * Tells if a recipe is laoded by the recipe service
   */
  public isLoaded: boolean = false;
  
  /**
   * Tells if admins have been loaded at least once
   */
  public areAdminsLoaded: boolean = false;
  
  /**
   * Recipe realtime subscription
   */
  private unsubscribeRecipe: Function = function(){};
  
  /**
   * Tells ì admins are curently resolved so that concurrent admins resolution cannot interfere
   */
  private resolvingAdmins: boolean = false;

  constructor(
    private userService: UserService,
    private profileService: ProfileService) {
      
//    // Subscribe to any profile update to:
//    // - Update profile latest recipe list (in case connected user on this recipe changes) 
//    this.profileService.profileSubject.subscribe(
//      () => {
//        if(this.isLoaded) {
//          this.profileService.updateLatestRecipes(this.recipe.id);
//        }
//      }
//    );
  }
  
  
  
  /**
   * Creates a new random recipe ID
   */
  public createNewRecipeId(): string {
    return new Date().getTime() + '';
  }
  
  /**
   * Refreshes the recipe services providing a new recipe ID
   */
  public refresh(id: string) {

    // Reset service
    this.reset();

    // End previous recipe subscription
    this.unsubscribeRecipe();
    
    // Establish new connexion with current recipe
    let that = this;
    this.unsubscribeRecipe = firebase.firestore().collection("recipes").doc(id)
      .withConverter(recipeConverter)
      .onSnapshot(function(doc) {
          if (doc.exists) {
            /*
             * Websocket: at each reference node change, this code is played
             */
             
            // Refresh recipe
            that.recipe = doc.data();
            
            // Launch author resolution
            that.userService.getUserFromIdOnServer(doc.data().author).then((result) => {
                that.recipe.resolvedAuthor = result;
                that.recipe.isAuthorResolved = true;
              });
              
            // Refresh resolved admins
            if(!that.resolvingAdmins){
              that.resolvingAdmins = true;
              that.resolvedAdmins = [];
              for(let adminId of that.recipe.admins){
                that.userService.getUserFromIdOnServer(adminId).then((user: User) => {
                    that.resolvedAdmins.push(user);
                    if(that.areAdminsResolved()){
                      that.areAdminsLoaded = true;
                      that.resolvingAdmins = false;
                    }
                  });
              }
            }
            
            
            // Refresh latest recipes
            if(that.profileService.isLoaded){
//              that.profileService.updateLatestRecipes(id);
            }

            // Tell recipe is loaded
            that.isLoaded = true;
            that.emitRecipeSubject();
          }
          else {
            that.createNewRecipeOnServer(id);
          }
        });
  }
  
  /**
   * Creates a new user on database from UID and name
   * May be called after a new Authentication object has been created
   */
  public createNewRecipeOnServer(id: string){
    let recipe: Recipe = new Recipe();
    recipe.id = id;
    recipe.created = Date.now();
    recipe.modified = recipe.created;
    recipe.author = this.profileService.profile.user.userId;
    recipe.miniatureImageUrl = 'https://firebasestorage.googleapis.com/v0/b/chefmanou-1705a.appspot.com/o/images%2Favatar_plat_default.png?alt=media&token=4011e334-50c5-4a0b-966b-d5c5497a00eb';
    recipe.imageUrl = 'https://firebasestorage.googleapis.com/v0/b/chefmanou-1705a.appspot.com/o/images%2Favatar_plat_default.png?alt=media&token=4011e334-50c5-4a0b-966b-d5c5497a00eb';
    recipe.admins = [this.profileService.profile.user.userId];

    const newDoc = firebase.firestore().collection("recipes").doc(id);
    newDoc.withConverter(recipeConverter).set(recipe);
  }
  
  /**
   * Get latest recipes in database
   * Max number of provided recipes is given as parameter
   */
  public getRecipesOnServer(maxNumber: number): Promise<Recipe[]>{
    return new Promise((resolve) => {
      let result: Recipe[] = [];
      firebase.firestore().collection("recipes")
        .limit(maxNumber)
        .withConverter(recipeConverter).get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                result.push(doc.data())
              });
            resolve(result);
        })
        .catch(function(error) {
            console.log("Error getting recipes", error);
        });
      });
  }
  
  /**
   * Get Recipe on server from recipe ID
   */
  public getRecipeFromIdOnServer(recipeId: string): Promise<Recipe>{
    return new Promise((resolve, reject) => {
      const recipeRef = firebase.firestore().collection('recipes').doc(recipeId);
      recipeRef.withConverter(recipeConverter).get()
        .then(function(doc) {
          if (doc.exists){
            // Convert to Recipe object
            resolve(doc.data());
          }
        }).catch(function(error) {
            reject(error);
        });
    });
  }
  
  /**
   * Increments number of views for a particular recipe on server from its ID
   */
  public incrementViewsFromIdOnServer(recipeId: string) {
    const recipeRef = firebase.firestore().collection('recipes').doc(recipeId);
    recipeRef.withConverter(recipeConverter).update({
      views: firebase.firestore.FieldValue.increment(1)
    });
  }
  
  /**
   * Deletes a recipe on server. do not delete its subcollections
   */
  public deleteRecipeOnServer(recipeId: string){
    firebase.firestore().collection('recipes').doc(recipeId).delete();
  }
  
  /**
   * Tells if all admins of the recipe are resolved
   */
  public areAdminsResolved(){
    return this.recipe.admins.length !== 0 && this.recipe.admins.length === this.resolvedAdmins.length;
  }
  
  /**
   * Emit profile subject
   */
  public emitRecipeSubject() {
    this.recipeSubject.next(this.recipe);
  }
  
  /**
   * Resets the service
   */
  public reset(){
    this.recipe = new Recipe();
    this.resolvedAdmins = [];
    this.isLoaded = false;
    this.areAdminsLoaded = false;
  }
}
