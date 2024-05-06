import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public emailForm: FormGroup;
  public isLoading = false;

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      from_name: ['', Validators.required],
      from_email: ['', [Validators.required, Validators.email]],
      to_name: "Admin", 
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  async sendEmail() {
    if (this.emailForm.invalid) return; 
    this.isLoading = true;
    try {
      emailjs.init("3sKfOv_MR6MMEjt2c");
      const response = await emailjs.send("service_zzfxfh1", "template_66vddby", this.emailForm.value);
      Swal.fire('Success', 'Message sent successfully!', 'success');
      this.emailForm.reset();
      console.log('Email successfully sent!', response);
    } catch (error) {
      console.error('Failed to send email', error);
      Swal.fire('Error', 'Failed to send message.', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}