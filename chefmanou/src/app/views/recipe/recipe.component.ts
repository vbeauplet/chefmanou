import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'recipe-view',
  host: { 'class' : 'margined-top page'},
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

}
