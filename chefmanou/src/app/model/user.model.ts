import { TlUser } from '../tl-common/model/tl-user.model';

/**
 * Defines a user structure
 * 
 * Extends basic tl-common user object
 */
export class User extends TlUser {
  
  /**
   * Name, as 'search term' to ease firestore search request on name
   */
  public nameSearchTerm: string = '';
  
  /**
   * Pseudo, as 'search term' to ease firestore search request on pseudo
   */
  public pseudoSearchTerm: string = '';
  
  /**
   * Name of the user
   */
  public email: string = '';
  
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
    super();
  }
}