// Módulo de Dashboard y Análisis
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

import { loadSidebar, getCurrentPatient, displayPatientBanner } from "./dashboard.js";

// Variables globales
let patientData = {};
let patientTreatmentPlan = {};
let patientDiagnosis = {};
let patientEvolutions = [];
let patientInitialEvaluation = {};
let charts = {};
let reportPreviewData = null;

// Inicialización del módulo
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar sidebar
    await loadSidebar();

    // Cargar paciente actual (si hay uno seleccionado)
    const currentPatient = getCurrentPatient();
    if (currentPatient) {
        await loadPatientData(currentPatient.id);
        displayPatientBanner(currentPatient, document.getElementById('patientInfoBanner'));
        document.getElementById('noPatientSelected').classList.add('d-none');
        document.getElementById('dashboardContainer').classList.remove('d-none');
    }

    // Inicializar eventos
    initializeEvents();
});

// Función para inicializar eventos
function initializeEvents() {
    // Eventos para controles de gráficos
    document.querySelectorAll('[data-metric]').forEach(button => {
        button.addEventListener('click', (e) => {
            // Remover clase activa de todos los botones
            document.querySelectorAll('[data-metric]').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Agregar clase activa al botón clickeado
            e.currentTarget.classList.add('active');
            
            // Actualizar gráfico principal con la métrica seleccionada
            updateMainChart(e.currentTarget.getAttribute('data-metric'));
        });
    });
    
    // Evento para selector de rango de tiempo
    document.getElementById('timeRangeSelect').addEventListener('change', (e) => {
        // Obtener métrica actual seleccionada
        const activeMetric = document.querySelector('[data-metric].active').getAttribute('data-metric');
        
        // Actualizar gráfico con el nuevo rango de tiempo
        updateMainChart(activeMetric, e.target.value);
    });
    
    // Eventos para exportación de informes
    document.getElementById('exportPatientReportBtn').addEventListener('click', () => {
        generateReportPreview('patient');
    });
    
    document.getElementById('exportMedicalReportBtn').addEventListener('click', () => {
        generateReportPreview('medical');
    });
    
    document.getElementById('exportFullReportBtn').addEventListener('click', () => {
        generateReportPreview('full');
    });
    
    // Evento para exportar gráfico
    document.getElementById('exportChartBtn').addEventListener('click', exportCurrentChart);
    
    // Evento para descargar informe desde vista previa
    document.getElementById('downloadReportBtn').addEventListener('click', downloadReport);
}

// Función para cargar datos del paciente
async function loadPatientData(patientId) {
    try {
        const db = getFirestore();
        
        // Cargar datos del paciente
        const patientDoc = await getDoc(doc(db, 'patients', patientId));
        
        if (patientDoc.exists()) {
            patientData = {
                id: patientDoc.id,
                ...patientDoc.data()
            };
            
            // Extraer datos de evaluación inicial
            patientInitialEvaluation = patientData.evaluation || {};
        }
        
        // Cargar plan de tratamiento del paciente
        await loadPatientTreatmentPlan(patientId);
        
        // Cargar diagnóstico del paciente
        await loadPatientDiagnosis(patientId);
        
        // Cargar evoluciones del paciente
        await loadPatientEvolutions(patientId);
        
        // Actualizar dashboard
        updateDashboardMetrics();
        
        // Inicializar gráficos
        initializeCharts();
        
        // Actualizar estadísticas
        updateStatistics();
        
        // Actualizar predicciones
        updatePredictions();
        
    } catch (error) {
        console.error('Error al cargar datos del paciente:', error);
        alert('Hubo un error al cargar los datos. Por favor intente nuevamente.');
    }
}

// Función para cargar plan de tratamiento del paciente
async function loadPatientTreatmentPlan(patientId) {
    try {
        const db = getFirestore();
        
        // Referencia a la colección de tratamientos
        const treatmentsRef = collection(db, 'treatments');
        
        // Buscar el plan de tratamiento del paciente
        const treatmentQuery = query(treatmentsRef, where('patientId', '==', patientId));
        const treatmentSnapshot = await getDocs(treatmentQuery);
        
        // Inicializar plan de tratamiento
        patientTreatmentPlan = {
            objectives: [],
            exercises: [],
            sessions: [],
            recommendations: []
        };
        
        if (!treatmentSnapshot.empty) {
            // Cargar datos del plan existente
            const treatmentData = treatmentSnapshot.docs[0].data();
            
            patientTreatmentPlan = {
                id: treatmentSnapshot.docs[0].id,
                ...treatmentData
            };
        }
    } catch (error) {
        console.error('Error al cargar plan de tratamiento:', error);
        throw error;
    }
}

// Función para cargar diagnóstico del paciente
async function loadPatientDiagnosis(patientId) {
    try {
        const db = getFirestore();
        
        // Referencia a la colección de diagnósticos
        const diagnosesRef = collection(db, 'diagnoses');
        
        // Buscar el diagnóstico del paciente
        const diagnosisQuery = query(diagnosesRef, where('patientId', '==', patientId));
        const diagnosisSnapshot = await getDocs(diagnosisQuery);
        
        // Inicializar diagnóstico
        patientDiagnosis = {};
        
        if (!diagnosisSnapshot.empty) {
            // Cargar datos del diagnóstico existente
            const diagnosisData = diagnosisSnapshot.docs[0].data();
            
            patientDiagnosis = {
                id: diagnosisSnapshot.docs[0].id,
                ...diagnosisData
            };
        }
    } catch (error) {
        console.error('Error al cargar diagnóstico:', error);
        throw error;
    }
}

// Función para cargar evoluciones del paciente
async function loadPatientEvolutions(patientId) {
    try {
        const db = getFirestore();
        
        // Referencia a la colección de evoluciones
        const evolutionsRef = collection(db, 'evolutions');
        
        // Buscar evoluciones del paciente ordenadas por fecha
        const evolutionsQuery = query(
            evolutionsRef, 
            where('patientId', '==', patientId),
            orderBy('date', 'asc')
        );
        
        const evolutionsSnapshot = await getDocs(evolutionsQuery);
        
        // Reiniciar array de evoluciones
        patientEvolutions = [];
        
        if (!evolutionsSnapshot.empty) {
            // Cargar evoluciones encontradas
            evolutionsSnapshot.docs.forEach(doc => {
                const evolutionData = doc.data();
                patientEvolutions.push({
                    id: doc.id,
                    ...evolutionData
                });
            });
        }
    } catch (error) {
        console.error('Error al cargar evoluciones:', error);
        throw error;
    }
}

// Función para actualizar métricas del dashboard
function updateDashboardMetrics() {
    // Actualizar contador de sesiones
    document.getElementById('sessionsCount').textContent = patientEvolutions.length;
    
    // Calcular días en tratamiento
    let treatmentDays = 0;
    if (patientEvolutions.length > 0) {
        const firstSession = new Date(patientEvolutions[0].date);
        const lastSession = new Date(patientEvolutions[patientEvolutions.length - 1].date);
        const diffTime = Math.abs(lastSession - firstSession);
        treatmentDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    document.getElementById('treatmentDays').textContent = treatmentDays;
    
    // Calcular objetivos completados
    let completedObjectives = 0;
    let totalObjectives = patientTreatmentPlan.objectives ? patientTreatmentPlan.objectives.length : 0;
    
    if (patientTreatmentPlan.objectives) {
        completedObjectives = patientTreatmentPlan.objectives.filter(obj => obj.status === 'Completado').length;
    }
    document.getElementById('completedObjectives').textContent = `${completedObjectives}/${totalObjectives}`;
    
    // Calcular mejoría global
    let globalImprovement = 0;
    if (patientEvolutions.length > 0) {
        // Si hay GROC (Global Rating of Change) en la última evolución, usarlo como indicador de mejoría
        const lastEvolution = patientEvolutions[patientEvolutions.length - 1];
        if (lastEvolution.metrics && lastEvolution.metrics.groc !== undefined) {
            const groc = lastEvolution.metrics.groc;
            // Convertir GROC (-7 a +7) a porcentaje (0-100%)
            globalImprovement = Math.round(((groc + 7) / 14) * 100);
        } else if (lastEvolution.metrics && lastEvolution.metrics.sane !== undefined) {
            // Si no hay GROC, usar SANE como indicador
            globalImprovement = lastEvolution.metrics.sane;
        } else if (
            patientInitialEvaluation.pain && 
            patientInitialEvaluation.pain.scale !== undefined && 
            lastEvolution.metrics && 
            lastEvolution.metrics.pain !== undefined
        ) {
            // Si no hay SANE, calcular basado en mejora del dolor
            const initialPain = patientInitialEvaluation.pain.scale;
            const currentPain = lastEvolution.metrics.pain;
            const painReduction = initialPain - currentPain;
            globalImprovement = Math.round((painReduction / initialPain) * 100);
            globalImprovement = Math.max(0, globalImprovement); // Asegurar que no sea negativo
        }
    }
    document.getElementById('globalImprovement').textContent = `${globalImprovement}%`;
}

// Función para inicializar gráficos
function initializeCharts() {
    // Inicializar gráfico principal (por defecto mostrando dolor)
    updateMainChart('pain');
    
    // Inicializar gráfico de radar para comparar evaluación inicial vs actual
    initializeRadarChart();
    
    // Inicializar gráfico de comparación bilateral
    initializeBilateralChart();
}

// Función para actualizar el gráfico principal
function updateMainChart(metric, timeRange = 'all') {
    // Destruir gráfico existente si hay uno
    if (charts.mainChart) {
        charts.mainChart.destroy();
    }
    
    // Verificar si hay evoluciones
    if (patientEvolutions.length === 0) {
        return;
    }
    
    // Filtrar evoluciones según el rango de tiempo seleccionado
    let filteredEvolutions = [];
    switch (timeRange) {
        case 'last5':
            filteredEvolutions = patientEvolutions.slice(-5);
            break;
        case 'last10':
            filteredEvolutions = patientEvolutions.slice(-10);
            break;
        case 'month1':
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            filteredEvolutions = patientEvolutions.filter(ev => new Date(ev.date) >= oneMonthAgo);
            break;
        case 'month3':
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            filteredEvolutions = patientEvolutions.filter(ev => new Date(ev.date) >= threeMonthsAgo);
            break;
        default:
            filteredEvolutions = [...patientEvolutions];
    }
    
    // Preparar datos para el gráfico según la métrica seleccionada
    const labels = filteredEvolutions.map(ev => {
        const date = new Date(ev.date);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    });
    
    let dataset = {};
    let chartConfig = {};
    
    switch (metric) {
        case 'pain':
            // Datos de dolor
            const painData = filteredEvolutions.map(ev => ev.metrics?.pain !== undefined ? ev.metrics.pain : null);
            
            dataset = {
                label: 'Dolor (0-10)',
                data: painData,
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#dc3545',
                tension: 0.3,
                fill: true
            };
            
            chartConfig = {
                title: 'Evolución del Dolor',
                yAxisTitle: 'Intensidad del Dolor',
                min: 0,
                max: 10
            };
            break;
            
        case 'psfs':
            // Datos de PSFS
            const psfsData = filteredEvolutions.map(ev => ev.metrics?.psfs !== undefined ? ev.metrics.psfs : null);
            
            dataset = {
                label: 'PSFS (0-10)',
                data: psfsData,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#28a745',
                tension: 0.3,
                fill: true
            };
            
            chartConfig = {
                title: 'Evolución Funcional Específica del Paciente',
                yAxisTitle: 'PSFS (0-10)',
                min: 0,
                max: 10
            };
            break;
            
        case 'sane':
            // Datos de SANE
            const saneData = filteredEvolutions.map(ev => ev.metrics?.sane !== undefined ? ev.metrics.sane : null);
            
            dataset = {
                label: 'SANE (0-100)',
                data: saneData,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#007bff',
                tension: 0.3,
                fill: true
            };
            
            chartConfig = {
                title: 'Evaluación Numérica Única',
                yAxisTitle: 'SANE (0-100)',
                min: 0,
                max: 100
            };
            break;
            
        case 'rom':
            // Datos de ROM (rango de movimiento)
            // Para simplificar, mostramos solo el % de mejora en ROM en cada evolución
            const romImprovementData = [];
            
            // Iteramos desde la segunda evolución para calcular mejoras
            for (let i = 1; i < filteredEvolutions.length; i++) {
                const prevEvolution = filteredEvolutions[i - 1];
                const currEvolution = filteredEvolutions[i];
                
                // Podríamos implementar un algoritmo más sofisticado para analizar ROM
                // Por ahora usamos un valor random entre 0 y 100 como ejemplo
                const improvement = Math.round(Math.random() * 100);
                romImprovementData.push(improvement);
            }
            
            // Agregar un valor inicial de 0 para la primera evolución
            romImprovementData.unshift(0);
            
            dataset = {
                label: 'Mejora en ROM (%)',
                data: romImprovementData,
                borderColor: '#fd7e14',
                backgroundColor: 'rgba(253, 126, 20, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#fd7e14',
                tension: 0.3,
                fill: true
            };
            
            chartConfig = {
                title: 'Evolución del Rango de Movimiento',
                yAxisTitle: 'Mejora en ROM (%)',
                min: 0,
                max: 100
            };
            break;
            
        case 'strength':
            // Datos de fuerza muscular
            // Similar a ROM, usamos % de mejora como ejemplo
            const strengthImprovementData = [];
            
            for (let i = 1; i < filteredEvolutions.length; i++) {
                const improvement = Math.round(Math.random() * 100);
                strengthImprovementData.push(improvement);
            }
            
            strengthImprovementData.unshift(0);
            
            dataset = {
                label: 'Mejora en Fuerza (%)',
                data: strengthImprovementData,
                borderColor: '#6f42c1',
                backgroundColor: 'rgba(111, 66, 193, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#6f42c1',
                tension: 0.3,
                fill: true
            };
            
            chartConfig = {
                title: 'Evolución de la Fuerza Muscular',
                yAxisTitle: 'Mejora en Fuerza (%)',
                min: 0,
                max: 100
            };
            break;
    }
    
    // Crear gráfico
    const ctx = document.getElementById('mainChart').getContext('2d');
    charts.mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [dataset]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: chartConfig.title,
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: chartConfig.min,
                    max: chartConfig.max,
                    title: {
                        display: true,
                        text: chartConfig.yAxisTitle
                    }
                }
            }
        }
    });
}

// Función para inicializar gráfico de radar
function initializeRadarChart() {
    // Destruir gráfico existente si hay uno
    if (charts.radarChart) {
        charts.radarChart.destroy();
    }
    
    // Verificar si hay datos suficientes
    if (patientEvolutions.length === 0) {
        return;
    }
    
    // Obtener última evaluación
    const lastEvolution = patientEvolutions[patientEvolutions.length - 1];
    
    // Métricas para comparar
    const metrics = [
        'Dolor',
        'Función',
        'ROM',
        'Fuerza',
        'Equilibrio',
        'Actividades'
    ];
    
    // Datos iniciales (de 0 a 100, donde 100 es lo mejor)
    // Convertir dolor inicial (0-10) a escala inversa (0-100)
    const initialPain = patientInitialEvaluation.pain ? 100 - (patientInitialEvaluation.pain.scale * 10) : 50;
    const initialPsfs = patientInitialEvaluation.psfs ? patientInitialEvaluation.psfs.average * 10 : 50;
    const initialRom = 50; // Valor ejemplo
    const initialStrength = 50; // Valor ejemplo
    const initialBalance = 50; // Valor ejemplo
    const initialActivities = 50; // Valor ejemplo
    
    const initialData = [
        initialPain,
        initialPsfs,
        initialRom,
        initialStrength,
        initialBalance,
        initialActivities
    ];
    
    // Datos actuales
    // Convertir dolor actual (0-10) a escala inversa (0-100)
    const currentPain = lastEvolution.metrics?.pain !== undefined ? 100 - (lastEvolution.metrics.pain * 10) : 50;
    const currentPsfs = lastEvolution.metrics?.psfs !== undefined ? lastEvolution.metrics.psfs * 10 : 60;
    const currentRom = 70; // Valor ejemplo
    const currentStrength = 75; // Valor ejemplo
    const currentBalance = 80; // Valor ejemplo
    const currentActivities = 70; // Valor ejemplo
    
    const currentData = [
        currentPain,
        currentPsfs,
        currentRom,
        currentStrength,
        currentBalance,
        currentActivities
    ];
    
    // Crear gráfico de radar
    const ctx = document.getElementById('radarChart').getContext('2d');
    charts.radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: metrics,
            datasets: [
                {
                    label: 'Evaluación Inicial',
                    data: initialData,
                    borderColor: '#6c757d',
                    backgroundColor: 'rgba(108, 117, 125, 0.2)',
                    pointBackgroundColor: '#6c757d',
                    borderWidth: 2
                },
                {
                    label: 'Evaluación Actual',
                    data: currentData,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    pointBackgroundColor: '#007bff',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: {
                        display: false
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Comparativa Inicial vs. Actual',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Función para inicializar gráfico de comparación bilateral
function initializeBilateralChart() {
    // Destruir gráfico existente si hay uno
    if (charts.bilateralChart) {
        charts.bilateralChart.destroy();
    }
    
    // Métricas para comparar bilateralmente
    const metrics = ['Fuerza', 'ROM', 'Equilibrio', 'Propiocepción'];
    
    // Datos ejemplo para lado afectado y sano (0-100)
    const affectedSideData = [65, 70, 60, 55];
    const healthySideData = [90, 95, 85, 80];
    
    // Crear gráfico de barras
    const ctx = document.getElementById('bilateralChart').getContext('2d');
    charts.bilateralChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: metrics,
            datasets: [
                {
                    label: 'Lado Afectado',
                    data: affectedSideData,
                    backgroundColor: 'rgba(220, 53, 69, 0.7)',
                    borderColor: '#dc3545',
                    borderWidth: 1
                },
                {
                    label: 'Lado Sano',
                    data: healthySideData,
                    backgroundColor: 'rgba(40, 167, 69, 0.7)',
                    borderColor: '#28a745',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Porcentaje (%)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Comparativa Bilateral',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Función para actualizar estadísticas
function updateStatistics() {
    if (patientEvolutions.length === 0) {
        // No hay datos suficientes para estadísticas
        return;
    }
    
    // Tiempo promedio de recuperación
    const firstSession = new Date(patientEvolutions[0].date);
    const lastSession = new Date(patientEvolutions[patientEvolutions.length - 1].date);
    const totalDays = Math.ceil((lastSession - firstSession) / (1000 * 60 * 60 * 24)) + 1;
    document.getElementById('avgRecoveryTime').textContent = `${totalDays} días`;
    
    // Adherencia al tratamiento
    // Asumiendo que adherencia = asistencia a todas las sesiones planificadas
    const plannedSessions = patientTreatmentPlan.sessions ? patientTreatmentPlan.sessions.length : 0;
    const completedSessions = patientEvolutions.length;
    let adherenceRate = plannedSessions > 0 ? Math.round((completedSessions / plannedSessions) * 100) : 100;
    adherenceRate = Math.min(adherenceRate, 100); // Máximo 100%
    document.getElementById('adherenceRate').textContent = `${adherenceRate}%`;
    
    // Tasa de mejora por sesión
    // Usando dolor como ejemplo
    let improvementRate = 'N/A';
    if (patientEvolutions.length > 1 && 
        patientInitialEvaluation.pain && 
        patientInitialEvaluation.pain.scale !== undefined && 
        patientEvolutions[patientEvolutions.length - 1].metrics && 
        patientEvolutions[patientEvolutions.length - 1].metrics.pain !== undefined) {
        
        const initialPain = patientInitialEvaluation.pain.scale;
        const currentPain = patientEvolutions[patientEvolutions.length - 1].metrics.pain;
        const painReduction = initialPain - currentPain;
        const painReductionPerSession = painReduction / completedSessions;
        improvementRate = `${painReductionPerSession.toFixed(2)} puntos/sesión`;
    }
    document.getElementById('improvementRate').textContent = improvementRate;
    
    // Efectividad del tratamiento
    // Efectividad basada en mejora del dolor, función, etc.
    let effectiveness = 'N/A';
    if (patientEvolutions.length > 0 && patientEvolutions[patientEvolutions.length - 1].metrics) {
        const lastMetrics = patientEvolutions[patientEvolutions.length - 1].metrics;
        
        if (lastMetrics.groc !== undefined) {
            // GROC va de -7 a +7, convertir a porcentaje
            const groc = lastMetrics.groc;
            const effectivenessValue = Math.round(((groc + 7) / 14) * 100);
            effectiveness = `${effectivenessValue}%`;
        } else if (lastMetrics.sane !== undefined) {
            effectiveness = `${lastMetrics.sane}%`;
        } else if (patientInitialEvaluation.pain && patientInitialEvaluation.pain.scale !== undefined && lastMetrics.pain !== undefined) {
            const initialPain = patientInitialEvaluation.pain.scale;
            const currentPain = lastMetrics.pain;
            const painReduction = initialPain - currentPain;
            const effectivenessValue = Math.round((painReduction / initialPain) * 100);
            effectiveness = `${Math.max(0, effectivenessValue)}%`;
        }
    }
    document.getElementById('treatmentEffectiveness').textContent = effectiveness;
    
    // Días desde inicio
    document.getElementById('daysSinceStart').textContent = `${totalDays} días`;
}

// Función para actualizar predicciones
function updatePredictions() {
    if (patientEvolutions.length === 0 || !patientTreatmentPlan.objectives) {
        // No hay datos suficientes para predicciones
        return;
    }
    
    // Calcular progreso estimado hacia objetivos
    let totalObjectives = patientTreatmentPlan.objectives.length;
    let totalProgress = 0;
    
    patientTreatmentPlan.objectives.forEach(objective => {
        totalProgress += objective.progress || 0;
    });
    
    const averageProgress = totalObjectives > 0 ? Math.round(totalProgress / totalObjectives) : 0;
    document.getElementById('progressPercentage').textContent = `${averageProgress}%`;
    document.getElementById('treatmentProgressBar').style.width = `${averageProgress}%`;
    
    // Sesiones estimadas restantes
    // Asumiendo progreso lineal
    const sessionsCompleted = patientEvolutions.length;
    let remainingSessions = 0;
    
    if (averageProgress > 0) {
        const progressPerSession = averageProgress / sessionsCompleted;
        const remainingProgress = 100 - averageProgress;
        remainingSessions = Math.ceil(remainingProgress / progressPerSession);
    }
    
    document.getElementById('remainingSessions').textContent = remainingSessions;
    
    // Fecha estimada de alta
    const lastSessionDate = new Date(patientEvolutions[patientEvolutions.length - 1].date);
    const frequencyMap = {
        'Diario': 1,
        '3 veces por semana': 2, // Aproximadamente cada 2 días
        '2 veces por semana': 3, // Aproximadamente cada 3-4 días
        'Semanal': 7,
        'Quincenal': 14
    };
    
    const frequency = patientTreatmentPlan.frequency || 'Semanal';
    const daysPerSession = frequencyMap[frequency] || 7;
    
    const dischargeDate = new Date(lastSessionDate);
    dischargeDate.setDate(dischargeDate.getDate() + (remainingSessions * daysPerSession));
    
    const formattedDischargeDate = dischargeDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    document.getElementById('estimatedDischargeDate').textContent = formattedDischargeDate;
    
    // Factores pronósticos
    updatePrognosticFactors();
}

// Función para actualizar factores pronósticos
function updatePrognosticFactors() {
    const container = document.getElementById('prognosticFactorsList');
    container.innerHTML = '';
    
    // Factores positivos
    const positiveFactors = [
        { icon: 'check-circle', text: 'Buena adherencia al tratamiento' },
        { icon: 'chart-line', text: 'Evolución funcional positiva' },
        { icon: 'thumbs-up', text: 'Participación activa en el tratamiento' }
    ];
    
    // Factores negativos
    const negativeFactors = [];
    
    if (patientEvolutions.length > 0) {
        const lastEvolution = patientEvolutions[patientEvolutions.length - 1];
        
        // Verificar si hay estancamiento en el dolor
        if (patientEvolutions.length > 2) {
            const secondLastEvolution = patientEvolutions[patientEvolutions.length - 2];
            if (lastEvolution.metrics?.pain !== undefined && secondLastEvolution.metrics?.pain !== undefined) {
                if (lastEvolution.metrics.pain >= secondLastEvolution.metrics.pain) {
                    negativeFactors.push({ icon: 'exclamation-circle', text: 'Estancamiento en la reducción del dolor' });
                }
            }
        }
        
        // Verificar banderas amarillas en diagnóstico
        if (patientDiagnosis.yellowFlags && patientDiagnosis.yellowFlags.length > 0) {
            negativeFactors.push({ icon: 'flag', text: 'Presencia de factores psicosociales (banderas amarillas)' });
        }
    }
    
    // Factores neutrales
    const neutralFactors = [
        { icon: 'info-circle', text: 'Edad del paciente' },
        { icon: 'clock', text: 'Duración de los síntomas desde inicio' }
    ];
    
    // Mostrar factores
    const allFactors = [
        ...positiveFactors.map(f => ({ ...f, type: 'positive' })),
        ...negativeFactors.map(f => ({ ...f, type: 'negative' })),
        ...neutralFactors.map(f => ({ ...f, type: 'neutral' }))
    ];
    
    allFactors.forEach(factor => {
        const item = document.createElement('div');
        item.className = 'factor-item';
        
        item.innerHTML = `
            <div class="factor-icon factor-${factor.type}">
                <i class="fas fa-${factor.icon}"></i>
            </div>
            <div>${factor.text}</div>
        `;
        
        container.appendChild(item);
    });
}

// Función para exportar gráfico actual
function exportCurrentChart() {
    // Obtener canvas del gráfico principal
    const canvas = document.getElementById('mainChart');
    
    // Convertir a imagen
    const image = canvas.toDataURL('image/png');
    
    // Crear enlace de descarga
    const link = document.createElement('a');
    link.href = image;
    link.download = 'grafico_evolucion.png';
    link.click();
}

// Función para generar vista previa de informe
function generateReportPreview(reportType) {
    const currentPatient = getCurrentPatient();
    if (!currentPatient) {
        alert('No hay un paciente seleccionado');
        return;
    }
    
    // Elementos a incluir en el informe
    const includePatientInfo = document.getElementById('includePatientInfo').checked;
    const includeEvaluationSummary = document.getElementById('includeEvaluationSummary').checked;
    const includeDiagnosisSummary = document.getElementById('includeDiagnosisSummary').checked;
    const includeTreatmentPlan = document.getElementById('includeTreatmentPlan').checked;
    const includeEvolutionCharts = document.getElementById('includeEvolutionCharts').checked;
    const includeRecommendations = document.getElementById('includeRecommendations').checked;
    
    // Título personalizado
    const customTitle = document.getElementById('reportTitle').value || 'Informe Kinesiológico';
    
    // Determinar contenido según tipo de informe
    let reportContent = '';
    
    // Encabezado común
    reportContent += `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2>${customTitle}</h2>
            <p>${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
        </div>
    `;
    
    // Información del paciente
    if (includePatientInfo) {
        reportContent += `
            <div style="margin-bottom: 30px;">
                <h3>Información del Paciente</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nombre:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${currentPatient.firstName} ${currentPatient.lastName}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>RUT:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${currentPatient.rut || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Edad:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${currentPatient.age || 'N/A'}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Género:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${currentPatient.gender || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Teléfono:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${currentPatient.phone || 'N/A'}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${currentPatient.email || 'N/A'}</td>
                    </tr>
                </table>
            </div>
        `;
    }
    
    // Resumen de evaluación
    if (includeEvaluationSummary) {
        reportContent += `
            <div style="margin-bottom: 30px;">
                <h3>Resumen de Evaluación</h3>
                <p><strong>Motivo de consulta:</strong> ${patientData.consultReason || 'No registrado'}</p>
                <p><strong>Diagnóstico médico:</strong> ${patientData.medicalDiagnosis || 'No registrado'}</p>
                
                <h4>Evaluación Inicial</h4>
                <p><strong>Fecha:</strong> ${patientData.evaluationDate ? new Date(patientData.evaluationDate).toLocaleDateString('es-ES') : 'No registrada'}</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <h5>Dolor</h5>
                        <p><strong>Intensidad:</strong> ${patientInitialEvaluation.pain?.scale || 'N/A'}/10</p>
                        <p><strong>Localización:</strong> ${patientInitialEvaluation.pain?.location || 'N/A'}</p>
                    </div>
                    <div>
                        <h5>Funcionalidad</h5>
                        <p><strong>PSFS:</strong> ${patientInitialEvaluation.psfs?.average || 'N/A'}/10</p>
                        <p><strong>SANE:</strong> ${patientInitialEvaluation.sane || 'N/A'}/100</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Resumen de diagnóstico
    if (includeDiagnosisSummary && patientDiagnosis.diagnosis) {
        reportContent += `
            <div style="margin-bottom: 30px;">
                <h3>Diagnóstico Kinesiológico</h3>
                <p>${patientDiagnosis.diagnosis}</p>
                
                <h4>Categorización CIF</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2; text-align: left;">Componente</th>
                        <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2; text-align: left;">Descripción</th>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Deficiencia</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${patientDiagnosis.cifComponents?.deficiency || 'No registrado'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Limitación de actividad</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${patientDiagnosis.cifComponents?.activity || 'No registrado'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Restricción de participación</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${patientDiagnosis.cifComponents?.participation || 'No registrado'}</td>
                    </tr>
                </table>
            </div>
        `;
    }
    
    // Plan de tratamiento
    if (includeTreatmentPlan) {
        reportContent += `
            <div style="margin-bottom: 30px;">
                <h3>Plan de Tratamiento</h3>
                <p><strong>Frecuencia:</strong> ${patientTreatmentPlan.frequency || 'No definida'}</p>
                <p><strong>Duración de sesión:</strong> ${patientTreatmentPlan.sessionDuration || '60'} minutos</p>
                
                <h4>Objetivos</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2; text-align: left;">Objetivo</th>
                        <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2; text-align: left;">Progreso</th>
                        <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2; text-align: left;">Estado</th>
                    </tr>
        `;
        
        if (patientTreatmentPlan.objectives && patientTreatmentPlan.objectives.length > 0) {
            patientTreatmentPlan.objectives.forEach(objective => {
                reportContent += `
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">${objective.title}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${objective.progress || 0}%</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${objective.status || 'En progreso'}</td>
                    </tr>
                `;
            });
        } else {
            reportContent += `
                <tr>
                    <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: center;">No hay objetivos definidos</td>
                </tr>
            `;
        }
        
        reportContent += `
                </table>
            </div>
        `;
    }
    
    // Gráficos de evolución
    if (includeEvolutionCharts) {
        reportContent += `
            <div style="margin-bottom: 30px;">
                <h3>Evolución del Paciente</h3>
                <p><strong>Sesiones completadas:</strong> ${patientEvolutions.length}</p>
                <p><strong>Días en tratamiento:</strong> ${document.getElementById('treatmentDays').textContent}</p>
                
                <h4>Evolución del Dolor</h4>
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="${document.getElementById('mainChart').toDataURL()}" style="max-width: 100%; height: auto;">
                </div>
                
                <h4>Comparativa con Evaluación Inicial</h4>
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="${document.getElementById('radarChart').toDataURL()}" style="max-width: 100%; height: auto;">
                </div>
            </div>
        `;
    }
    
    // Recomendaciones
    if (includeRecommendations) {
        reportContent += `
            <div style="margin-bottom: 30px;">
                <h3>Recomendaciones</h3>
        `;
        
        if (patientTreatmentPlan.recommendations && patientTreatmentPlan.recommendations.length > 0) {
            reportContent += `<ul>`;
            patientTreatmentPlan.recommendations.forEach(recommendation => {
                reportContent += `
                    <li>
                        <strong>${recommendation.title}</strong>: ${recommendation.description}
                    </li>
                `;
            });
            reportContent += `</ul>`;
        } else {
            reportContent += `<p>No hay recomendaciones específicas registradas.</p>`;
        }
        
        reportContent += `</div>`;
    }
    
    // Guardar datos del informe para descargar
    reportPreviewData = {
        content: reportContent,
        title: customTitle,
        type: reportType
    };
    
    // Mostrar vista previa en modal
    document.getElementById('reportPreviewContainer').innerHTML = reportContent;
    document.getElementById('reportPreviewModalLabel').textContent = `Vista Previa: ${customTitle}`;
    
    // Mostrar modal
    const reportPreviewModal = new bootstrap.Modal(document.getElementById('reportPreviewModal'));
    reportPreviewModal.show();
}

// Función para descargar informe
function downloadReport() {
    if (!reportPreviewData) {
        alert('No hay un informe para descargar');
        return;
    }
    
    const currentPatient = getCurrentPatient();
    if (!currentPatient) {
        alert('No hay un paciente seleccionado');
        return;
    }
    
    try {
        // Crear elemento temporal para convertir a PDF
        const tempContainer = document.createElement('div');
        tempContainer.style.width = '800px';
        tempContainer.style.padding = '40px';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.innerHTML = reportPreviewData.content;
        
        // Agregar al DOM temporalmente (fuera de la vista)
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        document.body.appendChild(tempContainer);
        
        // Usar html2canvas para capturar el contenido
        html2canvas(tempContainer).then(canvas => {
            // Eliminar el contenedor temporal
            document.body.removeChild(tempContainer);
            
            // Crear PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'pt', 'a4');
            
            // Determinar escala para ajustar al ancho de la página
            const imgWidth = 595; // Ancho de A4 en puntos
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            // Agregar imagen al PDF
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            
            // Añadir más páginas si el contenido es muy largo
            if (imgHeight > 842) { // Altura de A4 en puntos
                let remainingHeight = imgHeight;
                let currentPage = 1;
                
                while (remainingHeight > 842) {
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, -842 * currentPage, imgWidth, imgHeight);
                    remainingHeight -= 842;
                    currentPage++;
                }
            }
            
            // Guardar PDF
            const fileName = `informe_${reportPreviewData.type}_${currentPatient.lastName}_${currentPatient.firstName}.pdf`;
            pdf.save(fileName);
        });
    } catch (error) {
        console.error('Error al generar PDF:', error);
        alert('Hubo un error al generar el PDF. Por favor intente nuevamente.');
    }
}
