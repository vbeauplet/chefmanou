import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { TlMiniatureComponent } from '../../tl-common/components/tl-miniature/tl-miniature.component';
import { Router } from '@angular/router';
import { RecipeFilterService } from 'src/app/services/recipe-filter.service';

@Component({
  selector: 'user-miniature',
  host: { 
      '[class]' : 'this.size + " " + this.miniatureStyle + " clickable hor-space-between row-dir container-block"',
      '[class.margined]' : 'this.margined',
      '(click)' : 'this.onClickUser()'
    },
  templateUrl: './user-miniature.component.html',
  styleUrls: [
    './user-miniature.component.scss',
    '../../tl-common/components/tl-miniature/tl-miniature.component.scss']
})
export class UserMiniatureComponent extends TlMiniatureComponent implements OnInit {

  /**
   * User input, mandatory
   */
  @Input() user: User;

  /**
   * Tells if user is clickable, leading to the standrd behavior:
   * - Clicking on user drives you to all the recipes correspondin to this author
   */
  @Input() clickable: boolean = true;

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
  public onClickUser(){
    // If standard click behavior is activated, redirect to dashboard with the corresponding user search
    if(this.clickable){
      this.recipeFilterService.resetRecipeFilter();
      this.recipeFilterService.updateAuthors([this.user]);
      this.router.navigate(['kitchen']);
    }
  }
  
}
