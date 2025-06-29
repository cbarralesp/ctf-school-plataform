import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estudiante {
  id: number;
  nombre: string;
  asistencias: { [key: string]: string }; // fecha -> estado (P, A, R)
}

export interface AsistenciaRequest {
  estudianteId: number;
  fecha: string;
  estado: string;
}

export interface AsistenciaResponse {
  estudianteId: number;
  fecha: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private readonly apiUrl = 'http://localhost:8080/api/asistencia';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los estudiantes
   */
  obtenerEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/estudiantes`);
  }

  /**
   * Obtiene las asistencias de un mes específico
   */
  obtenerAsistenciasPorMes(mes: number, año: number): Observable<AsistenciaResponse[]> {
    const params = {
      mes: mes.toString(),
      año: año.toString()
    };
    return this.http.get<AsistenciaResponse[]>(`${this.apiUrl}/mes`, { params });
  }

  /**
   * Marca la asistencia de un estudiante
   */
  marcarAsistencia(request: AsistenciaRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/marcar`, request);
  }

  /**
   * Marca asistencia múltiple (varios estudiantes a la vez)
   */
  marcarAsistenciaMultiple(requests: AsistenciaRequest[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/marcar-multiple`, requests);
  }

  /**
   * Genera una fecha en formato ISO (YYYY-MM-DD)
   */
  generarFecha(año: number, mes: number, dia: number): string {
    return `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
  }

  /**
   * Obtiene la fecha actual en formato ISO
   */
  obtenerFechaHoy(): string {
    const hoy = new Date();
    return this.generarFecha(
      hoy.getFullYear(),
      hoy.getMonth() + 1,
      hoy.getDate()
    );
  }

  /**
   * Genera los requests para marcar todos los estudiantes presentes en una fecha
   */
  generarRequestsPresentes(estudiantes: Estudiante[], fecha: string): AsistenciaRequest[] {
    return estudiantes.map(est => ({
      estudianteId: est.id,
      fecha,
      estado: 'P'
    }));
  }
}
