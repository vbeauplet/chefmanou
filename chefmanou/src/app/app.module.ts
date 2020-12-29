import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService } from './auth/services/auth-guard.service';
import { DateAgoPipe } from './pipes/date-ago.pipe';

// Root & Views
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { LayoutComponent } from './layout/layout.component';
import { RecipeComponent } from './views/recipe/recipe.component';
import { EditRecipeComponent } from './views/edit-recipe/edit-recipe.component';
import { FollowUserComponent } from './views/follow-user/follow-user.component';
import { KitchenComponent } from './views/kitchen/kitchen.component';
import { KitchenFilterComponent } from './views/kitchen/kitchen-filter/kitchen-filter.component';
import { NewRecipeComponent } from './views/new-recipe/new-recipe.component';
import { HistoryComponent } from './views/history/history.component';
import { ProfileComponent } from './views/profile/profile.component';
import { DraftComponent } from './views/draft/draft.component';
import { ActivityComponent } from './views/activity/activity.component';

// Chef Manou components
import { EventBlockComponent } from './common/event-block/event-block.component';
import { RecipeListComponent } from './common/recipe-list/recipe-list.component';
import { RecipeCardComponent } from './common/recipe-card/recipe-card.component';
import { RecipeMiniatureComponent } from './common/recipe-miniature/recipe-miniature.component';
import { UserMiniatureComponent } from './common/user-miniature/user-miniature.component';
import { UserListComponent } from './common/user-list/user-list.component';
import { UserCardComponent } from './common/user-card/user-card.component'; 

// tl-common components
import { TlActiveImageComponent } from './tl-common/components/tl-active-image/tl-active-image.component';
import { TlButtonComponent } from './tl-common/components/tl-button/tl-button.component';
import { TlButtonTogglerComponent } from './tl-common/components/tl-button-toggler/tl-button-toggler.component';
import { TlCardComponent } from './tl-common/components/tl-card/tl-card.component';
import { TlColorPickerComponent } from './tl-common/components/tl-color-picker/tl-color-picker.component';
import { TlHamburgerComponent } from './tl-common/components/tl-hamburger/tl-hamburger.component';
import { TlIndicatorComponent } from './tl-common/components/tl-indicator/tl-indicator.component';
import { TlInteractiveInputComponent } from './tl-common/components/tl-interactive-input/tl-interactive-input.component';
import { TlLoaderComponent } from './tl-common/components/tl-loader/tl-loader.component';
import { TlMiniatureComponent } from './tl-common/components/tl-miniature/tl-miniature.component';
import { TlNukiCardComponent } from './tl-common/components/tl-nuki-card/tl-nuki-card.component';
import { TlOutlinedActiveImageComponent } from './tl-common/components/tl-outlined-active-image/tl-outlined-active-image.component';
import { TlSearchBarComponent } from './tl-common/components/tl-search-bar/tl-search-bar.component';
import { TlShapeBlockComponent } from './tl-common/components/tl-shape-block/tl-shape-block.component';
import { TlSpinnerComponent } from './tl-common/components/tl-spinner/tl-spinner.component';
import { TlSquareIconComponent } from './tl-common/components/tl-square-icon/tl-square-icon.component';
import { TlStatefulButtonComponent } from './tl-common/components/tl-stateful-button/tl-stateful-button.component';
import { TlStringPickerComponent } from './tl-common/components/tl-string-picker/tl-string-picker.component';
import { TlTimelineCardComponent } from './tl-common/components/tl-timeline-card/tl-timeline-card.component';
import { TlTogglerComponent } from './tl-common/components/tl-toggler/tl-toggler.component';
import { TlUserMiniatureComponent } from './tl-common/components/tl-user-miniature/tl-user-miniature.component';
import { TlAlertComponent } from './tl-common/overlay-components/tl-alert/tl-alert.component';
import { TlMobileMenuComponent } from './tl-common/overlay-components/tl-mobile-menu/tl-mobile-menu.component';

// tl-fbase-common components

import { TlFbaseActiveImageComponent } from './tl-fbase-common/components/tl-fbase-active-image/tl-fbase-active-image.component';
import { TlFbaseButtonTogglerComponent } from './tl-fbase-common/components/tl-fbase-button-toggler/tl-fbase-button-toggler.component';
import { TlFbaseColorPickerComponent } from './tl-fbase-common/components/tl-fbase-color-picker/tl-fbase-color-picker.component';
import { TlFbaseInteractiveInputComponent } from './tl-fbase-common/components/tl-fbase-interactive-input/tl-fbase-interactive-input.component';
import { TlFbaseOutlinedActiveImageComponent } from './tl-fbase-common/components/tl-fbase-outlined-active-image/tl-fbase-outlined-active-image.component';
import { TlFbaseStringPickerComponent } from './tl-fbase-common/components/tl-fbase-string-picker/tl-fbase-string-picker.component';
import { TlFbaseTogglerComponent } from './tl-fbase-common/components/tl-fbase-toggler/tl-fbase-toggler.component';
import { TlFbaseUserPickerComponent } from './tl-fbase-common/components/tl-fbase-user-picker/tl-fbase-user-picker.component';

@NgModule({ 
  declarations: [
    DateAgoPipe,
    AppComponent,
    SignupComponent,
    SigninComponent,
    LayoutComponent,
    RecipeComponent,
    EditRecipeComponent,
    FollowUserComponent,
    KitchenComponent,
    KitchenFilterComponent,
    NewRecipeComponent,
    HistoryComponent,
    ProfileComponent,
    DraftComponent,
    ActivityComponent,
    EventBlockComponent,
    RecipeListComponent,
    RecipeCardComponent,
    RecipeMiniatureComponent,
    UserMiniatureComponent,
    UserListComponent,
    UserCardComponent,
    TlActiveImageComponent,
    TlButtonComponent,
    TlButtonTogglerComponent,
    TlCardComponent,
    TlColorPickerComponent,
    TlHamburgerComponent,
    TlIndicatorComponent,
    TlInteractiveInputComponent,
    TlLoaderComponent,
    TlMiniatureComponent,
    TlNukiCardComponent,
    TlOutlinedActiveImageComponent,
    TlSearchBarComponent,
    TlShapeBlockComponent,
    TlSpinnerComponent,
    TlSquareIconComponent,
    TlStatefulButtonComponent,
    TlStringPickerComponent,
    TlTimelineCardComponent,
    TlTogglerComponent,
    TlUserMiniatureComponent,
    TlAlertComponent,
    TlMobileMenuComponent,
    TlFbaseActiveImageComponent,
    TlFbaseButtonTogglerComponent,
    TlFbaseColorPickerComponent,
    TlFbaseInteractiveInputComponent,
    TlFbaseOutlinedActiveImageComponent,
    TlFbaseStringPickerComponent,
    TlFbaseTogglerComponent,
    TlFbaseUserPickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, 
    CKEditorModule,
    NoopAnimationsModule
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
