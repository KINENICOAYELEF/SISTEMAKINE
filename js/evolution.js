// js/evolutions.js
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

// Función para guardar una evolución
export async function saveEvolution(patientId, evolutionData) {
    try {
        // Agregar datos adicionales
        evolutionData.patientId = patientId;
        evolutionData.createdAt = new Date().toISOString();
        
        // Guardar en Firestore
        const docRef = await addDoc(collection(db, "evolutions"), evolutionData);
        console.log("Evolución guardada con ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al guardar evolución:", error);
        throw error;
    }
}

// Función para obtener evoluciones de un paciente
export async function getPatientEvolutions(patientId) {
    try {
        const evolutionsQuery = query(
            collection(db, "evolutions"), 
            where("patientId", "==", patientId),
            orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(evolutionsQuery);
        
        const evolutions = [];
        querySnapshot.forEach((doc) => {
            evolutions.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return evolutions;
    } catch (error) {
        console.error("Error al obtener evoluciones:", error);
        throw error;
    }
}

// Función para obtener una evolución por ID
export async function getEvolutionById(evolutionId) {
    try {
        const docRef = doc(db, "evolutions", evolutionId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        } else {
            console.log("No existe la evolución con ID:", evolutionId);
            return null;
        }
    } catch (error) {
        console.error("Error al obtener evolución:", error);
        throw error;
    }
}

// Función para actualizar una evolución
export async function updateEvolution(evolutionId, evolutionData) {
    try {
        // Actualizar en Firestore
        const docRef = doc(db, "evolutions", evolutionId);
        await updateDoc(docRef, evolutionData);
        console.log("Evolución actualizada:", evolutionId);
        return true;
    } catch (error) {
        console.error("Error al actualizar evolución:", error);
        throw error;
    }
}

// Función para eliminar una evolución
export async function deleteEvolution(evolutionId) {
    try {
        await deleteDoc(doc(db, "evolutions", evolutionId));
        console.log("Evolución eliminada:", evolutionId);
        return true;
    } catch (error) {
        console.error("Error al eliminar evolución:", error);
        throw error;
    }
}
