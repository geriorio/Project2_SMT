import { Injectable } from '@angular/core';
import { ChecklistForm, ChecklistItem, CHECKLIST_ITEMS } from '../models/checklist.model';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  
  constructor() { }

  getChecklistItems(): ChecklistItem[] {
    return [...CHECKLIST_ITEMS];
  }

  createNewForm(): ChecklistForm {
    return {
      documentNumber: this.generateDocumentNumber(),
      dateTime: new Date().toISOString().slice(0, 16),
      driverName: '',
      vehicleLocation: '',
      departureKm: 0,
      exitTime: '',
      cargoType: '',
      roadPermitNumber: '',
      items: this.getChecklistItems(),
      notes: '',
      inspectedBy: '',
      driverSignature: '',
      disposalFromDistribution: {
        suitableRoad: false,
        canTravel: false,
        repairNotes: '',
        estimatedRepairDate: '',
        notSuitableRoad: false,
        repairCanContinue: false,
        repairContinueDate: ''
      }
    };
  }

  private generateDocumentNumber(): string {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `4QF.BKS-DST.${day}-${random}`;
  }

  saveChecklist(form: ChecklistForm): void {
    const savedChecklists = this.getSavedChecklists();
    savedChecklists.push(form);
    localStorage.setItem('truck-checklists', JSON.stringify(savedChecklists));
  }

  getSavedChecklists(): ChecklistForm[] {
    const saved = localStorage.getItem('truck-checklists');
    return saved ? JSON.parse(saved) : [];
  }

  getChecklistById(documentNumber: string): ChecklistForm | null {
    const checklists = this.getSavedChecklists();
    return checklists.find(c => c.documentNumber === documentNumber) || null;
  }

  getCategorizedItems(): { [category: string]: ChecklistItem[] } {
    const items = this.getChecklistItems();
    const categorized: { [category: string]: ChecklistItem[] } = {};
    
    items.forEach(item => {
      if (!categorized[item.category]) {
        categorized[item.category] = [];
      }
      categorized[item.category].push(item);
    });
    
    return categorized;
  }
}
