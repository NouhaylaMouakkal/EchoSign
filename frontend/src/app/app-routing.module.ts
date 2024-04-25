import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignTotextComponent } from './sign-totext/sign-totext.component';

const routes: Routes = [
  { path: 'sign_traduction', component: SignTotextComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
