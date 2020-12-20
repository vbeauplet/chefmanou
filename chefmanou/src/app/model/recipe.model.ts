import { User } from './user.model';

/**
 * Defines a recipe structure
 */
export class Recipe {
  /**
   * Unique ID of the recipe
   */
  public id: string = '';
  
  /**
   * Name of the recipe
   */
  public name: string = '';
  
  /**
   * Search terms associated to recipe name
   * Eases querying recipes by name search
   */
  public nameSearchTerms: string[] = [];
  
  /**
   * Author reference id of the author of the recipe
   */
  public author: string = '';
  
  /**
   * Creation date
   */
  public created: number = 0;
  
  /**
   * Last modification date
   */
  public modified: number = 0;
  
  /**
   * Tells if the recipe is a draft or is published
   */
  public draft: boolean = true;
  
  /**
   * Image URL
   */
  public imageUrl: string = '';
  
  /**
   * Image miniature URL
   */
  public miniatureImageUrl: string = '';
  
  /**
   * Number of views
   */
  public views: number = 0;
  
  /**
   * Content of the recipe
   */
  public content: string = '';
  
  /**
   * Recipe visibility
   */
  public visibility: string = 'privée';
  
  /**
   * Recipe administrators (user reference from ID)
   */
  public admins: string [] = [];
  
  /**
   * Recipe tags
   */
  public tags: string [] = [];
  
  /**
   * Number of portions
   * Numebr of people the recipe can feed
   */
  public portionNumber: string = '';
  
  /**
   * Time needed to make the recipe
   */
  public time: string = '';

  /**
   * User selected color to represent the recipe
   */
  public color: string = '';

  // Additional attributes, will not appear in database

  /**
   * Tells if author(as a user object) is resolved
   */
  public isAuthorResolved: boolean = false;

  /**
   * Resolved author of the recipe
   */
  public resolvedAuthor: User = new User();
  
  
  constructor() {
  }
}


export const recipeConverter = {
    toFirestore: function(recipe: any) {
        return {
            id: recipe.id,
            name: recipe.name,
            nameSearchTerms: recipe.nameSearchTerms,
            author: recipe.author,
            created: recipe.created,
            modified: recipe.created,
            draft: recipe.draft,
            imageUrl: recipe.imageUrl,
            miniatureImageUrl: recipe.miniatureImageUrl,
            views: recipe.views,
            content: recipe.content,
            visibility: recipe.visibility,
            admins: recipe.admins,
            tags: recipe.tags,
            portionNumber: recipe.portionNumber,
            time: recipe.time,
            color: recipe.color
          }
    },
    fromFirestore: function(snapshot: any, options: any){
        const data = snapshot.data(options);
        
        // Create corresponding object
        let recipe = new Recipe();
        
        // Recipe attributes
        recipe.id = data.id;
        recipe.name = data.name;
        recipe.nameSearchTerms = data.nameSearchTerms;
        recipe.author = data.author; 
        recipe.created = data.created,
        recipe.modified = data.modified,
        recipe.draft = data.draft;
        recipe.imageUrl = data.imageUrl;
        recipe.miniatureImageUrl = data.miniatureImageUrl;
        recipe.views = data.views;
        recipe.content = data.content;
        recipe.visibility = data.visibility;
        recipe.admins = data.admins;
        recipe.tags = data.tags;
        if(data.portionNumber != undefined){
          recipe.portionNumber = data.portionNumber;
        }
        if(data.time != undefined){
          recipe.time = data.time;
        }
        if(data.color != undefined){
          recipe.color = data.color;
        }
        
        return recipe;
    }
}