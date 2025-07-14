import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { EstudianteService, EstudiantePersonal } from '../../../services/estudiante.service';

@Component({
  selector: 'app-registro-estudiante',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './registro-estudiante.component.html',
  styleUrl: './registro-estudiante.component.css'
})
export class RegistroEstudianteComponent implements OnInit {

  estudiantePersonal: EstudiantePersonal = {
    run: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    nombres: '',
    fechaNacimiento: '',
    genero: '',
    nacionalidad: '',
    ciudadNacimiento: '',
    viveCon: '',
    direccion: '',
    comuna: '',
    etnia: '',
    telefonoCelular: '',
    telefonoFijo: '',
    email: '',
    periodoMatricula: '2025'
  };

  runFormateado: string = '';
  errores: string[] = [];
  cargando = false;
  mensajeExito = '';
  runValido = false;

  constructor(
    private estudianteService: EstudianteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar datos existentes si los hay
    const datosExistentes = this.estudianteService.getCurrentData();
    if (datosExistentes.personal) {
      this.estudiantePersonal = { ...datosExistentes.personal };
      // Formatear el RUN si existe
      if (this.estudiantePersonal.run) {
        this.runFormateado = this.formatearRun(this.estudiantePersonal.run);
      }
    }
  }

  // Método para formatear RUN agregando puntos y guión
  formatearRun(run: string): string {
    if (!run) return '';

    // Remover caracteres no válidos
    const runLimpio = run.replace(/[^0-9K]/g, '');

    if (runLimpio.length < 2) return runLimpio;

    // Separar números y dígito verificador
    const numeros = runLimpio.slice(0, -1);
    const dv = runLimpio.slice(-1);

    // Formatear números con puntos
    let numerosFormateados = '';
    for (let i = 0; i < numeros.length; i++) {
      if (i > 0 && (numeros.length - i) % 3 === 0) {
        numerosFormateados += '.';
      }
      numerosFormateados += numeros[i];
    }

    return numerosFormateados + '-' + dv;
  }

  // Método para limpiar el RUN (remover puntos y guión)
  limpiarRun(run: string): string {
    return run.replace(/[^0-9K]/g, '');
  }

  validarRun(): void {
    if (this.runFormateado) {
      // Limpiar el RUN para validación
      const runLimpio = this.limpiarRun(this.runFormateado);
      this.estudiantePersonal.run = runLimpio;

      this.runValido = this.estudianteService.validarRun(runLimpio);

      if (!this.runValido) {
        this.errores = this.errores.filter(error => !error.includes('RUN'));
        this.errores.push('RUN inválido');
      } else {
        this.errores = this.errores.filter(error => !error.includes('RUN'));
      }
    }
  }

  validarFormulario(): boolean {
    this.errores = [];

    // Validaciones obligatorias
    if (!this.estudiantePersonal.run) {
      this.errores.push('RUN es requerido');
    } else if (!this.estudianteService.validarRun(this.estudiantePersonal.run)) {
      this.errores.push('RUN inválido');
    }

    if (!this.estudiantePersonal.apellidoPaterno) {
      this.errores.push('Apellido paterno es requerido');
    }

    if (!this.estudiantePersonal.nombres) {
      this.errores.push('Nombres son requeridos');
    }

    if (!this.estudiantePersonal.fechaNacimiento) {
      this.errores.push('Fecha de nacimiento es requerida');
    } else {
      // Validar que la fecha no sea futura
      const fechaNacimiento = new Date(this.estudiantePersonal.fechaNacimiento);
      const hoy = new Date();
      if (fechaNacimiento > hoy) {
        this.errores.push('La fecha de nacimiento no puede ser futura');
      }

      // Validar que la persona no sea menor de 3 años ni mayor de 20 años
      const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      if (edad < 3 || edad > 20) {
        this.errores.push('La edad debe estar entre 3 y 20 años');
      }
    }

    // Validaciones opcionales con formato
    if (this.estudiantePersonal.email && !this.estudianteService.validarEmail(this.estudiantePersonal.email)) {
      this.errores.push('Email inválido');
    }

    if (this.estudiantePersonal.telefonoCelular && !this.estudianteService.validarTelefono(this.estudiantePersonal.telefonoCelular)) {
      this.errores.push('Teléfono celular inválido (debe tener 8 o 9 dígitos)');
    }

    if (this.estudiantePersonal.telefonoFijo && !this.estudianteService.validarTelefono(this.estudiantePersonal.telefonoFijo)) {
      this.errores.push('Teléfono fijo inválido (debe tener 8 o 9 dígitos)');
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
      this.estudianteService.updatePersonalData(this.estudiantePersonal);

      this.mensajeExito = 'Datos personales guardados correctamente';

      // Navegar al siguiente paso después de mostrar el mensaje
      setTimeout(() => {
        this.router.navigate(['/matricula/antecedentes-apoderado']);
      }, 1000);

    } catch (error) {
      console.error('Error al guardar datos personales:', error);
      this.errores.push('Error al guardar los datos personales');
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

  // Método para actualizar el período de matrícula
  onPeriodoChange(): void {
    // Los datos ya están actualizados en el modelo, no necesitamos hacer nada adicional
    // El servicio se actualizará cuando guardemos
  }

  // Método para validar en tiempo real
  onInputChange(): void {
    // Limpiar errores cuando el usuario empiece a escribir
    this.errores = [];
  }

  // Método para formatear el RUN mientras se escribe
  onRunInput(event: any): void {
    let value = event.target.value.toUpperCase();

    // Remover caracteres no válidos
    value = value.replace(/[^0-9K]/g, '');

    // Limitar a 9 caracteres (sin formato)
    if (value.length > 9) {
      value = value.substring(0, 9);
    }

    // Actualizar el RUN limpio en el modelo
    this.estudiantePersonal.run = value;

    // Formatear para mostrar
    this.runFormateado = this.formatearRun(value);

    // Actualizar el input con el valor formateado
    event.target.value = this.runFormateado;
  }

  // Método para formatear teléfonos
  onTelefonoInput(event: any, campo: 'telefonoCelular' | 'telefonoFijo'): void {
    let value = event.target.value.replace(/[^0-9]/g, '');

    if (value.length > 9) {
      value = value.substring(0, 9);
    }

    this.estudiantePersonal[campo] = value;
    event.target.value = value;
  }

  // Método para capitalizar nombres
  onNombreInput(event: any, campo: 'nombres' | 'apellidoPaterno' | 'apellidoMaterno'): void {
    let value = event.target.value;

    // Capitalizar cada palabra
    value = value.toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase());

    this.estudiantePersonal[campo] = value;
    event.target.value = value;
  }
}
