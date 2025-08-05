import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChecklistService } from '../services/checklist.service';
import { ChecklistForm, ChecklistItem } from '../models/checklist.model';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent implements OnInit {
  @ViewChild('driverSignatureCanvas', { static: false }) driverSignatureCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('inspectorSignatureCanvas', { static: false }) inspectorSignatureCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('driverSignatureCanvasMobile', { static: false }) driverSignatureCanvasMobile!: ElementRef<HTMLCanvasElement>;
  @ViewChild('inspectorSignatureCanvasMobile', { static: false }) inspectorSignatureCanvasMobile!: ElementRef<HTMLCanvasElement>;
  
  checklistForm: ChecklistForm;
  categorizedItems: { [category: string]: ChecklistItem[] } = {};
  categories: string[] = [];
  isSubmitted = false;

  // Signature drawing variables
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  private signatureType: string = '';

  constructor(private checklistService: ChecklistService) {
    this.checklistForm = this.checklistService.createNewForm();
  }

  ngOnInit(): void {
    this.categorizedItems = this.checklistService.getCategorizedItems();
    this.categories = Object.keys(this.categorizedItems);
  }

  updateItemCondition(itemId: number, condition: 'B' | 'TB' | 'N'): void {
    const item = this.checklistForm.items.find(i => i.id === itemId);
    if (item) {
      item.condition = condition;
    }
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.checklistService.saveChecklist(this.checklistForm);
      this.isSubmitted = true;
      alert('Checklist berhasil disimpan!');
    } else {
      alert('Mohon lengkapi semua field yang wajib diisi!');
    }
  }

  private validateForm(): boolean {
    return !!(
      this.checklistForm.driverName &&
      this.checklistForm.vehicleLocation &&
      this.checklistForm.cargoType &&
      this.checklistForm.inspectedBy
    );
  }

  resetForm(): void {
    this.checklistForm = this.checklistService.createNewForm();
    this.isSubmitted = false;
  }

  printChecklist(): void {
    window.print();
  }

  onRoadConditionChange(condition: string): void {
    // Reset all conditions
    this.checklistForm.disposalFromDistribution.suitableRoad = false;
    this.checklistForm.disposalFromDistribution.canTravel = false;
    this.checklistForm.disposalFromDistribution.notSuitableRoad = false;
    
    // Set the selected condition
    switch(condition) {
      case 'suitable':
        this.checklistForm.disposalFromDistribution.suitableRoad = true;
        break;
      case 'canTravel':
        this.checklistForm.disposalFromDistribution.canTravel = true;
        break;
      case 'notSuitable':
        this.checklistForm.disposalFromDistribution.notSuitableRoad = true;
        break;
    }
  }

  getCompletionPercentage(): number {
    const totalItems = this.checklistForm.items.length;
    const completedItems = this.checklistForm.items.filter(item => item.condition !== null).length;
    return Math.round((completedItems / totalItems) * 100);
  }

  getConditionCounts(): { B: number, TB: number, N: number } {
    const counts = { B: 0, TB: 0, N: 0 };
    this.checklistForm.items.forEach(item => {
      if (item.condition) {
        counts[item.condition]++;
      }
    });
    return counts;
  }

  // Signature Drawing Methods
  startDrawing(event: MouseEvent | TouchEvent, type: string): void {
    this.isDrawing = true;
    this.signatureType = type;
    
    const canvas = this.getCanvas(type);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (event instanceof MouseEvent) {
      this.lastX = (event.clientX - rect.left) * scaleX;
      this.lastY = (event.clientY - rect.top) * scaleY;
    } else {
      event.preventDefault();
      const touch = event.touches[0];
      this.lastX = (touch.clientX - rect.left) * scaleX;
      this.lastY = (touch.clientY - rect.top) * scaleY;
    }
    
    this.setupCanvas(canvas);
  }

  draw(event: MouseEvent | TouchEvent, type: string): void {
    if (!this.isDrawing || this.signatureType !== type) return;
    
    const canvas = this.getCanvas(type);
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let currentX: number, currentY: number;
    
    if (event instanceof MouseEvent) {
      currentX = (event.clientX - rect.left) * scaleX;
      currentY = (event.clientY - rect.top) * scaleY;
    } else {
      event.preventDefault();
      const touch = event.touches[0];
      currentX = (touch.clientX - rect.left) * scaleX;
      currentY = (touch.clientY - rect.top) * scaleY;
    }
    
    ctx.beginPath();
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    this.lastX = currentX;
    this.lastY = currentY;
  }

  stopDrawing(type: string): void {
    if (this.signatureType === type) {
      this.isDrawing = false;
    }
  }

  clearSignature(type: string): void {
    const canvas = this.getCanvas(type);
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (type === 'driver') {
      this.checklistForm.driverSignature = '';
    } else if (type === 'inspector') {
      this.checklistForm.inspectorSignature = '';
    }
  }

  saveSignature(type: string): void {
    const canvas = this.getCanvas(type);
    const dataURL = canvas.toDataURL('image/png');
    
    if (type === 'driver') {
      this.checklistForm.driverSignature = dataURL;
      alert('Tanda tangan sopir berhasil disimpan!');
    } else if (type === 'inspector') {
      this.checklistForm.inspectorSignature = dataURL;
      alert('Tanda tangan inspector berhasil disimpan!');
    }
  }

  private getCanvas(type: string): HTMLCanvasElement {
    // Detect if we're on desktop (>= 1024px) or mobile/tablet
    const isDesktop = window.innerWidth >= 1024;
    
    if (type === 'driver') {
      if (isDesktop && this.driverSignatureCanvas) {
        return this.driverSignatureCanvas.nativeElement;
      } else if (!isDesktop && this.driverSignatureCanvasMobile) {
        return this.driverSignatureCanvasMobile.nativeElement;
      }
      // Fallback to desktop canvas
      return this.driverSignatureCanvas?.nativeElement;
    } else if (type === 'inspector') {
      if (isDesktop && this.inspectorSignatureCanvas) {
        return this.inspectorSignatureCanvas.nativeElement;
      } else if (!isDesktop && this.inspectorSignatureCanvasMobile) {
        return this.inspectorSignatureCanvasMobile.nativeElement;
      }
      // Fallback to desktop canvas
      return this.inspectorSignatureCanvas?.nativeElement;
    }
    throw new Error('Invalid signature type');
  }

  private setupCanvas(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = '#2E4A7A';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }
}
