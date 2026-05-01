// ============================================
// firebase.js — Conexión y funciones de BD
// Ubicación: back_end/firebase.js
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- Configuración del proyecto Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyArT0iMiCiHHETRZUUwqaqCu-jDnl3-BkY",
  authDomain: "web-dodds.firebaseapp.com",
  projectId: "web-dodds",
  storageBucket: "web-dodds.firebasestorage.app",
  messagingSenderId: "989928273230",
  appId: "1:989928273230:web:239071430d2fa87aaa5a1f"
};

// --- Inicializar Firebase ---
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ============================================
// FUNCIONES REUTILIZABLES
// ============================================

/**
 * Carga los datos de un documento de Firestore.
 * @param {string} coleccion - Nombre de la colección (ej: "contadores")
 * @param {string} documento  - ID del documento (ej: "boku_no_hero")
 * @returns {object|null} - Los datos del documento o null si no existe
 */
export async function cargarDatos(coleccion, documento) {
  const ref  = doc(db, coleccion, documento);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
}

/**
 * Inicializa un documento con valores por defecto si no existe.
 * @param {string} coleccion
 * @param {string} documento
 * @param {object} valoresDefault - Objeto con los valores iniciales
 */
export async function inicializarSiNoExiste(coleccion, documento, valoresDefault) {
  const ref  = doc(db, coleccion, documento);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, valoresDefault);
  }
}

/**
 * Suma 1 a un campo numérico en Firestore.
 * @param {string} coleccion
 * @param {string} documento
 * @param {string} campo - El campo a incrementar (ej: "victorias")
 */
export async function sumar(coleccion, documento, campo) {
  const ref = doc(db, coleccion, documento);
  await updateDoc(ref, { [campo]: increment(1) });
}

/**
 * Resta 1 a un campo numérico (mínimo 0).
 * @param {string} coleccion
 * @param {string} documento
 * @param {string} campo
 * @param {number} valorActual - Para evitar bajar de 0
 */
export async function restar(coleccion, documento, campo, valorActual) {
  if (valorActual <= 0) return;
  const ref = doc(db, coleccion, documento);
  await updateDoc(ref, { [campo]: increment(-1) });
}

/**
 * Resetea un campo a 0.
 * @param {string} coleccion
 * @param {string} documento
 * @param {string} campo
 */
export async function resetear(coleccion, documento, campo) {
  const ref = doc(db, coleccion, documento);
  await updateDoc(ref, { [campo]: 0 });
}

export { db };
