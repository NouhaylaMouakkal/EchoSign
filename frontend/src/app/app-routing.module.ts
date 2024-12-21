import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignTotextComponent } from './sign-totext/sign-totext.component';
import { TextTosignComponent } from './text-tosign/text-tosign.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'sign_traduction', component: SignTotextComponent },
  { path: 'text_traduction', component: TextTosignComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' } // Handle undefined routes
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64]
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}