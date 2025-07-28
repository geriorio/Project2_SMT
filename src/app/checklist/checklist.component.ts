import { Component, OnInit } from '@angular/core';
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
  checklistForm: ChecklistForm;
  categorizedItems: { [category: string]: ChecklistItem[] } = {};
  categories: string[] = [];
  isSubmitted = false;

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
}
