import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { RecipeComponent } from './views/recipe/recipe.component';
import { EditRecipeComponent } from './views/edit-recipe/edit-recipe.component';
import { FollowUserComponent } from './views/follow-user/follow-user.component';
import { ProfileComponent } from './views/profile/profile.component'; 
import { KitchenComponent } from './views/kitchen/kitchen.component';
import { DraftComponent } from './views/draft/draft.component';
import { AuthGuardService } from './auth/services/auth-guard.service';
import { ActivityComponent } from './views/activity/activity.component';

 

const routes: Routes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'profile', canActivate: [AuthGuardService], component: ProfileComponent },
  { path: 'user/follow', canActivate: [AuthGuardService], component: FollowUserComponent },
  { path: 'kitchen', canActivate: [AuthGuardService], component: KitchenComponent },
  { path: 'activity', canActivate: [AuthGuardService], component: ActivityComponent },
  { path: 'draft', canActivate: [AuthGuardService], component: DraftComponent },
  { path: 'recipe/edit/:id', canActivate: [AuthGuardService], component: EditRecipeComponent },
  { path: 'recipe/:id', canActivate: [AuthGuardService], component: RecipeComponent },
  { path: '', redirectTo: 'kitchen', pathMatch: 'full' },
  { path: '**', redirectTo: 'kitchen' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
