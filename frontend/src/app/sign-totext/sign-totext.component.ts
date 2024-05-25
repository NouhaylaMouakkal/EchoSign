import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener, SimpleChanges } from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import { HttpClient } from '@angular/common/http';
import { Hands, HAND_CONNECTIONS, Results } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { OpenaiService } from '../services/openai.service';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-sign-totext',
  templateUrl: './sign-totext.component.html',
  styleUrls: ['./sign-totext.component.css']
})
export class SignTotextComponent implements OnInit, OnDestroy {

  @ViewChild('webcamVideo', { static: true })
  webcamVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  stream!: MediaStream | null;
  isWebcamStarted = false;
  predictedLetter: string = 'Click Capture or Space or Enter to predict.';
  previousPredictedLetter: string = '';
  translationFrench: string = 'Translation to French';
  translationEnglish: string = 'Translation to English';
  translationMaroc: string = 'Translation to Moroccan Darija';
  private waveSurfer!: WaveSurfer;
  private hands!: Hands;
  private canvasCtx!: CanvasRenderingContext2D;
  isLoading: boolean = false;

  constructor(private http: HttpClient, private openaiService: OpenaiService, private translationService: TranslationService) { }

  ngOnInit() {
    this.initWebcam();
    this.initializeWaveSurfer();
    this.clearPrediction();
    this.initializeHands();
  }

  ngOnDestroy() {
    this.stopWebcam();
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes['predictedLetter'] && !changes['predictedLetter'].isFirstChange()) {
      this.translatePrediction();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space' || event.code === 'Enter') {
      this.captureImage();
    }
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
      this.stopWebcam();
    }
    this.initWebcam();
  }

  stopWebcam() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null!;
      this.isWebcamStarted = false;
    }
  }

  clearPrediction() {
    this.predictedLetter = 'Click Capture or Space or Enter to predict.';
    this.translationFrench = 'Translation to French';
    this.translationEnglish = 'Translation to English';
    this.translationMaroc = 'Translation to Moroccan Darija';
    this.previousPredictedLetter = '';
    this.waveSurfer.load('assets/init_predit.mp3');
  }

  captureImage() {
    if (!this.webcamVideo.nativeElement) return;
    const canvas = document.createElement('canvas');
    canvas.width = this.webcamVideo.nativeElement.videoWidth;
    canvas.height = this.webcamVideo.nativeElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(this.webcamVideo.nativeElement, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append('image', blob);
          this.http.post<{ letters: string[] }>('http://localhost:5000/detect-sign-language', formData).subscribe(response => {
            if (this.predictedLetter === 'Click Capture or Space or Enter to predict.') {
              this.predictedLetter = '';
            }
            this.predictedLetter += response.letters.join('');
            this.translatePrediction();
          });
        }
      }, 'image/jpeg');
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

    this.waveSurfer.load('assets/init_predit.mp3');
  }

  private initializeHands() {
    this.canvasCtx = this.canvas.nativeElement.getContext('2d')!;
    this.hands = new Hands({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    this.hands.setOptions({
      selfieMode: true,
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.hands.onResults((results: Results) => this.onResults(results));
  }

  private lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  private onResults(results: Results): void {
    this.canvasCtx.save();
    this.canvasCtx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.canvasCtx.drawImage(
      results.image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let index = 0; index < results.multiHandLandmarks.length; index++) {
        const classification = results.multiHandedness[index];
        const isRightHand = classification.label === 'Right';
        const landmarks = results.multiHandLandmarks[index];
        drawConnectors(
          this.canvasCtx, landmarks, HAND_CONNECTIONS,
          { color: isRightHand ? '#00FF00' : '#FF0000' });
        drawLandmarks(this.canvasCtx, landmarks, {
          color: isRightHand ? '#00FF00' : '#FF0000',
          fillColor: isRightHand ? '#FF0000' : '#00FF00',
          radius: (data) => {
            return this.lerp(data.from?.z ?? 0, -0.15, 0.1) * 10 + 1;
          }
        });
      }
    }
    this.canvasCtx.restore();
  }

  public togglePlayPause(): void {
    if (this.waveSurfer.isPlaying()) {
      this.waveSurfer.pause();
    } else {
      this.waveSurfer.play();
    }
  }

  public listenToPrediction(): void {
    if (this.predictedLetter && this.predictedLetter !== 'Click Capture or Space or Enter to predict.') {
      if (this.predictedLetter !== this.previousPredictedLetter) {
        this.isLoading = true;
        this.waveSurfer.stop();
        this.openaiService.generateSpeech(this.predictedLetter).subscribe(blob => {
          this.isLoading = false;
          const url = window.URL.createObjectURL(blob);
          this.waveSurfer.load(url);
          this.waveSurfer.on('ready', () => {
            this.waveSurfer.play();
          });
          this.previousPredictedLetter = this.predictedLetter;
        }, error => {
          this.isLoading = false;
          console.error('Error generating speech:', error);
        });
      }
    }
    if (this.isLoading) this.waveSurfer.stop();
    else
      this.togglePlayPause();
  }

  private translatePrediction(): void {
    this.translationService.translate(this.predictedLetter, 'French').subscribe(frenchTranslation => {
      this.translationFrench = frenchTranslation;
    }, error => {
      console.error('Error translating to French:', error);
    });

    this.translationService.translate(this.predictedLetter, 'English').subscribe(englishTranslation => {
      this.translationEnglish = englishTranslation;
    }, error => {
      console.error('Error translating to English:', error);
    });
    this.translationService.translate(this.predictedLetter, 'Moroccan Darija').subscribe(marocTranslation => {
      this.translationMaroc = marocTranslation;
    }, error => {
      console.error('Error translating to Ma:', error);
    });
  }
}
