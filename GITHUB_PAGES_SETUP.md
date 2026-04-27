# 🚀 Subir tu Gestor de Tareas a GitHub Pages

## ✨ ¿Qué conseguirás?

- Una **URL pública** para acceder a tu app desde cualquier dispositivo
- Ejemplo: `https://tu-usuario.github.io/gestor-tareas/`
- **Totalmente GRATIS** y sin límites de tráfico
- Actualización instantánea cuando hagas cambios

---

## 📝 Método 1: GitHub Web (Sin instalar nada) - **MÁS FÁCIL**

### **Paso 1: Crear cuenta en GitHub**

1. Ve a **[https://github.com](https://github.com)**
2. Haz clic en **"Sign up"** (Registrarse)
3. Completa el formulario:
   - **Username**: Elige un nombre de usuario (ej: `juanperez`)
   - **Email**: Tu correo electrónico
   - **Password**: Crea una contraseña segura
4. Verifica tu email y completa el proceso

---

### **Paso 2: Crear un nuevo repositorio**

1. Una vez iniciada la sesión, haz clic en el botón **"+"** en la esquina superior derecha
2. Selecciona **"New repository"** (Nuevo repositorio)
3. Configura tu repositorio:
   - **Repository name**: `gestor-tareas` (o el nombre que prefieras)
   - **Description** (opcional): `Mi gestor de tareas personal`
   - **Public**: Déjalo en Public (puede ser gratis)
   - ✅ **IMPORTANTE**: Marca la casilla **"Add a README file"**
4. Haz clic en **"Create repository"** (Crear repositorio)

---

### **Paso 3: Subir tus archivos**

1. En la página de tu repositorio, verás un botón **"Add file"** → haz clic
2. Selecciona **"Upload files"** (Subir archivos)
3. **Arrastra TODOS estos archivos** desde tu carpeta a la ventana del navegador:
   ```
   ✅ index.html
   ✅ app.js
   ✅ styles.css
   ✅ firebase-config.js (con tu configuración de Firebase)
   ✅ README.md
   ✅ FIREBASE_SETUP.md
   📁 ejemplos/ (toda la carpeta con sus archivos)
   ```
4. En el campo "Commit changes" abajo, escribe: `Primera versión del gestor de tareas`
5. Haz clic en **"Commit changes"** (verde)
6. Espera a que termine de subir (verás una marca verde ✓)

---

### **Paso 4: Activar GitHub Pages**

1. En la página de tu repositorio, haz clic en **"Settings"** (⚙️ Configuración) - está en la barra superior
2. En el menú lateral izquierdo, busca y haz clic en **"Pages"** (está en la sección "Code and automation")
3. En la sección **"Source"**, selecciona:
   - **Branch**: `main` (o `master` si ese es el nombre)
   - **Folder**: `/ (root)`
4. Haz clic en **"Save"** (Guardar)
5. Espera 1-2 minutos (GitHub está publicando tu sitio)
6. **Refresca la página** (F5)
7. Verás un mensaje verde que dice:
   ```
   ✅ Your site is live at https://tu-usuario.github.io/gestor-tareas/
   ```

---

### **Paso 5: ¡Accede a tu app!**

1. Haz clic en la URL que te apareció (o **"Visit site"**)
2. ✅ **¡Tu aplicación ya está en Internet!**
3. Comparte esa URL para acceder desde cualquier dispositivo

---

## 🔄 **Cómo actualizar tu app después de hacer cambios**

Cuando modifiques algún archivo localmente:

1. Ve a tu repositorio en GitHub
2. Haz clic en el archivo que quieres actualizar (ej: `app.js`)
3. Haz clic en el ícono del **lápiz** ✏️ (Edit this file)
4. Pega el nuevo contenido
5. Haz clic en **"Commit changes"** abajo
6. Espera 1-2 minutos y tu sitio se actualizará automáticamente

**O si modificaste varios archivos:**

1. Haz clic en **"Add file"** → **"Upload files"**
2. Arrastra los archivos modificados (sobrescribirá los antiguos)
3. Commit changes
4. Listo, se actualiza automáticamente

---

## 💻 Método 2: GitHub Desktop (Aplicación) - **Recomendado si harás muchos cambios**

### **Paso 1: Descargar GitHub Desktop**

1. Ve a **[https://desktop.github.com/](https://desktop.github.com/)**
2. Descarga e instala la aplicación
3. Inicia sesión con tu cuenta de GitHub

---

### **Paso 2: Crear repositorio desde la app**

1. Abre GitHub Desktop
2. Haz clic en **"File"** → **"New repository"**
3. Configura:
   - **Name**: `gestor-tareas`
   - **Local path**: Selecciona la carpeta donde está tu proyecto
   - **Initialize this repository with a README**: ✅ Marca esto
4. Haz clic en **"Create repository"**

---

### **Paso 3: Hacer tu primer commit**

1. GitHub Desktop mostrará todos tus archivos en la lista de cambios
2. En la parte inferior izquierda:
   - **Summary**: Escribe `Primera versión`
   - **Description** (opcional): `Subiendo gestor de tareas`
3. Haz clic en **"Commit to main"** (azul)

---

### **Paso 4: Publicar en GitHub**

1. Haz clic en **"Publish repository"** (azul, arriba)
2. Desmarca **"Keep this code private"** si quieres que sea público (para GitHub Pages gratis)
3. Haz clic en **"Publish repository"**
4. Espera a que termine de subir

---

### **Paso 5: Activar GitHub Pages**

1. Ve a **[https://github.com/tu-usuario/gestor-tareas](https://github.com)**
2. Ve a **Settings** → **Pages**
3. En **Source**, selecciona `main` y `/ (root)`
4. Haz clic en **Save**
5. Espera 1-2 minutos y refresca la página
6. Verás tu URL: `https://tu-usuario.github.io/gestor-tareas/`

---

### **Cómo actualizar después (con GitHub Desktop):**

1. Modifica tus archivos localmente
2. Abre GitHub Desktop (verá los cambios automáticamente)
3. Escribe un mensaje de commit (ej: "Actualicé estilos")
4. Haz clic en **"Commit to main"**
5. Haz clic en **"Push origin"** (↑ arriba a la derecha)
6. Espera 1-2 minutos y los cambios estarán en tu sitio

---

## 🛠️ Método 3: Git por línea de comandos (Avanzado)

Si prefieres usar la terminal:

### **Primera vez:**

```powershell
# Inicializar git en tu carpeta
cd C:\Users\medinajj\task-manager
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Primera versión del gestor de tareas"

# Crear repositorio en GitHub primero (via web), luego:
git branch -M main
git remote add origin https://github.com/TU-USUARIO/gestor-tareas.git
git push -u origin main
```

### **Después de hacer cambios:**

```powershell
git add .
git commit -m "Descripción de los cambios"
git push
```

Luego activa GitHub Pages desde Settings → Pages (como en los métodos anteriores).

---

## ⚠️ **IMPORTANTE: Seguridad de Firebase**

Si tu archivo `firebase-config.js` contiene tu configuración real de Firebase:

### **Opción 1: Dejar el repositorio privado**
- En Settings → General → Danger Zone
- Cambia la visibilidad a **"Private"**
- **PROBLEMA**: GitHub Pages gratis solo funciona con repositorios públicos
- Necesitarías GitHub Pro (gratis para estudiantes)

### **Opción 2: Usar variables de entorno** (Avanzado)
- No recomendado para este proyecto simple
- Requiere configuración adicional

### **Opción 3: Dejarlo público** (Recomendado para uso personal)
- Las credenciales de Firebase son para el frontend, están "expuestas" de todas formas
- Tus **reglas de Firestore** son las que protegen los datos
- Para uso personal está bien
- Si compartes con otros, considera agregar Firebase Authentication

---

## 🎯 **Resumen rápido:**

1. **Crea cuenta en GitHub** → [github.com](https://github.com)
2. **Crea repositorio** → New repository
3. **Sube archivos** → Upload files (arrastra y suelta)
4. **Activa Pages** → Settings → Pages → Source: main → Save
5. **Espera 2 minutos** → Refresca → Copia tu URL
6. **¡Listo!** → Accede desde cualquier dispositivo

---

## ❓ **¿Necesitas ayuda?**

### **No aparece mi sitio después de 5 minutos:**
- Ve a **Settings** → **Pages** y verifica que esté configurado
- Revisa que el archivo principal se llame `index.html` (minúsculas)

### **Error 404:**
- Asegúrate de acceder a la URL correcta: `https://tu-usuario.github.io/nombre-repo/`
- Si el repo se llama `tu-usuario.github.io`, la URL es solo `https://tu-usuario.github.io/`

### **Los cambios no se ven:**
- Espera 1-2 minutos después de hacer push
- Limpia la caché del navegador (Ctrl + Shift + R)

---

## 🎉 ¡Tu app ya está en Internet!

Ahora puedes:
- ✅ Acceder desde cualquier dispositivo con la URL
- ✅ Compartir el link con otros
- ✅ Los datos se sincronizan con Firebase (si lo configuraste)
- ✅ Actualizar el código cuando quieras

¿Quieres un dominio personalizado? (ej: `mis-tareas.com` en lugar de `tu-usuario.github.io`)
- GitHub Pages permite dominios personalizados (requiere comprar un dominio)
- Instrucciones en: Settings → Pages → Custom domain
