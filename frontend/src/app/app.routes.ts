import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'admin', component: AdminPanelComponent }
];
