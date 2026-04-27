// ========================================
// CONFIGURACIÓN DE FIREBASE
// ========================================
// IMPORTANTE: Reemplaza estos valores con tu configuración de Firebase
// Para obtener estos valores:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un nuevo proyecto o selecciona uno existente
// 3. Ve a Configuración del proyecto > Tus apps > SDK setup and configuration
// 4. Copia y pega los valores aquí

const firebaseConfig = {
    apiKey: "AIzaSyAe136vQxQ7L_xtPKCoz2nyNSUFjIfMt5A",
    authDomain: "la-listica.firebaseapp.com",
    projectId: "la-listica",
    storageBucket: "la-listica.firebasestorage.app",
    messagingSenderId: "564530311125",
    appId: "1:564530311125:web:502431156d2733d71c975c"
};

// NO MODIFIQUES NADA DEBAJO DE ESTA LÍNEA
// ========================================

let db = null;
let firebaseEnabled = false;

// Verificar si Firebase está configurado
function isFirebaseConfigured() {
    return firebaseConfig.apiKey !== "TU_API_KEY_AQUI" && 
           firebaseConfig.projectId !== "tu-proyecto-id";
}

// Inicializar Firebase
try {
    if (isFirebaseConfigured()) {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        firebaseEnabled = true;
        console.log("✅ Firebase conectado correctamente");
        
        // Configurar persistencia offline
        db.enablePersistence()
            .catch((err) => {
                if (err.code == 'failed-precondition') {
                    console.warn('Persistencia offline no disponible (múltiples pestañas abiertas)');
                } else if (err.code == 'unimplemented') {
                    console.warn('Persistencia offline no soportada en este navegador');
                }
            });
    } else {
        console.warn("⚠️ Firebase no configurado - usando localStorage local");
        console.warn("Para habilitar sincronización en la nube, configura firebase-config.js");
    }
} catch (error) {
    console.error("❌ Error al inicializar Firebase:", error);
    console.warn("Usando localStorage como respaldo");
}
