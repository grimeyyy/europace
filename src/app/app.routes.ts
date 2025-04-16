import { Routes } from '@angular/router';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)},
      {path: 'calculator', loadComponent: () => import('./calculator/calculator.component').then(m => m.CalculatorComponent)},
    ]
  },
];
