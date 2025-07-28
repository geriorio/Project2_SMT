import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistService } from '../services/checklist.service';
import { ChecklistForm } from '../models/checklist.model';

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checklist-list.component.html',
  styleUrls: ['./checklist-list.component.css']
})
export class ChecklistListComponent {
  savedChecklists: ChecklistForm[] = [];

  constructor(private checklistService: ChecklistService) {
    this.loadChecklists();
  }

  loadChecklists(): void {
    this.savedChecklists = this.checklistService.getSavedChecklists();
  }

  getCompletionPercentage(checklist: ChecklistForm): number {
    const totalItems = checklist.items.length;
    const completedItems = checklist.items.filter(item => item.condition !== null).length;
    return Math.round((completedItems / totalItems) * 100);
  }

  getConditionCounts(checklist: ChecklistForm): { B: number, TB: number, N: number } {
    const counts = { B: 0, TB: 0, N: 0 };
    checklist.items.forEach(item => {
      if (item.condition) {
        counts[item.condition]++;
      }
    });
    return counts;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('id-ID');
  }

  deleteChecklist(documentNumber: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus checklist ini?')) {
      const checklists = this.checklistService.getSavedChecklists();
      const filteredChecklists = checklists.filter(c => c.documentNumber !== documentNumber);
      localStorage.setItem('truck-checklists', JSON.stringify(filteredChecklists));
      this.loadChecklists();
    }
  }

  getCompleteChecklistsCount(): number {
    return this.savedChecklists.filter(c => this.getCompletionPercentage(c) === 100).length;
  }

  getIncompleteChecklistsCount(): number {
    return this.savedChecklists.filter(c => this.getCompletionPercentage(c) < 100).length;
  }

  getAverageProgress(): number {
    if (this.savedChecklists.length === 0) return 0;
    const total = this.savedChecklists.reduce((sum, c) => sum + this.getCompletionPercentage(c), 0);
    return Math.round(total / this.savedChecklists.length);
  }

  exportToCSV(): void {
    if (this.savedChecklists.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    const headers = [
      'No. Dokumen',
      'Tanggal',
      'Nama Pengemudi',
      'Lokasi Kendaraan',
      'Jenis Muatan',
      'Progress (%)',
      'Baik (B)',
      'Tidak Baik (TB)',
      'Tidak Ada (N)',
      'Catatan'
    ];

    const csvData = this.savedChecklists.map(checklist => {
      const counts = this.getConditionCounts(checklist);
      return [
        checklist.documentNumber,
        this.formatDate(checklist.dateTime),
        checklist.driverName,
        checklist.vehicleLocation,
        checklist.cargoType,
        this.getCompletionPercentage(checklist),
        counts.B,
        counts.TB,
        counts.N,
        checklist.notes.replace(/,/g, ';') // Replace commas to avoid CSV conflicts
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `truck_checklists_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
