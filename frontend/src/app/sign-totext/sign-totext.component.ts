import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-sign-totext',
  templateUrl: './sign-totext.component.html',
  styleUrls: ['./sign-totext.component.css']
})
export class SignTotextComponent implements OnInit, OnDestroy {
  @ViewChild('webcamVideo', { static: true })
  webcamVideo!: ElementRef<HTMLVideoElement>;
  stream!: MediaStream | null;
  isWebcamStarted = false;
  private waveSurfer!: WaveSurfer;
  constructor() { }

  ngOnInit() {
    this.initWebcam();
    this.initializeWaveSurfer();
  }

  ngOnDestroy() {
    this.stopWebcam();
  }

  initWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.stream = stream;
        if (this.webcamVideo && this.webcamVideo.nativeElement && this.stream) {
          this.webcamVideo.nativeElement.srcObject = this.stream;
          this.isWebcamStarted = true;
        }
      })
      .catch(error => {
        console.error('Error accessing webcam:', error);
      });
  }

  startWebcam() {
    if (this.isWebcamStarted) {
      // Si la webcam est déjà démarrée, l'arrêter d'abord
      this.stopWebcam();
    }

    // Redémarrer la webcam
    this.initWebcam();
  }

  stopWebcam() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null!;
      this.isWebcamStarted = false;
    }
  }

  private initializeWaveSurfer(): void {
    this.waveSurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'rgba(255, 255, 255, 0.9)', 
      progressColor: 'rgb(25, 255, 255)',
      cursorColor: 'rgba(255, 255, 255, 0.7)',
      barWidth: 3,
      barRadius: 5,
      cursorWidth: 1,
      height: 40,
      barGap: 2
    });

    this.waveSurfer.load('assets/test.mp3');
  }

  public togglePlayPause(): void {
    if (this.waveSurfer.isPlaying()) {
      this.waveSurfer.pause();
    } else {
      this.waveSurfer.play();
    }
  }
}