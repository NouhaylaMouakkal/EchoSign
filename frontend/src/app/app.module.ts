import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignTotextComponent } from './sign-totext/sign-totext.component';
import { TextTosignComponent } from './text-tosign/text-tosign.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { WebcamModule } from 'ngx-webcam';
<<<<<<< HEAD
import { ReactiveFormsModule } from '@angular/forms';
=======
import { InputTextComponent } from './input-text/input-text.component';
import { InputAudioComponent } from './input-audio/input-audio.component';
import { ReactiveFormsModule } from '@angular/forms';

>>>>>>> 406de6f (fix style sign to text)
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignTotextComponent,
    TextTosignComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebcamModule,
    ReactiveFormsModule,
<<<<<<< HEAD
    FormsModule
=======
>>>>>>> 406de6f (fix style sign to text)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
