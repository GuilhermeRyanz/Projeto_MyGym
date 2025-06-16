import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import * as faceapi from 'face-api.js';
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient } from "@angular/common/http";
import { URLS } from "../../../../app.urls";
import { AuthService } from "../../../../auth/services/auth.service";
import { HttpMethodsService } from "../../../../shared/services/httpMethods/http-methods.service";

@Component({
  selector: 'app-totem',
  templateUrl: './totem.component.html',
  styleUrl: './totem.component.css',
})
export class TotemComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  video!: HTMLVideoElement;
  welcomeMessage: string = '';
  foundStudent: any = null;

  recognitionApiUrl = 'http://localhost:8001/api/recognize/';
  checkinVerificationUrl = 'http://localhost:8000/frequencias/verificar_checkin/';

  constructor(
    private http: HttpClient,
    private httpMethods: HttpMethodsService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadModels();
    this.startVideo();
  }

  ngOnDestroy(): void {
    if (this.video && this.video.srcObject) {
      const tracks = (this.video.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  }

  async loadModels() {
    const MODEL_URL = '/assets/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);
  }

  startVideo() {
    this.video = this.videoElement.nativeElement;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          this.video.srcObject = stream;
          this.video.play();
          this.video.addEventListener('playing', () => {
            this.captureAndRecognize();
          });
        })
        .catch((err) => console.error('Erro ao acessar a câmera:', err));
    }
  }

  async captureAndRecognize() {
    const canvas = faceapi.createCanvasFromMedia(this.video);
    document.body.append(canvas);
    const displaySize = {
      width: this.video.videoWidth,
      height: this.video.videoHeight,
    };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);

      for (const detection of resizedDetections) {
        // Desenha a caixa no rosto
        const box = detection.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: 'Detectado' });
        drawBox.draw(canvas);

        // Snapshot
        const snapshotCanvas = document.createElement('canvas');
        snapshotCanvas.width = this.video.videoWidth;
        snapshotCanvas.height = this.video.videoHeight;
        const ctx = snapshotCanvas.getContext('2d')!;
        ctx.drawImage(this.video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);

        const blob = await new Promise<Blob>((resolve) =>
          snapshotCanvas.toBlob((b) => resolve(b!), 'image/jpeg')
        );

        const formData = new FormData();
        formData.append('gym_id', this.authService.get_gym() || '');
        formData.append('face_image', blob, 'snapshot.jpg');

        this.http.post(this.recognitionApiUrl, formData).subscribe({
          next: (response: any) => {
            if (response.student_id && (!this.foundStudent || this.foundStudent !== response.student_id)) {
              this.foundStudent = response.student_id;
              this.verifyAndRegisterCheckIn(response.student_id);
            }
          },
          error: (err) => {
            console.error('Erro no reconhecimento facial:', err);
          }
        });

        break; // só o primeiro rosto
      }

    }, 3000);
  }

  /**
   * NOVA FUNÇÃO:
   * Verifica se o aluno pode fazer check-in e registra apenas se for permitido.
   */
  private verifyAndRegisterCheckIn(studentId: number): void {
    const gymId = this.authService.get_gym();
    if (!gymId) {
      console.error('ID da academia não encontrado.');
      return;
    }

    const params = {
      aluno: studentId,
      academia: gymId
    };

    this.http.get(this.checkinVerificationUrl, { params }).subscribe({
      next: (response: any) => {
        if (response.checkin_recente) {
          console.log(`Check-in já registrado para o aluno ${studentId}. Ignorando.`);
          this.showWelcomeMessage(`Olá novamente! Já registrado.`);
        } else {
          // Se não tiver check-in recente, faz o check-in normalmente
          this.registerCheckIn(studentId);
        }
      },
      error: (err) => {
        console.error('Erro ao verificar check-in:', err);
      }
    });
  }

  private registerCheckIn(studentId: number): void {
    const gymId = this.authService.get_gym();
    if (!gymId) {
      console.error('ID da academia não encontrado.');
      return;
    }

    const payload = {
      aluno: studentId,
      academia: gymId,
    };

    this.httpMethods.post(URLS.FREQUENCY, payload).subscribe({
      next: (response) => {
        console.log('Check-in registrado:', response);
        this.showWelcomeMessage(`Bem-vindo aluno ${studentId}!`);
      },
      error: (err) => {
        console.error('Erro ao registrar check-in:', err);
      },
    });
  }

  private showWelcomeMessage(message: string) {
    this.welcomeMessage = message;
    this.snackBar.open(this.welcomeMessage, 'Fechar', {
      duration: 4000,
      verticalPosition: 'top',
    });
    setTimeout(() => {
      this.welcomeMessage = '';
      this.foundStudent = null; // Permite novo reconhecimento
    }, 5000);
  }
}
