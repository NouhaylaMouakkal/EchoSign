import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignTotextComponent } from './sign-totext/sign-totext.component';
import { TextTosignComponent } from './text-tosign/text-tosign.component';
// import { HeaderComponent } from './shared/header/header.component';
// import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: 'sign_traduction', component: SignTotextComponent },
  { path: 'text_traduction', component: TextTosignComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64]})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
