import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { EstudianteService, AntecedentesFamiliares, EstudianteCompleto } from '../../../services/estudiante.service';

@Component({
  selector: 'app-antecedentes-familiares',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './antecedentes-familiares.component.html',
  styleUrl: './antecedentes-familiares.component.css'
})
export class AntecedentesFamiliaresComponent implements OnInit {

  familiares: AntecedentesFamiliares[] = [];
  familiarActual: AntecedentesFamiliares = this.inicializarFamiliar();
  editandoIndex: number = -1;

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
    if (datosExistentes.familiares && datosExistentes.familiares.length > 0) {
      this.familiares = [...datosExistentes.familiares];
    }

    // Cargar período de matrícula de los datos personales
    if (datosExistentes.personal?.periodoMatricula) {
      this.periodoMatricula = datosExistentes.personal.periodoMatricula;
    }
  }

  inicializarFamiliar(): AntecedentesFamiliares {
    return {
      tipoDocumento: '',
      numeroDocumento: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      nombres: '',
      estadoCivil: '',
      vinculoFamiliar: '',
      tipoApoderado: '',
      edad: undefined,
      direccion: '',
      comuna: '',
      email: '',
      telefonoCelular: '',
      telefonoFijo: '',
      nivelEducacional: '',
      ocupacion: '',
      esTutor: ''
    };
  }

  validarFamiliar(): boolean {
    this.errores = [];

    // Validaciones obligatorias
    if (!this.familiarActual.tipoDocumento) {
      this.errores.push('Tipo de documento es requerido');
    }

    if (!this.familiarActual.numeroDocumento) {
      this.errores.push('Número de documento es requerido');
    }

    if (!this.familiarActual.apellidoPaterno) {
      this.errores.push('Apellido paterno es requerido');
    }

    if (!this.familiarActual.nombres) {
      this.errores.push('Nombres son requeridos');
    }

    if (!this.familiarActual.vinculoFamiliar) {
      this.errores.push('Vínculo familiar es requerido');
    }

    if (!this.familiarActual.tipoApoderado) {
      this.errores.push('Tipo de apoderado es requerido');
    }

    // Validar RUN si es tipo RUN
    if (this.familiarActual.tipoDocumento === 'RUN' && this.familiarActual.numeroDocumento) {
      if (!this.estudianteService.validarRun(this.familiarActual.numeroDocumento)) {
        this.errores.push('RUN inválido');
      }
    }

    // Validar email si se proporciona
    if (this.familiarActual.email && !this.estudianteService.validarEmail(this.familiarActual.email)) {
      this.errores.push('Email inválido');
    }

    // Validar teléfonos si se proporcionan
    if (this.familiarActual.telefonoCelular && !this.estudianteService.validarTelefono(this.familiarActual.telefonoCelular)) {
      this.errores.push('Teléfono celular inválido');
    }

    if (this.familiarActual.telefonoFijo && !this.estudianteService.validarTelefono(this.familiarActual.telefonoFijo)) {
      this.errores.push('Teléfono fijo inválido');
    }

    // Validar edad si se proporciona
    if (this.familiarActual.edad && (this.familiarActual.edad < 18 || this.familiarActual.edad > 120)) {
      this.errores.push('La edad debe estar entre 18 y 120 años');
    }

    // Validar que no existe otro familiar con el mismo documento
    const existeDocumento = this.familiares.some((f, index) =>
      f.numeroDocumento === this.familiarActual.numeroDocumento &&
      index !== this.editandoIndex
    );

    if (existeDocumento) {
      this.errores.push('Ya existe un familiar con este número de documento');
    }

    return this.errores.length === 0;
  }

  agregarFamiliar(): void {
    if (!this.validarFamiliar()) {
      return;
    }

    if (this.editandoIndex >= 0) {
      // Actualizar familiar existente
      this.familiares[this.editandoIndex] = { ...this.familiarActual };
      this.editandoIndex = -1;
      this.mensajeExito = 'Familiar actualizado correctamente';
    } else {
      // Agregar nuevo familiar
      this.familiares.push({ ...this.familiarActual });
      this.mensajeExito = 'Familiar agregado correctamente';
    }

    // Limpiar formulario
    this.familiarActual = this.inicializarFamiliar();
    this.errores = [];

    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      this.mensajeExito = '';
    }, 3000);
  }

  editarFamiliar(index: number): void {
    this.familiarActual = { ...this.familiares[index] };
    this.editandoIndex = index;
    this.errores = [];
    this.mensajeExito = '';
  }

  eliminarFamiliar(index: number): void {
    if (confirm('¿Está seguro de que desea eliminar este familiar?')) {
      this.familiares.splice(index, 1);
      this.mensajeExito = 'Familiar eliminado correctamente';

      // Si estaba editando este familiar, cancelar la edición
      if (this.editandoIndex === index) {
        this.cancelarEdicion();
      } else if (this.editandoIndex > index) {
        this.editandoIndex--;
      }

      setTimeout(() => {
        this.mensajeExito = '';
      }, 3000);
    }
  }

  cancelarEdicion(): void {
    this.familiarActual = this.inicializarFamiliar();
    this.editandoIndex = -1;
    this.errores = [];
  }

  validarFormularioCompleto(): boolean {
    this.errores = [];

    if (this.familiares.length === 0) {
      this.errores.push('Debe agregar al menos un familiar');
      return false;
    }

    // Validar que al menos un familiar sea apoderado
    const tieneApoderado = this.familiares.some(f =>
      f.tipoApoderado === 'Padre' || f.tipoApoderado === 'Madre' || f.tipoApoderado === 'Tutor'
    );

    if (!tieneApoderado) {
      this.errores.push('Al menos un familiar debe ser apoderado (Padre, Madre o Tutor)');
      return false;
    }

    return true;
  }

  async guardarYMatricular(): Promise<void> {
    // Validar que se hayan completado todos los pasos
    if (!this.validarFormularioCompleto()) {
      return;
    }

    this.cargando = true;
    this.mensajeExito = '';

    try {
      // Actualizar los datos de familiares en el servicio
      this.estudianteService.updateFamiliaresData(this.familiares);

      // Validar que todos los datos estén completos
      const validacion = this.estudianteService.validarFormularioCompleto();
      if (!validacion.valido) {
        this.errores = validacion.errores;
        this.cargando = false;
        return;
      }

      // Obtener todos los datos
      const datosCompletos = this.estudianteService.getCurrentData();

      // Preparar el objeto para enviar al backend
      const estudianteCompleto: EstudianteCompleto = {
        personal: datosCompletos.personal!,
        apoderado: datosCompletos.apoderado!,
        salud: datosCompletos.salud!,
        escolares: datosCompletos.escolares!,
        familiares: this.familiares
      };

      // Enviar al backend
      const response = await this.estudianteService.crearEstudianteCompleto(estudianteCompleto).toPromise();

      this.mensajeExito = 'Estudiante matriculado exitosamente';

      // Limpiar datos del servicio
      this.estudianteService.clearData();

      // Navegar a la lista de matrículas después de un breve delay
      setTimeout(() => {
        this.router.navigate(['/matricula-home']);
      }, 2000);

    } catch (error: any) {
      console.error('Error al matricular estudiante:', error);

      if (error.status === 400) {
        this.errores.push('Error de validación: ' + (error.error?.message || 'Datos inválidos'));
      } else if (error.status === 409) {
        this.errores.push('Ya existe un estudiante con este RUN');
      } else {
        this.errores.push('Error al guardar los datos. Intente nuevamente.');
      }
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
    this.estudianteService.updateFamiliaresData(this.familiares);
    this.router.navigate(['/matricula/antecedentes-salud']);
  }

  // Método para actualizar el período de matrícula
  onPeriodoChange(): void {
    const datosActuales = this.estudianteService.getCurrentData();
    if (datosActuales.personal) {
      datosActuales.personal.periodoMatricula = this.periodoMatricula;
      this.estudianteService.updatePersonalData(datosActuales.personal);
    }
  }

  // Método para obtener el texto del botón de acción
  getTextoBotonAccion(): string {
    return this.editandoIndex >= 0 ? 'Actualizar Familiar' : 'Agregar Familiar';
  }

  // Método para verificar si hay cambios pendientes
  hayCambiosPendientes(): boolean {
    return this.familiarActual.tipoDocumento !== '' ||
           this.familiarActual.numeroDocumento !== '' ||
           this.familiarActual.apellidoPaterno !== '' ||
           this.familiarActual.nombres !== '' ||
           this.editandoIndex >= 0;
  }
}
