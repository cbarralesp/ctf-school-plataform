import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { EstudianteService, ApoderadoContacto } from '../../../services/estudiante.service';

@Component({
  selector: 'app-antecedentes-apoderado',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './antecedentes-apoderado.component.html',
  styleUrl: './antecedentes-apoderado.component.css'
})
export class AntecedentesApoderadoComponent implements OnInit {

  apoderadoContacto: ApoderadoContacto = {
    runApoderado: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    nombres: '',
    relacionEstudiante: '',
    ocupacion: '',
    telefonoCelular: '',
    telefonoFijo: '',
    email: '',
    direccion: '',
    comuna: '',
    nivelEducacional: ''
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
    if (datosExistentes.apoderado) {
      this.apoderadoContacto = { ...datosExistentes.apoderado };
    }

    // Cargar período de matrícula de los datos personales
    if (datosExistentes.personal?.periodoMatricula) {
      this.periodoMatricula = datosExistentes.personal.periodoMatricula;
    }
  }

  validarFormulario(): boolean {
    this.errores = [];

    // Validaciones obligatorias
    if (!this.apoderadoContacto.runApoderado) {
      this.errores.push('RUN del apoderado es requerido');
    } else if (!this.estudianteService.validarRun(this.apoderadoContacto.runApoderado)) {
      this.errores.push('RUN del apoderado no es válido');
    }

    if (!this.apoderadoContacto.apellidoPaterno) {
      this.errores.push('Apellido paterno es requerido');
    }

    if (!this.apoderadoContacto.nombres) {
      this.errores.push('Nombres son requeridos');
    }

    if (!this.apoderadoContacto.telefonoCelular) {
      this.errores.push('Teléfono celular es requerido');
    } else if (!this.estudianteService.validarTelefono(this.apoderadoContacto.telefonoCelular)) {
      this.errores.push('Teléfono celular no es válido (debe tener 8 o 9 dígitos)');
    }

    if (!this.apoderadoContacto.email) {
      this.errores.push('Email es requerido');
    } else if (!this.estudianteService.validarEmail(this.apoderadoContacto.email)) {
      this.errores.push('Email no es válido');
    }

    // Validaciones opcionales con formato
    if (this.apoderadoContacto.telefonoFijo && !this.estudianteService.validarTelefono(this.apoderadoContacto.telefonoFijo)) {
      this.errores.push('Teléfono fijo no es válido (debe tener 8 o 9 dígitos)');
    }

    // Validar longitud de campos
    if (this.apoderadoContacto.nombres && this.apoderadoContacto.nombres.length < 2) {
      this.errores.push('Nombres debe tener al menos 2 caracteres');
    }

    if (this.apoderadoContacto.apellidoPaterno && this.apoderadoContacto.apellidoPaterno.length < 2) {
      this.errores.push('Apellido paterno debe tener al menos 2 caracteres');
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
      // Limpiar y formatear datos antes de guardar
      this.limpiarDatos();

      // Actualizar los datos en el servicio
      this.estudianteService.updateApoderadoData(this.apoderadoContacto);

      this.mensajeExito = 'Datos del apoderado guardados correctamente';

      // Navegar al siguiente paso después de mostrar el mensaje
      setTimeout(() => {
        this.router.navigate(['/matricula/antecedentes-escolares']);
      }, 1000);

    } catch (error) {
      console.error('Error al guardar datos del apoderado:', error);
      this.errores.push('Error al guardar los datos del apoderado');
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
    this.estudianteService.updateApoderadoData(this.apoderadoContacto);
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

  // Método para limpiar y formatear datos
  private limpiarDatos(): void {
    // Limpiar RUN (remover puntos, guiones y espacios)
    this.apoderadoContacto.runApoderado = this.apoderadoContacto.runApoderado
      .replace(/\./g, '')
      .replace(/-/g, '')
      .replace(/\s/g, '')
      .toUpperCase();

    // Formatear nombres y apellidos (primera letra mayúscula)
    this.apoderadoContacto.nombres = this.formatearNombre(this.apoderadoContacto.nombres);
    this.apoderadoContacto.apellidoPaterno = this.formatearNombre(this.apoderadoContacto.apellidoPaterno);

    if (this.apoderadoContacto.apellidoMaterno) {
      this.apoderadoContacto.apellidoMaterno = this.formatearNombre(this.apoderadoContacto.apellidoMaterno);
    }

    // Limpiar teléfonos (solo números)
    this.apoderadoContacto.telefonoCelular = this.apoderadoContacto.telefonoCelular.replace(/\D/g, '');

    if (this.apoderadoContacto.telefonoFijo) {
      this.apoderadoContacto.telefonoFijo = this.apoderadoContacto.telefonoFijo.replace(/\D/g, '');
    }

    // Formatear email a minúsculas
    this.apoderadoContacto.email = this.apoderadoContacto.email.toLowerCase().trim();

    // Limpiar campos de texto
    if (this.apoderadoContacto.ocupacion) {
      this.apoderadoContacto.ocupacion = this.apoderadoContacto.ocupacion.trim();
    }

    if (this.apoderadoContacto.direccion) {
      this.apoderadoContacto.direccion = this.apoderadoContacto.direccion.trim();
    }
  }

  // Método auxiliar para formatear nombres
  private formatearNombre(nombre: string): string {
    if (!nombre) return '';

    return nombre.trim()
      .toLowerCase()
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }

  // Método para validar RUN en tiempo real
  validarRun(run: string): void {
    if (run && !this.estudianteService.validarRun(run)) {
      // Podrías mostrar un mensaje de error en tiempo real aquí
      console.log('RUN inválido:', run);
    }
  }

  // Método para validar email en tiempo real
  validarEmail(email: string): void {
    if (email && !this.estudianteService.validarEmail(email)) {
      // Podrías mostrar un mensaje de error en tiempo real aquí
      console.log('Email inválido:', email);
    }
  }

  // Método para validar teléfono en tiempo real
  validarTelefono(telefono: string, tipo: 'celular' | 'fijo'): void {
    if (telefono && !this.estudianteService.validarTelefono(telefono)) {
      console.log(`Teléfono ${tipo} inválido:`, telefono);
    }
  }

  // Método para auto-completar datos si el RUN ya existe
  async buscarApoderadoPorRun(): Promise<void> {
    if (!this.apoderadoContacto.runApoderado || !this.estudianteService.validarRun(this.apoderadoContacto.runApoderado)) {
      return;
    }

    try {
      // Aquí podrías implementar una búsqueda en el backend para verificar
      // si el apoderado ya existe y autocompletar los datos
      console.log('Buscando apoderado con RUN:', this.apoderadoContacto.runApoderado);

      // Ejemplo de implementación futura:
      // const apoderadoExistente = await this.estudianteService.buscarApoderadoPorRun(this.apoderadoContacto.runApoderado);
      // if (apoderadoExistente) {
      //   this.apoderadoContacto = { ...apoderadoExistente };
      //   this.mensajeExito = 'Datos del apoderado encontrados y cargados automáticamente';
      // }
    } catch (error) {
      console.error('Error al buscar apoderado:', error);
    }
  }
}
