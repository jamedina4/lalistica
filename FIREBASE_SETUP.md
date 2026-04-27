# 🔥 Configuración de Firebase para Gestor de Tareas

## ✨ ¿Qué obtendrás?

Después de configurar Firebase, tu aplicación:
- ✅ **Sincronizará automáticamente** entre todos tus dispositivos
- ✅ **Guardará en la nube** - No perderás datos aunque borres el historial
- ✅ **Actualización en tiempo real** - Los cambios aparecen al instante en otros dispositivos
- ✅ **Totalmente GRATIS** para uso personal

---

## 📝 Pasos para configurar Firebase

### **Paso 0: Acceder a Firebase Console**

1. **Abre tu navegador** (Chrome, Edge, Firefox, etc.)
2. **Copia y pega esta URL** en la barra de direcciones:
   ```
   https://console.firebase.google.com/
   ```
3. Presiona **Enter**
4. Si te pide iniciar sesión:
   - Usa tu **cuenta de Gmail/Google** existente, O
   - Crea una cuenta de Google gratis si no tienes una
5. Una vez iniciada la sesión, verás la **página principal de Firebase Console** con tus proyectos (o vacía si es primera vez)

---

### **Paso 1: Crear proyecto en Firebase**

Ahora que estás en Firebase Console:

1. Haz clic en el botón grande **"Agregar proyecto"** (o **"Add project"** / **"Create a project"**)
   - Lo verás en el centro de la pantalla si no tienes proyectos
   - O en la esquina superior si ya tienes proyectos existentes

2. **Paso 1 de 3**: Dale un nombre a tu proyecto
   - Escribe: `gestor-tareas` (o el nombre que prefieras)
   - Haz clic en **"Continuar"**

3. **Paso 2 de 3**: Google Analytics (opcional)
   - Puedes **desactivarlo** desmarcando la casilla (no lo necesitas para esta app)
   - Haz clic en **"Continuar"**

4. **Paso 3 de 3**: (Si dejaste Analytics activado)
   - Selecciona una cuenta o crea una nueva
   - Haz clic en **"Crear proyecto"**

5. Espera 30-60 segundos mientras se crea el proyecto (verás una pantalla de carga)

6. Cuando termine, haz clic en **"Continuar"**

✅ **¡Listo!** Ya estás dentro de tu proyecto en Firebase Console

---

### **Paso 2: Crear una aplicación web**

1. En la página principal de tu proyecto, haz clic en el ícono **"Web"** (`</>`)
2. Dale un apodo a tu app (ej: `task-manager-web`)
3. **NO marques** "Configure Firebase Hosting"
4. Haz clic en **"Registrar app"**
5. Verás un código de configuración - **déjalo abierto**, lo necesitarás en el siguiente paso

---

### **Paso 3: Copiar la configuración**

En la pantalla verás algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_abc123def456ghi789...",
  authDomain: "gestor-tareas-abc12.firebaseapp.com",
  projectId: "gestor-tareas-abc12",
  storageBucket: "gestor-tareas-abc12.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456..."
};
```

1. **Copia todo el contenido** entre las llaves `{ ... }`
2. Abre el archivo **`firebase-config.js`** de tu proyecto
3. **Reemplaza SOLO los valores** (deja las comillas):

```javascript
const firebaseConfig = {
    apiKey: "PEGA_AQUI_TU_API_KEY",           // ← Reemplaza esto
    authDomain: "tu-proyecto.firebaseapp.com", // ← Reemplaza esto
    projectId: "tu-proyecto-id",              // ← Reemplaza esto
    storageBucket: "tu-proyecto.appspot.com", // ← Reemplaza esto
    messagingSenderId: "123456789",           // ← Reemplaza esto
    appId: "1:123456789:web:abc123def456"     // ← Reemplaza esto
};
```

4. **Guarda el archivo** `firebase-config.js`

---

### **Paso 4: Configurar Firestore Database**
--- https://console.firebase.google.com/u/1/project/la-listica/overview
1. En el menú lateral izquierdo de Firebase Console, busca y haz clic en:
   - **"Firestore Database"** (puede estar directamente visible), O
   - **"Build"** > **"Firestore Database"** (en inglés), O
   - **"Compilación"** > **"Firestore Database"** (en español)
   
   💡 **Consejo**: Si no lo ves, busca en la barra de búsqueda superior escribiendo "Firestore"

2. Haz clic en **"Crear base de datos"** o **"Create database"**
3. Selecciona **"Iniciar en modo de prueba"** (o **"Start in test mode"**)
4. Selecciona una ubicación cercana (ej: `us-central`, `southamerica-east1`, o `us-east1`)
5. Haz clic en **"Habilitar"** o **"Enable"**

⚠️ **IMPORTANTE - Configurar reglas de seguridad:**

6. Ve a la pestaña **"Reglas"** (Rules)
7. Reemplaza el contenido con esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir que cada usuario lea/escriba solo sus propios datos
    match /users/{userId} {
      allow read, write: if true;
    }
  }
}
```

8. Haz clic en **"Publicar"** (Publish)

> 💡 **Nota de seguridad**: Estas reglas permiten acceso completo. Para uso personal está bien, pero si compartes el proyecto con otros, considera agregar autenticación.

---

### **Paso 5: Probar la aplicación**

1. **Abre `index.html`** en tu navegador
2. Abre la **Consola del navegador** (F12 → Console)
3. Deberías ver: **`✅ Firebase conectado correctamente`**
4. El indicador en la esquina superior debe decir: **`☁️ Sincronizado`** (en verde)

---

### **Paso 6: Probar sincronización entre dispositivos**

1. **Carga algunas tareas** y márcalas como completadas
2. **Abre la aplicación en otro dispositivo** (tu teléfono, otra computadora, etc.)
3. **Usa el mismo archivo `firebase-config.js`** (sube todo el proyecto a OneDrive, Google Drive, o cualquier hosting)
4. Los cambios que hagas en un dispositivo **aparecerán automáticamente** en el otro

---

## 🚀 Subir la aplicación a Internet

Para acceder desde cualquier lugar, necesitas hosting. Aquí tienes opciones **gratuitas**:

> 📖 **Instrucciones detalladas en [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)** - Guía paso a paso completa

### **Opción 1: GitHub Pages (Recomendado)** ⭐

**La más fácil y rápida:**

1. Crea cuenta en [GitHub.com](https://github.com)
2. Crea un nuevo repositorio
3. Sube todos tus archivos (arrastra y suelta en el navegador)
4. Ve a Settings > Pages > Source: `main` > Save
5. Espera 2 minutos → Tu app estará en `https://tu-usuario.github.io/nombre-repo/`

📖 **Ver guía detallada:** [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)

### **Opción 2: Netlify**

1. Ve a [Netlify.com](https://www.netlify.com/)
2. Regístrate gratis
3. Arrastra la carpeta completa del proyecto
4. Tu app estará lista en segundos en `https://random-name.netlify.app`

### **Opción 3: Firebase Hosting** (Mismo Firebase)

1. Instala Firebase CLI: `npm install -g firebase-tools`
2. En tu carpeta del proyecto: `firebase login`
3. `firebase init hosting`
4. `firebase deploy`
5. Tu app estará en: `https://tu-proyecto.web.app`

---

## 🔧 Solución de problemas

### **"Firebase no configurado - usando localStorage local"**
- Revisa que hayas pegado correctamente la configuración en `firebase-config.js`
- Verifica que no haya comillas extra o falten comas

### **Error 403 o "Permission denied"**
- Ve a Firestore > Reglas y asegúrate de haber configurado las reglas correctamente
- Publica las reglas nuevamente

### **Los cambios no se sincronizan**
- Abre la Consola (F12) y busca errores en rojo
- Verifica que ambos dispositivos tengan el mismo `firebase-config.js`
- Comprueba tu conexión a Internet

### **"Multiple tabs open" warning**
- Es normal si tienes varias pestañas abiertas
- No afecta la funcionalidad, solo la persistencia offline

---

## 📊 Limites gratuitos de Firebase

- **Lecturas**: 50,000 por día
- **Escrituras**: 20,000 por día
- **Almacenamiento**: 1 GB
- **Transferencia**: 10 GB por mes

**Para uso personal de un gestor de tareas, estos límites son más que suficientes.** 🎉

---

## ❓ ¿Necesitas ayuda?

Si algo no funciona, revisa:
1. La consola del navegador (F12 → Console) para ver errores
2. Firebase Console > Firestore > Datos - para ver si se están guardando
3. Firebase Console > Uso (Usage) - para verificar actividad

---

## 🎉 ¡Listo!

Tu aplicación ahora está sincronizada en la nube. Puedes acceder desde cualquier dispositivo y tus datos siempre estarán actualizados.
