import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService } from './auth/services/auth-guard.service';

// tl-common
import { TlCommonModule } from './tl-common/tl-common.module';
import { TlFbaseCommonModule } from './tl-fbase-common/tl-fbase-common.module';

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


@NgModule({ 
  declarations: [
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
    UserCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, 
    CKEditorModule,
    NoopAnimationsModule,
    TlCommonModule,
    TlFbaseCommonModule
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
