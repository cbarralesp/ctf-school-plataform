import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../header/header.component';
import { AsistenciaService, Estudiante, AsistenciaRequest } from '../../../services/asistencia.service';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderComponent],
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = 2026;

  months = [
    { value: 1, name: 'Enero' },
    { value: 2, name: 'Febrero' },
    { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' },
    { value: 5, name: 'Mayo' },
    { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' },
    { value: 8, name: 'Agosto' },
    { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' },
    { value: 11, name: 'Noviembre' },
    { value: 12, name: 'Diciembre' }
  ];

  estudiantes: Estudiante[] = [];
  diasDelMes: number[] = [];
  cargando = false;

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit() {
    this.generateDaysOfMonth();
    this.loadEstudiantes();
  }

  onMonthChange() {
    this.generateDaysOfMonth();
    this.loadAsistencias();
  }

  generateDaysOfMonth() {
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
    this.diasDelMes = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  loadEstudiantes() {
    this.cargando = true;
    this.asistenciaService.obtenerEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes = data.map(est => ({
          ...est,
          asistencias: {}
        }));
        this.loadAsistencias();
      },
      error: (error) => {
        console.error('Error cargando estudiantes:', error);
        this.cargando = false;
      }
    });
  }

  loadAsistencias() {
    if (this.estudiantes.length === 0) return;

    this.cargando = true;
    this.asistenciaService.obtenerAsistenciasPorMes(this.selectedMonth, this.selectedYear).subscribe({
      next: (asistencias) => {
        // Limpiar asistencias previas
        this.estudiantes.forEach(est => est.asistencias = {});

        // Mapear asistencias
        asistencias.forEach(asist => {
          const estudiante = this.estudiantes.find(est => est.id === asist.estudianteId);
          if (estudiante) {
            estudiante.asistencias[asist.fecha] = asist.estado;
          }
        });
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando asistencias:', error);
        this.cargando = false;
      }
    });
  }

  getEstadoAsistencia(estudianteId: number, dia: number): string {
    const fecha = this.asistenciaService.generarFecha(this.selectedYear, this.selectedMonth, dia);
    const estudiante = this.estudiantes.find(est => est.id === estudianteId);
    return estudiante?.asistencias[fecha] || '';
  }

  cambiarAsistencia(estudianteId: number, dia: number, estado: string) {
    const fecha = this.asistenciaService.generarFecha(this.selectedYear, this.selectedMonth, dia);

    const request: AsistenciaRequest = {
      estudianteId,
      fecha,
      estado
    };

    this.asistenciaService.marcarAsistencia(request).subscribe({
      next: () => {
        const estudiante = this.estudiantes.find(est => est.id === estudianteId);
        if (estudiante) {
          estudiante.asistencias[fecha] = estado;
        }
      },
      error: (error) => {
        console.error('Error marcando asistencia:', error);
      }
    });
  }

  marcarTodosPresentes() {
    this.cargando = true;
    const fecha = this.asistenciaService.obtenerFechaHoy();
    const requests = this.asistenciaService.generarRequestsPresentes(this.estudiantes, fecha);

    this.asistenciaService.marcarAsistenciaMultiple(requests).subscribe({
      next: () => {
        this.loadAsistencias();
      },
      error: (error) => {
        console.error('Error marcando asistencias:', error);
        this.cargando = false;
      }
    });
  }

  sincronizar() {
    this.loadAsistencias();
  }

  getSelectedMonthName(): string {
    return this.months.find(m => m.value === this.selectedMonth)?.name || '';
  }

  getDayName(dia: number): string {
    const fecha = new Date(this.selectedYear, this.selectedMonth - 1, dia);
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dias[fecha.getDay()];
  }
}
