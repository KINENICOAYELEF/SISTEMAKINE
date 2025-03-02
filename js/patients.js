// js/patients.js
import { db } from "./firebase-config.js";
import { 
    collection, 
    addDoc, 
    getDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Función para guardar un nuevo paciente
export async function savePatient(patientData) {
    try {
        // Agregar timestamp de creación
        patientData.createdAt = new Date().toISOString();
        patientData.updatedAt = new Date().toISOString();
        
        // Guardar en Firestore
        const docRef = await addDoc(collection(db, "patients"), patientData);
        console.log("Paciente guardado con ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al guardar paciente:", error);
        throw error;
    }
}

// Función para obtener todos los pacientes
export async function getAllPatients() {
    try {
        const patientsQuery = query(collection(db, "patients"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(patientsQuery);
        
        const patients = [];
        querySnapshot.forEach((doc) => {
            patients.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return patients;
    } catch (error) {
        console.error("Error al obtener pacientes:", error);
        throw error;
    }
}

// Función para obtener un paciente por ID
export async function getPatientById(patientId) {
    try {
        const docRef = doc(db, "patients", patientId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        } else {
            console.log("No existe el paciente con ID:", patientId);
            return null;
        }
    } catch (error) {
        console.error("Error al obtener paciente:", error);
        throw error;
    }
}

// Función para actualizar un paciente
export async function updatePatient(patientId, patientData) {
    try {
        // Agregar timestamp de actualización
        patientData.updatedAt = new Date().toISOString();
        
        // Actualizar en Firestore
        const docRef = doc(db, "patients", patientId);
        await updateDoc(docRef, patientData);
        console.log("Paciente actualizado:", patientId);
        return true;
    } catch (error) {
        console.error("Error al actualizar paciente:", error);
        throw error;
    }
}

// Función para eliminar un paciente
export async function deletePatient(patientId) {
    try {
        await deleteDoc(doc(db, "patients", patientId));
        console.log("Paciente eliminado:", patientId);
        return true;
    } catch (error) {
        console.error("Error al eliminar paciente:", error);
        throw error;
    }
}

// Función para buscar pacientes
export async function searchPatients(searchTerm) {
    try {
        // Obtener todos los pacientes (en una app real usarías índices y consultas más eficientes)
        const patients = await getAllPatients();
        
        // Filtrar por término de búsqueda
        const filtered = patients.filter(patient => {
            const fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase();
            const rut = patient.rut ? patient.rut.toLowerCase() : '';
            const searchLower = searchTerm.toLowerCase();
            
            return fullName.includes(searchLower) || rut.includes(searchLower);
        });
        
        return filtered;
    } catch (error) {
        console.error("Error al buscar pacientes:", error);
        throw error;
    }
}

// Función para obtener pacientes activos
export async function getActivePatients() {
    try {
        const patientsQuery = query(
            collection(db, "patients"), 
            where("status", "==", "active"), 
            orderBy("updatedAt", "desc")
        );
        
        const querySnapshot = await getDocs(patientsQuery);
        
        const patients = [];
        querySnapshot.forEach((doc) => {
            patients.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return patients;
    } catch (error) {
        console.error("Error al obtener pacientes activos:", error);
        // Si falla la consulta por status, intentar obtener todos y filtrar manualmente
        try {
            const allPatients = await getAllPatients();
            return allPatients.filter(p => p.status === "active" || !p.status);
        } catch (secondError) {
            console.error("Error en segundo intento:", secondError);
            throw error; // Lanzar el error original
        }
    }
}

// Función para obtener estadísticas de pacientes
export async function getPatientStatistics() {
    try {
        const patients = await getAllPatients();
        
        // Estadísticas básicas
        const stats = {
            total: patients.length,
            active: patients.filter(p => p.status === "active" || !p.status).length,
            inactive: patients.filter(p => p.status === "inactive").length,
            discharged: patients.filter(p => p.status === "discharged").length,
            byGender: {
                male: patients.filter(p => p.gender === "masculino").length,
                female: patients.filter(p => p.gender === "femenino").length,
                other: patients.filter(p => p.gender && p.gender !== "masculino" && p.gender !== "femenino").length
            },
            ageGroups: {
                under18: 0,
                age18to30: 0,
                age31to50: 0,
                age51to70: 0,
                over70: 0
            }
        };
        
        // Calcular grupos de edad
        patients.forEach(patient => {
            if (patient.age) {
                const age = parseInt(patient.age);
                if (age < 18) stats.ageGroups.under18++;
                else if (age <= 30) stats.ageGroups.age18to30++;
                else if (age <= 50) stats.ageGroups.age31to50++;
                else if (age <= 70) stats.ageGroups.age51to70++;
                else stats.ageGroups.over70++;
            }
        });
        
        return stats;
    } catch (error) {
        console.error("Error al obtener estadísticas de pacientes:", error);
        throw error;
    }
}

// Función para obtener pacientes recientes
export async function getRecentPatients(limit = 5) {
    try {
        const patientsQuery = query(
            collection(db, "patients"), 
            orderBy("createdAt", "desc"),
            limit(limit)
        );
        
        const querySnapshot = await getDocs(patientsQuery);
        
        const patients = [];
        querySnapshot.forEach((doc) => {
            patients.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return patients;
    } catch (error) {
        console.error("Error al obtener pacientes recientes:", error);
        throw error;
    }
}

// Función para marcar un paciente como activo/inactivo
export async function updatePatientStatus(patientId, status) {
    try {
        const validStatuses = ["active", "inactive", "discharged"];
        if (!validStatuses.includes(status)) {
            throw new Error("Estado no válido. Debe ser 'active', 'inactive' o 'discharged'");
        }
        
        await updateDoc(doc(db, "patients", patientId), {
            status: status,
            updatedAt: new Date().toISOString()
        });
        
        return true;
    } catch (error) {
        console.error("Error al actualizar estado del paciente:", error);
        throw error;
    }
}
