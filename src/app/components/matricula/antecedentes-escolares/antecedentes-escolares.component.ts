import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { EstudianteService, AntecedentesEscolares } from '../../../services/estudiante.service';

@Component({
  selector: 'app-antecedentes-escolares',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './antecedentes-escolares.component.html',
  styleUrl: './antecedentes-escolares.component.css'
})
export class AntecedentesEscolaresComponent implements OnInit {

  antecedentesEscolares: AntecedentesEscolares = {
    nivelEnsenanza: '',
    curso2024: '',
    fechaMatricula: '',
    numeroMatricula: '',
    colegioProcedencia: '',
    condicion: ''
  };

  periodoMatricula: string = '2024';
  errores: string[] = [];
  cargando = false;
  mensajeExito = '';

  constructor(
    private estudianteService: EstudianteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar datos existentes si los hay
    const datosExistentes = this.estudianteService.getCurrentData();
    if (datosExistentes.escolares) {
      this.antecedentesEscolares = { ...datosExistentes.escolares };
    }

    // Cargar período de matrícula de los datos personales
    if (datosExistentes.personal?.periodoMatricula) {
      this.periodoMatricula = datosExistentes.personal.periodoMatricula;
    }
  }

  validarFormulario(): boolean {
    this.errores = [];

    // Validaciones obligatorias
    if (!this.antecedentesEscolares.nivelEnsenanza) {
      this.errores.push('Nivel de enseñanza es requerido');
    }

    if (!this.antecedentesEscolares.curso2024) {
      this.errores.push('Curso 2024 es requerido');
    }

    if (!this.antecedentesEscolares.fechaMatricula) {
      this.errores.push('Fecha de matrícula es requerida');
    } else {
      // Validar que la fecha no sea futura
      const fechaMatricula = new Date(this.antecedentesEscolares.fechaMatricula);
      const hoy = new Date();
      if (fechaMatricula > hoy) {
        this.errores.push('La fecha de matrícula no puede ser futura');
      }
    }

    return this.errores.length === 0;
  }

  guardarYContinuar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.cargando = true;
    this.mensajeExito = '';

    try {
      // Actualizar los datos en el servicio
      this.estudianteService.updateEscolaresData(this.antecedentesEscolares);

      this.mensajeExito = 'Antecedentes escolares guardados correctamente';

      // Navegar al siguiente paso después de mostrar el mensaje
      setTimeout(() => {
        this.router.navigate(['/matricula/antecedentes-salud']);
      }, 1000);

    } catch (error) {
      console.error('Error al guardar antecedentes escolares:', error);
      this.errores.push('Error al guardar los antecedentes escolares');
    } finally {
      this.cargando = false;
    }
  }

  cancelar(): void {
    if (confirm('¿Está seguro de que desea cancelar? Se perderán todos los datos ingresados.')) {
      this.estudianteService.clearData();
      this.router.navigate(['/matriculas']);
    }
  }

  goBack(): void {
    // Guardar datos actuales antes de navegar hacia atrás
    this.estudianteService.updateEscolaresData(this.antecedentesEscolares);
    this.router.navigate(['/matricula/registro-estudiante']);
  }

  // Método para actualizar el período de matrícula
  onPeriodoChange(): void {
    const datosActuales = this.estudianteService.getCurrentData();
    if (datosActuales.personal) {
      datosActuales.personal.periodoMatricula = this.periodoMatricula;
      this.estudianteService.updatePersonalData(datosActuales.personal);
    }
  }
}
