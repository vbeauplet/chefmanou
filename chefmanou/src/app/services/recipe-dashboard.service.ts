import { Injectable } from '@angular/core';
import { Recipe, recipeConverter } from '../model/recipe.model';
import { Profile } from '../model/profile.model';
import { ProfileService } from './profile.service';
import * as firebase from 'firebase';
import { RecipeFilter, RecipeFilterService } from './recipe-filter.service';
import { UserService } from './user.service';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeDashboardService {

  /**
   * Bindable list of recipes
   */
  public recipes: Recipe[] = [];

  /**
   * Current Recipe Filter to apply, binded at each emission of the recipe filter objservable
   */
  private recipeFilter: RecipeFilter = null;
  
  /**
   * Current connected profile
   */
  private profile: Profile = new Profile();
  
  /**
   * Tells if recipes are loaded (and are therefore ready to be displayed)
   */
  public areRecipesLoaded = false;
  
  /**
   * Message to display to user
   */
  public messageCode: number = 0;
  
  constructor(
    public profileService: ProfileService,
    private userService: UserService,
    private recipeFilterService: RecipeFilterService) {
      
    // Subscribe to any new emission of the profile observable
    this.profileService.profileSubject.subscribe(
      () => {
        this.recipeFilterService.reset();
        this.refresh();
      }
    );
    
    // Subscribe to any new emission of the recipe filter observable
    this.recipeFilterService.recipeFilterSubject.subscribe(
      () => {
        this.refresh();
      }
    );
    
    // If profile service is already loaded, try to load
    if(this.profileService.isLoaded){
      this.refresh();
    }
  }
  
  /**
   * Refreshes the service
   */
  public refresh(){
    // Set current profile
    this.profile = this.profileService.profile
    
    // Set current recipe filter
    this.recipeFilter = this.recipeFilterService.recipeFilter;
    
    // Refresh recipes
    this.filterRecipes();
  }
  
  /**
   * Filter recipes from current filter
   */
  public filterRecipes(){
    
       // Do nothing if profile or recipe filter is not loaded yet
    if(this.profile.isUndefined() || this.recipeFilter == null){
      return;
    }
    
    // Set recipes are not loaded yet
    this.areRecipesLoaded = false;
    
    // Reset message
    this.messageCode = 0;
    
    // Redirect to correct filtering method    
    if(this.recipeFilter.favorite){
      this.filterRecipesLocally(this.profileService.profile.resolvedFavoriteRecipes)
    }
    else{
      this.filterRecipesFromServer();
    }
  }
  
  /**
   * Filters a bunch of recipe locally (from current recipe filter) and display results
   */
  public filterRecipesLocally(recipes: Recipe[]){
    let result: Recipe[] = [];
    
    for(let recipe of recipes){
      
      // Filter by free search
      let freeSearch: string = this.recipeFilterService.recipeFilter.freeSearch.toLowerCase();
      if(freeSearch != '' && !recipe.nameSearchTerms.includes(freeSearch)){
        continue;
      }
      
      // Filter by nature
      if(this.recipeFilterService.recipeFilter.myRecipes && recipe.author != this.profileService.profile.user.userId){
        continue;
      }
      
      // Filter by tag
      if(this.recipeFilterService.recipeFilter.tags.length != 0){
        let tag: string = this.recipeFilterService.recipeFilter.tags[0];
        if(!recipe.tags.includes(tag)){
          continue;
        }
      }
      
      // Filter by author
      if(this.recipeFilterService.recipeFilter.authors.length != 0){
        let author: User = this.recipeFilterService.recipeFilter.authors[0];
        if(author.userId != recipe.author){
          continue;
        }
      }
      
      // If recipe has passed all filters, add it to result
      result.push(recipe);
    }
    
    // Sort result ann set recipes
    result.sort((recipe1: Recipe ,recipe2: Recipe) => recipe2.created - recipe1.created);
    this.recipes = result;
    this.areRecipesLoaded = true;
  }
  
  /**
   * Load recipes from server and taking into account current filters
   */
  public filterRecipesFromServer(){
    
    // Create tempRecipes table
    let that = this;
    
    // Query database considering filter
    
    // Recipes from 1 author + tag filter    
    if((this.recipeFilter.myRecipes || this.recipeFilter.authors.length >= 1) && this.recipeFilter.tags.length >= 1 && this.recipeFilter.freeSearch.length < 2){
      let author = (this.recipeFilter.myRecipes)?this.profileService.profile.user.userId:this.recipeFilter.authors[0].userId;
      firebase.firestore().collection("recipes")
      .orderBy('created', 'desc')
      .limit(this.recipeFilter.numberOfRecipes)
      .where('draft', '==', false)
      .where('author', '==', author)
      .where('tags', 'array-contains', this.recipeFilter.tags[0])
      .withConverter(recipeConverter)
      .get()
      .then(function(querySnapshot) { 
          that.handleRecipeDashboardQuerySnapshot(querySnapshot)
      });
    }
    else if((this.recipeFilter.myRecipes || this.recipeFilter.authors.length >= 1) && this.recipeFilter.tags.length >= 1 && this.recipeFilter.freeSearch.length >= 2){
      this.recipes = [];
      this.messageCode = 401;
      this.areRecipesLoaded = true;
    }
    
    // Recipes from 1 author + no tag
    else if((this.recipeFilter.myRecipes || this.recipeFilter.authors.length >= 1) && this.recipeFilter.tags.length == 0 && this.recipeFilter.freeSearch.length < 2){
      let author = (this.recipeFilter.myRecipes)?this.profileService.profile.user.userId:this.recipeFilter.authors[0].userId;
      firebase.firestore().collection("recipes")
      .orderBy('created', 'desc')
      .limit(this.recipeFilter.numberOfRecipes)
      .where('draft', '==', false)
      .where('author', '==', author)
      .withConverter(recipeConverter)
      .get()
      .then(function(querySnapshot) { 
          that.handleRecipeDashboardQuerySnapshot(querySnapshot)
      });
    }
    else if((this.recipeFilter.myRecipes || this.recipeFilter.authors.length >= 1) && this.recipeFilter.tags.length == 0 && this.recipeFilter.freeSearch.length >= 2){
      let author = (this.recipeFilter.myRecipes)?this.profileService.profile.user.userId:this.recipeFilter.authors[0].userId;
      firebase.firestore().collection("recipes")
      .orderBy('created', 'desc')
      .limit(this.recipeFilter.numberOfRecipes)
      .where('draft', '==', false)
      .where('author', '==', author)
      .where('nameSearchTerms', 'array-contains', this.recipeFilter.freeSearch.toLowerCase())
      .withConverter(recipeConverter)
      .get()
      .then(function(querySnapshot) { 
          that.handleRecipeDashboardQuerySnapshot(querySnapshot)
      });
    }
    
    // Recipes from all authors + tag filter
    else if(!(this.recipeFilter.myRecipes || this.recipeFilter.authors.length >= 1) && this.recipeFilter.tags.length >= 1 && this.recipeFilter.freeSearch.length < 2){     
      firebase.firestore().collection("recipes")
      .orderBy("created", "desc")
      .limit(this.recipeFilter.numberOfRecipes)
      .where('draft', '==', false)
      .where('author', 'in', this.profileService.profile.user.followings)
      .where('tags', 'array-contains', this.recipeFilter.tags[0])
      .withConverter(recipeConverter)
      .get()
      .then(function(querySnapshot) { 
          that.handleRecipeDashboardQuerySnapshot(querySnapshot)
      });
    }
    else if(!(this.recipeFilter.myRecipes || this.recipeFilter.authors.length >= 1) && this.recipeFilter.tags.length >= 1 && this.recipeFilter.freeSearch.length >=2){     
      this.recipes = [];
      this.messageCode = 401;
      this.areRecipesLoaded = true;
    }
    
    // Recipes from all authors + no tag filter
    else if(!(this.recipeFilter.myRecipes || this.recipeFilter.authors.length >= 1) && this.recipeFilter.tags.length == 0 && this.recipeFilter.freeSearch.length < 2){     
      firebase.firestore().collection("recipes")
      .orderBy("created", "desc")
      .limit(this.recipeFilter.numberOfRecipes)
      .where('draft', '==', false)
      .where('author', 'in', this.profileService.profile.user.followings)
      .withConverter(recipeConverter)
      .get()
      .then(function(querySnapshot) { 
          that.handleRecipeDashboardQuerySnapshot(querySnapshot)
      })
    }
    else if(!(this.recipeFilter.myRecipes || this.recipeFilter.authors.length >= 1) && this.recipeFilter.tags.length == 0 && this.recipeFilter.freeSearch.length >= 2){     
      firebase.firestore().collection("recipes")
      .orderBy("created", "desc")
      .limit(this.recipeFilter.numberOfRecipes)
      .where('draft', '==', false)
      .where('author', 'in', this.profileService.profile.user.followings)
      .where('nameSearchTerms', 'array-contains', this.recipeFilter.freeSearch.toLowerCase())
      .withConverter(recipeConverter)
      .get()
      .then(function(querySnapshot) { 
          that.handleRecipeDashboardQuerySnapshot(querySnapshot)
      })
    }    
  }
  
  /**
   * Handle query snapshot when querying recipes in the dashboard context
   */
  public handleRecipeDashboardQuerySnapshot(querySnapshot: any){
    let counter: number = 0;
    let tempRecipes = [];
    let that = this;
             
    // If no result found
    if(querySnapshot.size == 0){
      that.recipes = tempRecipes;
      that.messageCode = 400;
      that.areRecipesLoaded = true;
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
          that.recipes = tempRecipes;
          that.areRecipesLoaded = true;
        }
      });
      
    }
  
  /**
   * Resets the service
   */
  public reset() {
    this.recipes = [];
    this.recipeFilter = null;
    this.profile = null;
    this.areRecipesLoaded = false;
  }
}
