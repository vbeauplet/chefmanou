import { Component, OnInit, ViewChild } from '@angular/core';
import { RecipeFilterService } from 'src/app/services/recipe-filter.service';
import { ProfileService } from 'src/app/services/profile.service';
import { CardComponent } from 'src/app/common/card/card.component';

@Component({
  selector: 'kitchen-filter',
  templateUrl: './kitchen-filter.component.html',
  styleUrls: ['./kitchen-filter.component.scss']
})
export class KitchenFilterComponent  extends CardComponent implements OnInit {
  
  /**
   * Tells if filter card is unwrapped
   */
  public filtersAreUnwrapped: boolean = false;

  constructor(
      public recipeFilterService: RecipeFilterService,
      public profileService: ProfileService) {
        super();
      }

  ngOnInit(): void {
  }

}
