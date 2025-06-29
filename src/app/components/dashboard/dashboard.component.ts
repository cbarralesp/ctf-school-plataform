import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  currentView: string = 'modules';
  teacherName: string = 'Nicole Profesora';
  courseName: string = 'Nombre curso';
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router) {}

  // Navegación entre vistas internas del dashboard (opcional)
  navigateToView(view: string) {
    this.currentView = view;
  }

  // Navegación hacia la vista de asistencia
  navigateToAsistencia() {
    this.router.navigate(['/asistencia']);
  }

  // Volver al dashboard principal (vista por defecto)
  backToDashboard() {
    this.currentView = 'modules';
  }
}
