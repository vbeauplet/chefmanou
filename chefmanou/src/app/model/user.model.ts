/**
 * Defines a user structure
 */
export class User {
  
  /**
   * Unique ID of the user
   */
  public userId: string = '';
  
  /**
   * Name of the user
   */
  public name: string = ''
  
  /**
   * Name, as 'search term' to ease firestore search request on name
   */
  public nameSearchTerm: string = '';
  
  /**
   * Unique pseudo to identify the côker
   */
  public pseudo: string = '';
  
  /**
   * Pseudo, as 'search term' to ease firestore search request on pseudo
   */
  public pseudoSearchTerm: string = '';
  
  /**
   * Name of the user
   */
  public email: string = '';
  
  /**
   * URL of the user's avatar
   */
  public avatarUrl: string = '';
 
  /**
   * URL of the user's photo
   */
  public photoUrl: string = '';
  
  /**
   * User followers
   */
  public followers: string[] = [];
  
  /**
   * List of cookers user is following
   */
  public followings: string[] = [];
  
  /**
   * Pinned Recipe
   */
  public pinnedRecipe: string = '';
  
  /**
   * List of latest recipes seen by user
   */
  public latestRecipes: string[] = [];
  
  /**
   * List of favorite recipes
   */
  public favoriteRecipes: string[] = [];
  
  /**
   * User theme
   */
  public theme: string = 'light';
  

  constructor() {
    // Nothing to do here
  }
  
  public isUndefined(): boolean {
    return this.userId === "";
  }
}