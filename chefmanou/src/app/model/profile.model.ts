import { User } from './user.model';
import { Recipe } from './recipe.model';

/**
 * Defines a profile structure
 * A profile is a resolved user, which means a user 
 * with all referenced structures (recipes, followers...) 
 * directly resolved as Recipes or User objects
 */
export class Profile {
  
  /**
   * Profile user
   */
  public user: User = new User();
  
  /**
   * List of all resolved followers
   */
  public resolvedFollowers: User[] = [];
  
  /**
   * List of all resolved followings
   */
  public resolvedFollowings: User[] = [];
  
  /**
   * List of all resolved latest recipes
   */
  public resolvedLatestRecipes: Recipe[] = [];
  

  constructor() {
    // Nothing to do here
  }
  
  public isUndefined(): boolean {
    return this.user.isUndefined();
  }
}