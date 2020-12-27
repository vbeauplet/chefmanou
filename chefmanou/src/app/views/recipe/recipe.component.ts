import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Event } from "../../model/event.model";
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'recipe-view',
  host: { 'class' : 'page'},
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

  /**
   * Edit recipe button status
   */
  public editRecipeButtonStatus = -1;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private eventService: EventService,
              public recipeService: RecipeService,
              public profileService: ProfileService) {}

  /**
   * On init, update recipe service with recipe to view
   */
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (!this.recipeService.isLoaded || this.recipeService.recipe.id !== id) {
      this.recipeService.refresh(id);
      
      // Increment number of views for the recipe
      this.recipeService.incrementViewsFromIdOnServer(id);
    }
  }

  /**
   * Handles click on back button
   */
  public onClickBack() {
    this.router.navigate(['/kitchen']);
  }
  
  /**
   * Handles click on edit button
   */
  public onClickEdit() {
    this.editRecipeButtonStatus = 0;
    setTimeout(()=>{
      this.router.navigate(['/recipe/edit/' + this.recipeService.recipe.id]);
    }, 10);
  }
  
    
  /**
   * Handles click on favorite button
   */
  public onClickFavorite(favoriteFlag: boolean) {
    if(favoriteFlag){
      this.profileService.addFavoriteRecipe(this.recipeService.recipe);
      
      // Create corresponding event
      this.createFavoriteRecipeEvents();
    }
    else{
      this.profileService.removeFavoriteRecipe(this.recipeService.recipe);
    }
  }
  
  /**
   * Create events on database corresponding to the selection of a favorite recipe
   */
  public createFavoriteRecipeEvents(){
    if(this.profileService.isLoaded && this.recipeService.isLoaded){
      
      // Create recipe favorite addition event for the recipe author, if this author is not you
      let event = new Event()
      event.init();
      event.code = 704;
      event.userRef = this.profileService.profile.user.userId;
      event.recipeRef = this.recipeService.recipe.id;
      this.eventService.uploadEventOnServer(event, this.recipeService.recipe.author);
    }
  }

}
