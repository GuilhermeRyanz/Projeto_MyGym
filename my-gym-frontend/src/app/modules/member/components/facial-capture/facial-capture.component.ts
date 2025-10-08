// src/app/modules/member/components/facial-capture/facial-capture.component.ts
import {Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as faceapi from 'face-api.js';
import {HttpMethodsService} from '../../../../shared/services/httpMethods/http-methods.service';
import {AuthService} from "../../../../auth/services/auth.service";

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

@Component({
  selector: 'app-facial-capture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facial-capture.component.html',
  styleUrls: ['./facial-capture.component.css']
})
export class FacialCaptureComponent implements OnInit, OnDestroy {
  @Input({ required: true }) studentId!: number;
  @Input({required: true}) gymId: string | null = "";
  @Output() captureComplete = new EventEmitter<void>();

  videoStream: MediaStream | null = null;
  feedbackMessage: string | null = "Iniciando...";
  errorMessage: string | null = null;
  isProcessing = false;
  private videoElement!: HTMLVideoElement;


  captureInstructions = [
    "Olhe para a FRENTE", "Incline a cabeça para a ESQUERDA", "Incline a cabeça para a DIREITA",
    "Olhe um pouco para CIMA", "Olhe um pouco para BAIXO", "Dê um leve SORRISO",
    "Expressão SÉRIA", "Aproxime-se um pouco da câmera", "Afaste-se um pouco da câmera",
    "Vire levemente o rosto para a ESQUERDA", "Vire levemente o rosto para a DIREITA"
  ];

  constructor(
    private httpMethods: HttpMethodsService,
    private ngZone: NgZone,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    if (!this.studentId) {
      this.errorMessage = "Erro: ID do aluno não fornecido.";
      return;
    }
    this.setup();
  }

  async setup() {
    this.isProcessing = true;
    this.feedbackMessage = "Carregando modelos de IA...";
    await this.loadModels();
    this.feedbackMessage = "Iniciando câmera...";
    await this.startCamera();
    this.isProcessing = false;
  }

  async loadModels() {
    const MODEL_URL = '/assets/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  }

  async startCamera() {
    try {
      this.videoElement = document.getElementById('video-capture') as HTMLVideoElement;
      this.videoStream = await navigator.mediaDevices.getUserMedia({ video: {} });
      this.videoElement.srcObject = this.videoStream;
    } catch (error: any) {
      this.errorMessage = `Erro ao acessar a câmera: ${error.message}`;
      this.isProcessing = false;
    }
  }

  async startAutomatedCapture() {
    this.isProcessing = true;
    this.feedbackMessage = "Capturando imagem única...";
    await sleep(1500);

    const blob = await this.captureSingleFrame();
    if (!blob) {
      this.errorMessage = "Falha ao capturar imagem.";
      this.isProcessing = false;
      return;
    }

    this.feedbackMessage = "Gerando variações da imagem...";
    const baseFile = new File([blob], `face_original.jpg`, { type: 'image/jpeg' });

    const imagesCaptured = await this.generateImageVariations(baseFile);

    this.feedbackMessage = "Enviando imagens geradas...";
    this.uploadFacialData(imagesCaptured);
  }

  private async generateImageVariations(baseFile: File): Promise<File[]> {
    const variations: File[] = [];
    const img = new Image();
    img.src = URL.createObjectURL(baseFile);

    await new Promise<void>((resolve) => (img.onload = () => resolve()));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = img.width;
    canvas.height = img.height;

    const transformations = [
      { rotate: 0, flip: false, brightness: 1.0 },
      { rotate: 10, flip: false, brightness: 1.05 },
      { rotate: -10, flip: false, brightness: 0.95 },
      { rotate: 0, flip: true, brightness: 1.0 },
      { rotate: 0, flip: false, brightness: 1.1 },
      { rotate: 0, flip: false, brightness: 0.9 },
      { rotate: 5, flip: true, brightness: 1.05 },
      { rotate: -5, flip: true, brightness: 0.95 },
      { rotate: 0, flip: false, brightness: 1.0, zoom: 1.1 },
      { rotate: 0, flip: false, brightness: 1.0, zoom: 0.9 },
      { rotate: 15, flip: false, brightness: 1.05 },
    ];

    for (let i = 0; i < transformations.length; i++) {
      const t = transformations[i];
      ctx.save();

      // Aplicar transformações
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (t.rotate) ctx.rotate((t.rotate * Math.PI) / 180);
      if (t.flip) ctx.scale(-1, 1);

      const zoom = t.zoom || 1.0;
      ctx.filter = `brightness(${t.brightness})`;
      ctx.drawImage(
        img,
        -img.width * zoom / 2,
        -img.height * zoom / 2,
        img.width * zoom,
        img.height * zoom
      );
      ctx.restore();

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg')
      );

      if (blob) {
        variations.push(new File([blob], `face_${i}.jpg`, { type: 'image/jpeg' }));
      }
    }

    return variations;
  }

  async capturePhoto() {
    this.isProcessing = true;
    this.feedbackMessage = "Capturando imagem...";

    const blob = await this.captureSingleFrame();
    if (!blob) {
      this.errorMessage = "Falha ao capturar imagem.";
      this.isProcessing = false;
      return;
    }

    this.feedbackMessage = "Gerando variações da imagem...";
    const baseFile = new File([blob], `face_original.jpg`, { type: 'image/jpeg' });
    const imagesCaptured = await this.generateImageVariations(baseFile);

    this.feedbackMessage = "Enviando imagens geradas...";
    this.uploadFacialData(imagesCaptured);
  }


  // async startAutomatedCapture() {
  //   this.isProcessing = true;
  //   const imagesCaptured: File[] = [];
  //   for (let i = 0; i < this.captureInstructions.length; i++) {
  //     this.ngZone.run(() => { this.feedbackMessage = `Passo ${i + 1}/${this.captureInstructions.length}: ${this.captureInstructions[i]}`; });
  //     await sleep(2500);
  //
  //     this.ngZone.run(() => { this.feedbackMessage = "Capturando..."; });
  //     await sleep(500);
  //
  //     const blob = await this.captureSingleFrame();
  //     if (blob) {
  //       imagesCaptured.push(new File([blob], `face_${i}.jpg`, { type: 'image/jpeg' }));
  //       this.ngZone.run(() => { this.feedbackMessage = `Foto ${i + 1} capturada!`; });
  //       await sleep(1000);
  //     }
  //   }
  //   this.feedbackMessage = 'Todas as fotos capturadas! Enviando para o microsserviço...';
  //   this.uploadFacialData(imagesCaptured);
  // }

  private captureSingleFrame(): Promise<Blob | null> {
    return new Promise((resolve) => {
      const canvas = faceapi.createCanvasFromMedia(this.videoElement);
      canvas.getContext('2d')?.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg');
    });
  }

  private uploadFacialData(images: File[]) {
    console.log(this.studentId,"estudante");
    console.log(this.gymId,"academia");
    this.httpMethods.uploadFacialData(this.studentId, this.gymId ,images).subscribe({
      next: () => {
        this.feedbackMessage = "Reconhecimento facial cadastrado com sucesso!";
        this.stopCamera();
        this.captureComplete.emit();
      },
      error: () => {
        // Seu HttpMethodsService já mostra o erro no snackbar
        this.errorMessage = 'Falha ao enviar dados faciais. Verifique o console e tente novamente.';
        this.isProcessing = false;
      }
    });
  }

  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
    }
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}
