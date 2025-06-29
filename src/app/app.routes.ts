import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AsistenciaComponent } from './components/libro-clases/asistencia/asistencia.component';
import { RouterModule } from '@angular/router';
import { RegistroEstudianteComponent } from './components/matricula/registro-estudiante/registro-estudiante.component';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard - Plataforma Educacional',
    data: {
      breadcrumb: 'Inicio'
    }
  },
  {
    path: 'asistencia',
    component: AsistenciaComponent,
    title: 'Asistencia - Plataforma Educacional',
    data: {
      breadcrumb: 'Asistencia'
    }
  },
  {
  path: 'matricula/registro-estudiante',
  component: RegistroEstudianteComponent,
  title: 'Registro de Estudiante - Plataforma Educacional',
  data: {
    breadcrumb: 'Registro Estudiante'
  }
},
  {
    path: '**',
    redirectTo: '/dashboard', pathMatch: 'full'
  }
];
