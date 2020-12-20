import { Component, OnInit, ViewChild } from '@angular/core';
import { RecipeFilterService } from 'src/app/services/recipe-filter.service';
import { RecipeDashboardService } from 'src/app/services/recipe-dashboard.service';
import { ProfileService } from 'src/app/services/profile.service';
import { KitchenFilterComponent } from './kitchen-filter/kitchen-filter.component';
import { User } from 'src/app/model/user.model';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-kitchen',
  host: { 'class' : 'page'},
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {

  /**
   * Kitchen filter child component
   */
  @ViewChild('kitchenfilter') kitchenFilter: KitchenFilterComponent;

  constructor(
      public recipeFilterService: RecipeFilterService,
      public recipeDashboardService: RecipeDashboardService,
      public profileService: ProfileService,
      public activityService: ActivityService
    ) {}

  ngOnInit(): void {
  }
  
  /**
   * Selects a particular tag from the kitchen view
   */
  public selectTagFromKitchen(tag: string){
    this.recipeFilterService.updateTags([tag]);
    this.kitchenFilter.filtersAreUnwrapped = true;
  }
  
  /**
   * Handles selection of a particular user from the kitchen view
   */
  public selectAuthorFromKitchen(author: User){
    this.recipeFilterService.updateAuthors([author]);
    this.kitchenFilter.filtersAreUnwrapped = true;
  }
  
    /**
   * Show more results
   * Add 5 to the current number and launches a new search
   */
  public showMore(){
    this.recipeFilterService.updateRecipeNumber(this.recipeFilterService.recipeFilter.numberOfRecipes + 5);
  }

}
