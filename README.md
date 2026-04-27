# Gestor de Tareas - Manual de Uso

## 📋 Descripción

Aplicación web para gestionar tareas de diferentes tipos: diarias, semanales, mensuales y proyectos.

## 🚀 Cómo empezar

1. Abre el archivo `index.html` en tu navegador web
2. La aplicación se cargará con la interfaz completa

## 📁 Formato de archivos de tareas

Los archivos de tareas deben ser archivos de texto (.txt) con el siguiente formato:

```
Tarea principal 1
	Subtarea 1.1
	Subtarea 1.2
Tarea principal 2
	Subtarea 2.1
	Subtarea 2.2
	Subtarea 2.3
Tarea principal 3
```

- Cada línea representa una tarea
- Las subtareas se indican con un tabulador al inicio de la línea
- Puedes tener múltiples subtareas por tarea principal

## 🎯 Tipos de tareas

### Tareas Diarias
- Se resetean automáticamente cada día (previa confirmación)
- Solo puede haber una lista de tareas diarias activa

### Tareas Semanales
- Se resetean automáticamente cada semana (previa confirmación)
- Solo puede haber una lista de tareas semanales activa

### Tareas Mensuales
- Se resetean automáticamente cada mes (previa confirmación)
- Solo puede haber una lista de tareas mensuales activa

### Proyectos
- Puedes tener múltiples proyectos simultáneamente
- Se pueden finalizar manualmente
- Al finalizar, se archivan y se pueden consultar posteriormente
- No se resetean automáticamente

## 🔧 Funcionalidades

### Cargar tareas desde archivo
1. Ve a la sección correspondiente (Diarias, Semanales o Mensuales)
2. Haz clic en "📁 Cargar desde archivo"
3. Selecciona un archivo .txt con el formato indicado

### Marcar tareas como completadas
- Haz clic en el checkbox de la tarea
- Al marcar una tarea principal, todas sus subtareas se marcarán automáticamente
- Al completar todas las subtareas, la tarea principal se marca automáticamente

### Resetear tareas
- Haz clic en el botón "🔄 Resetear"
- Confirma la acción en el modal
- Todas las tareas se desmarcarán

### Crear un proyecto
1. Ve a la sección "Proyectos"
2. Haz clic en "➕ Nuevo Proyecto"
3. Ingresa el nombre del proyecto
4. (Opcional) Selecciona un archivo .txt con las tareas
5. Haz clic en "Crear"

### Ver progreso de un proyecto
- Haz clic en "Ver" en la tarjeta del proyecto
- Podrás ver todas las tareas y marcarlas como completadas

### Finalizar un proyecto
- Haz clic en "✓ Finalizar" en la tarjeta del proyecto
- Confirma la acción
- El proyecto se archivará automáticamente

### Consultar proyectos archivados
1. Ve a la sección "Archivo"
2. Haz clic en "Ver Detalles" en cualquier proyecto archivado
3. Podrás ver todas las tareas (solo lectura)

### Exportar datos
- Haz clic en "Exportar Datos" en el header
- Se descargará un archivo JSON con todos tus datos
- Guarda este archivo como backup

### Importar datos
- Haz clic en "Importar Datos" en el header
- Selecciona un archivo JSON exportado previamente
- Todos los datos se restaurarán

## 💾 Almacenamiento

### Almacenamiento Local
- Los datos se guardan automáticamente en **localStorage** del navegador
- Los datos persisten incluso después de cerrar el navegador
- ⚠️ Se pueden perder si borras el historial/cookies del navegador

### 🔄 Sincronización en la Nube (Opcional)
¡Ahora puedes sincronizar tus datos en la nube con Firebase!

**Ventajas:**
- ✅ Sincronización automática entre todos tus dispositivos
- ✅ Tus datos están seguros en la nube
- ✅ Actualización en tiempo real
- ✅ No pierdes datos aunque borres el historial del navegador
- ✅ Completamente GRATIS para uso personal

**Cómo activarlo:**
1. Lee las instrucciones detalladas en [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
2. Configura tu proyecto de Firebase (5 minutos)
3. Actualiza el archivo `firebase-config.js` con tu configuración
4. ¡Listo! La sincronización se activará automáticamente

**Indicador de estado:**
- **☁️ Local** = Solo guardado local en tu navegador
- **☁️ Sincronizado** (verde) = Conectado a la nube, sincronizando automáticamente

## 🌐 Acceso desde Internet

Para acceder a tu aplicación desde cualquier dispositivo:

1. **Configura Firebase** (ver [FIREBASE_SETUP.md](FIREBASE_SETUP.md))
2. **Sube la aplicación a un hosting gratuito:**
   - **GitHub Pages** (recomendado)
   - **Netlify**
   - **Firebase Hosting**

Ver instrucciones completas en [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

## 🔧 Funcionalidades

Todos los datos se guardan automáticamente en el navegador (localStorage). No se necesita servidor ni base de datos.

## 📝 Archivos de ejemplo

En la carpeta `ejemplos/` encontrarás archivos de muestra:
- `tareas-diarias.txt`
- `tareas-semanales.txt`
- `tareas-mensuales.txt`
- `proyecto-ejemplo.txt`

## 🎨 Características

- ✅ Interfaz moderna y responsive
- ✅ Reseteo automático de tareas temporales con confirmación
- ✅ Gestión de múltiples proyectos
- ✅ Sistema de archivo para proyectos finalizados
- ✅ Cálculo automático de progreso
- ✅ Soporte para subtareas con tabuladores
- ✅ Exportar e importar datos
- ✅ Almacenamiento local persistente

## 🔐 Privacidad

Todos los datos se almacenan localmente en tu navegador. No se envía ninguna información a servidores externos.

---

¡Disfruta gestionando tus tareas! 🎉
