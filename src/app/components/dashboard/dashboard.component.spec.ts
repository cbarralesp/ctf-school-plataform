import { Component, OnInit } from '@angular/core';

// Interfaces
interface NavItem {
  icon: string;
  label: string;
  route?: string;
  action?: () => void;
}

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  actions: CardAction[];
  newFeature?: string;
  isNew?: boolean;
}

interface CardAction {
  label: string;
  route?: string;
  isPrimary?: boolean;
  isNew?: boolean;
  action?: () => void;
}

interface User {
  name: string;
  role: string;
  avatar?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Propiedades del usuario
  user: User = {
    name: 'Gloria Profesora',
    role: 'Profesora'
  };

  // Información del curso
  courseName: string = 'FORMACION GLORIA';
  currentYear: number = 2024;

  // Estado de las pestañas
  activeTab: string = 'modulos';

  // Elementos de navegación del header
  navItems: NavItem[] = [
    {
      icon: 'fas fa-th',
      label: 'Inicio',
      route: '/dashboard'
    },
    {
      icon: 'fas fa-bell',
      label: 'Notificaciones',
      route: '/notifications'
    },
    {
      icon: 'fas fa-graduation-cap',
      label: 'Formación',
      route: '/training'
    },
    {
      icon: 'fas fa-question-circle',
      label: 'Ayuda',
      route: '/help'
    }
  ];

  // Tarjetas de módulos
  moduleCards: ModuleCard[] = [
    {
      id: 'planificacion',
      title: 'Planificación',
      description: 'Diseña tus planificaciones y actividades de forma rápida y profesional.',
      icon: 'planning',
      actions: [
        {
          label: 'Mis planificaciones',
          route: '/planning',
          isPrimary: true
        }
      ],
      newFeature: '¡Nuevo! Planifica aprendizaje basado en proyectos (ABP) y trabaja de forma interdisciplinar con otras asignaturas.',
      isNew: true
    },
    {
      id: 'evaluacion',
      title: 'Evaluación',
      description: 'Aplicar evaluaciones estandarizadas o crear tus propios instrumentos vinculados al currículum y con resultados instantáneos.',
      icon: 'evaluation',
      actions: [
        {
          label: 'Aplicar evaluación',
          route: '/evaluation/apply'
        },
        {
          label: 'Crear evaluación',
          route: '/evaluation/create'
        },
        {
          label: 'Evaluaciones estandarizadas',
          route: '/evaluation/standard'
        },
        {
          label: 'Mis evaluaciones',
          route: '/evaluation/mine'
        }
      ]
    },
    {
      id: 'libro-clases',
      title: 'Libro de clases',
      description: 'Sube la asistencia, calificaciones e información general de tus estudiantes.',
      icon: 'gradebook',
      actions: [
        {
          label: 'Asistencia',
          route: '/gradebook/attendance'
        },
        {
          label: 'Calificaciones',
          route: '/gradebook/grades'
        },
        {
          label: 'Ficha de estudiante',
          route: '/gradebook/student-profile'
        },
        {
          label: 'Registros y anotaciones',
          route: '/gradebook/records',
          isNew: true
        },
        {
          label: 'Certificados',
          route: '/gradebook/certificates'
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.initializeComponent();
  }

  /**
   * Inicializa el componente
   */
  private initializeComponent(): void {
    this.setGreeting();
    console.log('Dashboard inicializado para:', this.user.name);
  }

  /**
   * Establece el saludo según la hora del día
   */
  private setGreeting(): void {
    const hour = new Date().getHours();
    let greeting = '';

    if (hour < 12) {
      greeting = 'Buenos días';
    } else if (hour < 18) {
      greeting = 'Buenas tardes';
    } else {
      greeting = 'Buenas noches';
    }

    this.greeting = greeting;
  }

  greeting: string = '';

  /**
   * Cambia la pestaña activa
   */
  changeTab(tab: string): void {
    this.activeTab = tab;
    console.log('Pestaña cambiada a:', tab);
  }

  /**
   * Navega a una ruta específica
   */
  navigateTo(route: string): void {
    console.log('Navegando a:', route);
    // Aquí implementarías la navegación con Router
    // this.router.navigate([route]);
  }

  /**
   * Maneja el clic en una acción de tarjeta
   */
  onCardAction(action: CardAction): void {
    if (action.route) {
      this.navigateTo(action.route);
    } else if (action.action) {
      action.action();
    }
    console.log('Acción ejecutada:', action.label);
  }

  /**
   * Maneja el clic en el selector de curso
   */
  onCourseSelector(): void {
    console.log('Selector de curso clickeado');
    // Aquí podrías abrir un modal o dropdown con otros cursos
  }

  /**
   * Maneja el clic en notificaciones
   */
  onNotificationsClick(): void {
    console.log('Notificaciones clickeadas');
    // Implementar lógica de notificaciones
  }

  /**
   * Maneja el clic en el perfil de usuario
   */
  onUserProfileClick(): void {
    console.log('Perfil de usuario clickeado');
    // Implementar menú de usuario
  }

  /**
   * Verifica si una pestaña está activa
   */
  isTabActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  /**
   * Obtiene las tarjetas según la pestaña activa
   */
  getActiveCards(): ModuleCard[] {
    // Por ahora retorna todas las tarjetas, pero podrías filtrar según la pestaña
    return this.moduleCards;
  }

  /**
   * Formatea el nombre completo del curso
   */
  getFullCourseName(): string {
    return `${this.currentYear} | ${this.courseName}`;
  }

  /**
   * Verifica si hay notificaciones pendientes
   */
  hasNotifications(): boolean {
    // Implementar lógica para verificar notificaciones
    return true; // Por ahora siempre true
  }

  /**
   * Obtiene el número de notificaciones pendientes
   */
  getNotificationCount(): number {
    // Implementar lógica para contar notificaciones
    return 3; // Ejemplo
  }

  /**
   * Maneja errores generales del componente
   */
  handleError(error: any): void {
    console.error('Error en dashboard:', error);
    // Implementar manejo de errores (toast, modal, etc.)
  }

  /**
   * Limpia recursos al destruir el componente
   */
  ngOnDestroy(): void {
    // Limpiar subscripciones, timers, etc.
    console.log('Dashboard destruido');
  }
}
