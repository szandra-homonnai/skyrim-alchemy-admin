import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/effects', pathMatch: 'full' },
  // eslint-disable-next-line @typescript-eslint/typedef
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  // eslint-disable-next-line @typescript-eslint/typedef
  { path: 'effects', loadChildren: () => import('./effect/effect.module').then(m => m.EffectModule) },
  // eslint-disable-next-line @typescript-eslint/typedef
  { path: 'ingredients', loadChildren: () => import('./ingredient/ingredient.module').then(m => m.IngredientModule) },
  { path: '**', redirectTo: '/effects', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
