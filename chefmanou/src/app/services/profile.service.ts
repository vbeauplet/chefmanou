import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { Profile } from '../model/profile.model';
import { AuthService, AuthInfos } from '../auth/services/auth.service';
import { UserService, userConverter } from './user.service';

import * as firebase from 'firebase';
import { User } from '../model/user.model';
import { Recipe, recipeConverter } from '../model/recipe.model';
import { TlThemeService } from '../tl-common/services/tl-theme.service';
import { TlAlertService } from '../tl-common/services/tl-alert.service';

/**
 * Gathers all services and observables related to the profile of currently logged user.
 * When acting on currently logged user, use ProfileServices API
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  /**
   * Represents the profile of the currently logged user
   */
  public profile: Profile = new Profile();
  
  /**
   * Profile subject, notify and provide user when user is refreshed
   */
  public profileSubject: Subject<Profile> = new Subject<Profile>();
  
  /**
   * Tells if a profile is loaded within the contextual service
   */
  public isLoaded: boolean = false;

  /**
   * Tells if latest recipes are laoded and up to date with connected user
   */
  public areLatestRecipesLoaded: boolean = false;
  
    /**
   * Tells if favorite recipes are loaded and up to date with connected user
   */
  public areFavoriteRecipesLoaded: boolean = false;

  /**
   * Builds the ProfileService, subscribing to the needed observable
   */
  constructor(
    private alertService: TlAlertService,
    private themeService: TlThemeService,
    private authService: AuthService, 
    private userService: UserService) { 
    
    // Subscribe to any connexion update to refresh profile 
    // and open corresponding websockets to follow its evolution)
    this.authService.authInfosSubject.subscribe(
      (authInfos: AuthInfos) => {
        if(authInfos.isAuth) {
          this.refreshProfile(authInfos.userId)
        }
      }
    );
    
    /**
     * If a user is already connected at profile service construction, immediatly refresh
     */
    if(this.authService.authInfos.isAuth){
      this.refreshProfile(this.authService.authInfos.userId)
    }
  }
  
  /**
   * Refreshes profile stored by Profile Service singleton. Once profile is refreshed, 
   * a websocket is also opened to follow any changes that may occur for user on server
   */
  public refreshProfile(userId: string){
    
    // Establish new connexion with current user
    let that = this;
    firebase.firestore().collection("users").doc(userId)
      .withConverter(userConverter)
      .onSnapshot(function(doc) {
          /*
           * Websocket: at each reference node change, this code is played
           */
          let user: User = doc.data();

          // If user still meets the one loaded in profile service, squash the new user snapshot
          if(that.isLoaded && userId == that.profile.user.userId){
            that.squashProfile(user);
          }
          
          // Else load profile from user from scratch
          else{
            that.loadProfile(user);
          }
          
          // Emit profile subject
          that.emitProfileSubject();
        }); 
  }
  
  /**
   * Loads profile service from scratch given the corresponding root user from server
   */
  public loadProfile(user: User){
  
    // Retrieve root user corresponding to connected auth from server
    this.profile.user = user;
    
    // Apply theme (only if changed)
    this.themeService.changeTheme(this.profile.user.theme);
    
    // Aditionally resolve followers and following Users
    this.userService.getFollowersOnServer(this.profile.user).then(
        (result: User[]) => {
          this.profile.resolvedFollowers = result;
        }
      );
    this.userService.getFollowingsOnServer(this.profile.user).then(
        (result: User[]) => {
          this.profile.resolvedFollowings = result;
        }
      );
    
    // And resolve favorite recipes
    this.resolveFavoriteRecipes();
      
    // Tell profile is loaded
    this.isLoaded = true;
  }
  
  /**
   * Sqaushes a profile from an existing one (loaded profile of the profile service) and a user to squash in
   */
  public squashProfile(user: User){
    
    // Apply theme (only if changed)
    this.themeService.changeTheme(user.theme);
    
    // Resolve followers only if needed (list to reload has changed)
    if(!this.arrayEquals(this.profile.user.followers, user.followers)){
      this.profile.user.followers = user.followers;
      this.userService.getFollowersOnServer(this.profile.user).then(
        (result: User[]) => {
          this.profile.resolvedFollowers = result;
        }
      );
    }
    
    // Resolve followings only if needed (list to reload has changed)
    if(!this.arrayEquals(this.profile.user.followings, user.followings)){
      this.profile.user.followings = user.followings;
      this.userService.getFollowingsOnServer(this.profile.user).then(
        (result: User[]) => {
          this.profile.resolvedFollowings = result;
        }
      );
    }
    
    // Resolve favorite recipes only if needed (list to reload has changed)
    if(!this.arrayEquals(this.profile.user.favoriteRecipes, user.favoriteRecipes)){
      this.profile.user.favoriteRecipes = user.favoriteRecipes;
      this.resolveFavoriteRecipes();
    }
    
    // Squash basic properties
    this.profile.user = user;
  }
  
    
  /**
   * Resolve latest recipes (via Recipe objects) from recipe IDs
   */
  public resolveLatestRecipes() {
    // Reset resolved latest recipes
    this.profile.resolvedLatestRecipes = []; 
    this.areLatestRecipesLoaded = false;
    let tempRecipes = {};
    let numberOfLoadedRecipes = 0;
           
    // In case there is no members to resolve, tell that members are loaded
    if(this.profile.user.latestRecipes.length === 0){
      this.areLatestRecipesLoaded = true;
    }
    
    // Resolve each member of the newly refreshed child area
    this.profile.user.latestRecipes.forEach(element=>{
      this.getRecipeFromIdOnServer(element).then(
          (result : Recipe) => {
            // Add to temp recipes structure
            tempRecipes[element] = result;
            numberOfLoadedRecipes++;
            
            // Identify when all recipes are resolved
            if(this.profile.user.latestRecipes.length === numberOfLoadedRecipes){
              
              // Push all resolved elements in the right order
              for (var recipeId of this.profile.user.latestRecipes) {
                this.profile.resolvedLatestRecipes.push(tempRecipes[recipeId]);
              }
              
              // Notify it is resolve              
              this.areLatestRecipesLoaded = true;
            }
          });
        });
  }
  
  /**
   */
  public resolveFavoriteRecipes() {
    // Reset resolved latest recipes
    this.profile.resolvedFavoriteRecipes = []; 
    this.areFavoriteRecipesLoaded = false;
    let tempRecipes = {};
    let numberOfLoadedRecipes = 0;
           
    // In case there is no members to resolve, tell that members are loaded
    if(this.profile.user.favoriteRecipes.length === 0){
      this.areFavoriteRecipesLoaded = true;
    }
    
    // Resolve each member of the favorite recipes list
    this.profile.user.favoriteRecipes.forEach(element=>{
      this.getRecipeFromIdOnServer(element).then(
          (result : Recipe) => {
            // Launch author resolution
            this.userService.getUserFromIdOnServer(result.author).then((author: User) => {
                result.resolvedAuthor = author;
                result.isAuthorResolved = true;
              });
            
            // Add to temp recipes structure
            tempRecipes[element] = result;
            numberOfLoadedRecipes++;
            
            // Identify when all recipes are resolved
            if(this.profile.user.favoriteRecipes.length === numberOfLoadedRecipes){
              
              // Push all resolved elements in the right order
              for (var recipeId of this.profile.user.favoriteRecipes) {
                this.profile.resolvedFavoriteRecipes.push(tempRecipes[recipeId]);
              }
              
              // Notify it is resolve              
              this.areLatestRecipesLoaded = true;
            }
          });
        });
  }
  
  /**
   * Put in profile kitchen a particular user
   * It means adding the user as a following,and adding current profile as follower of the user
   */
  public follow(userToFollow: User){
    // Add selected user to followings
    this.userService.addFollowingOnServer(this.profile.user, userToFollow);
    this.userService.addFollowerOnServer(userToFollow, this.profile.user);
  }
  
  
  /**
   * Removes from profile kitchen a particular user
   */
  public unfollow(userToFollow: User){
    this.alertService.raiseConfirmationAlert('Voulez-vous vraiment enlever ' + userToFollow.name + ' de vos cuisiniers ?', 2)
      .then((response:string) => {
          if(response == 'accept'){
            
            // Remove user from folowings ones
            this.userService.removeFollowingOnServer(this.profile.user, userToFollow);
            this.userService.removeFollowerOnServer(userToFollow, this.profile.user);
          }
        });
  }
  
  /**
   * Adds a favorite recipe to the currently connected profile
   */
  public addFavoriteRecipe(recipe: Recipe){
    if(this.isLoaded){
      this.userService.addFavoriteRecipeOnServer(this.profile.user.userId, recipe);
    }
  } 
  
  /**
   * Removes a favorite recipe to the currently connected profile
   */
  public removeFavoriteRecipe(recipe: Recipe){
    if(this.isLoaded){
      this.userService.removeFavoriteRecipeOnServer(this.profile.user.userId, recipe);
    }
  }
  
  /**
   * Update latest recipes list considering a new recipe ID has been handled
   */
  public updateLatestRecipes(recipeId: string){
    let latestRecipes = this.profile.user.latestRecipes;
    
    // Check latest recipe is not the same before do anything
    if(latestRecipes.length > 0){
      if(latestRecipes[0] === recipeId){
        // If this is, do nothing
        return;
      }
    }
    
    // Init new list
    let newLatestRecipes: string[] = [recipeId];
    
    // Add the 2 latest recipes at the end of the new list
    for(let recipe of latestRecipes){
      newLatestRecipes.push(recipe);
      if(newLatestRecipes.length >= 3){
        break;
      }
    }
    
    // Update Latest Recipes list on server
    this.userService.updateLatestRecipesOnServer(this.profile.user, newLatestRecipes);
  }
  
  
  /**
   * Emit profile subject
   */
  public emitProfileSubject() {
    this.profileSubject.next(this.profile);
  }
  
  
    /**
   * Get Recipe on server from recipe ID
   */
  private getRecipeFromIdOnServer(recipeId: string): Promise<Recipe>{
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
   * Resets  profile service
   */
  public reset(){
    this.profile = new Profile();
    this.isLoaded = false;
    this.areLatestRecipesLoaded = false;
  }
  
  /**
   * Tells if 2 arrays have the same content
   */
  private arrayEquals(_arr1, _arr2) {
    if (
      !Array.isArray(_arr1)
      || !Array.isArray(_arr2)
      || _arr1.length !== _arr2.length
      ) {
        return false;
      }
    
    const arr1 = _arr1.concat().sort();
    const arr2 = _arr2.concat().sort();
    
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
         }
    }
    
    return true;
}
 
}
