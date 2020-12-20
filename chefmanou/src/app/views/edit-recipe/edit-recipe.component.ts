import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Router, ActivatedRoute } from '@angular/router';

import { UploadAdapter } from './upload-adapter';
 
import { Event } from "../../model/event.model";

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as firebase from 'firebase';
import { Recipe } from 'src/app/model/recipe.model';
import { RecipeDashboardService } from 'src/app/services/recipe-dashboard.service';
import { ProfileService } from 'src/app/services/profile.service';
import { EventService } from 'src/app/services/event.service';
import { ColorItem } from 'src/app/common/color-picker/color-picker.component';
import { AlertService } from 'src/app/layout/services/alert.service';
import { User } from 'src/app/model/user.model';


@Component({
  selector: 'edit-recipe-view',
  host: { 'class' : 'page'},
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
   * Loading status of the 'delete recipe' buttonrecipe 'draft' flag
   */
  public recipeDeleteStatus: number = -1;
  
  /**
   * Color proposals for the recipe
   */
  public proposedColorItems: ColorItem[] = [
        {
          label:'Moutarde',
          payload:'mustard',
          colors:['#FEAA00']
        },
        {
          label:'Forêt',
          payload:'green',
          colors:['#013328']
        },
        {
          label:'Nemo',
          payload:'nemo',
          colors:['#F26659']
        }
      ];
  
  /**
   * Tells if admin card shall be displayed.Not displayed at the beggining
   */
  public displayAdminCard = false;
  
  /**
   * Tells if modifications  have occured since edition session began
   */
  private hasBeenModified: boolean = false;

  constructor(public recipeService: RecipeService,
              public recipeDashboardService: RecipeDashboardService,
              public profileService: ProfileService,
              private alertService: AlertService,
              private eventService: EventService,
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
  
  /**
   * Describes what shall happen at component destruction
   */
  ngOnDestroy() {
    // If their was modification during the edition session, and current recipe is not a draft, create associated events
    if(this.hasBeenModified && this.recipeService.isLoaded && !this.recipeService.recipe.draft){
      this.createRecipeModificationEvents();
    }
  }
  
  /**
   * Reacts to recipe modification
   */
  public onRecipeModification(){
    // If recipe is not a draft, refresh dashboard
    if(!this.recipeService.recipe.draft){
      this.refreshRecipeDashboard();
    }
    
    // Tell recipe was modified
    this.hasBeenModified = true;
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
                // Tell recipe has been modified
                that.hasBeenModified = true;
              
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
      
      // Record initial draft flag
      const wasDraft = this.recipeService.recipe.draft;
      
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
            
            // Create associated publication events
            if(wasDraft){
              that.createRecipePublicationEvents();
            }
            
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
   * Handles click on the delete button
   */
  public onClickDelete(){
    
    // Update button status
    this.recipeDeleteStatus = 0;
    
    // Ask user for confirmation
    this.alertService.raiseConfirmationAlert('Etes-vous vraiment sûr de vouloir supprimer la recette ?', 3)
      .then((response:string) => {
          if(response == 'accept'){
           
            // If confirmed by user, delete recipe
            this.recipeService.deleteRecipeOnServer(this.recipeService.recipe.id);
            
            // Reset recipe service and redirect to home page
            this.recipeService.reset();
            this.recipeDashboardService.refresh();
            this.router.navigate(['kitchen']);
          }
          
          else{
            this.recipeDeleteStatus = -1;
          }
        });
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
   * On select color
   */
  public onSelectColor(){
    this.alertService.raiseInfo('Attends la prochaine release !');
  }
  
  /**
   * Refreshes the recipe dahboard
   */
  public refreshRecipeDashboard(){
    this.recipeDashboardService.refresh();
  }
  
  /**
   * Create events on database corresponding to the recipe publication
   */
  public createRecipePublicationEvents(){
    if(this.profileService.isLoaded && this.recipeService.isLoaded){
      
      // Create recipe publication events for followers
      let event = new Event()
      event.init();
      event.code = 700;
      event.userRef = this.profileService.profile.user.userId;
      event.recipeRef = this.recipeService.recipe.id;
      this.eventService.uploadEventsOnServer(event, this.profileService.profile.user.followers);
      
      // Create publication event for my own recipe
      let selfEvent = new Event()
      selfEvent.init();
      selfEvent.code = 701;
      selfEvent.recipeRef = this.recipeService.recipe.id;
      this.eventService.uploadEventOnServer(selfEvent, this.profileService.profile.user.userId);
    }
  }
  
  /**
   * Create events on database corresponding to the recipe modification
   */
  public createRecipeModificationEvents(){
    if(this.profileService.isLoaded && this.recipeService.isLoaded){
      
      // Create recipe modification events for followers
      let event = new Event()
      event.init();
      event.code = 702;
      event.userRef = this.profileService.profile.user.userId;
      event.recipeRef = this.recipeService.recipe.id;
      this.eventService.uploadEventsOnServer(event, this.profileService.profile.user.followers);
      
      // Create modification event for my own recipe
      let selfEvent = new Event()
      selfEvent.init();
      selfEvent.code = 703;
      selfEvent.recipeRef = this.recipeService.recipe.id;
      this.eventService.uploadEventOnServer(selfEvent, this.profileService.profile.user.userId);
    }
  }
  
  /**
   * Create events on database corresponding to the recipe modification
   */
  public createRecipeEditorAddedEvents(addedUser: User){
      let event = new Event()
      event.init();
      event.code = 712;
      event.userRef = this.profileService.profile.user.userId;
      event.recipeRef = this.recipeService.recipe.id;
      this.eventService.uploadEventOnServer(event, addedUser.userId);
  }
  
  /**
   * Matches a proposed color item from a color payload
   */
  public matchColorItem(color: string) {
    for(let item of this.proposedColorItems){
      if(item.payload === color){
        return item;
      }
    }
  }
  
}

