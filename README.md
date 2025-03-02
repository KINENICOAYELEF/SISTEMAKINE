# SISTEMAKINE

# Sistema de Fichas Clínicas Kinesiológicas

Este sistema es una plataforma integral para kinesiólogos que permite registrar pacientes, realizar evaluaciones completas, establecer diagnósticos basados en evidencia, planificar tratamientos personalizados y hacer seguimiento de la evolución de los pacientes con visualización de datos y análisis de resultados avanzados.

## Tecnologías Utilizadas

- HTML5, CSS3 y JavaScript (ES6+)
- Bootstrap 5.3+
- Firebase (Firestore, Authentication, Storage)
- Chart.js 4.0+
- Bibliotecas adicionales: Moment.js, jsPDF, html2canvas

## Estructura del Proyecto

```
├── css/
│   ├── styles.css             # Estilos globales
│   ├── login.css              # Estilos para la página de login
│   ├── dashboard.css          # Estilos para el dashboard principal
│   ├── treatment.css          # Estilos para el módulo de tratamiento
│   ├── evolution.css          # Estilos para el módulo de evoluciones
│   └── dashboard-analysis.css # Estilos para el módulo de dashboard y análisis
├── js/
│   ├── firebase-config.js     # Configuración de Firebase
│   ├── auth.js                # Funciones de autenticación
│   ├── dashboard.js           # Funcionalidades del dashboard principal
│   ├── forms.js               # Funcionalidades para el formulario de pacientes
│   ├── patients.js            # Funciones para gestión de pacientes
│   ├── diagnosis.js           # Funcionalidades para el diagnóstico
│   ├── treatment.js           # Funcionalidades para el plan de tratamiento
│   ├── evolution.js           # Funcionalidades para las evoluciones
│   └── dashboard-analysis.js  # Funcionalidades para el dashboard y análisis
├── modules/
│   ├── patient-form.html      # Formulario de ingreso de pacientes
│   ├── records.html           # Listado y gestión de pacientes
│   ├── diagnosis.html         # Módulo de diagnóstico kinesiológico
│   ├── treatment.html         # Módulo de plan de tratamiento
│   ├── evolution.html         # Módulo de evoluciones
│   └── dashboard-analysis.html# Módulo de dashboard y análisis
├── index.html                 # Página de login
├── dashboard.html             # Panel principal
└── README.md                  # Documentación del proyecto
```

## Módulos del Sistema

### 1. Formulario de Ingreso
- Información personal completa del paciente
- Motivo de consulta y diagnóstico médico
- Anamnesis próxima y remota
- Hábitos y entorno social
- Evaluación física completa
- Cuestionarios estandarizados
- Sistema de banderas de alerta
- Mapa corporal interactivo
- Carga de archivos/exámenes complementarios

### 2. Diagnóstico Kinesiológico
- Asistente de razonamiento clínico
- Categorización según CIF
- Calculadora de probabilidad diagnóstica
- Integración con modelos de dolor actualizados
- Sistema de banderas automatizado

### 3. Plan de Tratamiento
- Creación de objetivos SMART
- Planificación de ejercicios terapéuticos
- Planificación de sesiones
- Línea de tiempo visual del tratamiento
- Recomendaciones basadas en evidencia

### 4. Evoluciones
- Registro cronológico de evoluciones (SOAP)
- Actualización de métricas cuantitativas
- Seguimiento de objetivos
- Visualización de progreso
- Comparativa automática

### 5. Dashboard y Análisis
- Gráficos de evolución temporal
- Comparativas visuales
- Estadísticas de resultados clínicos
- Predicción de resultados
- Exportación de informes personalizados

## Estructura de Datos en Firebase

### Colecciones
- **patients**: Información de pacientes
- **diagnoses**: Diagnósticos kinesiológicos
- **treatments**: Planes de tratamiento
- **evolutions**: Evoluciones registradas

## Instalación y Configuración

1. Clonar el repositorio
2. Configurar Firebase:
   - Crear un proyecto en Firebase Console
   - Habilitar Firestore, Authentication y Storage
   - Actualizar credenciales en `js/firebase-config.js`
3. Desplegar en GitHub Pages o servidor web de su elección

## Uso

1. Acceder a la página de login (index.html)
2. Ingresar credenciales
3. Navegar al dashboard principal
4. Crear o seleccionar paciente
5. Utilizar los diferentes módulos según el flujo de trabajo

## Autor

Este sistema fue desarrollado por [Tu Nombre] para uso en prácticas kinesiológicas.

## Licencia

Este proyecto es de uso personal y no está disponible para su redistribución sin autorización.
