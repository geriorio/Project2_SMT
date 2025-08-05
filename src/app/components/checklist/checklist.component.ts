import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  required: boolean;
}

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent implements OnInit {
  truckBarcode: string = '';
  tripType: string = '';
  
  checklistItems: ChecklistItem[] = [
    { id: 'engine', label: 'Engine Oil Level', checked: false, required: true },
    { id: 'tires', label: 'Tire Condition', checked: false, required: true },
    { id: 'brakes', label: 'Brake System', checked: false, required: true },
    { id: 'lights', label: 'Lights (Headlights, Taillights)', checked: false, required: true },
    { id: 'mirrors', label: 'Side Mirrors', checked: false, required: true },
    { id: 'fuel', label: 'Fuel Level', checked: false, required: true },
    { id: 'documents', label: 'Vehicle Documents', checked: false, required: true },
    { id: 'emergency', label: 'Emergency Kit', checked: false, required: false },
    { id: 'cleanliness', label: 'Vehicle Cleanliness', checked: false, required: false }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.truckBarcode = localStorage.getItem('currentTruckBarcode') || '';
    this.tripType = localStorage.getItem('tripType') || '';
    
    if (!this.truckBarcode || this.tripType !== 'OUT') {
      this.router.navigate(['/trip-selection']);
    }
  }

  get requiredItemsCompleted(): boolean {
    const requiredItems = this.checklistItems.filter(item => item.required);
    return requiredItems.every(item => item.checked);
  }

  get completedCount(): number {
    return this.checklistItems.filter(item => item.checked).length;
  }

  get totalCount(): number {
    return this.checklistItems.length;
  }

  onSubmit() {
    if (this.requiredItemsCompleted) {
      // Save checklist data
      localStorage.setItem('checklistData', JSON.stringify(this.checklistItems));
      this.router.navigate(['/odometer']);
    } else {
      alert('Please complete all required checklist items before proceeding.');
    }
  }

  goBack() {
    this.router.navigate(['/trip-selection']);
  }
}
