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
import { InputTextComponent } from './input-text/input-text.component';
import { InputAudioComponent } from './input-audio/input-audio.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignTotextComponent,
    TextTosignComponent,
    HeaderComponent,
    FooterComponent,
    InputTextComponent,
    InputAudioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebcamModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
