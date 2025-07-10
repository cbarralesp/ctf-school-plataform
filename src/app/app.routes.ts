import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AsistenciaComponent } from './components/libro-clases/asistencia/asistencia.component';
import { RouterModule } from '@angular/router';
import { RegistroEstudianteComponent } from './components/matricula/registro-estudiante/registro-estudiante.component';
import { AntecedentesFamiliaresComponent } from './components/matricula/antecedentes-familiares/antecedentes-familiares.component';
import { AntecedentesEscolaresComponent } from './components/matricula/antecedentes-escolares/antecedentes-escolares.component';
import { AntecedentesSaludComponent } from './components/matricula/antecedentes-salud/antecedentes-salud.component';
import { AntecedentesApoderadoComponent } from './components/matricula/antecedentes-apoderado/antecedentes-apoderado.component';
import { MatriculaHomeComponent } from './components/matricula/matricula-home/matricula-home.component';


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
    path: 'matricula/matricula-home',
    component: MatriculaHomeComponent,
    title: 'Matricula Home'
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
    path: 'matricula/antecedentes-apoderado',
    component: AntecedentesApoderadoComponent,
    title: 'Antecedentes apoderado'
  },
{
    path: 'matricula/antecedentes-familiares',
    component: AntecedentesFamiliaresComponent,
    title: 'Antecedentes Familiares'
  },
  {
    path: 'matricula/antecedentes-escolares',
    component: AntecedentesEscolaresComponent,
    title: 'Antecedentes Escolares'
  },
  {
    path: 'matricula/antecedentes-salud',
    component: AntecedentesSaludComponent,
    title: 'Antecedentes Salud'
  },
  {
    path: '**',
    redirectTo: '/dashboard', pathMatch: 'full'
  }
];
