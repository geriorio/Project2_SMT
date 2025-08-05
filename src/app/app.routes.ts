import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LandingComponent } from './components/landing/landing.component';
import { ScanBarcodeComponent } from './components/scan-barcode/scan-barcode.component';
import { TripSelectionComponent } from './components/trip-selection/trip-selection.component';
import { ChecklistComponent } from './components/checklist/checklist.component';
import { OdometerComponent } from './components/odometer/odometer.component';
import { TripCompleteComponent } from './components/trip-complete/trip-complete.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'scan-barcode', component: ScanBarcodeComponent },
  { path: 'trip-selection', component: TripSelectionComponent },
  { path: 'checklist', component: ChecklistComponent },
  { path: 'odometer', component: OdometerComponent },
  { path: 'trip-complete', component: TripCompleteComponent },
  { path: '**', redirectTo: '/login' }
];
