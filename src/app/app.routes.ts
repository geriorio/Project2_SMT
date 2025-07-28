import { Routes } from '@angular/router';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistListComponent } from './checklist-list/checklist-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/checklist', pathMatch: 'full' },
  { path: 'checklist', component: ChecklistComponent },
  { path: 'checklist-list', component: ChecklistListComponent },
  { path: '**', redirectTo: '/checklist' }
];
