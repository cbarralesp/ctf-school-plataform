import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { EstudianteService, AntecedentesSalud } from '../../../services/estudiante.service';

@Component({
  selector: 'app-antecedentes-salud',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './antecedentes-salud.component.html',
  styleUrl: './antecedentes-salud.component.css'
})
export class AntecedentesSaludComponent implements OnInit {

  antecedentesSalud: AntecedentesSalud = {
    estatura: '',
    peso: '',
    grupoSanguineo: '',
    alergiasAlimentos: '',
    alergiasMedicamentos: '',
    medicamentosContraindicados: '',
    enfermedadesCronicas: '',
    aptoEducacionFisica: '',
    sistemaProvision: '',
    seguroEscolarPrivado: '',
    consultorioClinica: '',
    observaciones: ''
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
    if (datosExistentes.salud) {
      this.antecedentesSalud = { ...datosExistentes.salud };
    }

    // Cargar período de matrícula de los datos personales
    if (datosExistentes.personal?.periodoMatricula) {
      this.periodoMatricula = datosExistentes.personal.periodoMatricula;
    }
  }

  validarFormulario(): boolean {
    this.errores = [];

    // Validaciones opcionales pero lógicas
    if (this.antecedentesSalud.estatura) {
      const estatura = parseFloat(this.antecedentesSalud.estatura);
      if (isNaN(estatura) || estatura <= 0 || estatura > 300) {
        this.errores.push('La estatura debe ser un número válido entre 1 y 300 cm');
      }
    }

    if (this.antecedentesSalud.peso) {
      const peso = parseFloat(this.antecedentesSalud.peso);
      if (isNaN(peso) || peso <= 0 || peso > 500) {
        this.errores.push('El peso debe ser un número válido entre 1 y 500 kg');
      }
    }

    // Validar que si tiene alergias/contraindicaciones, al menos especifique el sistema de previsión
    if ((this.antecedentesSalud.alergiasAlimentos ||
         this.antecedentesSalud.alergiasMedicamentos ||
         this.antecedentesSalud.medicamentosContraindicados ||
         this.antecedentesSalud.enfermedadesCronicas === 'Otra') &&
        !this.antecedentesSalud.sistemaProvision) {
      this.errores.push('Es recomendable especificar el sistema de previsión cuando hay condiciones médicas especiales');
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
      this.estudianteService.updateSaludData(this.antecedentesSalud);

      this.mensajeExito = 'Antecedentes de salud guardados correctamente';

      // Navegar al siguiente paso después de mostrar el mensaje
      setTimeout(() => {
        this.router.navigate(['/matricula/antecedentes-familiares']);
      }, 1000);

    } catch (error) {
      console.error('Error al guardar antecedentes de salud:', error);
      this.errores.push('Error al guardar los antecedentes de salud');
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
    this.estudianteService.updateSaludData(this.antecedentesSalud);
    this.router.navigate(['/matricula/antecedentes-escolares']);
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
