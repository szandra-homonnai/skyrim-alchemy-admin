import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/effects', pathMatch: 'full' },
  // eslint-disable-next-line @typescript-eslint/typedef
  { path: 'effects', loadChildren: () => import('./effect/effect.module').then(m => m.EffectModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
