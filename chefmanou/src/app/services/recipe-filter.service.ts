import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../model/user.model';

export interface RecipeFilter {
  freeSearch: string;
  myRecipes: boolean;
  tags: string[];
  authors: User[];
  numberOfRecipes: number;
  sortBy: string;
}

/**
 * Handles filters applied on recipe loaded and stored b the recipe dashboard service
 */
@Injectable({
  providedIn: 'root'
})
export class RecipeFilterService {

  /**
   * Current filter to apply for recipes provided by the Recipe Dashboard service
   */
  public recipeFilter: RecipeFilter;

  /**
   * Recipe Filter Subject, observable which aims to notify that the recipe filter has changed and to provide it
   */
  public recipeFilterSubject: Subject<RecipeFilter> = new Subject<RecipeFilter>();

  constructor() {
    this.resetRecipeFilter();
  }
  
  /**
   * Update filter free search term
   */
  public updateFreeSearch(freeSearch: string){    
    // Update recipe filter
    this.recipeFilter.freeSearch = freeSearch;
    
    // Emit subject
    this.emitRecipeFilterSubject();
  }
  
  /**
   * Update filter tags
   */
  public updateTags(tags: string[]){
    // Update recipe filter
    this.recipeFilter.tags = tags;
    
    // Emit subject
    this.emitRecipeFilterSubject();
  }
  
  /**
   * Update filter tags
   */
  public updateAuthors(authors: User[]){
    // Update recipe filter
    this.recipeFilter.authors = authors;
    
    // Emit subject
    this.emitRecipeFilterSubject();
  }
  
  /**
   * Update filter recipe nature
   */
  public updateRecipeNature(recipeNature: string){
    // Update recipe filter
    if(recipeNature === 'Mes Recettes'){
      this.recipeFilter.myRecipes = true;
    }
    else{
      this.recipeFilter.myRecipes = false;
    }
    
    // Emit subject
    this.emitRecipeFilterSubject();
  }
  
  
  /**
   * Update filter recipe number
   */
  public updateRecipeNumber(numberOfRecipes: number){
    // Update recipe filter
    this.recipeFilter.numberOfRecipes = numberOfRecipes;
    
    // Emit subject
    this.emitRecipeFilterSubject();
  }
  
  /**
   * Resets the recipe filter
   */
  public resetRecipeFilter(){    
    this.recipeFilter =  {
        freeSearch: '',
        myRecipes: false,
        tags: [],
        authors: [],
        numberOfRecipes: 10,
        sortBy: '',
      };
    
    // Emit recipe filter subject after reset
    this.emitRecipeFilterSubject();
  }
  
  /**
   * Emit the recipe filter subject
   */
  private emitRecipeFilterSubject(){    
    this.recipeFilterSubject.next(this.recipeFilter);
  }
  
  /**
   * Resets the service
   */
  public reset() {
    this.resetRecipeFilter();
  }
}
