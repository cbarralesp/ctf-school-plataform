// src/app/services/estudiante.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

// Interfaces para los datos (coinciden con las entidades Java)
export interface EstudiantePersonal {
  id?: number;
  run: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  nombres: string;
  fechaNacimiento: string;
  genero?: string;
  nacionalidad?: string;
  ciudadNacimiento?: string;
  viveCon?: string;
  direccion?: string;
  comuna?: string;
  etnia?: string;
  telefonoCelular?: string;
  telefonoFijo?: string;
  email?: string;
  periodoMatricula: string;
}

export interface ApoderadoContacto {
  id?: number;
  estudianteId?: number;
  runApoderado: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  nombres: string;
  relacionEstudiante?: string;
  ocupacion?: string;
  telefonoCelular: string;
  telefonoFijo?: string;
  email: string;
  direccion?: string;
  comuna?: string;
  nivelEducacional?: string;
}

export interface AntecedentesSalud {
  id?: number;
  estudianteId?: number;
  estatura?: string;
  peso?: string;
  grupoSanguineo?: string;
  alergiasAlimentos?: string;
  alergiasMedicamentos?: string;
  medicamentosContraindicados?: string;
  enfermedadesCronicas?: string;
  aptoEducacionFisica?: string;
  sistemaProvision?: string;
  seguroEscolarPrivado?: string;
  consultorioClinica?: string;
  observaciones?: string;
}

export interface AntecedentesEscolares {
  id?: number;
  estudianteId?: number;
  nivelEnsenanza: string;
  curso2024: string;
  fechaMatricula: string;
  numeroMatricula?: string;
  colegioProcedencia?: string;
  condicion?: string;
}

export interface AntecedentesFamiliares {
  id?: number;
  estudianteId?: number;
  tipoDocumento: string;
  numeroDocumento: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  nombres: string;
  estadoCivil?: string;
  vinculoFamiliar: string;
  tipoApoderado: string;
  edad?: number;
  direccion?: string;
  comuna?: string;
  email?: string;
  telefonoCelular?: string;
  telefonoFijo?: string;
  nivelEducacional?: string;
  ocupacion?: string;
  esTutor?: string;
}

export interface EstudianteCompleto {
  personal: EstudiantePersonal;
  apoderado: ApoderadoContacto;
  salud: AntecedentesSalud;
  escolares: AntecedentesEscolares;
  familiares: AntecedentesFamiliares[];
}

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private readonly API_URL = 'http://localhost:8081/api/estudiantes';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Subject para manejar el estado del formulario
  private estudianteData = new BehaviorSubject<Partial<EstudianteCompleto>>({});
  public estudianteData$ = this.estudianteData.asObservable();

  constructor(private http: HttpClient) {}

  // Métodos para manejar el estado local del formulario
  updatePersonalData(data: EstudiantePersonal): void {
    const current = this.estudianteData.value;
    this.estudianteData.next({ ...current, personal: data });
  }

  updateApoderadoData(data: ApoderadoContacto): void {
    const current = this.estudianteData.value;
    this.estudianteData.next({ ...current, apoderado: data });
  }

  updateSaludData(data: AntecedentesSalud): void {
    const current = this.estudianteData.value;
    this.estudianteData.next({ ...current, salud: data });
  }

  updateEscolaresData(data: AntecedentesEscolares): void {
    const current = this.estudianteData.value;
    this.estudianteData.next({ ...current, escolares: data });
  }

  updateFamiliaresData(data: AntecedentesFamiliares[]): void {
    const current = this.estudianteData.value;
    this.estudianteData.next({ ...current, familiares: data });
  }

  getCurrentData(): Partial<EstudianteCompleto> {
    return this.estudianteData.value;
  }

  clearData(): void {
    this.estudianteData.next({});
  }

  // Métodos para comunicarse con el backend
  crearEstudianteCompleto(estudianteCompleto: EstudianteCompleto): Observable<EstudianteCompleto> {
    return this.http.post<EstudianteCompleto>(`${this.API_URL}/completo`, estudianteCompleto, this.httpOptions);
  }

  actualizarEstudianteCompleto(id: number, estudianteCompleto: EstudianteCompleto): Observable<EstudianteCompleto> {
    return this.http.put<EstudianteCompleto>(`${this.API_URL}/completo/${id}`, estudianteCompleto, this.httpOptions);
  }

  obtenerEstudianteCompleto(id: number): Observable<EstudianteCompleto> {
    return this.http.get<EstudianteCompleto>(`${this.API_URL}/completo/${id}`);
  }

  obtenerEstudiantePorRun(run: string): Observable<EstudianteCompleto> {
    return this.http.get<EstudianteCompleto>(`${this.API_URL}/completo/run/${run}`);
  }

  listarEstudiantesCompletos(): Observable<EstudianteCompleto[]> {
    return this.http.get<EstudianteCompleto[]>(`${this.API_URL}/completo/todos`);
  }

 eliminarEstudiante(id: number): Observable<void> {
  return this.http.delete<void>(`${this.API_URL}/completo/${id}`);
}


  // Métodos de validación
  validarRun(run: string): boolean {
    if (!run) return false;

    const runLimpio = run.replace(/\./g, '').replace(/-/g, '');
    if (runLimpio.length < 2) return false;

    const cuerpo = runLimpio.slice(0, -1);
    const dv = runLimpio.slice(-1).toLowerCase();

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    const dvCalculado = resto < 2 ? resto.toString() : resto === 10 ? 'k' : (11 - resto).toString();

    return dv === dvCalculado;
  }

  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  validarTelefono(telefono: string): boolean {
    const regex = /^[0-9]{8,9}$/;
    return regex.test(telefono.replace(/\s/g, ''));
  }

  // Método para formatear fechas
  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
  }

  // Método para validar si el formulario completo es válido
  validarFormularioCompleto(): { valido: boolean; errores: string[] } {
    const data = this.getCurrentData();
    const errores: string[] = [];

    // Validar datos personales
    if (!data.personal) {
      errores.push('Los datos personales son requeridos');
    } else {
      if (!data.personal.run || !this.validarRun(data.personal.run)) {
        errores.push('RUN inválido');
      }
      if (!data.personal.apellidoPaterno) {
        errores.push('Apellido paterno es requerido');
      }
      if (!data.personal.nombres) {
        errores.push('Nombres son requeridos');
      }
      if (!data.personal.fechaNacimiento) {
        errores.push('Fecha de nacimiento es requerida');
      }
    }

    // Validar datos del apoderado
    if (!data.apoderado) {
      errores.push('Los datos del apoderado son requeridos');
    } else {
      if (!data.apoderado.runApoderado || !this.validarRun(data.apoderado.runApoderado)) {
        errores.push('RUN del apoderado inválido');
      }
      if (!data.apoderado.apellidoPaterno) {
        errores.push('Apellido paterno del apoderado es requerido');
      }
      if (!data.apoderado.nombres) {
        errores.push('Nombres del apoderado son requeridos');
      }
      if (!data.apoderado.telefonoCelular) {
        errores.push('Teléfono celular del apoderado es requerido');
      }
      if (!data.apoderado.email || !this.validarEmail(data.apoderado.email)) {
        errores.push('Email del apoderado inválido');
      }
    }

    // Validar antecedentes escolares
    if (!data.escolares) {
      errores.push('Los antecedentes escolares son requeridos');
    } else {
      if (!data.escolares.nivelEnsenanza) {
        errores.push('Nivel de enseñanza es requerido');
      }
      if (!data.escolares.curso2024) {
        errores.push('Curso 2024 es requerido');
      }
      if (!data.escolares.fechaMatricula) {
        errores.push('Fecha de matrícula es requerida');
      }
    }

    // Validar antecedentes familiares
    if (!data.familiares || data.familiares.length === 0) {
      errores.push('Al menos un familiar es requerido');
    } else {
      data.familiares.forEach((familiar, index) => {
        if (!familiar.tipoDocumento) {
          errores.push(`Tipo de documento del familiar ${index + 1} es requerido`);
        }
        if (!familiar.numeroDocumento) {
          errores.push(`Número de documento del familiar ${index + 1} es requerido`);
        }
        if (!familiar.apellidoPaterno) {
          errores.push(`Apellido paterno del familiar ${index + 1} es requerido`);
        }
        if (!familiar.nombres) {
          errores.push(`Nombres del familiar ${index + 1} son requeridos`);
        }
        if (!familiar.vinculoFamiliar) {
          errores.push(`Vínculo familiar ${index + 1} es requerido`);
        }
        if (!familiar.tipoApoderado) {
          errores.push(`Tipo de apoderado del familiar ${index + 1} es requerido`);
        }
      });
    }

    return {
      valido: errores.length === 0,
      errores: errores
    };
  }
}
