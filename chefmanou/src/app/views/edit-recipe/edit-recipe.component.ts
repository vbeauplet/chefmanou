import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Router, ActivatedRoute } from '@angular/router';

import { UploadAdapter } from './upload-adapter';
 
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as firebase from 'firebase';
import { Recipe } from 'src/app/model/recipe.model';
import { RecipeDashboardService } from 'src/app/services/recipe-dashboard.service';
import { ProfileService } from 'src/app/services/profile.service';


@Component({
  selector: 'edit-recipe-view',
  host: { 'class' : 'margined-top page'},
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss']
})
export class EditRecipeComponent implements OnInit {

  /**
   * The rich text editor
   */
  public richTextEditor = ClassicEditor;

  /**
   * Bindable recipe content
   */
  public recipeContent: string = '';
  
  /**
   * Loading status of the recipe
   */
  public recipeContentLoadingStatus: number = -1;
  
  /**
   * Loading status of the recipe 'draft' flag
   */
  public recipeDraftFlagStatus: number = -1;
  
  /**
   * Recipe 'draft' flag button label
   */
  public recipeDraftFlagButtonLabel = '';
  
  /**
   * Tells if admin card shall be displayed.Not displayed at the beggining
   */
  public displayAdminCard = false;

  constructor(public recipeService: RecipeService,
              public recipeDashboardService: RecipeDashboardService,
              public profileService: ProfileService,
              private route: ActivatedRoute,
              private router: Router) { }

  /**
   * On init, update recipe service with recipe to edit
   */
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (!this.recipeService.isLoaded || this.recipeService.recipe.id !== id) {
      this.recipeService.refresh(id);
    }
    else {
      this.recipeContent = this.recipeService.recipe.content;
      this.recipeDraftFlagButtonLabel = (this.recipeService.recipe.draft)?'Publier la recette':'Mettre en brouillon';
    }
    
    // Subscribe to recipe subject to handle its content
    this.recipeService.recipeSubject.subscribe(
      (recipe: Recipe) => {        
        this.recipeContent = recipe.content;        
        if(this.recipeDraftFlagButtonLabel === '') {
          this.recipeDraftFlagButtonLabel = (this.recipeService.recipe.draft)?'Publier la recette':'Mettre en brouillon';
        }
      }
    );
    
  }
  
  public onReady(eventData: any){
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      return new UploadAdapter(loader);
    }
  }
  
  /**
   * Handles blurring of the recipe edit
   * Launch save action on server
   */
  public onBlurEditor(){    
    // Only upload in case recipe content is not null
    if (this.recipeContent !== '') {
      
      // Update value on SDB at provided node, if any
        let that = this;
        that.recipeContentLoadingStatus = 0;
        
        setTimeout(() => {
          
          let sdbPropertyUpdate = {};
          sdbPropertyUpdate['content'] = this.recipeContent;
          firebase.firestore().doc('recipes/' + this.recipeService.recipe.id).update(sdbPropertyUpdate)
            .then(function() {
                // Continue and set miniature URL
                that.recipeContentLoadingStatus = 1;
                
                // Release status after the 3 second validation time span
                setTimeout(() => {
                  
                  // Set status
                  that.recipeContentLoadingStatus = -1;
                  
                }, 3000);
              })
            .catch(function(error) {
                // If any, notify failure to user
                that.recipeContentLoadingStatus = 2;
                console.log(error);
              });

          }, 1000);
      }
  }
  
  /**
   * Handle click on the 'publish' or 'unpublish' button
   */
  public onClickPublish() {
    // Check no operation is pending
    if(this.recipeDraftFlagStatus === -1){
      let that = this;
      
      // Signal waiting
      that.recipeDraftFlagStatus = 0;
      
      // Update recipe 'draft' flag with the corresponding value (which is the opposite to current one...)
      let sdbPropertyUpdate = {};
      sdbPropertyUpdate['draft'] = !this.recipeService.recipe.draft;
      firebase.firestore().doc('recipes/' + this.recipeService.recipe.id).update(sdbPropertyUpdate)
        .then(function() {
            // Continue and set miniature URL
            that.recipeDraftFlagStatus = 1;
            
            // Refresh Recipe dashboard
            that.refreshRecipeDashboard();
            
            // Release status after the 3 second validation time span
            setTimeout(() => {
              that.recipeDraftFlagStatus = -1;
               
              // Recompute button label
              that.recipeDraftFlagButtonLabel = (that.recipeService.recipe.draft)?'Publier la recette':'Mettre en brouillon';
            
            }, 3000);
          })
        .catch(function(error) {
            // If any, notify failure to user
            that.recipeDraftFlagStatus = 2;
            console.log(error);
          });
    }
  }
  
  /**
   * Handles click on view button
   */
  public onClickView() {
    this.router.navigate(['/recipe', this.recipeService.recipe.id]);
  }
  
  /**
   * Handles click on initialize template
   */
  public onClickInitializeTemplate() {
    this.recipeContent='<h1>Ingrédients</h1><ul><li>Ingrédient 1</li><li>Ingrédient 2<li></ul><h1>Procédure</h1><p>Bon appétit !</p>' + this.recipeContent;
  }
  
  /**
   * Refreshes the recipe dahboard
   */
  public refreshRecipeDashboard(){
    console.log('REFRESH RECIPE DASHBOARD');
    this.recipeDashboardService.refresh();
  }
  
}

