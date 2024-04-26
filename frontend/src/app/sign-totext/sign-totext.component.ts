import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-sign-totext',
  templateUrl: './sign-totext.component.html',
  styleUrls: ['./sign-totext.component.css']
})
export class SignTotextComponent implements OnInit, OnDestroy {
  @ViewChild('webcamVideo', { static: true })
  webcamVideo!: ElementRef<HTMLVideoElement>;
  stream!: MediaStream;

  constructor() { }

  ngOnInit() {
    this.initWebcam();
  }

  ngOnDestroy() {
    this.stopWebcam();
  }

  initWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.stream = stream;
        this.startWebcam(); // Start webcam once it's initialized
      })
      .catch(error => {
        console.error('Error accessing webcam:', error);
      });
  }

  startWebcam() {
    if (this.webcamVideo && this.webcamVideo.nativeElement && this.stream) {
      this.webcamVideo.nativeElement.srcObject = this.stream;
    }
   
  }

  stopWebcam() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}
