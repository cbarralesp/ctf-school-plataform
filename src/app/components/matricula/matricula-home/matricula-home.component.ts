import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { FormsModule } from '@angular/forms';
import { EstudianteService, EstudianteCompleto } from '../../../services/estudiante.service';

// Interface para los datos que se muestran en la tabla
interface EstudianteTabla {
  id: number;
  numeroMatricula: string;
  run: string;
  nombreCompleto: string;
  curso: string;
  nivelEnsenanza: string;
  estado: string;
  genero: string;
}

@Component({
  selector: 'app-matricula-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './matricula-home.component.html',
  styleUrl: './matricula-home.component.css'
})
export class MatriculaHomeComponent implements OnInit {
  // Propiedades para los datos
  estudiantes: EstudianteTabla[] = [];
  estudiantesFiltrados: EstudianteTabla[] = [];
  loading: boolean = false;
  error: string = '';

  // Propiedades para filtros
  filtros = {
    anio: '2024',
    curso: 'todos',
    busqueda: ''
  };

  // Propiedades para estadísticas
  estadisticas = {
    totalMatriculados: 0,
    totalHombres: 0,
    totalMujeres: 0,
    totalSinDefinir: 0
  };

  // Opciones para los selectores
  aniosDisponibles = ['2024', '2023', '2022'];

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  /**
   * Carga todos los estudiantes desde el servicio
   */
  cargarEstudiantes(): void {
    this.loading = true;
    this.error = '';

    this.estudianteService.listarEstudiantesCompletos().subscribe({
      next: (estudiantesCompletos) => {
        this.procesarEstudiantes(estudiantesCompletos);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estudiantes:', error);
        this.error = 'Error al cargar los estudiantes';
        this.loading = false;
      }
    });
  }

  /**
   * Procesa la lista de estudiantes completos y los convierte al formato de tabla
   */
  private procesarEstudiantes(estudiantesCompletos: EstudianteCompleto[]): void {
    this.estudiantes = estudiantesCompletos.map(estudiante => ({
      id: estudiante.personal.id || 0,
      numeroMatricula: estudiante.escolares.numeroMatricula || 'N/A',
      run: estudiante.personal.run,
      nombreCompleto: `${estudiante.personal.nombres} ${estudiante.personal.apellidoPaterno} ${estudiante.personal.apellidoMaterno || ''}`.trim(),
      curso: estudiante.escolares.curso2024,
      nivelEnsenanza: estudiante.escolares.nivelEnsenanza,
      estado: estudiante.escolares.condicion || 'Regular',
      genero: estudiante.personal.genero || 'No definido'
    }));

    this.aplicarFiltros();
    this.calcularEstadisticas();
  }

  /**
   * Aplica los filtros seleccionados a la lista de estudiantes
   */
  aplicarFiltros(): void {
    this.estudiantesFiltrados = this.estudiantes.filter(estudiante => {
      // Filtro por año (basado en el período de matrícula)
      const cumpleAnio = this.filtros.anio === '2024' || true; // Por ahora todos son 2024

      // Filtro por curso
      const cumpleCurso = this.filtros.curso === 'todos' || estudiante.curso === this.filtros.curso;

      // Filtro por búsqueda (nombre o RUN)
      const cumpleBusqueda = this.filtros.busqueda === '' ||
        estudiante.nombreCompleto.toLowerCase().includes(this.filtros.busqueda.toLowerCase()) ||
        estudiante.run.toLowerCase().includes(this.filtros.busqueda.toLowerCase());

      return cumpleAnio && cumpleCurso && cumpleBusqueda;
    });
  }

  /**
   * Calcula las estadísticas de los estudiantes
   */
  private calcularEstadisticas(): void {
    this.estadisticas.totalMatriculados = this.estudiantes.length;
    this.estadisticas.totalHombres = this.estudiantes.filter(e => e.genero === 'Masculino').length;
    this.estadisticas.totalMujeres = this.estudiantes.filter(e => e.genero === 'Femenino').length;
    this.estadisticas.totalSinDefinir = this.estudiantes.filter(e =>
      e.genero !== 'Masculino' && e.genero !== 'Femenino'
    ).length;
  }

  /**
   * Maneja el cambio en el filtro de año
   */
  onAnioChange(): void {
    this.aplicarFiltros();
  }

  /**
   * Maneja el cambio en el filtro de curso
   */
  onCursoChange(): void {
    this.aplicarFiltros();
  }

  /**
   * Maneja el cambio en el campo de búsqueda
   */
  onBusquedaChange(): void {
    this.aplicarFiltros();
  }

  /**
   * Actualiza la lista de estudiantes
   */
  actualizarLista(): void {
    this.cargarEstudiantes();
  }

  /**
   * Reintenta cargar los estudiantes en caso de error
   */
  reintentar(): void {
    this.cargarEstudiantes();
  }

  /**
   * Navega a la página de matricular nuevo estudiante
   */
  matricularEstudiante(): void {
    // Aquí puedes navegar a la página de matrícula
    // this.router.navigate(['/matricula/nuevo']);
    console.log('Navegar a matrícula de nuevo estudiante');
  }

  /**
   * Acciones para cada estudiante
   */
  verEstudiante(id: number): void {
    console.log('Ver estudiante:', id);
    // Implementar navegación a detalle del estudiante
  }

  editarEstudiante(id: number): void {
    console.log('Editar estudiante:', id);
    // Implementar navegación a edición del estudiante
  }

  eliminarEstudiante(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este estudiante?')) {
      this.estudianteService.eliminarEstudiante(id).subscribe({
        next: () => {
          console.log('Estudiante eliminado exitosamente');
          this.cargarEstudiantes(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar estudiante:', error);
          alert('Error al eliminar el estudiante');
        }
      });
    }
  }

  /**
   * Getters para usar en el template
   */
  get hayEstudiantes(): boolean {
    return this.estudiantesFiltrados.length > 0;
  }

  get textoResultados(): string {
    return `Mostrando ${this.estudiantesFiltrados.length} de ${this.estudiantes.length} estudiantes`;
  }

  get cursosUnicos(): string[] {
    const cursos = [...new Set(this.estudiantes.map(e => e.curso))];
    return ['todos', ...cursos];
  }
}
