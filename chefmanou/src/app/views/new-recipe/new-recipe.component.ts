import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/layout/services/alert.service';

@Component({
  selector: 'app-new-recipe',
  host: { 'class' : 'page'},
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.scss']
})
export class NewRecipeComponent implements OnInit {

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    // Create a new recipe ID
    let newRecipeId = this.recipeService.createNewRecipeId();
    
    // Raise an info
    this.alertService.raiseInfo('Nouvelle recette créée ! Vous pouvez l\'éditer de suite ou la retrouver dans vos brouillons')
    
    // Navigate toward edition page
    this.router.navigate(['recipe', 'edit', newRecipeId]);
  }

}
