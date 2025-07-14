import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../header/header.component';
import { AsistenciaService, EstudianteConAsistencia, AsistenciaRequest } from '../../../services/asistencia.service';

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

  // Propiedades para el componente
  estudiantes: EstudianteConAsistencia[] = [];
  diasDelMes: number[] = [];
  cargando: boolean = false;

  // Configuración de meses
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

  // Nombres de días en español
  private diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  /**
   * Carga los datos iniciales del componente
   */
  private cargarDatosIniciales(): void {
    this.generarDiasDelMes();
    this.cargarEstudiantesConAsistencias();
  }

  /**
   * Genera los días del mes seleccionado
   */
  private generarDiasDelMes(): void {
    const diasEnMes = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
    this.diasDelMes = Array.from({ length: diasEnMes }, (_, i) => i + 1);
  }

  /**
   * Obtiene el nombre del día de la semana para una fecha específica
   */
  getDayName(dia: number): string {
    const fecha = new Date(this.selectedYear, this.selectedMonth - 1, dia);
    return this.diasSemana[fecha.getDay()];
  }

  /**
   * Maneja el cambio de mes
   */
  onMonthChange(): void {
    this.generarDiasDelMes();
    this.cargarEstudiantesConAsistencias();
  }

  /**
   * Carga los estudiantes con sus asistencias para el mes seleccionado
   */
  private cargarEstudiantesConAsistencias(): void {
    this.cargando = true;
    this.asistenciaService.obtenerEstudiantesConAsistencias(this.selectedMonth, this.selectedYear)
      .subscribe({
        next: (estudiantes) => {
          this.estudiantes = estudiantes;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar estudiantes con asistencias:', error);
          this.cargando = false;
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      });
  }

  /**
   * Obtiene el estado de asistencia de un estudiante en un día específico
   */
  getEstadoAsistencia(estudianteId: number, dia: number): string {
    const estudiante = this.estudiantes.find(e => e.id === estudianteId);
    if (!estudiante) return '';

    const fecha = this.asistenciaService.generarFecha(this.selectedYear, this.selectedMonth, dia);
    return estudiante.asistencias[fecha] || '';
  }

  /**
   * Cambia el estado de asistencia de un estudiante
   */
  cambiarAsistencia(estudianteId: number, dia: number, estado: string): void {
    const fecha = this.asistenciaService.generarFecha(this.selectedYear, this.selectedMonth, dia);

    const request: AsistenciaRequest = {
      estudianteId,
      fecha,
      estado
    };

    this.asistenciaService.marcarAsistencia(request).subscribe({
      next: (response) => {
        // Actualizar el estado local
        const estudiante = this.estudiantes.find(e => e.id === estudianteId);
        if (estudiante) {
          estudiante.asistencias[fecha] = estado;
        }
        console.log('Asistencia marcada:', response);
      },
      error: (error) => {
        console.error('Error al marcar asistencia:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }

  /**
   * Sincroniza con el backend de estudiantes
   */
  sincronizar(): void {
    this.asistenciaService.verificarConectividadEstudiantes().subscribe({
      next: (response) => {
        console.log('Conectividad verificada:', response);
        this.cargarEstudiantesConAsistencias();
      },
      error: (error) => {
        console.error('Error de conectividad:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }

  /**
   * Marca todos los estudiantes como ausentes para el día actual
   */
  marcarTodosPresentes(): void {
    const fechaHoy = this.asistenciaService.obtenerFechaHoy();
    const hoy = new Date();

    // Verificar si la fecha actual está en el mes seleccionado
    if (hoy.getMonth() + 1 !== this.selectedMonth || hoy.getFullYear() !== this.selectedYear) {
      console.warn('No se puede marcar asistencia para un mes diferente al actual');
      return;
    }

    // Crear requests para marcar todos como ausentes (según el botón dice "Marcar ausentes")
    const requests: AsistenciaRequest[] = this.estudiantes.map(estudiante => ({
      estudianteId: estudiante.id,
      fecha: fechaHoy,
      estado: 'A' // Ausente
    }));

    this.asistenciaService.marcarAsistenciaMultiple(requests).subscribe({
      next: (response) => {
        console.log('Asistencias múltiples marcadas:', response);
        // Actualizar el estado local
        this.estudiantes.forEach(estudiante => {
          estudiante.asistencias[fechaHoy] = 'A';
        });
      },
      error: (error) => {
        console.error('Error al marcar asistencias múltiples:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }

  /**
   * Método de utilidad para verificar si una fecha es fin de semana
   */
  private esFinDeSemana(dia: number): boolean {
    const fecha = new Date(this.selectedYear, this.selectedMonth - 1, dia);
    const diaSemana = fecha.getDay();
    return diaSemana === 0 || diaSemana === 6; // 0 = Domingo, 6 = Sábado
  }

  /**
   * Método de utilidad para obtener la clase CSS del día
   */
  getDayClass(dia: number): string {
    const clases = ['day-header'];
    if (this.esFinDeSemana(dia)) {
      clases.push('weekend');
    }
    return clases.join(' ');
  }
}
