import { Component } from '@angular/core';
import * as emailjs from 'emailjs-com';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 
  sendEmail(name: string, email: string, subject: string, message: string) {
    const params = {
      name: name,
      reply_email: email,
      subject: subject,
      message: message
    };

    emailjs.send('service_zzfxfh1', 'template_g80ckbl', params, 'YOUR_USER_ID')
      .then((response) => {
        alert('Email sent successfully!'+ response.text);
        // Reset the form or show a confirmation message here
      }, (error) => {
        alert('Error sending email:' + error);
        // Display an error message to the user here
      });
  }
}
