# Extensión Alarma Aula Digital

Una extensión de navegador para evitar que la sesión en la plataforma **Aula Digital de SENCE** (`auladigital.sence.cl`) expire por inactividad.

---

## 🚀 ¿Qué es?

La plataforma Aula Digital de SENCE cierra automáticamente la sesión de los usuarios tras 30 minutos de inactividad. Esta extensión soluciona ese inconveniente de manera no intrusiva:
- Mantiene un temporizador interno de **29 minutos**.
- Se reinicia de forma inteligente y automática cada vez que navegas, haces click o cambias de página dentro de Aula Digital.
- Si el temporizador llega a 0 (lo que significa que llevas 29 minutos sin hacer click), el navegador lanzará una **notificación nativa del sistema** recordándote interactuar con la página para no perder tu sesión.

---

## 🛠️ ¿Cómo se instala?

### En navegadores basados en Chromium (Google Chrome, Brave, Microsoft Edge, Opera)
1. Descarga o clona este repositorio en tu computadora.
2. Abre tu navegador y dirígete a `chrome://extensions/`.
3. Activa el **Modo de desarrollador** (habitualmente en la esquina superior derecha).
4. Haz click en el botón **Cargar descomprimida** (Load unpacked).
5. Selecciona la carpeta `Chromium` ubicada dentro del directorio de este proyecto.

### En Mozilla Firefox
1. Descarga o clona este repositorio en tu computadora.
2. Abre Firefox y dirígete a la dirección `about:debugging`.
3. En el menú lateral izquierdo, haz click en **Este Firefox** (This Firefox).
4. Haz click en el botón **Cargar complemento temporal...** (Load Temporary Add-on...).
5. Selecciona el archivo `manifest.json` dentro de la carpeta `Mozilla` de este proyecto.

---

## 📖 ¿Cómo se usa?

1. Una vez instalada, la extensión funciona **de forma automática**.
2. Al ingresar y navegar en [Aula Digital SENCE](https://auladigital.sence.cl), el contador se restablecerá automáticamente a 29:00 minutos.
3. Si deseas comprobar cuánto tiempo queda, puedes hacer click en el ícono de la extensión en la barra de herramientas para ver el conteo en tiempo real.
4. Si pasa el tiempo sin interacción y queda solo 1 minuto de sesión, recibirás una notificación de alerta:  
   * **Título:** `CLICK EN AULA DIGITAL`  
   * **Mensaje:** `Queda 1 minuto de actividad restante.`
