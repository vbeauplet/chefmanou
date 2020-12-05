import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { Profile } from '../model/profile.model';
import { AuthService, AuthInfos } from '../auth/services/auth.service';
import { UserService, userConverter } from './user.service';

import * as firebase from 'firebase';
import { User } from '../model/user.model';
import { Recipe, recipeConverter } from '../model/recipe.model';
import { ThemeService } from '../layout/services/theme.service';
import { AlertService } from '../layout/services/alert.service';

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
   * Buildsthe ProfileService, subscribing to the needed observable
   */
  constructor(
    private alertService: AlertService,
    private themeService: ThemeService,
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
          that.profile.user = doc.data();
          
          // Apply theme (only if changed)
          that.themeService.changeTheme(that.profile.user.theme);
          
          // Aditionally resolve followers and following Users
          that.userService.getFollowersOnServer(that.profile.user).then(
              (result: User[]) => {
                that.profile.resolvedFollowers = result;
              }
            );
          that.userService.getFollowingsOnServer(that.profile.user).then(
              (result: User[]) => {
                that.profile.resolvedFollowings = result;
              }
            );
            
          // And resolve latest recipes
          that.refreshLatestRecipes();
            
          // Tell profile is loaded
          that.isLoaded = true;
          
          // Emit profile subject
          that.emitProfileSubject();
        });
  }
  
    
  /**
   * Resolve latest recipes (via Recipe objects) from recipe IDs
   */
  public refreshLatestRecipes() {
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
   * Put in profile kitchen a particular user
   * It means adding the user as a following,and adding current profile as follower of the user
   */
  public follow(userToFollow: User){
    // Add selected user to followings
    this.userService.addFollowingOnServer(this.profile.user, userToFollow)
      .then(() => {
          console.log('adding user'); 
        
          // Alert user cooker has been added
          this.alertService.raiseInfo(userToFollow.name + ' a été ajouté à vos cuisiniers')
        });
    this.userService.addFollowerOnServer(userToFollow, this.profile.user);
  }
  
  
  /**
   * Removes from profile kitchen a particular user
   */
  public unfollow(userToFollow: User){
    this.alertService.raiseConfirmationAlert('Voulez-vous vraiment enlever ' + userToFollow.name + ' de vos cuisiniers ?', 2)
      .then((response:string) => {
          if(response == 'accept'){
            
            // REmove user from folowings ones
            this.userService.removeFollowingOnServer(this.profile.user, userToFollow);
            this.userService.removeFollowerOnServer(userToFollow, this.profile.user);
          }
        });
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
    this.profileSubject = new Subject<Profile>();
    this.isLoaded = false;
    this.areLatestRecipesLoaded = false;
  }
  
 
}
