import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { LayoutComponent } from './layout/layout.component';
import { RecipeComponent } from './views/recipe/recipe.component';
import { AuthService } from './auth/services/auth.service';
import { AuthGuardService } from './auth/services/auth-guard.service';
import { UserService } from './services/user.service';
import { RecipeService } from './services/recipe.service';
import { UploadService } from './services/upload.service';
import { RecipeDashboardService } from './services/recipe-dashboard.service';
import { EditRecipeComponent } from './views/edit-recipe/edit-recipe.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HamburgerComponent } from './layout/hamburger/hamburger.component';
import { MenuComponent } from './layout/menu/menu.component';
import { CardComponent } from './common/card/card.component';
import { UserCardComponent } from './common/user-card/user-card.component'; 
import { LoaderComponent } from './common/loader/loader.component';
import { UserListComponent } from './common/user-list/user-list.component';
import { FollowUserComponent } from './views/follow-user/follow-user.component';
import { ButtonComponent } from './common/button/button.component';
import { MiniatureComponent } from './common/miniature/miniature.component';
import { ProfileComponent } from './views/profile/profile.component';
import { SpinnerComponent } from './common/spinner/spinner.component';
import { InteractiveInputComponent } from './common/interactive-input/interactive-input.component';
import { ActiveImageComponent } from './common/active-image/active-image.component';
import { SquareIconComponent } from './common/square-icon/square-icon.component';
import { StringPickerComponent } from './common/string-picker/string-picker.component';
import { UserPickerComponent } from './common/user-picker/user-picker.component';
import { RecipeListComponent } from './common/recipe-list/recipe-list.component';
import { RecipeCardComponent } from './common/recipe-card/recipe-card.component';
import { KitchenComponent } from './views/kitchen/kitchen.component';
import { RecipeMiniatureComponent } from './common/recipe-miniature/recipe-miniature.component';
import { SearchBarComponent } from './common/search-bar/search-bar.component';
import { UserMiniatureComponent } from './common/user-miniature/user-miniature.component';
import { StatefulButtonComponent } from './common/stateful-button/stateful-button.component';
import { OutlinedActiveImageComponent } from './common/outlined-active-image/outlined-active-image.component';
import { ShapeBlockComponent } from './common/shape-block/shape-block.component';
import { KitchenFilterComponent } from './views/kitchen/kitchen-filter/kitchen-filter.component';
import { NukiCardComponent } from './common/nuki-card/nuki-card.component';
import { DraftComponent } from './views/draft/draft.component';
import { ActivityComponent } from './views/activity/activity.component';

@NgModule({ 
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    LayoutComponent,
    RecipeComponent,
    EditRecipeComponent,
    HamburgerComponent,
    MenuComponent,
    CardComponent,
    UserCardComponent,
    LoaderComponent,
    UserListComponent,
    FollowUserComponent,
    ButtonComponent,
    MiniatureComponent,
    ProfileComponent,
    SpinnerComponent,
    InteractiveInputComponent,
    ActiveImageComponent,
    SquareIconComponent,
    StringPickerComponent,
    UserPickerComponent,
    RecipeListComponent,
    RecipeCardComponent,
    KitchenComponent,
    RecipeMiniatureComponent,
    SearchBarComponent,
    UserMiniatureComponent,
    StatefulButtonComponent,
    OutlinedActiveImageComponent,
    ShapeBlockComponent,
    KitchenFilterComponent,
    NukiCardComponent,
    DraftComponent,
    ActivityComponent,
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
  providers: [AuthGuardService, AuthService, UserService, RecipeService, RecipeDashboardService, UploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
