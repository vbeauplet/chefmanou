import { Component, OnInit } from '@angular/core';
import { Recipe, recipeConverter } from 'src/app/model/recipe.model';
import { ProfileService } from 'src/app/services/profile.service';
import { Profile } from 'src/app/model/profile.model';
import * as firebase from 'firebase';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-draft',
  host: { 'class' : 'margined-top page'},
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})
export class DraftComponent implements OnInit {

  /**
   * Tells if draft recipes are loaded
   */
  public areDraftRecipesLoaded: boolean = false;

  /**
   * Bindable list of draft recipes
   */
  public draftRecipes: Recipe[] = [];
  
  /**
   * Profile of current connected user
   */
  public profile: Profile = new Profile();

  constructor(
      private userService: UserService, 
      public profileService: ProfileService
    ) { }

  ngOnInit(): void {
    // Subscribe to any new emission of the profile observable to refresh draft recipes
    this.profileService.profileSubject.subscribe(
      () => {
        this.refresh();
      }
    );
    
    // If profile is already loaded at component initialisation, refresh draft recipes
    if(this.profileService.isLoaded){
      this.refresh();
    }
  }
  
  /**
   * Refreshes draft recipes component
   */
  public refresh(){
    // Set current recipe filter
    this.profile = this.profileService.profile;
    
    // Refresh recipes
    this.loadDraftRecipes();
  }
  
  /**
   * Load recipes from server
   */
  public loadDraftRecipes(){
    
    // Do nothing if profile or recipe filter is not loaded yet
    if(this.profile.isUndefined()){
      return;
    }
    
    // Set draft recipes are not loaded yet
    this.areDraftRecipesLoaded = false;
    
    // Create tempRecipes table
    let that = this;
    
    // Query database
    firebase.firestore().collection("recipes")
      .orderBy('created', 'desc')
      .where('draft', '==', true)
      .where('author', '==', this.profile.user.userId)
      .withConverter(recipeConverter)
      .get()
      .then(function(querySnapshot) { 
        let counter: number = 0;
        let tempRecipes = [];
                 
        // If no result found
        if(querySnapshot.size == 0){
          that.draftRecipes = tempRecipes;
          that.areDraftRecipesLoaded = true;
        }
        
        // Find all query result
        querySnapshot.forEach(function(doc) {
            counter++;
            
            // Get data a Recipe
            const recipe: Recipe = doc.data();
            
            // Launch author resolution
            that.userService.getUserFromIdOnServer(recipe.author).then((result: User) => {
                recipe.resolvedAuthor = result;
                recipe.isAuthorResolved = true;
              });
            
            // Add to temp recipe list
            tempRecipes.push(recipe);
            
            // At the end of the query execution, set the bindable recipes list
            if(counter === querySnapshot.size){
              that.draftRecipes = tempRecipes;
              that.areDraftRecipesLoaded = true;
            }
          });
      });
  }
}
