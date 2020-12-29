import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recipe } from 'src/app/model/recipe.model';
import { TlMiniatureComponent } from '../../tl-common/components/tl-miniature/tl-miniature.component';
import { Router } from '@angular/router';
import { RecipeFilterService } from 'src/app/services/recipe-filter.service';

@Component({
  selector: 'recipe-miniature',
  host: { 
      '[class]' : 'this.size + " " + this.miniatureStyle + " clickable hor-space-between row-dir container-block"',
      '[class.margined]' : 'this.margined',
      '(click)' : 'this.onClickRecipe()'
    },
  templateUrl: './recipe-miniature.component.html',
  styleUrls: [
    './recipe-miniature.component.scss',
    '../../tl-common/components/tl-miniature/tl-miniature.component.scss']
})
export class RecipeMiniatureComponent extends TlMiniatureComponent implements OnInit {

  /**
   * Recipe input, mandatory
   */
  @Input() recipe: Recipe;
   
  /**
   * Tells if both recipe and tag are clickable, leading to the standrd behavior:
   * - Clicking on recipe drives you to the recipe
   * - Clicking on a tag drives you to the tag search on recipe dashboard
   */
  @Input() clickable: boolean = true;

  /**
   * Event to emit when a tag is clicked
   * Carried payload is the clicked tag string
   */
  @Output() clickTag: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(
    private router: Router,
    private recipeFilterService: RecipeFilterService
  ) {
    super();
  }

  ngOnInit(): void {
  }
  
  /**
   * Handles click on recipe 
   */
  public onClickRecipe(){
    if(this.clickable){
      // Redirect through recipe route
      this.router.navigate(['recipe', this.recipe.id]);
    }
  }
  
  /**
   * Handes click on tag
   */
  public onClickTag(tag: string){
    
    // Emit click on tag custom event
    this.clickTag.emit(tag);
    
    // If standard click behavior is activated, redirect to dashboard with the corresponding tag search
    if(this.clickable){
      this.recipeFilterService.resetRecipeFilter();
      this.recipeFilterService.updateTags([tag]);
      this.router.navigate(['kitchen']);
    }
  }

}
